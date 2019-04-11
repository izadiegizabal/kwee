import {Action} from '@ngrx/store';

export const TRY_POST_INVOICE = 'TRY_POST_INVOICE';
export const POST_INVOICE = 'POST_INVOICE';
export const TRY_GET_INVOICES_APPLICANT = 'TRY_GET_INVOICES_APPLICANT';
export const GET_INVOICES_APPLICANT = 'GET_INVOICES_APPLICANT';
export const TRY_GET_INVOICES_OFFERER = 'TRY_GET_INVOICES_OFFERER';
export const GET_INVOICES_OFFERER = 'GET_INVOICES_OFFERER';
export const OPERATION_ERROR = 'OPERATION_ERROR';
export const CLEAR = 'CLEAR';

export class Clear implements Action {
  readonly type = CLEAR;

  constructor() {
  }
}

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

export class TryGetInvoicesApplicant implements Action {
  readonly type = TRY_GET_INVOICES_APPLICANT;

  constructor(public payload: { id: number }) {
  }
}

export class GetInvoicesApplicant implements Action {
  readonly type = GET_INVOICES_APPLICANT;

  constructor(public payload: any) {
  }
}

export class TryGetInvoicesOfferer implements Action {
  readonly type = TRY_GET_INVOICES_OFFERER;

  constructor(public payload: { id: number }) {
  }
}

export class GetInvoicesOfferer implements Action {
  readonly type = GET_INVOICES_OFFERER;

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
  OperationError | TryGetInvoicesApplicant | TryGetInvoicesOfferer |
  GetInvoicesApplicant | GetInvoicesOfferer | Clear;
