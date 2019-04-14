import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as KweeLiveActions from './kwee-live.actions';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import * as fromApp from '../../store/app.reducers';
import {Router} from '@angular/router';


@Injectable()
export class KweeLiveEffects {
  @Effect()
  kweeLiveGetApplications = this.actions$.pipe(
    ofType(KweeLiveActions.TRY_GET_APPLICATIONS),
    map((action: KweeLiveActions.TryGetApplications) => {
      return action.payload;
    }),
    switchMap((payload) => {
        const apiEndpointUrl = environment.apiUrl + 'applications/kweelive?limit=' + payload.limit + '&page=' + payload.page;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res) => {
            return {
              type: KweeLiveActions.GET_APPLICATIONS,
              payload: res
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('kweeLiveGetApplications', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: KweeLiveActions.OPERATION_ERROR,
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
