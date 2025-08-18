# Node.js SDK – Skilled.U AI Gateway

A minimal Node.js client for the Skilled.U AI Gateway.

## Requirements
- Node.js 18+ (native `fetch`)

## Installation
- Copy `sdk_node.js` into your project
- Set your base URL to your hosted gateway (e.g., `https://api.skilledu.in/api/ai_gateway.php`)

## Quick Start
```js
const { SkilledUAIClient } = require('./sdk_node');

const client = new SkilledUAIClient('https://api.skilledu.in/api/ai_gateway.php');

(async () => {
  console.log(await client.listModels());

  console.log(await client.chat({ message: 'Hello!' }));

  console.log(await client.chat({ system: 'You are helpful.', user: 'Who are you?' }));

  console.log(await client.chat({
    messages: [
      { role: 'system', content: 'You are concise.' },
      { role: 'user', content: 'Explain LLMs briefly.' },
    ],
  }));

  console.log(await client.chat({
    message: 'Write a one-liner motivational quote.',
    temperature: 0.6,
    max_tokens: 120,
  }));
})();
```

## API

### class SkilledUAIClient(baseUrl: string)
- `baseUrl`: Full URL to `ai_gateway.php`

#### listModels(timeoutMs: number = 30000): Promise<string[]>
Returns available models for the active platform.

#### chat(opts): Promise<string>
`opts` fields:
- message?: string
- system?: string
- user?: string
- messages?: Array<{ role: 'system'|'user'|'assistant', content: string }>
- model?: string
- temperature?: number (default 0.7)
- max_tokens?: number (default 1000)
- timeoutMs?: number (default 60000)

Provide exactly one of `message`, `system+user`, or `messages`.

## Error Handling
Methods throw on HTTP/API errors; use try/catch.