import * as OfferActions from './offer.actions';

export interface State {
  offer: {
    contractType: number,
    currentApplications: number,
    dateEnd: Date,
    datePublished: Date,
    dateStart: Date,
    description: string,
    duration: number,
    durationUnit: number,
    id: number,
    isIndefinite: boolean,
    location: string,
    maxApplicants: number,
    requeriments: string,
    responsabilities: string,
    salaryAmount: number,
    salaryCurrency: string,
    salaryFrequency: number,
    seniority: number,
    skills: string[],
    status: number,
    title: string,
    workLocation: number,

    fk_offerer: number,
    offererName: string,
    offererIndex: number,
    img: string,
  };
}

const initialState: State = {
  offer: null,
};

export function offerReducer(state = initialState, action: OfferActions.OfferActions) {
  switch (action.type) {
    case OfferActions.SET_OFFER:
      return {
        ...state,
        offer: action.payload
      };
    case OfferActions.POST_APPLICATION:
      return {
        ...state,
      };
    default:
      return state;
  }
}
