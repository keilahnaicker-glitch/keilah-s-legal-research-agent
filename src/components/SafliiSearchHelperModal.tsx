import React from 'react';
import { X, ExternalLink, Search, Terminal } from 'lucide-react';

interface SafliiSearchHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafliiSearchHelperModal: React.FC<SafliiSearchHelperModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const databases = [
    { code: 'ZACC', name: 'Constitutional Court', url: 'https://www.saflii.org/za/cases/ZACC/' },
    { code: 'ZASCA', name: 'Supreme Court of Appeal', url: 'https://www.saflii.org/za/cases/ZASCA/' },
    { code: 'ZAWCHC', name: 'Western Cape High Court, Cape Town', url: 'https://www.saflii.org/za/cases/ZAWCHC/' },
    { code: 'ZAGPJHC', name: 'Gauteng High Court, Johannesburg', url: 'https://www.saflii.org/za/cases/ZAGPJHC/' },
    { code: 'ZAGPPHC', name: 'Gauteng High Court, Pretoria', url: 'https://www.saflii.org/za/cases/ZAGPPHC/' },
    { code: 'ZAKZDHC', name: 'KwaZulu-Natal High Court, Durban', url: 'https://www.saflii.org/za/cases/ZAKZDHC/' },
    { code: 'ZALC', name: 'Labour Court of South Africa', url: 'https://www.saflii.org/za/cases/ZALC/' },
    { code: 'ZALAC', name: 'Labour Appeal Court', url: 'https://www.saflii.org/za/cases/ZALAC/' },
    { code: 'ZACAC', name: 'Competition Appeal Court', url: 'https://www.saflii.org/za/cases/ZACAC/' },
    { code: 'ZATC', name: 'Tax Court of South Africa', url: 'https://www.saflii.org/za/cases/ZATC/' },
    { code: 'ZALCC', name: 'Land Claims Court', url: 'https://www.saflii.org/za/cases/ZALCC/' },
    { code: 'LEGIS', name: 'Consolidated South African Legislation', url: 'https://www.saflii.org/za/legis/consol_act/' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-50">
              SAFLII Research Syntax & Court Databases
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-stone-800">
          {/* SINO Search Syntax Guide */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-600" />
              SinoSearch Query Techniques (SAFLII Search Engine)
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 font-mono">
                <span className="text-amber-800 font-bold">"exact phrase"</span>
                <p className="text-stone-600 font-sans mt-0.5 text-xs">
                  Enclose multiple terms in quotation marks to match the exact sequence (e.g. <code>"piercing the corporate veil"</code>).
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 font-mono">
                <span className="text-amber-800 font-bold">title(Cape Pacific)</span>
                <p className="text-stone-600 font-sans mt-0.5 text-xs">
                  Restricts matching strictly to the case title / party names rather than the judgment text.
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 font-mono">
                <span className="text-amber-800 font-bold">term1 pre/5 term2</span>
                <p className="text-stone-600 font-sans mt-0.5 text-xs">
                  Proximity search: Matches <code>term1</code> preceding <code>term2</code> within 5 words (e.g. <code>"director" pre/5 "reckless"</code>).
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 font-mono">
                <span className="text-amber-800 font-bold">AND / OR / NOT</span>
                <p className="text-stone-600 font-sans mt-0.5 text-xs">
                  Boolean operators must be capitalized (e.g. <code>"section 22" AND "personal liability" NOT "close corporation"</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Database Codes */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2">
              SAFLII Court Database Collections (Direct Links)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {databases.map((db) => (
                <a
                  key={db.code}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-50 hover:bg-amber-50 rounded border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono font-bold text-amber-800 mr-2 bg-amber-100/60 px-1.5 py-0.5 rounded text-[11px]">
                      {db.code}
                    </span>
                    <span className="text-stone-800 font-medium group-hover:text-amber-950">
                      {db.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex justify-between items-center">
          <a
            href="https://www.saflii.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline"
          >
            <span>Visit SAFLII Homepage</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-md text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
