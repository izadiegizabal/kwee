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
        applications: any[]
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
    selected: CandidatePreview[],
    accepted: CandidatePreview[],
    refused: CandidatePreview[],
  };
}


const initialState: State = {
  offers: null,
  selection: {
    all: [],
    faved: [],
    selected: [],
    accepted: [],
    refused: [],
  }
};

export function OfferManageReducer(state = initialState, action: OfferManageActions.OfferManageActions) {
  switch (action.type) {
    case OfferManageActions.EMPTY_STATE:
      return {offers: null, selection: null};

    case OfferManageActions.SET_OFFERS_OFFERER:
    case OfferManageActions.SET_OFFERS_APPLICANT:
      return {
        ...state,
        offers: action.payload
      };

    case OfferManageActions.SET_APPLICATIONS_ACCEPTED:
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
            all: action.payload.candidates,
          };
          break;
        // Fav
        case 1:
          newSelection = {
            ...state.selection,
            faved: action.payload.candidates,
          };
          break;
        // Selected
        case 2:
          newSelection = {
            ...state.selection,
            selected: action.payload.candidates,
          };
          break;
        // Accepted
        case 3:
          newSelection = {
            ...state.selection,
            accepted: action.payload.candidates,
          };
          break;
        // refused
        case 4:
          newSelection = {
            ...state.selection,
            refused: action.payload.candidates,
          };
          break;
      }

      return {
        ...state,
        selection: newSelection
      };

    // case OfferManageActions.SET_CHANGE_APPLICATION_STATUS:
    //   newSelection = null;
    //   const changingCandidate = findCandidate(action.payload.candidateId);
    //   newSelection = removedSelection(changingCandidate);
    //   console.log(changingCandidate);
    //   console.log(state.selection);
    //   console.log(newSelection);
    //   switch (action.payload.status) {
    //     // to pending
    //     case 0:
    //       newSelection = {
    //         ...newSelection,
    //         all: [...newSelection.all, changingCandidate]
    //       };
    //       break;
    //     // to faved
    //     case 1:
    //       newSelection = {
    //         ...newSelection,
    //         faved: [...newSelection.all, changingCandidate]
    //       };
    //       break;
    //   }
    //   return {
    //     ...state,
    //     selection: newSelection
    //   };
    default:
      return state;
  }

  ////////////////////////////////
  // Helper methods
  ///////////////////////////////

  function findCandidate(candidateId: number) {
    let changingCandidate = state.selection.all.find(test => test.id === candidateId);
    if (!changingCandidate) {
      changingCandidate = state.selection.faved.find(test => test.id === candidateId);
    }
    if (!changingCandidate) {
      changingCandidate = state.selection.selected.find(test => test.id === candidateId);
    }
    if (!changingCandidate) {
      console.log('Changing candidate couln\'t be found');
    }
    return changingCandidate;
  }

  function removedSelection(changingCandidate: CandidatePreview):
    { all: CandidatePreview[], faved: CandidatePreview[], selected: CandidatePreview[] } {
    let foundCandidate = state.selection.all.find(test => test.id === changingCandidate.id);
    if (foundCandidate) {
      const index = state.selection.all.indexOf(foundCandidate);
      const candidates = state.selection.all.splice(index, 1);
      return {
        ...state.selection, all: candidates,
      };
    } else {
      foundCandidate = state.selection.faved.find(test => test.id === changingCandidate.id);
      if (foundCandidate) {
        const index = state.selection.faved.indexOf(foundCandidate);
        const candidates = state.selection.faved.splice(index, 1);
        return {
          ...state.selection, faved: candidates,
        };
      } else {
        foundCandidate = state.selection.selected.find(test => test.id === changingCandidate.id);
        if (foundCandidate) {
          const index = state.selection.selected.indexOf(foundCandidate);
          const candidates = state.selection.selected.splice(index, 1);
          return {
            ...state.selection, selected: candidates,
          };
        }
      }
    }
  }
}

