import * as AdminActions from './admin.actions';

export interface State {
  candidates: {
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
  }[];
  businesses: {
    id: number,
    name: string,
    index: number,
    email: string,
    cif: string,
    workField: number,
    state: number,
    premium: number,
    lastAccess: Date,
    createdAt: Date
  }[];
}

const initialState: State = {
  candidates: [],
  businesses: []
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
    default:
      return state;
  }
}
