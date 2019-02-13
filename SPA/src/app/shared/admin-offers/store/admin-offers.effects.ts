import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as AdminOffersActions from './admin-offers.actions';
import {environment} from '../../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';

@Injectable()
export class AdminOffersEffects {
  @Effect()
  GetOffersOfferer = this.actions$.pipe(
    ofType(AdminOffersActions.TRY_GET_OFFERS_OFFERER),
    map((action: AdminOffersActions.TryGetOffersOfferer) => {
      return action.payload;
    }),
    //  withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap((payload) => {
        const apiEndpointUrl = environment.apiUrl + 'offerer/' + payload.id
          + '/offers?page=' + payload.page + '&limit=' + payload.limit +
          '&status=' + payload.status + '&summary=0';
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
            console.log(res);
            return {
              type: AdminOffersActions.SET_OFFERS_OFFERER,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersOfferer', err));
            return [
              {
                type: AdminOffersActions.OPERATION_ERROR,
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
    ofType(AdminOffersActions.TRY_GET_OFFERS_APPLICANT),
    map((action: AdminOffersActions.TryGetOffersApplicant) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'application/' + payload.id
          + '?page=' + payload.page + '&limit=' + payload.limit +
          '&status=' + payload.status + '&summary=0';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        console.log(apiEndpointUrl);
        console.log(token);

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
            console.log(res);
            return {
              type: AdminOffersActions.SET_OFFERS_APPLICANT,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffersApplicant', err));
            return [
              {
                type: AdminOffersActions.OPERATION_ERROR,
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

