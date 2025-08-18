'use strict';
/**
 * Minimal Node.js SDK for Skilled.U AI API
 */

class SkilledUAIClient {
  constructor(baseUrl) {
    if (!baseUrl) throw new Error('baseUrl is required');
    this.baseUrl = String(baseUrl).replace(/\/$/, '');
  }

  async _get(url, timeoutMs = 60000) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
      return text ? JSON.parse(text) : {};
    } finally {
      clearTimeout(t);
    }
  }

  async _post(url, payload, timeoutMs = 60000) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
      return text ? JSON.parse(text) : {};
    } finally {
      clearTimeout(t);
    }
  }

  /**
   * @param {{
   *  message?: string,
   *  system?: string,
   *  user?: string,
   *  assistant?: string,
   *  messages?: Array<{role: 'system'|'user'|'assistant', content: string}>,
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

    const result = await this._post(this.baseUrl, payload, opts.timeoutMs ?? 60000);
    if (!result || typeof result !== 'object') throw new Error('Invalid response');
    if (!result.success) throw new Error(result.error || 'Request failed');
    return String(result.response ?? '');
  }

  async listModels(timeoutMs = 30000) {
    const result = await this._get(`${this.baseUrl}?action=models`, timeoutMs);
    if (!result || typeof result !== 'object') throw new Error('Invalid response');
    if (!result.success) throw new Error(result.error || 'Request failed');
    const models = Array.isArray(result.models) ? result.models : [];
    return models.map(String);
  }
}

module.exports = { SkilledUAIClient };