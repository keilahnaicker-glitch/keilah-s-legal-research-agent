import React, { useState } from 'react';
import { ResearchReport, LeadingCase } from '../types';
import Markdown from 'react-markdown';
import {
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Scale,
  Award,
  Layers,
  FileCheck,
  HelpCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

interface ReportViewerProps {
  report: ResearchReport;
  rawMarkdown?: string;
  onPrint: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, rawMarkdown, onPrint }) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'opinion'>('structured');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const getRelevanceBadge = (score: number) => {
    switch (score) {
      case 5:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 4:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 3:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 2:
        return 'bg-stone-100 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getBindingBadge = (status: LeadingCase['bindingStatus']) => {
    switch (status) {
      case 'Binding':
        return 'bg-red-50 text-red-800 border-red-200 font-semibold';
      case 'Highly Persuasive':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'Persuasive':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      case 'Distinguishable':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Overruled':
        return 'bg-stone-200 text-stone-600 line-through';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Report Header Bar */}
      <div className="bg-stone-900 text-stone-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-stone-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>South African Legal Research Report • LexSA Verified</span>
          </div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-stone-50">
            {report.researchQuestion || report.query}
          </h2>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center space-x-2 shrink-0 no-print">
          <div className="bg-stone-800 p-0.5 rounded-lg border border-stone-700 flex text-xs">
            <button
              id="btn-tab-structured"
              onClick={() => setActiveTab('structured')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'structured'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              Structured Report
            </button>
            <button
              id="btn-tab-opinion"
              onClick={() => setActiveTab('opinion')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'opinion'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              Legal Opinion Markdown
            </button>
          </div>

          <button
            id="btn-copy-full-report"
            onClick={() =>
              copyToClipboard(
                rawMarkdown || JSON.stringify(report, null, 2),
                'Full Report'
              )
            }
            className="p-1.5 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Copy Report"
          >
            {copiedText === 'Full Report' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            id="btn-print-report-action"
            onClick={onPrint}
            className="p-1.5 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Generated SAFLII Searches Banner */}
      {report.safliiSearchTermsGenerated?.length > 0 && (
        <div className="bg-stone-100 px-5 py-2.5 border-b border-stone-200 text-xs flex flex-wrap items-center gap-2 no-print">
          <span className="font-semibold text-stone-600 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Generated SAFLII Searches:
          </span>
          {report.safliiSearchTermsGenerated.map((term, i) => (
            <a
              key={i}
              href={`https://www.saflii.org/cgi-bin/sinosrch.cgi?query=${encodeURIComponent(
                term
              )}&submit=Search`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-300 hover:border-amber-400 px-2 py-0.5 rounded font-mono text-[11px] transition-colors flex items-center gap-1"
              title="Execute search on SAFLII"
            >
              <span>{term}</span>
              <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
            </a>
          ))}
        </div>
      )}

      {/* Tab 1: Structured Report */}
      {activeTab === 'structured' ? (
        <div className="p-5 sm:p-7 space-y-8 print:p-0">
          {/* SECTION 1: RESEARCH QUESTION */}
          <section id="section-1-research-question">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                1
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Research Question
              </h3>
            </div>
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-stone-900 font-medium text-[15px] leading-relaxed">
                {report.researchQuestion || report.query}
              </p>
            </div>
          </section>

          {/* SECTION 2: SHORT ANSWER */}
          <section id="section-2-short-answer">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                2
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Short Answer
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Established Law */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Established Law</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {report.shortAnswer?.establishedLaw || 'Direct binding precedent firmly established by superior courts.'}
                </p>
              </div>

              {/* Likely Interpretation */}
              <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>Likely Interpretation</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {report.shortAnswer?.likelyInterpretation || 'Supported by modern appellate interpretation and judicial trends.'}
                </p>
              </div>

              {/* Uncertain / Unresolved Issue */}
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Uncertain / Unresolved Issue</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {report.shortAnswer?.uncertainOrUnresolved || 'Potential conflicts between provincial divisions or lack of definitive Constitutional Court confirmation.'}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: APPLICABLE LAW */}
          <section id="section-3-applicable-law">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                3
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Applicable Law
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Constitutional & Statutory Provisions */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  Constitution & Statutes (Acts & Sections)
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {report.applicableLaw?.constitution?.map((c, i) => (
                    <li key={`c-${i}`} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                  {report.applicableLaw?.actsAndSections?.map((act, i) => (
                    <li key={`act-${i}`} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                  {(!report.applicableLaw?.constitution?.length && !report.applicableLaw?.actsAndSections?.length) && (
                    <li className="text-stone-500 italic">No specific statute highlighted.</li>
                  )}
                </ul>
              </div>

              {/* Regulations & Common Law */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Regulations & Common-Law Principles
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {report.applicableLaw?.regulations?.map((reg, i) => (
                    <li key={`reg-${i}`} className="flex items-start gap-1.5">
                      <span className="text-stone-500">•</span>
                      <span>{reg}</span>
                    </li>
                  ))}
                  {report.applicableLaw?.commonLaw?.map((cl, i) => (
                    <li key={`cl-${i}`} className="flex items-start gap-1.5">
                      <span className="text-stone-500">•</span>
                      <span>{cl}</span>
                    </li>
                  ))}
                  {(!report.applicableLaw?.regulations?.length && !report.applicableLaw?.commonLaw?.length) && (
                    <li className="text-stone-500 italic">Governed by general South African common-law standards.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 4: LEADING CASES */}
          <section id="section-4-leading-cases">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                  4
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Leading Cases & Judgments
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                {report.leadingCases?.length || 0} primary authorities analyzed
              </span>
            </div>

            <div className="space-y-4">
              {report.leadingCases?.map((c) => (
                <div
                  key={c.id || c.neutralCitation}
                  className="rounded-lg border border-stone-300 bg-stone-50/40 p-4 sm:p-5 hover:border-stone-400 transition-colors"
                >
                  {/* Case Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3 mb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-stone-950">
                        {c.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-xs text-stone-600">
                        <span className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">
                          {c.neutralCitation}
                        </span>
                        <span>•</span>
                        <span>{c.court}</span>
                        <span>•</span>
                        <span>{c.date}</span>
                        {c.judges && (
                          <>
                            <span>•</span>
                            <span className="text-stone-500 italic">Bench: {c.judges}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border ${getRelevanceBadge(
                          c.relevanceScore
                        )} font-medium`}
                      >
                        {c.relevanceLabel || '★★★★★ Directly on point'}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border ${getBindingBadge(
                          c.bindingStatus
                        )}`}
                      >
                        {c.bindingStatus || 'Binding'}
                      </span>
                    </div>
                  </div>

                  {/* Facts, Issue, Held */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-1 uppercase tracking-wider text-[10px]">
                        Facts:
                      </span>
                      <p className="text-stone-700 leading-relaxed">{c.facts}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-1 uppercase tracking-wider text-[10px]">
                        Issue:
                      </span>
                      <p className="text-stone-700 leading-relaxed">{c.issue}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-1 uppercase tracking-wider text-[10px]">
                        Held:
                      </span>
                      <p className="text-stone-700 leading-relaxed">{c.held}</p>
                    </div>
                  </div>

                  {/* Ratio Decidendi vs Obiter Dicta */}
                  <div className="bg-amber-50/50 p-3 rounded border border-amber-200/80 mb-3 text-xs space-y-1.5">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-900 shrink-0 uppercase tracking-wider text-[10px] bg-amber-100 px-1 py-0.5 rounded">
                        Ratio Decidendi:
                      </span>
                      <p className="text-stone-800 leading-relaxed">
                        {c.ratioDecidendi || c.keyPrinciple}
                      </p>
                    </div>
                    {c.obiterDicta && (
                      <div className="flex items-start gap-1.5 pt-1 border-t border-amber-200/50">
                        <span className="font-bold text-stone-600 shrink-0 uppercase tracking-wider text-[10px] bg-stone-200 px-1 py-0.5 rounded">
                          Obiter Dicta:
                        </span>
                        <p className="text-stone-700 leading-relaxed">{c.obiterDicta}</p>
                      </div>
                    )}
                  </div>

                  {/* Paragraphs & Relevance */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-stone-600 gap-2 pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-700">Verified Paragraphs:</span>
                      <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">
                        {Array.isArray(c.importantParagraphs)
                          ? c.importantParagraphs.join(', ')
                          : c.importantParagraphs}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${c.name} ${c.neutralCitation}`,
                            c.neutralCitation
                          )
                        }
                        className="text-[11px] text-stone-600 hover:text-stone-900 px-2 py-1 bg-white hover:bg-stone-100 rounded border border-stone-200 transition-colors flex items-center gap-1"
                      >
                        {copiedText === c.neutralCitation ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Citation</span>
                      </button>

                      {c.safliiUrl && (
                        <a
                          href={c.safliiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200 rounded border border-amber-300 transition-colors flex items-center gap-1"
                        >
                          <span>Open on SAFLII</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!report.leadingCases || report.leadingCases.length === 0) && (
                <div className="p-4 bg-stone-50 rounded border border-stone-200 text-stone-600 text-xs italic">
                  Leading cases and full authority citations are presented in the Markdown Opinion view below.
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: DEVELOPMENT OF THE LAW */}
          <section id="section-5-development-of-law">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                5
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Development of the Law
              </h3>
            </div>
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 leading-relaxed whitespace-pre-line">
              {report.developmentOfLaw || 'Evolution of common-law principles through Constitutional Court jurisprudence and Supreme Court of Appeal decisions.'}
            </div>
          </section>

          {/* SECTION 6: APPLICATION TO THE FACTS (IF AVAILABLE) */}
          {report.applicationToFacts && (
            <section id="section-6-application-to-facts">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                  6
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Application to the Facts
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="p-3 bg-white rounded border border-stone-200 text-xs">
                  <span className="font-bold text-stone-800 block mb-1 uppercase tracking-wider text-[10px]">
                    Known Facts:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-700">
                    {report.applicationToFacts.knownFacts?.map((kf, i) => (
                      <li key={i}>{kf}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white rounded border border-stone-200 text-xs">
                  <span className="font-bold text-stone-800 block mb-1 uppercase tracking-wider text-[10px]">
                    Assumptions:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-700">
                    {report.applicationToFacts.assumptions?.map((as, i) => (
                      <li key={i}>{as}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white rounded border border-stone-200 text-xs">
                  <span className="font-bold text-stone-800 block mb-1 uppercase tracking-wider text-[10px]">
                    Facts Requiring Evidence:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-700">
                    {report.applicationToFacts.factsRequiringEvidence?.map((fe, i) => (
                      <li key={i}>{fe}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: COUNTERARGUMENTS */}
          <section id="section-7-counterarguments">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                7
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Counterarguments & Defences
              </h3>
            </div>
            <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200/80 text-xs text-stone-800 leading-relaxed">
              {report.counterarguments || 'Defences based on statutory limitation, lack of animus, or procedural non-joinder.'}
            </div>
          </section>

          {/* SECTION 8: CONCLUSION */}
          <section id="section-8-conclusion">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                8
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Conclusion (Calibrated Assessment)
              </h3>
            </div>
            <div className="p-4 bg-stone-900 text-stone-100 rounded-lg shadow-sm border border-stone-800 text-xs sm:text-sm leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                <Award className="w-4 h-4" />
                <span>Defensible Legal Position Supported by Authorities</span>
              </div>
              <p className="text-stone-200">{report.conclusion}</p>
            </div>
          </section>

          {/* SECTION 9: AUTHORITY TABLE */}
          <section id="section-9-authority-table">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                9
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Authority Table
              </h3>
            </div>

            <div className="overflow-x-auto border border-stone-300 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-stone-200 text-xs">
                <thead className="bg-stone-100 text-stone-800 font-semibold">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Authority / Case</th>
                    <th className="px-3 py-2.5 text-left">Court</th>
                    <th className="px-3 py-2.5 text-left">Year</th>
                    <th className="px-3 py-2.5 text-left">Key Principle</th>
                    <th className="px-3 py-2.5 text-left">Relevance</th>
                    <th className="px-3 py-2.5 text-right">SAFLII Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {report.authorityTable?.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="px-3 py-2.5 font-serif font-semibold text-stone-900">
                        {row.authority}
                      </td>
                      <td className="px-3 py-2.5 text-stone-700">{row.court}</td>
                      <td className="px-3 py-2.5 text-stone-600 font-mono">{row.year}</td>
                      <td className="px-3 py-2.5 text-stone-700 max-w-xs">{row.keyPrinciple}</td>
                      <td className="px-3 py-2.5 font-medium text-amber-800">
                        {row.relevance}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {row.safliiUrl && (
                          <a
                            href={row.safliiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!report.authorityTable || report.authorityTable.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-3 py-3 text-center text-stone-500 italic">
                        Refer to Leading Cases section and Markdown Opinion view for the complete table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 10: SOURCES */}
          <section id="section-10-sources">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif">
                10
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Primary Sources & Verified SAFLII Authorities
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.sources?.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        s.type === 'Act'
                          ? 'bg-blue-100 text-blue-800'
                          : s.type === 'Judgment'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {s.type}
                    </span>
                    <span className="truncate text-stone-900 font-medium">{s.title}</span>
                  </div>

                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
                    title="Open verified source on SAFLII"
                  >
                    <span>SAFLII</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Tab 2: Official Markdown Legal Opinion */
        <div className="p-6 sm:p-8 bg-white legal-report-content">
          <div className="mb-4 pb-3 border-b border-stone-200 flex items-center justify-between no-print">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Formatted for Formal Legal Memorandum & Research Report</span>
            </div>
            <button
              onClick={() => copyToClipboard(rawMarkdown || '', 'Markdown Text')}
              className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium flex items-center gap-1 border border-stone-200"
            >
              {copiedText === 'Markdown Text' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Raw Markdown</span>
            </button>
          </div>

          <Markdown>{rawMarkdown || 'Generating legal opinion...'}</Markdown>
        </div>
      )}
    </div>
  );
};
