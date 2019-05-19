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
        const apiEndpointUrl = environment.apiUrl + 'message';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload);

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

    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'messages';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: any) => {
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

  @Effect()
  getConversation = this.actions$.pipe(
    ofType(MessageActions.TRY_GET_CONVERSATION),
    map((action: MessageActions.TryGetConversation) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'messages/' + payload.id;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: any) => {
            return {
              type: MessageActions.GET_CONVERSATION,
              payload: res
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getConversation', err));
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
  tryGetNotifications = this.actions$.pipe(
    ofType(MessageActions.TRY_GET_NOTIFICATIONS),
    map((action: MessageActions.TryGetNotifications) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'notifications?page=' + payload.page + '&limit=' + payload.limit;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: any) => {
            return {
              type: MessageActions.SET_NOTIFICATIONS,
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

  @Effect()
  trySetNotiRead = this.actions$.pipe(
    ofType(MessageActions.TRY_SET_NOTI_AS_READ),
    map((action: MessageActions.TryGetNotifications) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'notification/' + payload + '/read';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.put(apiEndpointUrl, null, {headers: headers}).pipe(
          map((res: any) => {
            console.log(res);
            return {
              type: MessageActions.SET_NOTI_AS_READ,
              payload: payload
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
