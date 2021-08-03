import { createPostMessageArguments } from '../src/main';

test('createPostMessageArguments colored=true, verbose=true, unfurl=true', async () => {
  const args = await createPostMessageArguments(
    'develop',
    'hello',
    'Bot',
    [
      {
        type: 'mrkdwn',
        text: 'text'
      }
    ],
    true,
    '#000000',
    true
  );

  expect(args.text).toEqual('hello');
  expect(args.attachments).not.toBeUndefined();
  expect(args.blocks).toBeUndefined();
  expect(args.unfurl_links).toEqual(true);
  expect(args.unfurl_media).toEqual(true);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(args.attachments!).toEqual([
    {
      color: '#000000',
      blocks: [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: 'text'
            }
          ]
        }
      ]
    }
  ]);
});

test('createPostMessageArguments colored=true, verbose=true, unfurl=false', async () => {
  const args = await createPostMessageArguments(
    'develop',
    'hello',
    'Bot',
    [
      {
        type: 'mrkdwn',
        text: 'text'
      }
    ],
    true,
    '#000000',
    false
  );

  expect(args.text).toEqual('hello');
  expect(args.attachments).not.toBeUndefined();
  expect(args.blocks).toBeUndefined();
  expect(args.unfurl_links).toEqual(false);
  expect(args.unfurl_media).toEqual(false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(args.attachments!).toEqual([
    {
      color: '#000000',
      blocks: [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: 'text'
            }
          ]
        }
      ]
    }
  ]);
});

test('createPostMessageArguments colored=false, verbose=true', async () => {
  const args = await createPostMessageArguments(
    'develop',
    'hello',
    'Bot',
    [
      {
        type: 'mrkdwn',
        text: 'text'
      }
    ],
    true,
    '',
    true
  );

  expect(args.text).toEqual('');
  expect(args.attachments).toBeUndefined();
  expect(args.blocks).not.toBeUndefined();
  expect(args.unfurl_links).toEqual(true);
  expect(args.unfurl_media).toEqual(true);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(args.blocks!).toEqual([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'hello'
      },
      fields: [
        {
          type: 'mrkdwn',
          text: 'text'
        }
      ]
    }
  ]);
});

test('createPostMessageArguments colored=true, verbose=false', async () => {
  const args = await createPostMessageArguments(
    'develop',
    'hello',
    'Bot',
    [
      {
        type: 'mrkdwn',
        text: 'text'
      }
    ],
    false,
    '#000000',
    true
  );

  expect(args.text).toEqual('');
  expect(args.attachments).not.toBeUndefined();
  expect(args.blocks).toBeUndefined();
  expect(args.unfurl_links).toEqual(true);
  expect(args.unfurl_media).toEqual(true);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(args.attachments!).toEqual([
    {
      color: '#000000',
      text: 'hello'
    }
  ]);
});

test('createPostMessageArguments colored=false, verbose=false', async () => {
  const args = await createPostMessageArguments(
    'develop',
    'hello',
    'Bot',
    [
      {
        type: 'mrkdwn',
        text: 'text'
      }
    ],
    false,
    '',
    true
  );

  expect(args.text).toEqual('hello');
  expect(args.attachments).toBeUndefined();
  expect(args.blocks).toBeUndefined();
  expect(args.unfurl_links).toEqual(true);
  expect(args.unfurl_media).toEqual(true);
});
