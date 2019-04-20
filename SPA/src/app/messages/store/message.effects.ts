import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as MessageActions from './message.actions';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import * as fromApp from '../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';

@Injectable()
export class MessageEffects {
  @Effect()
  messagePost = this.actions$.pipe(
    ofType(MessageActions.TRY_POST_MESSAGE),
    map((action: MessageActions.TryPostMessage) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'message' ;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.obj);

        return this.httpClient.post(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            message: string,
          }) => {
            return {
              type: MessageActions.POST_MESSAGE,
              payload: res
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('messagePost', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: MessageActions.OPERATION_ERROR,
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
  getMessage = this.actions$.pipe(
    ofType(MessageActions.TRY_GET_MESSAGES),
    map((action: MessageActions.TryGetMessages) => {
console.log('!!!!!!!!!!!!!');

    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
      const apiEndpointUrl = environment.apiUrl + 'messages';
      const token = authState.token;
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
console.log('askdjhfakjsdhfis');

      return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
        map((res: any) => {
          console.log('res: ', res);

          return {
            type: MessageActions.GET_MESSAGES,
            payload: res
          };
        }),
        catchError((err: HttpErrorResponse) => {
          throwError(this.handleError('getMessage', err));
          const error = err.error.message ? err.error.message : err;
          return [
            {
              type: MessageActions.OPERATION_ERROR,
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
