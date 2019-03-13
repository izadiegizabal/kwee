import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as OfferManageActions from './offer-manage.actions';
import {environment} from '../../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {CandidatePreview} from "../../../../models/candidate-preview.model";

function reformatCandidates(apiApplicationCandidates: any[]): CandidatePreview[] {
  let correctCandidates: CandidatePreview[] = [];
  for (let apiCandidate of apiApplicationCandidates) {
    correctCandidates.push({...apiCandidate, id: apiCandidate.applicantId});
  }
  return correctCandidates;
}

@Injectable()
export class OfferManageEffects {
  @Effect()
  GetOffersOfferer = this.actions$.pipe(
    ofType(OfferManageActions.TRY_GET_OFFERS_OFFERER),
    map((action: OfferManageActions.TryGetOffersOfferer) => {
      return action.payload;
    }),
    //  withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap((payload) => {
        let apiEndpointUrl = environment.apiUrl + 'offerer/' + payload.id
          + '/offers?page=' + payload.page + '&limit=' + payload.limit
          + '&summary=0';

        if (payload.status !== -1) {
          apiEndpointUrl = apiEndpointUrl + '&status=' + payload.status;
        }

        // const token = authState.token;
        // const headers = new HttpHeaders().set('token', token);
        // console.log(apiEndpointUrl);
        return this.httpClient.get(apiEndpointUrl).pipe(
          map((res: {
            ok: boolean,
            message: any,
            data: {
              offer: any[],
              user: any[],
            },
            count: number,
          }) => {
            return {
              type: OfferManageActions.SET_OFFERS_OFFERER,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersOfferer', err));
            return [
              {
                type: OfferManageActions.OPERATION_ERROR,
                payload: err.error.error
              }
            ];
          })
        );
      }
    ),
    share()
  );


  @Effect()
  GetOffersApplicant = this.actions$.pipe(
    ofType(OfferManageActions.TRY_GET_OFFERS_APPLICANT),
    map((action: OfferManageActions.TryGetOffersApplicant) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        let apiEndpointUrl = environment.apiUrl + 'applicant/' + payload.id + '/applications/'
          + '?page=' + payload.page + '&limit=' + payload.limit + '&summary=0';
        if (payload.status !== -1) {
          apiEndpointUrl = apiEndpointUrl + '&status=' + payload.status;
        }

        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        // console.log(apiEndpointUrl);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            message: any,
            data: {
              offer: any[],
              user: any[],
            },
            count: number,
          }) => {
            // console.log(res);
            return {
              type: OfferManageActions.SET_OFFERS_APPLICANT,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersApplicant', err));
            return [
              {
                type: OfferManageActions.OPERATION_ERROR,
                payload: err.error.error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  GetOfferCandidates = this.actions$.pipe(
    ofType(OfferManageActions.TRY_GET_OFFER_CANDIDATES),
    map((action: OfferManageActions.TryGetOfferCandidates) => {
      return action.payload;
    }),
    switchMap((payload) => {
        let apiEndpointUrl = environment.apiUrl + 'offer/' + payload.id +
          '/applications?page=' + payload.page + '&limit=' + payload.limit;

        if (payload.status !== -1) {
          apiEndpointUrl = apiEndpointUrl + '&status=' + payload.status;
        }

        return this.httpClient.get(apiEndpointUrl).pipe(
          map((res: {
            ok: boolean,
            message: any,
            data: any[],
            total: number,
          }) => {
            if (res.ok) {
              const newCandidates = reformatCandidates(res.data);
              return {
                type: OfferManageActions.SET_OFFER_CANDIDATES,
                payload: {status: payload.status, candidates: newCandidates},
              };
            } else {
              return [
                {
                  type: OfferManageActions.OPERATION_ERROR,
                  payload: 'Error from API'
                }
              ];
            }
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersOfferer', err));
            return [
              {
                type: OfferManageActions.OPERATION_ERROR,
                payload: err.error.error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  ChangeApplicationStatus = this.actions$.pipe(
    ofType(OfferManageActions.TRY_CHANGE_APPLICATION_STATUS),
    map((action: OfferManageActions.TryChangeApplicationStatus) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'application/' + payload.applicationId;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify({status: payload.status});
        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
          }) => {
            if (res.ok) {
              return {
                type: OfferManageActions.SET_CHANGE_APPLICATION_STATUS,
                payload: {status: payload.status, candidateId: payload.candidateId},
              };
            } else {
              return [
                {
                  type: OfferManageActions.OPERATION_ERROR,
                  payload: 'Error from API'
                }
              ];
            }
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersOfferer', err));
            return [
              {
                type: OfferManageActions.OPERATION_ERROR,
                payload: err.error.error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  constructor(private actions$: Actions, private store$: Store<fromApp.AppState>, private router: Router, private httpClient: HttpClient) {
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

