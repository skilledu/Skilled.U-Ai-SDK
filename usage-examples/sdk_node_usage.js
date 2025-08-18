'use strict';
// Usage example for the Node.js SDK
// Requirements: Node.js 18+ (native fetch)
// Run: node sdk_node_usage.js

const { SkilledUAIClient } = require('./sdk_node');

const BASE_URL = 'https://api.skilledu.in/api/ai_gateway.php'; // Production endpoint

(async () => {
  const client = new SkilledUAIClient(BASE_URL);

  console.log('== List models (active platform) ==');
  try {
    const models = await client.listModels();
    console.log(models);
  } catch (e) {
    console.error('Error listing models:', e.message);
  }

  console.log('\n== Chat (minimal) ==');
  try {
    const reply = await client.chat({ message: 'Hello from Node SDK usage file!' });
    console.log(reply);
  } catch (e) {
    console.error('Chat error:', e.message);
  }

  console.log('\n== Chat (system/user) ==');
  try {
    const reply = await client.chat({ system: 'You are helpful.', user: 'Who are you?' });
    console.log(reply);
  } catch (e) {
    console.error('Chat error (system/user):', e.message);
  }

  console.log('\n== Chat (assistant only) ==');
  try {
    const reply = await client.chat({ assistant: 'Previously, I summarized the topic.' });
    console.log(reply);
  } catch (e) {
    console.error('Chat error (assistant):', e.message);
  }

  console.log('\n== Chat (messages array) ==');
  try {
    const reply = await client.chat({
      messages: [
        { role: 'system', content: 'You are a concise assistant.' },
        { role: 'user', content: 'Explain LLMs briefly.' },
      ],
    });
    console.log(reply);
  } catch (e) {
    console.error('Chat error (messages):', e.message);
  }

  console.log('\n== Chat (with options) ==');
  try {
    const reply = await client.chat({
      message: 'Write a one-liner motivational quote.',
      temperature: 0.6,
      max_tokens: 120,
    });
    console.log(reply);
  } catch (e) {
    console.error('Chat error (options):', e.message);
  }
})();