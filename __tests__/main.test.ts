import { createPostMessageArguments } from '../src/main';

test('createPostMessageArguments color=true, verbose=true', async () => {
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
    '#000000'
  );

  expect(args.text).toEqual('hello');
  expect(args.attachments).not.toBeUndefined();
  expect(args.blocks).toBeUndefined();
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

test('createPostMessageArguments color=false, verbose=true', async () => {
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
    ''
  );

  expect(args.text).toEqual('');
  expect(args.attachments).toBeUndefined();
  expect(args.blocks).not.toBeUndefined();
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

test('createPostMessageArguments color=true, verbose=false', async () => {
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
    '#000000'
  );

  expect(args.text).toEqual('');
  expect(args.attachments).not.toBeUndefined();
  expect(args.blocks).toBeUndefined();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(args.attachments!).toEqual([
    {
      color: '#000000',
      text: 'hello'
    }
  ]);
});

test('createPostMessageArguments color=false, verbose=false', async () => {
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
    ''
  );

  expect(args.text).toEqual('hello');
  expect(args.attachments).toBeUndefined();
  expect(args.blocks).toBeUndefined();
});
