import * as OfferManageActions from './offer-manage.actions';
import {CandidatePreview} from '../../../../models/candidate-preview.model';

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
    }[]
  };
  selection: {
    all: CandidatePreview[],
    faved: CandidatePreview[],
    selected: CandidatePreview[]
  };
}


const initialState: State = {
  offers: null,
  selection: null
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

    case OfferManageActions.SET_OFFER_CANDIDATES:
      let newSelection = null;
      switch (action.payload.status) {
        case 1:
          newSelection = {
            ...state.selection,
            faved: action.payload.candidates
          };
          break;
        case 2:
          newSelection = {
            ...state.selection,
            selected: action.payload.candidates
          };
          break;
        default:
          newSelection = {
            ...state.selection,
            all: action.payload.candidates
          };
          break;
      }

      return {
        ...state,
        selection: newSelection
      };
    default:
      return state;
  }
}

