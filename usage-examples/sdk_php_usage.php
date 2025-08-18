<?php
// Usage example for the PHP SDK
// Run: php sdk_php_usage.php

require __DIR__ . '/sdk_php.php';

$BASE_URL = 'https://api.skilledu.in/api/ai_gateway.php'; // Production endpoint

function print_section(string $title): void {
    echo "\n== $title ==\n";
}

try {
    $client = new SkilledUAIClient($BASE_URL);

    print_section('List models (active platform)');
    try {
        $models = $client->listModels();
        print_r($models);
    } catch (Throwable $e) {
        echo 'Error listing models: ' . $e->getMessage() . "\n";
    }

    print_section('Chat (minimal)');
    try {
        $reply = $client->chat(['message' => 'Hello from PHP SDK usage file!']);
        echo $reply . "\n";
    } catch (Throwable $e) {
        echo 'Chat error: ' . $e->getMessage() . "\n";
    }

    print_section('Chat (system/user)');
    try {
        $reply = $client->chat([
            'system' => 'You are helpful.',
            'user'   => 'Who are you?'
        ]);
        echo $reply . "\n";
    } catch (Throwable $e) {
        echo 'Chat error (system/user): ' . $e->getMessage() . "\n";
    }

    print_section('Chat (assistant only)');
    try {
        $reply = $client->chat([
            'assistant' => 'Previously, I summarized the topic.'
        ]);
        echo $reply . "\n";
    } catch (Throwable $e) {
        echo 'Chat error (assistant): ' . $e->getMessage() . "\n";
    }

    print_section('Chat (messages array)');
    try {
        $reply = $client->chat([
            'messages' => [
                ['role' => 'system', 'content' => 'You are a concise assistant.'],
                ['role' => 'user',   'content' => 'Explain LLMs briefly.'],
            ],
        ]);
        echo $reply . "\n";
    } catch (Throwable $e) {
        echo 'Chat error (messages): ' . $e->getMessage() . "\n";
    }

    print_section('Chat (with options)');
    try {
        $reply = $client->chat([
            'message'     => 'Write a one-liner motivational quote.',
            'temperature' => 0.6,
            'max_tokens'  => 120,
        ]);
        echo $reply . "\n";
    } catch (Throwable $e) {
        echo 'Chat error (options): ' . $e->getMessage() . "\n";
    }
} catch (Throwable $e) {
    echo 'SDK init error: ' . $e->getMessage() . "\n";
}