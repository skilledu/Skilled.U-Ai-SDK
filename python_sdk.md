# Python SDK – Skilled.U AI Gateway

A minimal Python client for the Skilled.U AI Gateway.

## Requirements
- Python 3.8+
- No external dependencies

## Installation
- Copy `sdk_python.py` into your project
- Set your base URL to your hosted gateway (e.g., `https://api.skilledu.in/api/ai_gateway.php`)

## Quick Start
```python
from sdk_python import SkilledUAIClient

client = SkilledUAIClient("https://api.skilledu.in/api/ai_gateway.php")

# List models
print(client.list_models())

# Chat – single message
print(client.chat(message="Hello!"))

# Chat – system + user
print(client.chat(system="You are helpful.", user="Who are you?"))

# Chat – messages array
print(client.chat(messages=[
    {"role": "system", "content": "You are concise."},
    {"role": "user", "content": "Explain LLMs briefly."},
    {"role": "assistant", "content": "Previously summarized the topic."},
]))

# Chat – with options
print(client.chat(
    message="Write a one-liner motivational quote.",
    temperature=0.6,
    max_tokens=120,
))
```

## API

### class SkilledUAIClient(base_url: str)
- `base_url`: Full URL to `ai_gateway.php`

#### list_models(timeout: int = 30) -> list[str]
Returns the available models for the active platform.

#### chat(
- message: Optional[str] = None
- system: Optional[str] = None
- user: Optional[str] = None
- assistant: Optional[str] = None
- messages: Optional[list[dict]] = None
- model: Optional[str] = None
- temperature: float = 0.7
- max_tokens: int = 1000
- timeout: int = 60
) -> str

Provide exactly one of `message`, `system+user`, or `messages`.

## Error Handling
SDK raises `RuntimeError` on HTTP/API errors. Wrap calls in try/except in production code.
