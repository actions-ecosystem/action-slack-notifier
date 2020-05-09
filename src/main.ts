import * as github from '@actions/github';
import * as core from '@actions/core';
import * as webhooks from '@octokit/webhooks';
import {
  WebClient,
  Block,
  MrkdwnElement,
  ChatPostMessageArguments
} from '@slack/web-api';

const colorCodes = new Map<string, string>([
  ['black', '#000000'],
  ['red', '#F44336'],
  ['green', '#4CAF50'],
  ['yellow', '#FFEB3B'],
  ['blue', '#2196F3'],
  ['magenta', '#FF00FF'],
  ['cyan', '#00BCD4'],
  ['white', '#FFFFFF']
]);

async function run(): Promise<void> {
  try {
    const client = new WebClient(core.getInput('slack_token'));

    const channel = core.getInput('channel').replace(/^#/, ''); // remove '#' prefix

    const message = core.getInput('message');
    const username = core.getInput('username');
    const iconUrl = core.getInput('icon_url') || undefined;
    const color =
      colorCodes.get(core.getInput('color')) || core.getInput('color');
    const verbose = core.getInput('verbose') === 'true';

    const customPayload: Block[] = JSON.parse(core.getInput('custom_payload'));

    const { owner, repo } = github.context.repo;
    const { payload, ref, eventName, workflow } = github.context;

    const runId = process.env['GITHUB_RUN_ID'] || '';

    const elements = await createGitHubContextElements(
      owner,
      repo,
      payload,
      ref,
      eventName,
      workflow,
      runId
    );

    const args = await createPostMessageArguments(
      channel,
      message,
      username,
      elements,
      verbose,
      color,
      customPayload,
      iconUrl
    );

    client.chat.postMessage(args);
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

export async function createPostMessageArguments(
  channel: string,
  message: string,
  username: string,
  elements: MrkdwnElement[],
  verbose: boolean,
  color: string,
  customBlocks?: Block[],
  iconUrl?: string
): Promise<ChatPostMessageArguments> {
  const args: ChatPostMessageArguments = {
    channel,
    text: '',
    username,
    iconUrl,
    link_names: true,
    unfurl_links: true,
    unfurl_media: true
  };

  if (customBlocks) {
    args.blocks = customBlocks;
    return args;
  }

  const colored = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    ? true
    : false;

  // Make elements based on the values of colored and verbose.
  //
  //  colored &&  verbose -> .text, .attachments[].{color, blocks}
  // !colored &&  verbose -> .blocks[]
  //  colored && !verbose -> .attachments[].{color, text}
  // !colored && !verbose -> .text

  args.text = (!colored && verbose) || (colored && !verbose) ? '' : message;

  if (!colored && verbose) {
    args.blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message
        },
        fields: elements
      }
    ];
    return args;
  }

  if (!colored) {
    return args;
  }

  args.attachments = [
    {
      color,
      text: verbose ? undefined : message,
      blocks: verbose
        ? [
            {
              type: 'section',
              fields: elements
            }
          ]
        : undefined
    }
  ];

  return args;
}

async function createGitHubContextElements(
  owner: string,
  repo: string,
  payload: any,
  ref: string,
  event: string,
  workflow: string,
  runId: string
): Promise<MrkdwnElement[]> {
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const workflowUrl = `${repoUrl}/actions?query=workflow%3A"${workflow}"`;
  const eventUrl = `${repoUrl}/actions?query=event%3A"${event}"`;
  const actionUrl = `${repoUrl}/actions/runs/${runId}`;

  let number = 0;
  let issueOrPullUrl = '';
  if (isWebhookPayloadIssues(payload)) {
    number = payload.issue.number;
    issueOrPullUrl = `${repoUrl}/issues/${number}`;
  }
  if (isWebhookPayloadPullRequest(payload)) {
    number = payload.pull_request.number;
    issueOrPullUrl = `${repoUrl}/pull/${number}`;
  }

  const elements: MrkdwnElement[] = [
    {
      type: 'mrkdwn',
      text: `*Repository:*\n<${repoUrl}|${owner}/${repo}>`
    },
    {
      type: 'mrkdwn',
      text: `*Ref:*\n${ref}`
    },
    {
      type: 'mrkdwn',
      text: `*Workflow:*\n<${workflowUrl}|${workflow}>`
    },
    {
      type: 'mrkdwn',
      text: `*Event:*\n<${eventUrl}|${event}>`
    },
    {
      type: 'mrkdwn',
      text: `*Action:*\n<${actionUrl}|Link>`
    }
  ];
  if (number) {
    elements.push({
      type: 'mrkdwn',
      text: `*Number:*\n<${issueOrPullUrl}|${number}>`
    });
  }

  return elements;
}

function isWebhookPayloadIssues(
  arg: any
): arg is webhooks.WebhookPayloadIssues {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    arg.issue !== null &&
    typeof arg.issue === 'object'
  );
}

function isWebhookPayloadPullRequest(
  arg: any
): arg is webhooks.WebhookPayloadPullRequest {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    arg.pull_request !== null &&
    typeof arg.pull_request === 'object'
  );
}

run();
