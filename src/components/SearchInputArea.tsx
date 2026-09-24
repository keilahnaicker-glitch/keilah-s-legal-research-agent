import React, { useState } from 'react';
import { ResearchMode, CourtFocus, PresetTopic } from '../types';
import { PRESET_TOPICS } from '../data/landmarkAuthorities';
import { Search, Sparkles, ChevronDown, ChevronUp, FileText, ArrowRight, CornerDownRight } from 'lucide-react';

interface SearchInputAreaProps {
  query: string;
  onQueryChange: (q: string) => void;
  facts: string;
  onFactsChange: (f: string) => void;
  citationOrCase: string;
  onCitationOrCaseChange: (c: string) => void;
  currentMode: ResearchMode;
  currentCourt: CourtFocus;
  onSelectPreset: (preset: PresetTopic) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SearchInputArea: React.FC<SearchInputAreaProps> = ({
  query,
  onQueryChange,
  facts,
  onFactsChange,
  citationOrCase,
  onCitationOrCaseChange,
  currentMode,
  currentCourt: _currentCourt,
  onSelectPreset,
  onSubmit,
  isLoading,
}) => {
  const [showFactsSection, setShowFactsSection] = useState(Boolean(facts));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((query.trim() || citationOrCase.trim()) && !isLoading) {
        onSubmit();
      }
    }
  };

  const isCaseCentricMode =
    currentMode === 'case_brief' ||
    currentMode === 'compare_cases' ||
    currentMode === 'trace_precedent';

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-5 no-print">
      {/* Presets / Benchmark questions */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Suggested Legal Inquiries (Click to Load)
          </span>
          <span className="text-[11px] text-stone-400">Normal language questions converted automatically</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              onClick={() => onSelectPreset(preset)}
              className="text-xs bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition-colors text-left flex items-center gap-1.5"
            >
              <CornerDownRight className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="font-medium">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Area */}
      <div className="space-y-3">
        {isCaseCentricMode && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Case Name / Citation (SAFLII Neutral Citation or Parties):
            </label>
            <input
              id="input-target-case"
              type="text"
              value={citationOrCase}
              onChange={(e) => onCitationOrCaseChange(e.target.value)}
              placeholder="e.g. Cape Pacific Ltd v Lubner [1995] ZASCA 53 OR Spring Forest Trading [2014] ZASCA 178"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600 font-mono text-stone-800 bg-stone-50/50"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Legal Question, Fact Pattern, Act / Section or Research Topic:
          </label>
          <div className="relative">
            <textarea
              id="input-legal-query"
              rows={isCaseCentricMode ? 2 : 3}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Find South African cases where a director was personally liable for company debts... OR What cases interpret section 22 of the Companies Act?... OR Can WhatsApp messages create a binding contract?"
              className="w-full px-3.5 py-2.5 text-[15px] border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600 text-stone-800 resize-none leading-relaxed placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Factual dispute drawer toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowFactsSection(!showFactsSection)}
            className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 underline underline-offset-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {showFactsSection
                ? 'Hide Factual Dispute / Circumstances'
                : '+ Add Specific Facts / Hypothetical Dispute (Optional for Step 6 Fact Analysis)'}
            </span>
            {showFactsSection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showFactsSection && (
            <div className="mt-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Known Facts & Circumstances (For Precedent Matching & Argument Analysis):
                </label>
                <span className="text-[11px] text-stone-500">
                  LexSA will separate Known Facts, Assumptions, and Facts requiring evidence.
                </span>
              </div>
              <textarea
                id="input-factual-dispute"
                rows={3}
                value={facts}
                onChange={(e) => onFactsChange(e.target.value)}
                placeholder="Describe the real or hypothetical facts (e.g. Company director incurred R1.5m credit knowing liquidation was imminent... OR WhatsApp exchange promising commercial delivery...)"
                className="w-full px-3 py-2 text-xs text-stone-800 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          )}
        </div>

        {/* Search action bar */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Zero-Hallucination Protocol Active • SAFLII Priority</span>
          </div>

          <button
            id="btn-conduct-research"
            onClick={onSubmit}
            disabled={isLoading || (!query.trim() && !citationOrCase.trim())}
            className={`px-5 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all shadow-sm ${
              isLoading || (!query.trim() && !citationOrCase.trim())
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-amber-400 font-semibold'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Researching SAFLII...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>Conduct Legal Research</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
