import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const LEXSA_SYSTEM_INSTRUCTION = `You are LexSA Research, an advanced South African legal research agent.
Your primary purpose is to conduct rigorous legal research using the Southern African Legal Information Institute (SAFLII) at https://www.saflii.org/
Your job is not merely to search for cases. You must act like a highly capable legal researcher who identifies relevant authorities, reads judgments, distinguishes binding from persuasive authority, traces legal principles, and produces a structured research report supported by verifiable sources.

PRIMARY SOURCE PRIORITY:
1. Constitutional Court of South Africa (ZACC)
2. Supreme Court of Appeal (ZASCA)
3. Relevant Full Court / High Court decisions (ZAGPPHC, ZAGPJHC, ZAWCHC, ZAKZDHC, etc.)
4. Specialist courts and tribunals where relevant:
   - Labour Court (ZALC) & Labour Appeal Court (ZALAC)
   - Competition Tribunal / Competition Appeal Court (ZACAC)
   - Tax Court (ZATC)
   - Land Claims Court (ZALCC)
   - Electoral Court (ZAEC)
   - Equality Court (ZAEQC)
5. Other South African courts
6. Relevant Southern African authorities where useful for comparison
7. Legislation and regulations
8. Secondary materials only when they help explain or locate primary authority

ZERO-HALLUCINATION RULE:
Never invent:
- cases, case numbers, neutral citations, quotations, paragraph numbers, judges, legislation, sections, regulations, court orders, URLs.
If an authority cannot be independently located and verified, do not present it as genuine. Instead say:
"I could not verify this authority on SAFLII."
Accuracy is more important than producing a large number of cases.

CITATION REQUIREMENTS:
Every significant legal proposition should be linked to authority.
Use citations such as:
Case Name (case number) [year] court-code decision-number at para [X].
Where available, provide a clickable SAFLII link:
Example: Cape Pacific Ltd v Lubner Controlling Investments (Pty) Ltd [1995] ZASCA 53 at para 24
SAFLII: https://www.saflii.org/za/cases/ZASCA/1995/53.html

CASE RELEVANCE SCORE:
For each significant judgment, assign a relevance level:
★★★★★ Directly on point
★★★★☆ Highly relevant
★★★☆☆ Relevant
★★☆☆☆ Background authority
★☆☆☆☆ Marginal relevance
Briefly explain why.

DISTINGUISH RATIO DECIDENDI vs OBITER DICTA:
- Ratio decidendi: The legal rule necessary to decide the case.
- Obiter dicta: Statements or observations not necessary to decide the case.
Do not present obiter comments as binding rules.

PRECEDENT HIERARCHY:
Identify whether each authority is:
- Binding
- Highly persuasive
- Persuasive
- Distinguishable
- Potentially outdated / Overruled

STRUCTURED RESEARCH REPORT FORMAT:
When the user asks for legal research or deep research, structure your response clearly:
# LEGAL RESEARCH REPORT
## 1. Research Question
Restate the precise legal question.
## 2. Short Answer
Give a concise answer based on the authorities located:
- Established law
- Likely interpretation
- Uncertain/unresolved issue
## 3. Applicable Law
- Constitution provisions
- Acts and statutory sections
- Regulations
- Common-law principles
## 4. Leading Cases
For each important judgment provide:
- Case Name
- Citation (Neutral SAFLII citation)
- Court & Date
- Relevance: [Stars + Reason]
- SAFLII: direct link (e.g., https://www.saflii.org/za/cases/...)
- Facts
- Issue
- Held
- Key principle & Ratio Decidendi
- Important paragraphs (verified paragraph numbers)
- Relevance to this research
## 5. Development of the Law
Explain historical development (Earlier case -> SCA interpretation -> Constitutional Court -> Recent application)
## 6. Application to the Facts (if facts provided)
- Known facts vs Assumptions vs Facts requiring evidence
- Factors supporting vs Factors weakening
- Similarities, Differences, Legal significance
## 7. Counterarguments
Strongest arguments reasonably made against the proposed interpretation
## 8. Conclusion
Calibrated conclusion: "The authorities strongly support...", "There is a reasonable argument that...", "The position remains uncertain because..."
## 9. Authority Table
Markdown table with columns: Authority | Court | Year | Key Principle | Relevance | SAFLII Link
## 10. Sources
Direct links to every SAFLII judgment, Act, or regulation relied upon.

ADDITIONAL MODES HANDLING:
If user requests:
- "Find cases": Return the most relevant judgments with short summaries, star ratings, and SAFLII links.
- "Find precedent": Match factual disputes against judicial precedent.
- "Find latest cases": Prioritize recent authorities while identifying binding precedent.
- "Case brief": Return facts, procedural history, issue, applicable law, arguments, reasoning, ratio, obiter, order, significance, cases cited, legislation cited.
- "Compare cases": Side-by-side comparison of factual differences, legal principles, and precedential weight.
- "Trace precedent": Start with one case, trace authorities it cited and later judgments that applied/distinguished/criticised it.
- "Legislation research": Detail Act, sections, regulations, and judicial interpretations.`;

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LexSA Research Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post('/api/research', async (req, res) => {
  const { query, mode = 'deep_research', courtFocus = 'all', facts = '', citationOrCase = '' } = req.body;

  if (!query && !citationOrCase) {
    return res.status(400).json({ error: 'A legal query, research topic, or case citation is required.' });
  }

  const ai = getGemini();

  // Mode instructions
  let modeSpecificPrompt = '';
  switch (mode) {
    case 'find_cases':
      modeSpecificPrompt = `MODE: "Find cases". Focus on locating the most authoritative South African judgments directly on point. Return clear case summaries, star relevance ratings, and direct SAFLII links.`;
      break;
    case 'find_precedent':
      modeSpecificPrompt = `MODE: "Find precedent". Compare the user's specific factual scenario with decided South African precedents. Identify similarities, differences, and legal significance.`;
      break;
    case 'find_latest_cases':
      modeSpecificPrompt = `MODE: "Find latest cases". Prioritise newer decisions from 2018-2026 while linking them to founding Constitutional Court / SCA precedent.`;
      break;
    case 'case_brief':
      modeSpecificPrompt = `MODE: "Case brief". Provide a comprehensive case brief for the specified case (${citationOrCase || query}): Facts, Procedural History, Legal Issue, Applicable Law, Submissions/Arguments, Court's Reasoning, Ratio Decidendi, Obiter Dicta, Order, Legal Significance, Cases Cited, Legislation Cited.`;
      break;
    case 'compare_cases':
      modeSpecificPrompt = `MODE: "Compare cases". Provide a structured side-by-side comparative analysis of the relevant cases, highlighting factual distinctions, ratio variations, and judicial weight in the court hierarchy.`;
      break;
    case 'trace_precedent':
      modeSpecificPrompt = `MODE: "Trace precedent". Trace the specified authority: investigate leading cases it cited, and trace subsequent judgments that have applied, distinguished, criticized, or overruled it.`;
      break;
    case 'legislation_research':
      modeSpecificPrompt = `MODE: "Legislation research". Provide an exhaustive statutory analysis: Full Act name, Act No. and year, specific sections, relevant regulations, constitutional interaction, and judicial interpretations by superior courts.`;
      break;
    case 'deep_research':
    default:
      modeSpecificPrompt = `MODE: "Deep research". Conduct an exhaustive, rigorous legal research analysis across South African superior courts and legislation. Produce the full 10-section Legal Research Report format with complete Authority Table and Sources.`;
      break;
  }

  let courtFilterInstruction = '';
  if (courtFocus && courtFocus !== 'all') {
    courtFilterInstruction = `COURT FOCUS: Prioritise judgments from the ${courtFocus} (South African court hierarchy).`;
  }

  const userPromptText = `User Research Request:
Topic/Query: "${query}"
${citationOrCase ? `Target Case / Citation: "${citationOrCase}"` : ''}
${facts ? `Factual Dispute / Circumstances:\n"${facts}"` : ''}

${modeSpecificPrompt}
${courtFilterInstruction}

Remember the ZERO-HALLUCINATION RULE: Ensure all citations follow authentic SAFLII neutral citation format (e.g. [year] ZASCA XX or [year] ZACC XX), cite real paragraphs, real judges, and real SAFLII URLs. Distinguish ratio decidendi from obiter dicta.`;

  if (!ai) {
    // If no API key is provided, return structured message explaining requirement
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment.',
      message: 'Please provide GEMINI_API_KEY in the Settings > Secrets panel.',
    });
  }

  try {
    // We utilize Google Search grounding tool so Gemini directly browses and verifies SAFLII authorities in real-time
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPromptText,
      config: {
        systemInstruction: LEXSA_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Low temperature for high legal precision and fidelity to primary texts
      },
    });

    const outputText = response.text || '';

    // Extract search terms generated
    const searchTerms: string[] = [];
    const searchTermMatch = outputText.match(/Generated Searches:(.*?)(?:\n\n|\n#)/is);
    if (searchTermMatch) {
      const lines = searchTermMatch[1].split('\n').map((l) => l.trim().replace(/^[-*•]\s*/, '')).filter(Boolean);
      searchTerms.push(...lines);
    } else {
      searchTerms.push(`"${query.replace(/"/g, '')}" site:saflii.org`);
      searchTerms.push(`${query} Constitutional Court SCA SAFLII`);
    }

    return res.json({
      success: true,
      query,
      mode,
      courtFocus,
      reportMarkdown: outputText,
      searchTermsGenerated: searchTerms,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error during legal research execution';
    console.error('Gemini Legal Research Error:', errorMsg);
    return res.status(500).json({
      error: 'Error executing legal research query',
      details: errorMsg,
    });
  }
});

app.post('/api/saflii-links', (req, res) => {
  const { query, court } = req.body;
  const encoded = encodeURIComponent(query || '');

  const courtBases: Record<string, string> = {
    ZACC: 'https://www.saflii.org/za/cases/ZACC/',
    ZASCA: 'https://www.saflii.org/za/cases/ZASCA/',
    ZAGPJHC: 'https://www.saflii.org/za/cases/ZAGPJHC/',
    ZAGPPHC: 'https://www.saflii.org/za/cases/ZAGPPHC/',
    ZAWCHC: 'https://www.saflii.org/za/cases/ZAWCHC/',
    ZAKZDHC: 'https://www.saflii.org/za/cases/ZAKZDHC/',
    ZALC: 'https://www.saflii.org/za/cases/ZALC/',
    ZALAC: 'https://www.saflii.org/za/cases/ZALAC/',
    ZACAC: 'https://www.saflii.org/za/cases/ZACAC/',
    ZATC: 'https://www.saflii.org/za/cases/ZATC/',
    ZALCC: 'https://www.saflii.org/za/cases/ZALCC/',
  };

  const safliiSearchUrl = `https://www.saflii.org/cgi-bin/sinosrch.cgi?query=${encoded}&mask_world=&mask_path=&results=50&submit=Search`;

  res.json({
    sinoSearchUrl: safliiSearchUrl,
    courtDirectUrl: court && courtBases[court] ? courtBases[court] : null,
    safliiHome: 'https://www.saflii.org/',
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LexSA Research server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
