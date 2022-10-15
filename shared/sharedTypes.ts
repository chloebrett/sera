export interface BestPractice {
  id: string; // sha1 hash of the contents
  paperName?: string;
  paperLink?: string;
  cohorts: string[];
  subCohorts: string[];
  keywords: string[];
  targetAudience?: string;
  findings?: string;
  summary?: string;
  notes?: string;
  bestPractices?: string;
  methodologyUsed?: string;
  toolsUsed?: string;
  terminology?: string;
  notesOfCaution?: string;
  relatedPapers?: string;
  publishDate?: string;
  submissionDate?: string;
}

export interface Cohort {
  name: string;
  parentCohortId: string | null; // uuidv4
  categoryName: string | null; // ignored if parentCohortId is present
  referenceName: string;
}

export interface CompiledContent {
    cohorts: Cohort[];
    bestPractices: BestPractice[];
    metadata: {
      cohorts: string[];
      subCohorts: string[];
      keywords: string[];
    }[];
}
