export class BusinessModel {
  id: number;
  kweeIndex: {
    total: number,
    salary: number,
    environment: number,
    partners: number,
    services: number,
    installations: number
  };
  name: string;
  img: string;
  cif: string;
  email: string;
  industry: BusinessIndustries;
  state: BusinessAccountStates;
  premium: BusinessAccountSubscriptions;
  lastAccess: Date;
  createdAt: Date;
  address: string;
  location: {
    long: number,
    lat: number
  };
  bio: string;
  website: string;
  size: BusinessSize;
  foundationDate: Date;

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
      salary: number,
      environment: number,
      partners: number,
      services: number,
      installations: number,
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

export enum BusinessIndustries {
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


export enum BusinessAccountStates {
  'Active' = 0,
  'Verification Pending' = 1,
  'Validation Pending' = 2,
  'Blocked' = 3,
}

export enum BusinessAccountSubscriptions {
  'Free / Pay-as-you-go' = 0,
  'Premium' = 1,
  'Elite' = 2,
}

export enum BusinessSize {
  // 'Less than 5 people' = 5,
  'Less than 10 people' = 10,
  'Less than 50 people' = 50,
  'Less than 100 people' = 100,
  'More than 100 people' = 1000,
  // 'More than 1000 people' = 10000,
}
