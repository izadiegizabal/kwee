import * as OffersActions from './offers.actions';

export interface State {
  offers: {
    offer: {
      status: number,
      title: string,
      description: string,
      datePublished: Date,
      dateStart: Date,
      dateEnd: Date,
      location: string,
      salary: number,
      salaryFrecuency: number,
      salaryCurrency: string,
      workLocation: number,
      seniority: number,
      responsabilities: string,
    },
    user: {
      id: number,
      name: string,
      img: string,
      bio: string,
      index: number,
    }
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
