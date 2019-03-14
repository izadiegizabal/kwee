import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as OffersActions from './offers.actions';
import {environment} from '../../../environments/environment';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

@Injectable()
export class OffersEffects {
  @Effect()
  offersGetoffers = this.actions$.pipe(
    ofType(OffersActions.TRY_GET_OFFERS),
    map((action: OffersActions.TryGetOffers) => {
      return action.payload;
    }),
    switchMap((payload) => {
      const apiEndpointUrl = environment.apiUrl + 'offers/search?page=' + payload.page + '&limit=' + payload.limit;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const body = JSON.stringify(payload.params);

        // console.log(apiEndpointUrl);
        // console.log(body);

        return this.httpClient.post(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            message: any,
            data: any,
            total: number,
          }) => {
            // console.log(res);
            return {
              type: OffersActions.SET_OFFERS,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOffers', err));
            return [
              {
                type: OffersActions.OPERATION_ERROR,
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

