# PHP SDK – Skilled.U AI Gateway

A minimal PHP client for the Skilled.U AI Gateway.

## Requirements
- PHP 8.0+
- cURL extension enabled

## Installation
- Copy `sdk_php.php` into your project
- Set your base URL to your hosted gateway (e.g., `https://api.skilledu.in/api/ai_gateway.php`)

## Quick Start
```php
require 'sdk_php.php';

$client = new SkilledUAIClient('https://api.skilledu.in/api/ai_gateway.php');

// List models
$models = $client->listModels();
print_r($models);

// Chat – single message
echo $client->chat(['message' => 'Hello!']);

// Chat – system + user
echo $client->chat([
  'system' => 'You are helpful.',
  'user'   => 'Who are you?'
]);

// Chat – messages array
echo $client->chat([
  'messages' => [
    ['role' => 'system', 'content' => 'You are concise.'],
    ['role' => 'user',   'content' => 'Explain LLMs briefly.'],
    ['role' => 'assistant',   'content' => 'Previously summarized the topic.'],
  ],
]);

// Chat – with options
echo $client->chat([
  'message'     => 'Write a one-liner motivational quote.',
  'temperature' => 0.6,
  'max_tokens'  => 120,
]);
```

## API

### class SkilledUAIClient(string $baseUrl)
- `$baseUrl`: Full URL to `ai_gateway.php`

#### listModels(int $timeout = 30): array
Returns available models for the active platform.

#### chat(array $opts): string
`$opts` keys:
- `message`?: string
- `system`?: string
- `user`?: string
- `assistant`?: string
- `messages`?: array<int, array{role: string, content: string}>
- `model`?: string
- `temperature`?: float (default 0.7)
- `max_tokens`?: int (default 1000)
- `timeout`?: int (default 60)

Provide exactly one of `message`, `system+user`, or `messages`.

## Error Handling
Methods throw `RuntimeException` on HTTP/API errors; wrap calls in try/catch.
