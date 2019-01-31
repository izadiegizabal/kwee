export class Offer {
  // Basic info
  id: number;
  title: string;
  companyId: number;
  companyName: string;
  companyIndex: number;
  status: OfferStatus;
  description: string;
  publishDate: Date;
  selectionStartDate: Date;

  // Details
  duration: number;
  durationUnit: JobDurationUnit;
  isIndefinite: boolean;
  contractType: ContractType;
  salaryAmount?: number;
  salaryCurrency?: string;
  salaryFrequency?: SalaryFrequency;
  location?: string;
  workLocation: WorkLocationType;
  applications: number;
  seniority?: SeniorityLevel;
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
}

// Enums for the offer details
export enum OfferStatus {
  Open = 0,
  Closed = 1,
  Draft = 2,
  Selection = 3,
}

export enum ContractType {
  'Full-Time' = 0,
  'Part-Time' = 1,
  'Internship' = 2,
  'End of Degree Project' = 3,
}

export enum SalaryFrequency {
  'per hour' = 0,
  'per month' = 1,
  'per year' = 2,
  'for the project' = 3,
}

export enum WorkLocationType {
  'On Site' = 0,
  'Remote' = 1,
  'Partially Remote' = 2,
}

export enum SeniorityLevel {
  'Entry - Junior' = 0,
  Intermediate = 1,
  Senior = 2,
  Lead = 3,
}

export enum JobDurationUnit {
  Days = 0,
  Months = 1,
  Years = 3
}
