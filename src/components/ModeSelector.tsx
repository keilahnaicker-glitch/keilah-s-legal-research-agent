import React from 'react';
import { ResearchMode } from '../types';
import {
  FileText,
  Search,
  Scale,
  Clock,
  FileCheck,
  Columns,
  GitBranch,
  BookMarked,
} from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ResearchMode;
  onSelectMode: (mode: ResearchMode) => void;
}

interface ModeItem {
  id: ResearchMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  const modes: ModeItem[] = [
    {
      id: 'deep_research',
      label: 'Deep Research',
      description: 'Exhaustive 10-section report, hierarchy analysis, and complete authority table',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'find_cases',
      label: 'Find Cases',
      description: 'Authoritative judgments with summaries, star ratings, and SAFLII links',
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: 'find_precedent',
      label: 'Find Precedent',
      description: 'Match factual disputes directly against judicial precedents',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: 'find_latest_cases',
      label: 'Find Latest Cases',
      description: 'Prioritise newest rulings while anchoring in binding precedent',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'case_brief',
      label: 'Case Brief',
      description: 'Detailed breakdown of facts, procedural history, ratio decidendi & obiter',
      icon: <FileCheck className="w-4 h-4" />,
    },
    {
      id: 'compare_cases',
      label: 'Compare Cases',
      description: 'Side-by-side comparison of factual differences and precedential weight',
      icon: <Columns className="w-4 h-4" />,
    },
    {
      id: 'trace_precedent',
      label: 'Trace Precedent',
      description: 'Trace cited authorities and later decisions applying or distinguishing it',
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: 'legislation_research',
      label: 'Legislation Research',
      description: 'Statutory sections, amendments, regulations & judicial interpretations',
      icon: <BookMarked className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full no-print">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Research Mode
        </label>
        <span className="text-xs text-stone-500 italic">
          {modes.find((m) => m.id === currentMode)?.description}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-1 bg-stone-200/80 rounded-lg border border-stone-300">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`mode-btn-${m.id}`}
              onClick={() => onSelectMode(m.id)}
              className={`flex flex-col items-center justify-center text-center p-2 rounded-md transition-all text-xs font-medium ${
                isActive
                  ? 'bg-stone-900 text-stone-50 shadow-sm font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
              title={m.description}
            >
              <span className={`mb-1 ${isActive ? 'text-amber-400' : 'text-stone-500'}`}>
                {m.icon}
              </span>
              <span className="truncate w-full">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
