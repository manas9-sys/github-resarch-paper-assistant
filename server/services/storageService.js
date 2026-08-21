import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data/papers');

// Ensure directory exists
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

export const storageService = {
  /**
   * Save or Update Paper
   */
  async savePaper(paperData) {
    await ensureDir();
    const id = paperData.id || uuidv4();
    const now = new Date().toISOString();
    
    const paper = {
      ...paperData,
      id,
      updatedAt: now,
      createdAt: paperData.createdAt || now
    };

    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(paper, null, 2), 'utf-8');
    return paper;
  },

  /**
   * Get Paper By ID
   */
  async getPaper(id) {
    await ensureDir();
    const filePath = path.join(DATA_DIR, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  },

  /**
   * List all saved papers
   */
  async listPapers() {
    await ensureDir();
    try {
      const files = await fs.readdir(DATA_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      const papers = [];

      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
          const parsed = JSON.parse(content);
          // Return summary metadata
          papers.push({
            id: parsed.id,
            title: parsed.title || 'Untitled Research Paper',
            topic: parsed.topic || '',
            domain: parsed.domain || '',
            targetVenue: parsed.targetVenue || 'IEEE Transactions',
            createdAt: parsed.createdAt,
            updatedAt: parsed.updatedAt,
            wordCount: parsed.sections?.reduce((acc, s) => acc + (s.content?.split(/\s+/)?.length || 0), 0) || 0,
            sectionCount: parsed.sections?.length || 0
          });
        } catch (e) {
          console.warn('Skipping unreadable paper file:', file);
        }
      }

      // Sort newest first
      papers.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      return papers;
    } catch (err) {
      return [];
    }
  },

  /**
   * Delete Paper
   */
  async deletePaper(id) {
    await ensureDir();
    const filePath = path.join(DATA_DIR, `${id}.json`);
    try {
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }
};
