export class CandidateModel {
  // Basic info
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  createdAt: Date;
  accessedAt: Date;
  city: string;
  dateBorn: Date;
  premium: boolean;
  status: CandidateAccountStatus;
}

enum CandidateAccountStatus {
  Active = 'active',

}
