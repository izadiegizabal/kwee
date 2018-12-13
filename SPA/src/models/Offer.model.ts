export class OfferModel {
  // Basic info
  id: number;
  title: string;
  companyId: number;
  companyName: string;
  companyIndex: number;
  photoUrl: string;
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
  salaryFrequency?: SalaryFrecuency;
  location: string;
  workLocation?: WorkLocationType;
  seniority?: SeniorityLevel;
  responsibilities?: string;
  requeriments?: string;
  skills?: string[];
}

// Enums for the offer details
enum OfferStatus {
  Open = 0,
  Closed = 1,
  Draft = 2,
  Selection = 3,
}

enum ContractType {
  FullTime = 0,
  PartTime = 1,
  Internship = 2,
  EndOfDegreeProject = 3,
}

enum SalaryFrecuency {
  PerHour = 0,
  PerMonth = 1,
  PerYear = 2,
  PerProject = 3,
}

enum WorkLocationType {
  OnSite = 0,
  Remote = 1,
  PartRemote = 2,
}

enum SeniorityLevel {
  EntryJunior = 0,
  Intermediate = 1,
  Senior = 2,
  Lead = 3,
}

enum JobDurationUnit {
  Days = 0,
  Months = 1,
  Years = 3
}
