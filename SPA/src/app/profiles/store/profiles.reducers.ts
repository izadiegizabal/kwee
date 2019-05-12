import * as ProfilesActions from './profiles.actions';

export interface State {
  candidate: {
    id: number,
    index: number,
    avg: any;
    name: string,
    email: string,
    city: string,
    rol: number,
    dateBorn: Date,
    premium: number,
    status: number,
    lastAccess: Date,
    img: string,
    bio: string,
    social_networks: any,
    skills: string[],
    educations: string[],
    languages: any[],
    experiences: string[],
    applications: string[]
  };

  business: {
    address: string,
    cif: string,
    companySize: number,
    createdAt: Date,
    dateVerification: Date,
    bio: string,
    email: string,
    id: number,
    img: string,
    index: number,
    avg: any;
    lastAccess: Date,
    name: string,
    premium: number,
    social_networks: any,
    status: number,
    website: string,
    workField: number,
    year: Date
  };

  opinions: {
    data: {
      userName: string,
      title: string,
      overall: number,
      opinion: string,
      id: number,
      userRated: number,
      efficiency: number,
      skills: number,
      punctuality: number,
      hygiene: number,
      teamwork: number,
      satisfaction: number,
      createdAt: Date,
    }[],
    total: number,
  };
}

const initialState: State = {
  candidate: null,
  business: null,
  opinions: null,
};

export function profilesReducer(state = initialState, action: ProfilesActions.ProfilesActions) {
  switch (action.type) {
    case ProfilesActions.SET_PROFILE_CANDIDATE:
      return {
        ...state,
        candidate: action.payload
      };
    case ProfilesActions.SET_PROFILE_BUSINESS:
      return {
        ...state,
        business: action.payload
      };
    case ProfilesActions.USER_UPDATE_CANDIDATE:
      return {
        ...state,
        candidate: action.payload
      };
    case ProfilesActions.USER_UPDATE_BUSINESS:
      return {
        ...state,
        business: action.payload
      };
    case ProfilesActions.SET_OPINIONS_USER:
      return {
        ...state,
        opinions: action.payload
      };
    default:
      return state;
  }
}
