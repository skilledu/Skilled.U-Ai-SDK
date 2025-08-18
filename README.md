# Skilled AI SDK — Master Guide  

Welcome to the **Skilled AI SDK** repository 🚀 This repo provides **language-specific SDKs** (Browser, Node.js, PHP, Python) to access Skilled AI APIs **without any API key**.  

- [Browser SDK](./browser_sdk.md)  
- [Node.js SDK](./node_sdk.md)  
- [PHP SDK](./php_sdk.md)  
- [Python SDK](./python_sdk.md)  

All SDKs internally connect to the Skilled AI Gateway:  
```
https://api.skilledu.in/api/ai_gateway.php
```

This gateway provides access to multiple AI models without requiring an API key.  

### Quick API Examples  

**GET API Info**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --header "Accept: application/json"
```

**GET Available Models**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php?action=models" \
  --header "Accept: application/json"
```

**POST Minimal Example**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "message": "Hello!"
  }'
```

**POST With Options**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "message": "Write a 2-line poem about oceans.",
    "model": "llama-3.1-8b-instant",
    "temperature": 0.6,
    "max_tokens": 200
  }'
```

**POST With System/User/Assistant Roles**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "system": "You are a concise assistant.",
    "user": "Explain LLMs briefly.",
    "assistant": "Previously, I explained LLMs succinctly."
  }'
```

**POST With Messages Array**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "messages": [
      {"role": "system", "content": "You are helpful and concise."},
      {"role": "assistant", "content": "Previously summarized the topic."},
      {"role": "user", "content": "Give 3 tips to learn faster."}
    ]
  }'
```

**POST Longer Prompt Example**  
```bash
curl --location "https://api.skilledu.in/api/ai_gateway.php" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "message": "Summarize the key pros and cons of static typing vs dynamic typing in 5 bullet points."
  }'
```

**Note**: Each SDK is simply a wrapper around these API calls, so you can use either the SDKs or direct API calls.  

✨ With **Skilled AI SDK**, you can integrate AI into your projects quickly and easily — no API keys required!  
