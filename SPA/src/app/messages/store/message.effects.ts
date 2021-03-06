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
              type: MessageActions.REORDER_CHATS,
              payload: payload
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
  addMessage = this.actions$.pipe(
    ofType(MessageActions.ADD_MESSAGE),
    map((action: MessageActions.AddMessage) => {
      return {
        type: MessageActions.REORDER_CHATS,
        payload: action.payload
      };
    }),
    share()
  );

  @Effect()
  getChats = this.actions$.pipe(
    ofType(MessageActions.TRY_GET_CHATS),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'messages';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: any) => {
            return {
              type: MessageActions.SET_CHATS,
              payload: res
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getChats', err));
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
        const apiEndpointUrl = environment.apiUrl + 'messages/' + payload;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: any) => {
            this.store$.dispatch(new MessageActions.TryMarkConverRead(payload));
            return {
              type: MessageActions.SET_CONVER,
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
  markConverAsRead = this.actions$.pipe(
    ofType(MessageActions.TRY_MARK_CONVER_AS_READ),
    map((action: MessageActions.TryMarkConverRead) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'messages/read/' + payload;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.put(apiEndpointUrl, undefined, {headers: headers}).pipe(
          map((res: any) => {
            return {
              type: MessageActions.MARK_CONVER_AS_READ,
              payload: payload
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('setAsRead', err));
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
            throwError(this.handleError('getNotis', err));
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
            return {
              type: MessageActions.SET_NOTI_AS_READ,
              payload: payload
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('setNotiAsRead', err));
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
