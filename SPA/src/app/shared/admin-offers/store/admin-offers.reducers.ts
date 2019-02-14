import * as AdminOffersActions from './admin-offers.actions';

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

export function adminOffersReducer(state = initialState, action: AdminOffersActions.AdminOffersActions) {
  switch (action.type) {
    case AdminOffersActions.SET_OFFERS_OFFERER:
      return {
        ...state,
        offers: action.payload
      };
    case AdminOffersActions.SET_OFFERS_APPLICANT:
      return {
        ...state,
        offers: action.payload
      };
    default:
      return state;
  }
}

