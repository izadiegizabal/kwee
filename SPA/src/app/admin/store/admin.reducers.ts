import * as AdminActions from './admin.actions';

export interface State {
  candidates: {
    data: {
      city: string
      createdAt: Date,
      dateBorn: Date,
      lastAccess: Date,
      email: string,
      id: number,
      name: string,
      premium: number,
      index: number,
      avg: any,
      status: number,
      bio: string,
      img: string,
    }[],
    total: number,
    message: string;
  };
  businesses: {
    data: {
      id: number,
      name: string,
      index: number,
      avg: any,
      email: string,
      cif: string,
      workField: number,
      status: number,
      premium: number,
      lastAccess: Date,
      createdAt: Date,
      bio: string,
      img: string,
      address: string,
    }[],
    total: number;
    message: string;
  };
}

const initialState: State = {
  candidates: null,
  businesses: null,
};

export function adminReducer(state = initialState, action: AdminActions.AdminActions) {
  switch (action.type) {
    case AdminActions.SET_CANDIDATES:
      return {
        ...state,
        candidates: action.payload
      };
    case AdminActions.SET_BUSINESSES:
      return {
        ...state,
        businesses: action.payload
      };
    case AdminActions.UPDATE_CANDIDATE:
      const updatedCandidate = [...state.candidates.data];
      const totalCandidates = state.candidates.total;
      for (const i in updatedCandidate) {
        if (updatedCandidate[i].id === action.payload.id) {
          updatedCandidate[i] = {
            ...updatedCandidate[i],
            ...action.payload.updatedCandidate
          };
          break;
        }
      }
      const dataCandidates = {data: updatedCandidate, total: totalCandidates};
      return {
        ...state,
        candidates: dataCandidates
      };
    case AdminActions.UPDATE_BUSINESS:
      const updatedBusinesses = [...state.businesses.data];
      const totalBusinesses = state.businesses.total;
      for (const i in updatedBusinesses) {
        if (updatedBusinesses[i].id === action.payload.id) {
          updatedBusinesses[i] = {
            ...updatedBusinesses[i],
            ...action.payload.updatedBusiness
          };
          break;
        }
      }
      const dataBusinessess = {data: updatedBusinesses, total: totalBusinesses};
      return {
        ...state,
        businesses: dataBusinessess
      };
    case AdminActions.DELETE_CANDIDATE:
      const candidatesDel = [...state.candidates.data];
      for (const i in candidatesDel) {
        if (candidatesDel[i].id === action.payload) {
          candidatesDel.splice(+i, 1);
          break;
        }
      }
      return {
        ...state,
        candidates: candidatesDel
      };
    case AdminActions.DELETE_BUSINESS:
      const businessesDel = [...state.businesses.data];
      for (const i in businessesDel) {
        if (businessesDel[i].id === action.payload) {
          businessesDel.splice(+i, 1);
          break;
        }
      }
      return {
        ...state,
        businesses: businessesDel
      };
    default:
      return state;
  }
}
