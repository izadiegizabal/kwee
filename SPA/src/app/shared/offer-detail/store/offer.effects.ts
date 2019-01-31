import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as OfferActions from './offer.actions';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
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
            offer: any[],
            user: any[],
          }) => {
            console.log(res);
            return {
              type: OfferActions.SET_OFFER,
              payload: res.offer,
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
