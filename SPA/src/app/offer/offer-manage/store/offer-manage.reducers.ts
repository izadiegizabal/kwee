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
  function findCandidate(candidateId: number) {
    let changingCandidate = state.selection.all.find(test => test.id === candidateId);
    if (!changingCandidate) {
      changingCandidate = state.selection.selected.find(test => test.id === candidateId);
    }
    if (!changingCandidate) {
      console.log('Changing candidate couln\'t be found');
    }
    return changingCandidate;
  }

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
        case 0:
          newSelection = {
            ...state.selection,
            all: {...action.payload.candidates, ...state.selection.all}
          };
          break;
        // Fav
        case 1:
          newSelection = {
            ...state.selection,
            all: {
              ...action.payload.candidates, ...state.selection.all
            },
            faved: action.payload.candidates,
          };
          break;
        // Selected / accepted / refused
        case 2:
        case 3:
        case 4:
          newSelection = {
            ...state.selection,
            selected: {...action.payload.candidates, ...state.selection.selected}
          };
          break;
      }

      return {
        ...state,
        selection: newSelection
      };
    case OfferManageActions.SET_CHANGE_APPLICATION_STATUS:
      newSelection = null;
      const changingCandidate = findCandidate(action.payload.candidateId);
      switch (action.payload.status) {
        // to pending
        case 0:
          switch (changingCandidate.status) {
            // from faved -> pending
            case 1:
              const newFaved = {
                ...state.selection.faved
              };
              const newAll = {
                ...state.selection.all
              };
              for (const favCandidate of newFaved) {
                if (favCandidate.id === action.payload.candidateId) {
                  // remove candidate from favs
                  newFaved.slice(favCandidate.index, 1);
                  // change the status to pending in the all array
                  newAll.find(candidate => candidate.id === action.payload.candidateId).status = 0;
                  break;
                }
              }
              newSelection = {
                ...state.selection,
                all: newAll,
                faved: newFaved,
              };
              break;
          }
          break;
        // to faved
        case 1:
          switch (changingCandidate.status) {
            // from pending -> faved
            case 0:
              // add candidate to faved array
              const newFaved = {
                ...changingCandidate,
                ...state.selection.faved
              };
              const newAll = {
                ...state.selection.all
              };

              // change the status to faved in the all array
              newAll.find(candidate => candidate.id === action.payload.candidateId).status = 1;

              newSelection = {
                ...state.selection,
                all: newAll,
                faved: newFaved,
              };
              break;
          }
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

