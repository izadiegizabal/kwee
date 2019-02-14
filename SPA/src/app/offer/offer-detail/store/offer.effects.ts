import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as OfferActions from './offer.actions';
import {environment} from '../../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';

@Injectable()
export class OfferEffects {
  @Effect()
  offerGetoffer = this.actions$.pipe(
    ofType(OfferActions.TRY_GET_OFFER),
    map((action: OfferActions.TryGetOffer) => {
      return action.payload;
    }),
    switchMap((payload) => {
        const apiEndpointUrl = environment.apiUrl + 'offer/' + payload.id;
        // const token = authState.token;
        // const headers = new HttpHeaders().set('token', token);
        return this.httpClient.get(apiEndpointUrl).pipe(
          map((res: {
            ok: boolean,
            data: {
              offer: any[],
              user: any[],
            }
          }) => {
            return {
              type: OfferActions.SET_OFFER,
              payload: res.data,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffer', err));
            return [
              {
                type: OfferActions.OPERATION_ERROR,
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
  offerPostApplication = this.actions$.pipe(
    ofType(OfferActions.TRY_POST_APPLICATION),
    map((action: OfferActions.TryPostApplication) => {
      return action.payload;
    }),
     withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
       const apiEndpointUrl = environment.apiUrl + 'application';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload);

        return this.httpClient.post(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            application: [],
          }) => {
            console.log(res);
            return {
              type: OfferActions.POST_APPLICATION,
              payload: res.application
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('postApplication', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: OfferActions.OPERATION_ERROR,
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
