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
      salaryFrecuency: number,
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
    }[],
    total: number,
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
    default:
      return state;
  }
}
