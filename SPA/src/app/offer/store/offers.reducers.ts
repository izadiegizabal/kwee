import * as OffersActions from './offers.actions';

export interface State {
  offers: {
    data: {
      status: number,
      title: string,
      description: string,
      datePublished: Date,
      dateStart: Date,
      dateEnd: Date,
      location: string,
      salaryAmount: number,
      salaryFrequency: number,
      salaryCurrency: string,
      workLocation: number,
      seniority: number,
      isIndefinite: boolean,
      duration: number,
      durationUnit: number,
      id: number,
      contractType: number,
      maxApplicats: number,
      currentApplications: number,
      fk_offerer: number,
      offererName: string,
      img: string,
      offererIndex: number,
      avg: any
    }[],
    total: number,
    message: string;
  };
}

const initialState: State = {
  offers: null,
};

export function offersReducer(state = initialState, action: OffersActions.OffersActions) {
  switch (action.type) {
    case OffersActions.SET_OFFERS:
      return {
        ...state,
        offers: action.payload
      };
    case OffersActions.UPDATE_OFFER:
      const updatedOffers = [...state.offers.data];
      const totalOffers = state.offers.total;
      for (const i in updatedOffers) {
        if (updatedOffers[i].id === action.payload.id) {
          updatedOffers[i] = {
            ...updatedOffers[i],
            ...action.payload.updateoffer
          };
          break;
        }
      }
      const dataOffers = {data: updatedOffers, total: totalOffers};
      return {
        ...state,
        offers: dataOffers
      };
    case OffersActions.DELETE_OFFER:
      const OfferDel = [...state.offers.data];
      for (const i in OfferDel) {
        if (OfferDel[i].id === action.payload) {
          OfferDel.splice(+i, 1);
          break;
        }
      }
      return {
        ...state,
        offers: OfferDel
      };
    default:
      return state;
  }
}
