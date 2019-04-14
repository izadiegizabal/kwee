import {Action} from '@ngrx/store';

export const TRY_GET_APPLICATIONS = 'TRY_GET_APPLICATIONS';
export const GET_APPLICATIONS = 'GET_APPLICATIONS';
export const OPERATION_ERROR = 'OPERATION_ERROR';

export class TryGetApplications implements Action {
  readonly type = TRY_GET_APPLICATIONS;

  constructor(public payload: { page: number, limit: number }) {
  }
}

export class GetApplication implements Action {
  readonly type = GET_APPLICATIONS;

  constructor(public payload: any) {
  }
}


export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}


export type KweeLiveActions =
  TryGetApplications |
  GetApplication |
  OperationError;
