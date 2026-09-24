export type ResearchMode =
  | 'deep_research'
  | 'find_cases'
  | 'find_precedent'
  | 'find_latest_cases'
  | 'case_brief'
  | 'compare_cases'
  | 'trace_precedent'
  | 'legislation_research';

export type CourtFocus =
  | 'all'
  | 'ZACC' // Constitutional Court
  | 'ZASCA' // Supreme Court of Appeal
  | 'ZAHC' // High Courts
  | 'ZALAC' // Labour & Labour Appeal Court
  | 'SPECIALIST'; // Competition, Tax, Land Claims, Equality

export interface LeadingCase {
  id: string;
  name: string;
  neutralCitation: string;
  court: string;
  date: string;
  judges?: string;
  relevanceScore: 1 | 2 | 3 | 4 | 5;
  relevanceLabel: string; // e.g. "★★★★★ Directly on point"
  relevanceExplanation: string;
  safliiUrl: string;
  facts: string;
  issue: string;
  held: string;
  keyPrinciple: string;
  importantParagraphs: string[];
  relevanceToResearch: string;
  ratioDecidendi?: string;
  obiterDicta?: string;
  bindingStatus: 'Binding' | 'Highly Persuasive' | 'Persuasive' | 'Distinguishable' | 'Overruled';
}

export interface AuthorityTableRow {
  authority: string;
  court: string;
  year: string;
  keyPrinciple: string;
  relevance: string;
  safliiUrl?: string;
}

export interface VerifiedSource {
  title: string;
  type: 'Judgment' | 'Act' | 'Regulation' | 'Secondary';
  url: string;
  verifiedOnSaflii: boolean;
  citation?: string;
}

export interface FactualComparison {
  similarities: string[];
  differences: string[];
  legalSignificance: string;
}

export interface ApplicationToFacts {
  knownFacts: string[];
  assumptions: string[];
  factsRequiringEvidence: string[];
  factorsSupporting: string[];
  factorsWeakening: string[];
  comparisons?: FactualComparison;
}

export interface ArgumentAnalysis {
  applicant: {
    strongestBasis: string;
    supportingLegislation: string;
    supportingJudgments: string;
    favourableFacts: string;
  };
  respondent: {
    strongestDefence: string;
    contraryAuthorities: string;
    factualDistinctions: string;
    proceduralIssues: string;
  };
  assessment: string;
}

export interface ResearchReport {
  id: string;
  timestamp: string;
  mode: ResearchMode;
  query: string;
  courtFocus: CourtFocus;
  researchQuestion: string;
  shortAnswer: {
    establishedLaw: string;
    likelyInterpretation: string;
    uncertainOrUnresolved: string;
  };
  applicableLaw: {
    constitution: string[];
    actsAndSections: string[];
    regulations: string[];
    commonLaw: string[];
  };
  leadingCases: LeadingCase[];
  developmentOfLaw: string;
  applicationToFacts?: ApplicationToFacts;
  argumentAnalysis?: ArgumentAnalysis;
  counterarguments: string;
  conclusion: string;
  authorityTable: AuthorityTableRow[];
  sources: VerifiedSource[];
  safliiSearchTermsGenerated: string[];
  rawMarkdown?: string;
}

export interface PresetTopic {
  id: string;
  title: string;
  category: string;
  query: string;
  mode: ResearchMode;
  courtFocus: CourtFocus;
  description: string;
  sampleFacts?: string;
}
