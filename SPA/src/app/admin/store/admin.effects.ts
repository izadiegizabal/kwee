import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as AdminActions from './admin.actions';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

@Injectable()
export class AdminEffects {
  @Effect()
  adminGetCandidates = this.actions$.pipe(
    ofType(AdminActions.TRY_GET_CANDIDATES),
    map((action: AdminActions.TryGetCandidates) => {
      return action.payload;
    }),
    // withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap((payload) => {
        let apiEndpointUrl = environment.apiUrl + 'applicants/search?page=' + payload.page + '&limit=' + payload.limit;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = JSON.stringify(payload.params);

        if (payload.order !== '0') {
          apiEndpointUrl += '&sort=' + payload.order;
        }
        return this.httpClient.post(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            data: any[],
            total: number,
            message: string,
          }) => {
            return {
              type: AdminActions.SET_CANDIDATES,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getCandidates', err));
            const error = err.message ? err.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  adminGetBusinesses = this.actions$.pipe(
    ofType(AdminActions.TRY_GET_BUSINESSES),
    map((action: AdminActions.TryGetBusinesses) => {
      return action.payload;
    }),
    // withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap((payload) => {
        let apiEndpointUrl = environment.apiUrl + 'offerers/search?page=' + payload.page + '&limit=' + payload.limit;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = JSON.stringify(payload.params);

        if (payload.order !== '0') {
          apiEndpointUrl += '&sort=' + payload.order;
        }

        return this.httpClient.post(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            data: any[],
            total: number,
            message: string,
          }) => {
            return {
              type: AdminActions.SET_BUSINESSES,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getBusinesses', err));
            const error = err.message ? err.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  adminUpdateCandidate = this.actions$.pipe(
    ofType(AdminActions.TRY_UPDATE_CANDIDATE),
    map((action: AdminActions.TryUpdateCandidate) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'applicant/' + payload.id;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.updatedCandidate);

        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map(() => {
            return {
              type: AdminActions.UPDATE_CANDIDATE,
              payload: {id: payload.id, updatedCandidate: payload.updatedCandidate}
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('updateCandidate', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  adminUpdateBusiness = this.actions$.pipe(
    ofType(AdminActions.TRY_UPDATE_BUSINESS),
    map((action: AdminActions.TryUpdateBusiness) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'offerer/' + payload.id;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.updatedBusiness);
        // console.log(body);
        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map(() => {
            return {
              type: AdminActions.UPDATE_BUSINESS,
              payload: {id: payload.id, updatedBusiness: payload.updatedBusiness}
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('updateBusiness', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  adminDeleteCandidate = this.actions$.pipe(
    ofType(AdminActions.TRY_DELETE_CANDIDATE),
    map((action: AdminActions.TryDeleteCandidate) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'applicant/' + payload;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        return this.httpClient.delete(apiEndpointUrl, {headers: headers}).pipe(
          map(() => {
            return {
              type: AdminActions.DELETE_CANDIDATE,
              payload: payload
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('deleteCandidate', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
              }
            ];
          })
        );
      }
    ),
    share()
  );

  @Effect()
  adminDeleteBusiness = this.actions$.pipe(
    ofType(AdminActions.TRY_DELETE_BUSINESS),
    map((action: AdminActions.TryDeleteBusiness) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'offerer/' + payload;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        return this.httpClient.delete(apiEndpointUrl, {headers: headers}).pipe(
          map(() => {
            return {
              type: AdminActions.DELETE_BUSINESS,
              payload: payload
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('deleteBusiness', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AdminActions.OPERATION_ERROR,
                payload: error
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
