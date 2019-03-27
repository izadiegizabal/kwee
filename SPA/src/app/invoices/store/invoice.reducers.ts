import * as InvoiceActions from './invoice.actions';

export interface State {
  invoices: {
    ok: boolean,
    message: string,
  };
}

const initialState: State = {
  invoices: null,
};

export function invoiceReducer(state = initialState, action: InvoiceActions.InvoiceActions) {
  switch (action.type) {
    case InvoiceActions.POST_INVOICE:
      return {
        ...state,
        invoices: action.payload
      };
    default:
      return state;
  }
}
