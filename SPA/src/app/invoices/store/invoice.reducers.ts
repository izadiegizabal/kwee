import * as InvoiceActions from './invoice.actions';

export interface State {
  invoices: {
    id: number,
    product: string,
    createdAt: Date,
    price: string,
    data: any
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
    case InvoiceActions.GET_INVOICES_APPLICANT:
    case InvoiceActions.GET_INVOICES_OFFERER:
      return {
        ...state,
        invoices: action.payload
      };
    case InvoiceActions.CLEAR:
      return {
        ...state,
        invoices: {}
      };
    default:
      return state;
  }
}
