import * as AdminActions from './admin.actions';

export interface State {
  candidates: {
    data: {
      city: string
      createdAt: Date,
      dateBorn: Date,
      // lastAccess: Date,
      email: string,
      id: number,
      name: string,
      premium: number,
      // index: number,
      // state: number,
    }[],
    total: number,
  };
  businesses: {
    data: {
      id: number,
      name: string,
      index: number,
      email: string,
      cif: string,
      workField: number,
      state: number,
      premium: number,
      lastAccess: Date,
      createdAt: Date,
    }[],
    total: number;
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
      const updatedCandidates = [...state.candidates.data];
      for (const i in updatedCandidates) {
        if (updatedCandidates[i].id === action.payload.id) {
          updatedCandidates[i] = {
            ...updatedCandidates[i],
            ...action.payload.updatedCandidate
          };
          break;
        }
      }
      return {
        ...state,
        candidates: updatedCandidates
      };
    case AdminActions.UPDATE_BUSINESS:
      const updatedBusinesses = [...state.businesses.data];
      for (const i in updatedBusinesses) {
        if (updatedBusinesses[i].id === action.payload.id) {
          updatedBusinesses[i] = {
            ...updatedBusinesses[i],
            ...action.payload.updatedBusiness
          };
          break;
        }
      }
      return {
        ...state,
        businesses: updatedBusinesses
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
