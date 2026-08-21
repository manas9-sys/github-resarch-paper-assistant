/**
 * API Client for AI Research Paper Assistant
 */

const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const userApiKey = localStorage.getItem('research_paper_api_key');
  if (userApiKey) {
    headers['x-api-key'] = userApiKey;
  }
  return headers;
}

export const api = {
  // Generate entire paper
  async generatePaper(params) {
    const res = await fetch(`${API_BASE}/paper/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate paper');
    }
    return res.json();
  },

  // Generate single section
  async generateSection(params) {
    const res = await fetch(`${API_BASE}/paper/generate-section`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate section');
    }
    return res.json();
  },

  // Improve / Rewrite Section
  async improveSection(params) {
    const res = await fetch(`${API_BASE}/paper/improve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to improve section');
    }
    return res.json();
  },

  // Summarize Paper
  async summarizePaper(params) {
    const res = await fetch(`${API_BASE}/paper/summarize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to summarize paper');
    }
    return res.json();
  },

  // References generator
  async generateReferences(params) {
    const res = await fetch(`${API_BASE}/paper/references`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate references');
    }
    return res.json();
  },

  // Academic Analyzer
  async analyzePaper(text) {
    const res = await fetch(`${API_BASE}/paper/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to analyze text');
    }
    return res.json();
  },

  // Copilot Chat
  async chatCopilot(messages, paperContext) {
    const res = await fetch(`${API_BASE}/paper/copilot`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ messages, paperContext })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to chat with Copilot');
    }
    return res.json();
  },

  // Persistence - Save Paper
  async savePaper(paperData) {
    const res = await fetch(`${API_BASE}/paper/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paperData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save paper');
    }
    return res.json();
  },

  // Persistence - List Papers
  async listPapers() {
    const res = await fetch(`${API_BASE}/paper/list`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to list papers');
    }
    return res.json();
  },

  // Persistence - Get Paper by ID
  async getPaper(id) {
    const res = await fetch(`${API_BASE}/paper/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch paper');
    }
    return res.json();
  },

  // Persistence - Delete Paper
  async deletePaper(id) {
    const res = await fetch(`${API_BASE}/paper/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete paper');
    }
    return res.json();
  },

  // Export LaTeX
  async exportLatex(paperData) {
    const res = await fetch(`${API_BASE}/export/latex`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paperData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to export LaTeX');
    }
    return res.json();
  }
};
