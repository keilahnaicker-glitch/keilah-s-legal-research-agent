import React from 'react';
import { Scale, BookOpen, ExternalLink, ShieldCheck, Printer } from 'lucide-react';

interface NavbarProps {
  onOpenHierarchy: () => void;
  onOpenSafliiGuide: () => void;
  onPrint: () => void;
  hasReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHierarchy,
  onOpenSafliiGuide,
  onPrint,
  hasReport,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/90 text-stone-950 flex items-center justify-center font-serif font-bold shadow-inner ring-1 ring-amber-400/40">
            <Scale className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-50">
                LexSA Research
              </span>
              <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                SAFLII Grounded
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              South African Legal Research Agent • Zero-Hallucination Verified Authorities
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="btn-hierarchy-modal"
            onClick={onOpenHierarchy}
            className="text-xs sm:text-sm font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
            title="View South African Court Hierarchy & Precedent Rules"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Court Hierarchy</span>
          </button>

          <button
            id="btn-saflii-guide-modal"
            onClick={onOpenSafliiGuide}
            className="text-xs sm:text-sm font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
            title="SAFLII Search Syntax & Databases"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">SAFLII Syntax</span>
          </button>

          <a
            id="link-saflii-portal"
            href="https://www.saflii.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
            title="Open SAFLII in New Tab"
          >
            <span>SAFLII.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {hasReport && (
            <button
              id="btn-navbar-print"
              onClick={onPrint}
              className="text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-stone-700"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
