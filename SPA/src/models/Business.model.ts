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
  'Any' = -1,
  'Energy Equipment & Services' = 0,
  'Oil, Gas & Consumable Fuels' = 1,
  'Chemicals' = 2,
  'Construction Materials' = 3,
  'Containers & Packaging' = 4,
  'Metals & Mining' = 5,
  'Paper & Forest Products' = 6,
  'Aerospace & Defense' = 7,
  'Building Products' = 8,
  'Construction & Engineering' = 9,
  'Electrical Equipment' = 10,
  'Industrial Conglomerates' = 11,
  'Machinery' = 12,
  'Trading Companies & Distributors' = 13,
  'Commercial Services & Supplies' = 14,
  'Professional Services' = 15,
  'Air Freight & Logistics' = 16,
  'Airlines' = 17,
  'Marine' = 18,
  'Road & Rail' = 19,
  'Transportation Infrastructure' = 20,
  'Auto Components' = 21,
  'Automobiles' = 22,
  'Household Durables' = 23,
  'Leisure Products' = 24,
  'Textiles, Apparel & Luxury Goods' = 25,
  'Hotels, Restaurants & Leisure' = 26,
  'Diversified Consumer Services' = 27,
  'Distributors' = 28,
  'Internet & Direct Marketing Retail' = 29,
  'Multiline Retail' = 30,
  'Specialty Retail' = 31,
  'Food & Staples Retailing' = 32,
  'Beverages' = 33,
  'Food Products' = 34,
  'Tobacco' = 35,
  'Household Products' = 36,
  'Personal Products' = 37,
  'Health Care Equipment & Supplies' = 38,
  'Health Care Providers & Services' = 39,
  'Health Care Technology' = 40,
  'Biotechnology' = 41,
  'Pharmaceuticals' = 42,
  'Life Sciences Tools & Services' = 43,
  'Banks' = 44,
  'Thrifts & Mortgage Finance' = 45,
  'Diversified Financial Services' = 46,
  'Consumer Finance' = 47,
  'Capital Markets' = 48,
  'Mortgage Real Estate Investment Trusts (REITs)' = 49,
  'Insurance' = 50,
  'Internet Software & Services' = 51,
  'IT Services' = 52,
  'Software' = 53,
  'Communications Equipment' = 54,
  'Technology Hardware, Storage & Peripherals' = 55,
  'Electronic Equipment, Instruments & Components' = 56,
  'Semiconductors & Semiconductor Equipment' = 57,
  'Diversified Telecommunication Services' = 58,
  'Wireless Telecommunication Services' = 59,
  'Media' = 60,
  'Entertainment' = 61,
  'Interactive Media & Services' = 62,
  'Electric Utilities' = 63,
  'Gas Utilities' = 64,
  'Multi-Utilities' = 65,
  'Water Utilities' = 66,
  'Independent Power and Renewable Electricity Producers' = 67,
  'Equity Real Estate Investment Trusts (REITs)' = 68,
  'Real Estate Management & Development' = 69
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
  'Doesn\'t matter' = 0,
  'Less than 10 people' = 10,
  'Less than 50 people' = 50,
  'Less than 100 people' = 100,
  'More than 100 people' = 1000,
  // 'More than 1000 people' = 10000,
}
