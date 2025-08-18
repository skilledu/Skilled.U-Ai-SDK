<?php
/**
 * Minimal PHP SDK for Skilled.U AI API
 *
 * Usage:
 *   require 'sdk_php.php';
 *   $client = new SkilledUAIClient('http://localhost:8000/ai_gateway.php');
 *   $reply = $client->chat(['message' => 'Hello!']);
 *   $models = $client->listModels();
 */

class SkilledUAIClient
{
    private string $baseUrl;

    public function __construct(string $baseUrl)
    {
        if ($baseUrl === '') {
            throw new InvalidArgumentException('baseUrl is required');
        }
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    /**
     * @param array{message?:string, system?:string, user?:string, assistant?:string, messages?:array<int,array{role:string,content:string}>, model?:string, temperature?:float, max_tokens?:int, timeout?:int} $opts
     */
    public function chat(array $opts): string
    {
        $hasSingle = isset($opts['message']) && is_string($opts['message']) && $opts['message'] !== '';
        $hasSystemUserAssistant = (isset($opts['system']) && $opts['system'] !== '') || (isset($opts['user']) && $opts['user'] !== '') || (isset($opts['assistant']) && $opts['assistant'] !== '');
        $hasMessages = isset($opts['messages']) && is_array($opts['messages']) && count($opts['messages']) > 0;
        if (!$hasSingle && !$hasSystemUserAssistant && !$hasMessages) {
            throw new InvalidArgumentException('Provide message, or system/user/assistant, or messages[]');
        }

        $payload = [
            'temperature' => $opts['temperature'] ?? 0.7,
            'max_tokens' => $opts['max_tokens'] ?? 1000,
        ];
        if (!empty($opts['model'])) {
            $payload['model'] = (string) $opts['model'];
        }
        if ($hasMessages) {
            $payload['messages'] = array_values($opts['messages']);
        } else {
            if (!empty($opts['system'])) {
                $payload['system'] = (string) $opts['system'];
            }
            if (!empty($opts['user'])) {
                $payload['user'] = (string) $opts['user'];
            }
            if (!empty($opts['assistant'])) {
                $payload['assistant'] = (string) $opts['assistant'];
            }
            if ($hasSingle) {
                $payload['message'] = (string) $opts['message'];
            }
        }

        $timeout = isset($opts['timeout']) ? (int) $opts['timeout'] : 60;
        $result = $this->httpPostJson($this->baseUrl, $payload, $timeout);

        if (!is_array($result)) {
            throw new RuntimeException('Invalid response from server');
        }
        if (empty($result['success'])) {
            $err = isset($result['error']) ? (string) $result['error'] : 'Request failed';
            throw new RuntimeException($err);
        }
        return isset($result['response']) ? (string) $result['response'] : '';
    }

    public function listModels(int $timeout = 30): array
    {
        $url = $this->baseUrl . '?action=models';
        $result = $this->httpGetJson($url, $timeout);
        if (!is_array($result)) {
            throw new RuntimeException('Invalid response from server');
        }
        if (empty($result['success'])) {
            $err = isset($result['error']) ? (string) $result['error'] : 'Request failed';
            throw new RuntimeException($err);
        }
        $models = $result['models'] ?? [];
        if (!is_array($models)) {
            return [];
        }
        return array_values(array_map('strval', $models));
    }

    private function httpGetJson(string $url, int $timeout): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode < 200 || $httpCode >= 300) {
            throw new RuntimeException('HTTP ' . $httpCode . ': ' . $response);
        }
        $decoded = json_decode((string) $response, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function httpPostJson(string $url, array $payload, int $timeout): array
    {
        $body = json_encode($payload);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode < 200 || $httpCode >= 300) {
            throw new RuntimeException('HTTP ' . $httpCode . ': ' . $response);
        }
        $decoded = json_decode((string) $response, true);
        return is_array($decoded) ? $decoded : [];
    }
}