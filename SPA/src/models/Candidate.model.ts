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
  'Cloud Computing Engineering' = 1,
  'Engineering Management' = 2,
  'Network Engineering' = 3,
  'Technical Support' = 4,
  'Design' = 5,
  'Data Analytics' = 6,
  'Systems Analytics' = 7,
  'Business Analytics' = 8,
  'Developer Operations' = 9,
  'Quality Assurance' = 10,
  'Information Technology' = 11,
  'Project Management' = 12,
  'Product Management' = 13,
  'Software Testing' = 14,
  'Software Developement' = 15,
  'Web Developement' = 16,
  'Marketing' = 17,
  'Technical Sales' = 18,
  'Security' = 19,
  'Database Administrator' = 20
}
