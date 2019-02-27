import * as OfferManageActions from './offer-manage.actions';

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
        salaryFrequency: number,
        salaryCurrency: string,
        workLocation: number,
        seniority: number,
        isIndefinite: boolean,
        duration: number,
        durationUnit: number,
        fk_offerer: number,
        contractType: number,
        maxApplicants: number,
        currentApplications: number,
      },
      user: {
        id: number,
        name: string,
        img: string,
        bio: string,
        index: number,
      }
    }[],
    count: {
      Total: number,
      Draft: number,
      Open: number,
      Selection: number,
      Closed: number,
    }[],
  };
}


const initialState: State = {
  offers: null,
};

export function OfferManageReducer(state = initialState, action: OfferManageActions.OfferManageActions) {
  switch (action.type) {
    case OfferManageActions.SET_OFFERS_OFFERER:
      return {
        ...state,
        offers: action.payload
      };
    case OfferManageActions.SET_OFFERS_APPLICANT:
      return {
        ...state,
        offers: action.payload
      };
    default:
      return state;
  }
}

