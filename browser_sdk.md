# Browser SDK – Skilled.U AI Gateway

A lightweight JavaScript SDK for direct use in web pages. Works via `<script>` without bundlers.

## Requirements
- Modern browser with `fetch` support
- Your gateway must be reachable from the browser (same-origin or CORS enabled)

## Installation
Include the SDK in your page and point it to your hosted gateway URL.

```html
<script src="/path/to/sdk_browser.js"></script>
<script>
  const client = new SkilledUAIClient('https://api.skilledu.in/api/ai_gateway.php');
</script>
```

If serving from the same origin as the gateway, you can use a relative path:
```html
<script>
  const client = new SkilledUAIClient('/ai_gateway.php');
</script>
```

## Quick Start
```html
<script src="/path/to/sdk_browser.js"></script>
<script>
  (async () => {
    const client = new SkilledUAIClient('https://api.skilledu.in/api/ai_gateway.php');

    // List models
    const models = await client.listModels();
    console.log(models);

    // Chat – single message
    const reply1 = await client.chat({ message: 'Hello!' });
    console.log(reply1);

    // Chat – system + user
    const reply2 = await client.chat({ system: 'You are helpful.', user: 'Who are you?' });
    console.log(reply2);

    // Chat – messages array
    const reply3 = await client.chat({
      messages: [
        { role: 'system', content: 'You are concise.' },
        { role: 'user', content: 'Explain LLMs briefly.' },
      ],
    });
    console.log(reply3);
  })();
</script>
```

## API

### new SkilledUAIClient(baseUrl: string)
- `baseUrl`: Full URL (or same-origin relative path) to `ai_gateway.php`

### listModels(timeoutMs: number = 30000): Promise<string[]>
Returns available models for the active platform.

### chat(opts): Promise<string>
`opts` fields:
- `message?`: string
- `system?`: string
- `user?`: string
- `messages?`: Array<{ role: 'system'|'user'|'assistant', content: string }>
- `model?`: string
- `temperature?`: number (default 0.7)
- `max_tokens?`: number (default 1000)
- `timeoutMs?`: number (default 60000)

Provide exactly one of `message`, `system+user`, or `messages`.

## Error Handling
The SDK throws `Error` on HTTP/API failures. Use try/catch around calls.

## CORS & Same-Origin
- If your HTML and gateway are served from the same origin (same domain/port/protocol), relative URLs will work without CORS.
- If using a different domain/port, ensure your gateway sends CORS headers (the provided PHP gateway already includes permissive CORS headers).

## Example Page
See `sdk_browser_usage.html` in the repository for a working example UI.