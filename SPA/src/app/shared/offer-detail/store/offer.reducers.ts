import * as OfferActions from './offer.actions';

export interface State {
 // offer: {
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
    /*},
    user: {
      id: number,
      name: string,
      img: string,
      bio: string,
      index: number,
    }*/
  };
}

const initialState: State = {
    offer: null,
  }
;

export function offerReducer(state = initialState, action: OfferActions.OfferActions) {
  switch (action.type) {
    case OfferActions.SET_OFFER:
      return {
        ...state,
        offer: action.payload
      };
    default:
      return state;
  }
}
