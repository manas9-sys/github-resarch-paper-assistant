/**
 * Academic Analysis Engine for Grammar, AI Tone, and Plagiarism Risk
 */

const AI_CLICHE_PHRASES = [
  'delve into', 'testament to', 'tapestry', 'pivotal role', 'in conclusion, it is evident',
  'seamlessly integrates', 'game changer', 'paradigm shift in modern', 'it is important to note that',
  'serves as a beacon', 'sheds light on', 'fosters innovation', 'revolutionizing the landscape',
  'furthermore, it is worth mentioning', 'undeniably crucial', 'in a world where', 'stands at the forefront'
];

const WEAK_ACADEMIC_VERBS = [
  { weak: 'get', better: 'obtain / derive / acquire' },
  { weak: 'got', better: 'obtained / attained / derived' },
  { weak: 'make better', better: 'enhance / optimize / refine' },
  { weak: 'shows that', better: 'demonstrates / substantiates / validates' },
  { weak: 'a lot of', better: 'a substantial volume of / numerous' },
  { weak: 'good results', better: 'statistically superior outcomes' },
  { weak: 'big problem', better: 'critical operational bottleneck' },
  { weak: 'think that', better: 'hypothesize / postulate' },
  { weak: 'deal with', better: 'address / mitigate / accommodate' },
  { weak: 'very fast', better: 'sub-millisecond / near-deterministic' }
];

export const analysisService = {
  /**
   * Comprehensive Academic Scan
   */
  analyzePaper(text) {
    if (!text || text.trim().length === 0) {
      return {
        wordCount: 0,
        characterCount: 0,
        readingTimeMinutes: 0,
        academicScore: 100,
        aiRiskScore: 0,
        plagiarismRiskScore: 0,
        grammarIssues: [],
        aiFlags: [],
        plagiarismFlags: [],
        readabilityGrade: 'N/A'
      };
    }

    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const characterCount = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);
    const avgWordsPerSentence = wordCount / sentenceCount;

    // 1. AI-Generated Wording Scanner
    const aiFlags = [];
    let aiTriggerCount = 0;

    AI_CLICHE_PHRASES.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        aiTriggerCount++;
        if (aiFlags.length < 10) {
          aiFlags.push({
            type: 'ai_cliche',
            phrase: match[0],
            index: match.index,
            suggestion: `Replace generic AI transition "${match[0]}" with direct academic phrasing.`,
            severity: 'medium'
          });
        }
      }
    });

    // Check sentence variance (low variance is characteristic of naive LLMs)
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgWordsPerSentence, 2), 0) / sentenceCount;
    if (sentenceLengths.length > 5 && variance < 8) {
      aiFlags.push({
        type: 'burstiness_low',
        phrase: 'Uniform sentence length throughout text',
        suggestion: 'Vary sentence lengths to introduce natural scholarly cadence and burstiness.',
        severity: 'low'
      });
      aiTriggerCount += 2;
    }

    const rawAiScore = Math.min(100, Math.round((aiTriggerCount / Math.max(1, wordCount / 100)) * 25));
    const aiRiskScore = Math.max(5, Math.min(95, rawAiScore));

    // 2. Plagiarism Risk Scanner
    const plagiarismFlags = [];
    let plagiarismPoints = 0;

    // Check un-cited bold claims
    const claimKeywords = ['proven beyond doubt', 'widely known that', 'everyone agrees', 'all researchers know', 'it has been observed that'];
    claimKeywords.forEach(claim => {
      if (text.toLowerCase().includes(claim)) {
        plagiarismFlags.push({
          type: 'unsubstantiated_assertion',
          phrase: claim,
          suggestion: `Add an IEEE reference citation (e.g., "[1]") or formalize the scope of "${claim}".`,
          severity: 'high'
        });
        plagiarismPoints += 15;
      }
    });

    // Check citation density
    const citationMatches = text.match(/\[\d+\]/g) || [];
    const citationCount = citationMatches.length;
    const citationDensityPer100Words = (citationCount / Math.max(1, wordCount)) * 100;

    if (wordCount > 300 && citationDensityPer100Words < 0.5) {
      plagiarismFlags.push({
        type: 'low_citation_density',
        phrase: 'Low in-text citation density',
        suggestion: 'Academic papers typically feature 1-3 citations per paragraph in literature review and introduction.',
        severity: 'medium'
      });
      plagiarismPoints += 20;
    }

    const plagiarismRiskScore = Math.min(90, Math.max(8, plagiarismPoints));

    // 3. Grammar & Academic Style Review
    const grammarIssues = [];

    WEAK_ACADEMIC_VERBS.forEach(({ weak, better }) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (grammarIssues.length < 15) {
          grammarIssues.push({
            type: 'informal_vocabulary',
            original: match[0],
            replacement: better,
            index: match.index,
            context: text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + weak.length + 20)),
            message: `Replace informal term "${match[0]}" with scholarly alternative: "${better}".`
          });
        }
      }
    });

    // Long convoluted sentences (> 45 words)
    sentences.forEach((s, idx) => {
      const sWords = s.trim().split(/\s+/);
      if (sWords.length > 45 && grammarIssues.length < 20) {
        grammarIssues.push({
          type: 'run_on_sentence',
          original: s.trim().slice(0, 50) + '...',
          context: s.trim(),
          replacement: 'Split into two focused sentences with a logical connective (e.g., "Consequently,", "Furthermore,").',
          message: `Sentence ${idx + 1} contains ${sWords.length} words, which hinders readability.`
        });
      }
    });

    // Overall Academic Health Score
    const deductions = (grammarIssues.length * 2) + (aiTriggerCount * 3) + (plagiarismPoints * 0.3);
    const academicScore = Math.max(40, Math.min(100, Math.round(100 - deductions)));

    return {
      wordCount,
      characterCount,
      readingTimeMinutes: Math.ceil(wordCount / 220),
      academicScore,
      aiRiskScore,
      plagiarismRiskScore,
      citationCount,
      grammarIssues,
      aiFlags,
      plagiarismFlags,
      metrics: {
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        sentences: sentenceCount,
        citations: citationCount,
        fleschKincaidEstimate: Math.max(12, Math.min(19, Math.round(0.39 * avgWordsPerSentence + 11.8 - 5)))
      }
    };
  }
};
