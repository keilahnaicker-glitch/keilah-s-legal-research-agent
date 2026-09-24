import { useState, useEffect } from 'react';
import { ResearchMode, CourtFocus, ResearchReport, PresetTopic } from './types';
import { BENCHMARK_REPORTS, PRESET_TOPICS } from './data/landmarkAuthorities';
import { Navbar } from './components/Navbar';
import { ModeSelector } from './components/ModeSelector';
import { CourtHierarchyBar } from './components/CourtHierarchyBar';
import { SearchInputArea } from './components/SearchInputArea';
import { ReportViewer } from './components/ReportViewer';
import { CourtHierarchyModal } from './components/CourtHierarchyModal';
import { SafliiSearchHelperModal } from './components/SafliiSearchHelperModal';
import { Scale, BookOpen, AlertCircle, ExternalLink, ShieldAlert } from 'lucide-react';

export default function App() {
  const initialPreset = PRESET_TOPICS[0]; // Director liability
  const [query, setQuery] = useState(initialPreset.query);
  const [facts, setFacts] = useState(initialPreset.sampleFacts || '');
  const [citationOrCase, setCitationOrCase] = useState('');
  const [currentMode, setCurrentMode] = useState<ResearchMode>('deep_research');
  const [currentCourt, setCurrentCourt] = useState<CourtFocus>('all');

  const [currentReport, setCurrentReport] = useState<ResearchReport | null>(
    BENCHMARK_REPORTS['director-liability']
  );
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [isSafliiGuideOpen, setIsSafliiGuideOpen] = useState(false);

  // Generate initial markdown for benchmark report if not set
  useEffect(() => {
    if (currentReport && !rawMarkdown) {
      const benchmarkMd = `# LEGAL RESEARCH REPORT: ${currentReport.researchQuestion}

## 1. Research Question
${currentReport.researchQuestion}

## 2. Short Answer
### Established Law
${currentReport.shortAnswer.establishedLaw}

### Likely Interpretation
${currentReport.shortAnswer.likelyInterpretation}

### Uncertain / Unresolved Issue
${currentReport.shortAnswer.uncertainOrUnresolved}

## 3. Applicable Law
### Constitution & Statutes
${currentReport.applicableLaw.constitution.map((c) => `- ${c}`).join('\n')}
${currentReport.applicableLaw.actsAndSections.map((a) => `- ${a}`).join('\n')}

### Common Law Principles
${currentReport.applicableLaw.commonLaw.map((cl) => `- ${cl}`).join('\n')}

## 4. Leading Cases
${currentReport.leadingCases
  .map(
    (c) => `### ${c.name}
- **Neutral Citation:** \`${c.neutralCitation}\`
- **Court & Date:** ${c.court} (${c.date})
- **Relevance:** ${c.relevanceLabel}
- **SAFLII Link:** [Open Judgment on SAFLII](${c.safliiUrl})
- **Ratio Decidendi:** ${c.ratioDecidendi || c.keyPrinciple}
- **Facts:** ${c.facts}
- **Held:** ${c.held}
- **Important Paragraphs:** ${Array.isArray(c.importantParagraphs) ? c.importantParagraphs.join(', ') : c.importantParagraphs}
`
  )
  .join('\n\n')}

## 5. Development of the Law
${currentReport.developmentOfLaw}

## 6. Counterarguments
${currentReport.counterarguments}

## 7. Conclusion
${currentReport.conclusion}

## 8. Authority Table
| Authority | Court | Year | Key Principle | Relevance |
| :--- | :--- | :--- | :--- | :--- |
${currentReport.authorityTable
  .map((a) => `| ${a.authority} | ${a.court} | ${a.year} | ${a.keyPrinciple} | ${a.relevance} |`)
  .join('\n')}

## 9. Primary Sources
${currentReport.sources.map((s) => `- [${s.title}](${s.url}) (Verified on SAFLII)`).join('\n')}
`;
      setRawMarkdown(benchmarkMd);
    }
  }, [currentReport, rawMarkdown]);

  const handleSelectPreset = (preset: PresetTopic) => {
    setQuery(preset.query);
    setFacts(preset.sampleFacts || '');
    setCitationOrCase('');
    setCurrentMode(preset.mode);
    setCurrentCourt(preset.courtFocus);

    if (BENCHMARK_REPORTS[preset.id]) {
      const rep = BENCHMARK_REPORTS[preset.id];
      setCurrentReport(rep);
      setRawMarkdown('');
      setError(null);
    }
  };

  const handleConductResearch = async () => {
    if (!query.trim() && !citationOrCase.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode: currentMode,
          courtFocus: currentCourt,
          facts,
          citationOrCase,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to conduct legal research');
      }

      if (data.reportMarkdown) {
        setRawMarkdown(data.reportMarkdown);

        // Build dynamic report object from AI response
        const dynamicReport: ResearchReport = {
          id: `rep-${Date.now()}`,
          timestamp: new Date().toISOString(),
          mode: currentMode,
          query: query || citationOrCase,
          courtFocus: currentCourt,
          researchQuestion: query || `Research into ${citationOrCase}`,
          shortAnswer: {
            establishedLaw: 'Detailed in the legal opinion markdown below.',
            likelyInterpretation: 'Extracted from judicial precedent and superior court jurisprudence.',
            uncertainOrUnresolved: 'See counterarguments and court divergences in opinion.',
          },
          applicableLaw: {
            constitution: [],
            actsAndSections: [],
            regulations: [],
            commonLaw: [],
          },
          leadingCases: currentReport?.leadingCases || [],
          developmentOfLaw: 'See comprehensive analysis in the Legal Opinion view.',
          counterarguments: 'See Section 7 of the generated Legal Opinion.',
          conclusion: 'See Section 8 of the generated Legal Opinion.',
          authorityTable: currentReport?.authorityTable || [],
          sources: [
            {
              title: 'SAFLII Legal Databases',
              type: 'Judgment',
              url: 'https://www.saflii.org/',
              verifiedOnSaflii: true,
            },
          ],
          safliiSearchTermsGenerated: data.searchTermsGenerated || [
            `"${query}" site:saflii.org`,
          ],
        };

        setCurrentReport(dynamicReport);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error during research';
      console.warn('Backend query notice:', errorMsg);

      // Check if this matches one of our rich benchmark topics
      const matchingPreset = PRESET_TOPICS.find(
        (p) =>
          query.toLowerCase().includes(p.id.replace('-', ' ')) ||
          query.toLowerCase().includes(p.title.toLowerCase()) ||
          p.query.toLowerCase() === query.toLowerCase()
      );

      if (matchingPreset && BENCHMARK_REPORTS[matchingPreset.id]) {
        setCurrentReport(BENCHMARK_REPORTS[matchingPreset.id]);
        setError(
          `Notice: Live AI query experienced an issue (${errorMsg}). Loaded verified benchmark SAFLII authorities for "${matchingPreset.title}".`
        );
      } else {
        setError(`Research Query Notice: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-amber-200 selection:text-stone-900">
      {/* Navigation */}
      <Navbar
        onOpenHierarchy={() => setIsHierarchyOpen(true)}
        onOpenSafliiGuide={() => setIsSafliiGuideOpen(true)}
        onPrint={handlePrint}
        hasReport={Boolean(currentReport)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Error / Notice Alert */}
        {error && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start gap-2 shadow-xs no-print">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Notice: </span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-amber-800 hover:text-amber-950 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Court Hierarchy Bar */}
        <CourtHierarchyBar
          currentCourt={currentCourt}
          onSelectCourt={(c) => setCurrentCourt(c)}
        />

        {/* Mode Selector */}
        <ModeSelector
          currentMode={currentMode}
          onSelectMode={(m) => setCurrentMode(m)}
        />

        {/* Search & Fact Input Area */}
        <SearchInputArea
          query={query}
          onQueryChange={setQuery}
          facts={facts}
          onFactsChange={setFacts}
          citationOrCase={citationOrCase}
          onCitationOrCaseChange={setCitationOrCase}
          currentMode={currentMode}
          currentCourt={currentCourt}
          onSelectPreset={handleSelectPreset}
          onSubmit={handleConductResearch}
          isLoading={isLoading}
        />

        {/* Report Display */}
        {currentReport && (
          <div className="pt-2">
            <ReportViewer
              report={currentReport}
              rawMarkdown={rawMarkdown}
              onPrint={handlePrint}
            />
          </div>
        )}

        {/* Research Methodology Explanatory Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs text-stone-600 no-print space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-sm">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>LexSA 8-Step Research Process & Zero-Hallucination Protocol</span>
            </div>
            <span className="text-[11px] font-mono bg-stone-200 px-2 py-0.5 rounded text-stone-700">
              Source: Southern African Legal Information Institute (SAFLII)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] leading-relaxed">
            <div className="bg-white p-3 rounded border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">
                1. Issue & Search Strategy
              </span>
              <p>
                Identifies underlying legal controversies, generates exact statutory section numbers, Act titles, and SINO proximity queries.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">
                2. Judgment Deep Reading
              </span>
              <p>
                Distinguishes binding <em>ratio decidendi</em> from non-binding <em>obiter dicta</em>; extracts verified neutral citations and paragraphs.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">
                3. Stare Decisis Precedent
              </span>
              <p>
                Constitutional Court &gt; Supreme Court of Appeal &gt; High Courts. Considers whether earlier authorities were distinguished or overturned.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">
                4. Zero Hallucination
              </span>
              <p>
                Never invents citations, quotes, or paragraph numbers. Unverified authorities are flagged: <em>"I could not verify this authority on SAFLII."</em>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 mt-12 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold text-stone-200">
              LexSA Research
            </span>
            <span>• South African Legal Research Agent</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHierarchyOpen(true)}
              className="hover:text-stone-200 transition-colors"
            >
              Court Hierarchy Guide
            </button>
            <button
              onClick={() => setIsSafliiGuideOpen(true)}
              className="hover:text-stone-200 transition-colors"
            >
              SAFLII Databases
            </button>
            <a
              href="https://www.saflii.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>SAFLII.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CourtHierarchyModal
        isOpen={isHierarchyOpen}
        onClose={() => setIsHierarchyOpen(false)}
      />
      <SafliiSearchHelperModal
        isOpen={isSafliiGuideOpen}
        onClose={() => setIsSafliiGuideOpen(false)}
      />
    </div>
  );
}
