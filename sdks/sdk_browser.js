(function () {
  'use strict';

  class SkilledUAIClient {
    /**
     * @param {string} baseUrl Full URL to ai_gateway.php (e.g., https://api.skilledu.in/api/ai_gateway.php)
     */
    constructor(baseUrl) {
      if (!baseUrl) throw new Error('baseUrl is required');
      this.baseUrl = String(baseUrl).replace(/\/$/, '');
    }

    /**
     * Internal helper for fetch with optional timeout
     * @param {string} url
     * @param {RequestInit} opts
     * @param {number} timeoutMs
     */
    async _fetchJson(url, opts, timeoutMs) {
      const controller = new AbortController();
      const t = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : null;
      try {
        const res = await fetch(url, { ...opts, signal: controller.signal });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        return text ? JSON.parse(text) : {};
      } finally {
        if (t) clearTimeout(t);
      }
    }

    /**
     * List available models for the active platform
     * @param {number} [timeoutMs=30000]
     * @returns {Promise<string[]>}
     */
    async listModels(timeoutMs = 30000) {
      const result = await this._fetchJson(`${this.baseUrl}?action=models`, {
        headers: { 'Accept': 'application/json' }
      }, timeoutMs);
      if (!result || typeof result !== 'object') throw new Error('Invalid response');
      if (!result.success) throw new Error(result.error || 'Request failed');
      return Array.isArray(result.models) ? result.models.map(String) : [];
    }

    /**
     * Send a chat request
     * Provide exactly one of: message, (system+user), or messages[]
     * @param {{
     *  message?: string,
     *  system?: string,
     *  user?: string,
     *  assistant?: string,
     *  messages?: Array<{role:'system'|'user'|'assistant', content:string}>,
     *  model?: string,
     *  temperature?: number,
     *  max_tokens?: number,
     *  timeoutMs?: number,
     * }} opts
     * @returns {Promise<string>}
     */
    async chat(opts) {
      if (!opts || (!opts.message && !opts.system && !opts.user && !opts.assistant && !Array.isArray(opts.messages))) {
        throw new Error('Provide message, or system/user/assistant, or messages[]');
      }
      const payload = {
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.max_tokens ?? 1000,
      };
      if (opts.model) payload.model = opts.model;
      if (Array.isArray(opts.messages)) {
        payload.messages = opts.messages;
      } else {
        if (opts.system) payload.system = opts.system;
        if (opts.user) payload.user = opts.user;
        if (opts.assistant) payload.assistant = opts.assistant;
        if (opts.message) payload.message = opts.message;
      }

      const result = await this._fetchJson(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }, opts.timeoutMs ?? 60000);

      if (!result || typeof result !== 'object') throw new Error('Invalid response');
      if (!result.success) throw new Error(result.error || 'Request failed');
      return String(result.response ?? '');
    }
  }

  // Expose globally for <script> usage
  if (typeof window !== 'undefined') {
    window.SkilledUAIClient = SkilledUAIClient;
  }
  // Optional: support module environments
  if (typeof self !== 'undefined') {
    self.SkilledUAIClient = SkilledUAIClient;
  }
})();
