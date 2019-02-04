import * as OffersActions from './offers.actions';

export interface State {
  offers: {
    data: {
      offer: {
        id: number,
        status: number,
        title: string,
        description: string,
        datePublished: Date,
        dateStart: Date,
        dateEnd: Date,
        location: string,
        salaryAmount: number,
        salaryFrecuency: number,
        salaryCurrency: string,
        workLocation: number,
        seniority: number,
        isIndefinite: boolean,
        duration: number,
        durationUnit: number,
        fk_offerer: number,
        contractType: number,
      },
      user: {
        id: number,
        name: string,
        img: string,
        bio: string,
        index: number,
      }
    },
  total: number,
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
