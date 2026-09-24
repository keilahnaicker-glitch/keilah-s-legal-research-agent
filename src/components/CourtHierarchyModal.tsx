import React from 'react';
import { X, Scale, ShieldCheck, ChevronRight } from 'lucide-react';

interface CourtHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourtHierarchyModal: React.FC<CourtHierarchyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-50">
              South African Court Hierarchy & Rules of Precedent
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-stone-800">
          {/* Rule of Hierarchy */}
          <div className="p-3.5 bg-amber-50/80 rounded-lg border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Primary Source Priority in South African Law
            </h4>
            <p className="text-stone-700 leading-relaxed">
              In accordance with the doctrine of <em>stare decisis</em>, higher courts bind lower courts throughout South Africa. A later High Court judgment does <strong>NOT</strong> override an earlier Supreme Court of Appeal or Constitutional Court authority.
            </p>
          </div>

          {/* Hierarchy Tiers */}
          <div className="space-y-3">
            {/* Level 1: Constitutional Court */}
            <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400 text-xs tracking-wider uppercase">
                  1. Constitutional Court of South Africa (ZACC) • Apex Court
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono">
                  Universal Binding Authority
                </span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed">
                Highest court in all matters (constitutional and general non-constitutional legal issues since the 17th Constitutional Amendment). Decisions bind all other courts in South Africa unconditionally.
              </p>
            </div>

            {/* Level 2: Supreme Court of Appeal */}
            <div className="p-4 rounded-lg bg-stone-100 border border-stone-300">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900 text-xs tracking-wider uppercase">
                  2. Supreme Court of Appeal (ZASCA) • Appellate Apex
                </span>
                <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-mono">
                  Binds All High Courts
                </span>
              </div>
              <p className="text-stone-700 text-xs leading-relaxed">
                Seated in Bloemfontein. Appellate jurisdiction over High Courts. Its decisions are binding on all High Courts and lower tribunals unless overridden by the Constitutional Court.
              </p>
            </div>

            {/* Level 3: High Courts */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900 text-xs tracking-wider uppercase">
                  3. High Courts of South Africa (Full Court & Single Judge)
                </span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono">
                  Division Binding / Persuasive
                </span>
              </div>
              <p className="text-stone-700 text-xs leading-relaxed mb-2">
                Divisions include Gauteng (Pretoria/Johannesburg), Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, North West, Northern Cape.
              </p>
              <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded border border-stone-200 space-y-1">
                <div>• <strong>Full Bench / Full Court (3 judges):</strong> Binds a single judge in the same division.</div>
                <div>• <strong>Inter-divisional authority:</strong> A decision of one Provincial Division (e.g. Western Cape) is highly persuasive but not strictly binding on another Division (e.g. Gauteng).</div>
              </div>
            </div>

            {/* Level 4: Specialist Courts */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900 text-xs tracking-wider uppercase">
                  4. Specialist Courts and Tribunals
                </span>
                <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] px-2 py-0.5 rounded font-mono">
                  Specialist Jurisdiction
                </span>
              </div>
              <p className="text-stone-700 text-xs leading-relaxed mb-2">
                Specialized statutes confer jurisdiction on dedicated tribunals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-700">
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Labour Court (ZALC) & Labour Appeal Court (ZALAC)</div>
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Competition Appeal Court (ZACAC)</div>
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Tax Court (ZATC)</div>
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Land Claims Court (ZALCC)</div>
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Equality Court (ZAEQC)</div>
                <div className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-amber-600" /> Electoral Court (ZAEC)</div>
              </div>
            </div>
          </div>

          {/* Ratio vs Obiter Reminder */}
          <div className="p-3.5 bg-stone-100 rounded-lg border border-stone-200 text-xs">
            <h4 className="font-bold text-stone-900 mb-1">Distinguishing Ratio Decidendi vs Obiter Dicta:</h4>
            <div className="space-y-1 text-stone-700">
              <p>• <strong>Ratio decidendi:</strong> The indispensable reason or legal principle necessary to arrive at the judicial order. This forms binding precedent.</p>
              <p>• <strong>Obiter dicta:</strong> Incidental judicial statements, commentary, or observations that were not essential to the determination of the legal issue. Persuasive only; never binding.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-md text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
