export class CandidateModel {
  // Basic info
  id: number;
  name: string;
  kweeIndex: {
    total: number,
    efficiency: number,
    skills: number,
    punctuality: number,
    hygiene: number,
    teamwork: number,
  };
  bio: string;
  img: string;
  email: string;
  createdAt: Date;
  lastAccess: Date;
  dateBorn: Date;
  city: string;
  premium: boolean;
  status: CandidateAccountStatus;
  workfield: WorkFields;

  experience: [{
    title: string,
    company: string,
    start: Date,
    end: Date,
    description: string
  }];

  education: [{
    title: string,
    institution: string,
    start: Date,
    end: Date,
    description: string
  }];

  languages: [{
    name: string,
    level: LanguageLevels,
  }];

  skills: [string];

  opinions: [{
    opinionId: number,
    publishedAt: Date,
    offerId: number,
    offerTitle: string,
    userId: number,
    userName: string,
    userIndex: number,
    opinionScore: number,
    ratingScore: number,
    opinion: string,
    details: {
      efficiency: number,
      skills: number,
      punctuality: number,
      hygiene: number,
      teamwork: number,
    },
    replies: [{
      replyId: number,
      userId: number,
      userName: string,
      userIndex: number,
      reply: string,
    }]
  }];

}

export enum CandidateAccountStatus {
  'Active' = 0,
  'Blocked' = 1,
  'Verification Pending' = 2
}

export enum LanguageLevels {
  'Elementary proficiency' = 0,
  'Limited working proficiency' = 1,
  'Professional working proficiency' = 2,
  'Full professional proficiency' = 3,
  'Native or bilingual proficiency' = 4,
}

export enum WorkFields {
  'Software Engineering' = 0,
  'Engineering Management' = 1,
  'Design' = 2,
  'Data Analytics' = 3,
  'Developer Operations' = 4,
  'Quality Assurance' = 5,
  'Information Technology' = 6,
  'Project Management' = 7,
  'Product Management' = 8,
}
