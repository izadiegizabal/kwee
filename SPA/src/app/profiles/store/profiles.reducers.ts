import * as ProfilesActions from './profiles.actions';

export interface State {
  candidate: {
    id: number,
    index: number,
    name: string,
    email: string,
    city: string,
    dateBorn: Date,
    premium: number,
    status: number,
    lastAccess: Date,
    img: string,
    bio: string,
    social_networks: string[],
    skills: string[],
    educations: string[],
    languages: string[],
    experiences: string[],
    applications: string[]
  };

  business: {
    address: string,
    cif: string,
    companySize: number,
    createdAt: Date,
    dateVerification: Date,
    email: string,
    id: number,
    img: string,
    index: number,
    lastAccess: Date,
    name: string,
    premium: number,
    social_networks: string[]
    status: number,
    website: string,
    workField: number,
    year: Date,
  };
}

const initialState: State = {
  candidate: null,
  business: null,
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
    default:
      return state;
  }
}
