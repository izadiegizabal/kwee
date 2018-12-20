import * as OffersActions from './offers.actions';

export interface State {
  offers: {
    id: number,
    fk_offerer: number,
    title: string,
    description: string,
    dateStart: Date,
    dateEnd: Date,
    location: string,
    salary: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  }[];
}

const initialState: State = {
  offers: [],
};

export function offersReducer(state = initialState, action: OffersActions.OffersActions) {
  switch (action.type) {
    case OffersActions.SET_OFFERS:
      return {
        ...state,
        offers: action.payload
      };
    default:
      return state;
  }
}
