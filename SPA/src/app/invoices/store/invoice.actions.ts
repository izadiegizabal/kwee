import {Action} from '@ngrx/store';

export const TRY_POST_INVOICE = 'TRY_POST_INVOICE';
export const POST_INVOICE = 'POST_INVOICE';
export const OPERATION_ERROR = 'OPERATION_ERROR';

export class TryPostInvoice implements Action {
  readonly type = TRY_POST_INVOICE;

  constructor(public payload: { obj: any }) {
  }
}

export class PostInvoice implements Action {
  readonly type = POST_INVOICE;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type InvoiceActions =
  TryPostInvoice | PostInvoice |
  OperationError;
