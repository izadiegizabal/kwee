import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as OffersActions from './offers.actions';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
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
        let apiEndpointUrl = environment.apiUrl + 'offers/search?page=' + payload.page + '&limit=' + payload.limit;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = JSON.stringify(payload.params);

        if (payload.order !== '0') {
          apiEndpointUrl += '&sort=' + payload.order;
        }

        console.log(body);

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


  @Effect()
  OfferUpdate = this.actions$.pipe(
    ofType(OffersActions.TRY_UPDATE_OFFER),
    map((action: OffersActions.TryUpdateOffer) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'offer/' + payload.id;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.updateoffer);

        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res) => {
            // console.log(res);
            return {
              type: OffersActions.UPDATE_OFFER,
              payload: {id: payload.id, updateoffer: payload.updateoffer}
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('updateOffer', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: OffersActions.OPERATION_ERROR,
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
  offerDelete = this.actions$.pipe(
    ofType(OffersActions.TRY_DELETE_OFFER),
    map((action: OffersActions.TryDeleteOffer) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'offer/' + payload;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        return this.httpClient.delete(apiEndpointUrl, {headers: headers}).pipe(
          map((res) => {
            console.log(res);
            return {
              type: OffersActions.DELETE_OFFER,
              payload: payload
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('deleteOffer', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: OffersActions.OPERATION_ERROR,
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

