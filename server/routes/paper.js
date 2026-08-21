import express from 'express';
import { aiService } from '../services/aiService.js';
import { analysisService } from '../services/analysisService.js';
import { storageService } from '../services/storageService.js';

const router = express.Router();

// Helper to extract API key from headers if provided by frontend settings
function getApiKey(req) {
  return req.headers['x-api-key'] || process.env.GEMINI_API_KEY || null;
}

/**
 * Generate full IEEE paper
 * POST /api/paper/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { topic, domain, keywords, targetVenue, tone } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic or paper title is required' });
    }

    const apiKey = getApiKey(req);
    const paper = await aiService.generatePaper({ topic, domain, keywords, targetVenue, tone }, apiKey);
    res.json({ success: true, paper });
  } catch (err) {
    console.error('Error generating paper:', err);
    res.status(500).json({ error: err.message || 'Failed to generate paper' });
  }
});

/**
 * Generate single section
 * POST /api/paper/generate-section
 */
router.post('/generate-section', async (req, res) => {
  try {
    const { sectionId, sectionTitle, topic, domain, context, instructions } = req.body;
    const apiKey = getApiKey(req);
    const content = await aiService.generateSection({ sectionId, sectionTitle, topic, domain, context, instructions }, apiKey);
    res.json({ success: true, content });
  } catch (err) {
    console.error('Error generating section:', err);
    res.status(500).json({ error: err.message || 'Failed to generate section' });
  }
});

/**
 * Improve/Rewrite Section
 * POST /api/paper/improve
 */
router.post('/improve', async (req, res) => {
  try {
    const { text, action, instructions, topic } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for improvement' });
    }

    const apiKey = getApiKey(req);
    const improvedText = await aiService.improveSection({ text, action, instructions, topic }, apiKey);
    res.json({ success: true, improvedText });
  } catch (err) {
    console.error('Error improving section:', err);
    res.status(500).json({ error: err.message || 'Failed to improve section' });
  }
});

/**
 * Summarize paper
 * POST /api/paper/summarize
 */
router.post('/summarize', async (req, res) => {
  try {
    const { paperContent, type } = req.body;
    if (!paperContent) {
      return res.status(400).json({ error: 'Paper content is required' });
    }

    const apiKey = getApiKey(req);
    const summary = await aiService.summarizePaper({ paperContent, type }, apiKey);
    res.json({ success: true, summary });
  } catch (err) {
    console.error('Error summarizing paper:', err);
    res.status(500).json({ error: err.message || 'Failed to summarize paper' });
  }
});

/**
 * Generate IEEE References
 * POST /api/paper/references
 */
router.post('/references', async (req, res) => {
  try {
    const { topic, domain, count } = req.body;
    const apiKey = getApiKey(req);
    const result = await aiService.generateReferences({ topic, domain, count }, apiKey);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Error generating references:', err);
    res.status(500).json({ error: err.message || 'Failed to generate references' });
  }
});

/**
 * Academic Analysis (Grammar, AI Risk, Plagiarism Risk)
 * POST /api/paper/analyze
 */
router.post('/analyze', (req, res) => {
  try {
    const { text } = req.body;
    const analysis = analysisService.analyzePaper(text || '');
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Error analyzing paper:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze text' });
  }
});

/**
 * Research Copilot Chat
 * POST /api/paper/copilot
 */
router.post('/copilot', async (req, res) => {
  try {
    const { messages, paperContext } = req.body;
    const apiKey = getApiKey(req);
    const reply = await aiService.chatCopilot({ messages, paperContext }, apiKey);
    res.json({ success: true, reply });
  } catch (err) {
    console.error('Error in copilot chat:', err);
    res.status(500).json({ error: err.message || 'Failed to chat with copilot' });
  }
});

/**
 * Save Paper
 * POST /api/paper/save
 */
router.post('/save', async (req, res) => {
  try {
    const paperData = req.body;
    if (!paperData) {
      return res.status(400).json({ error: 'Paper payload is required' });
    }

    const saved = await storageService.savePaper(paperData);
    res.json({ success: true, paper: saved });
  } catch (err) {
    console.error('Error saving paper:', err);
    res.status(500).json({ error: err.message || 'Failed to save paper' });
  }
});

/**
 * List Saved Papers
 * GET /api/paper/list
 */
router.get('/list', async (req, res) => {
  try {
    const papers = await storageService.listPapers();
    res.json({ success: true, papers });
  } catch (err) {
    console.error('Error listing papers:', err);
    res.status(500).json({ error: err.message || 'Failed to list papers' });
  }
});

/**
 * Get Paper By ID
 * GET /api/paper/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const paper = await storageService.getPaper(req.params.id);
    if (!paper) {
      return res.status(400).json({ error: 'Paper not found' });
    }
    res.json({ success: true, paper });
  } catch (err) {
    console.error('Error getting paper:', err);
    res.status(500).json({ error: err.message || 'Failed to get paper' });
  }
});

/**
 * Delete Paper
 * DELETE /api/paper/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const success = await storageService.deletePaper(req.params.id);
    res.json({ success });
  } catch (err) {
    console.error('Error deleting paper:', err);
    res.status(500).json({ error: err.message || 'Failed to delete paper' });
  }
});

export default router;
