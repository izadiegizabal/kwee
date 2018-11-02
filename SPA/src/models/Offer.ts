export class Offer {
  // Basic info
  id: number;
  title: string;
  companyId: number;
  companyName: string;
  companyIndex: number;
  companyPhotoUri: string;
  status: OfferStatus;
  description: string;
  publishDate: Date;
  selectionStartDate: Date;

  // Details
  startDate: Date;
  endDate?: Date;
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
  Internship = 3,
  EndOfDegreeProject = 4,
}

enum SalaryFrecuency {
  PerMonth = 0,
  PerHour = 1,
  ForProject = 2,
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
