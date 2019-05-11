import * as KweeLiveActions from './kwee-live.actions';

export interface State {
  applications: {
    data: {
      id: 1,
      applicantLAT: any,
      applicantLON: any,
      offerLAT: any,
      offerLON: any
    }[],
  };
}

const initialState: State = {
  applications: null,
};


export function kweeLiveReducer(state = initialState, action: KweeLiveActions.KweeLiveActions) {
  switch (action.type) {
    case KweeLiveActions.GET_APPLICATIONS:
      return {
        ...state,
        applications: action.payload
      };
    default:
      return state;
  }
}
