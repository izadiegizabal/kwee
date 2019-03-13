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

  applications: {
    id: number,
    fk_applicant: number,
    fk_offer: number,
    status: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  };

}

const initialState: State = {
  offer: null,
  applications: null,
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
        applications: action.payload
      };
    case OfferActions.SET_APPLICATION:
      return {
        ...state,
        applications: action.payload
      };
    case OfferActions.DELETE_APPLICATION:
      return {
        ...state,
        applications: action.payload
      };
    default:
      return state;
  }
}
