import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, share, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as UserActions from './profiles.actions';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';


@Injectable()
export class ProfilesEffects {
  @Effect()
  profileGetCandidate = this.actions$.pipe(
    ofType(UserActions.TRY_GET_PROFILE_CANDIDATE),
    map((action: UserActions.TryGetProfileCandidate) => {
      return action.payload;
    }),
    switchMap((payload) => {
        const apiEndpointUrl = environment.apiUrl + 'applicant/' + payload.id;
        // const token = authState.token;
        // const headers = new HttpHeaders().set('token', token);
        return this.httpClient.get(apiEndpointUrl).pipe(
          map((res: {
            ok: boolean,
            message: any[],
            data: any[],
          }) => {
            // console.log(res);
            if (!res.data) {
              this.router.navigate(['error/404']);
            }
            return {
              type: UserActions.SET_PROFILE_CANDIDATE,
              payload: res.data,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getProfileCandidate', err));
            return [
              {
                type: UserActions.OPERATION_ERROR,
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
  profileGetBusiness = this.actions$.pipe(
    ofType(UserActions.TRY_GET_PROFILE_BUSINESS),
    map((action: UserActions.TryGetProfileBusiness) => {
      return action.payload;
    }),
    switchMap((payload) => {
        const apiEndpointUrl = environment.apiUrl + 'offerer/' + payload.id;
        // const token = authState.token;
        // const headers = new HttpHeaders().set('token', token);
        return this.httpClient.get(apiEndpointUrl).pipe(
          map((res: {
            ok: boolean,
            message: any[],
            data: any[],
          }) => {
            console.log('jhdkajhsgdsagd ' + res);
            if (!res.data) {
              this.router.navigate(['error/404']);
            }
            return {
              type: UserActions.SET_PROFILE_BUSINESS,
              payload: res.data,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getProfileBusiness', err));
            return [
              {
                type: UserActions.OPERATION_ERROR,
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
  userUpdateCandidate = this.actions$.pipe(
    ofType(UserActions.USER_TRY_UPDATE_CANDIDATE),
    map((action: UserActions.UserTryUpdateCandidate) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'applicant';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.updatedCandidate);


        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res) => {
            return {
              type: UserActions.USER_UPDATE_CANDIDATE,
              payload: { updatedCandidate: payload.updatedCandidate}
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('updateCandidate', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: UserActions.OPERATION_ERROR,
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
  userUpdateBusiness = this.actions$.pipe(
    ofType(UserActions.USER_TRY_UPDATE_BUSINESS),
    map((action: UserActions.UserTryUpdateBusiness) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'offerer';
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
        const body = JSON.stringify(payload.updatedBusiness);

        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map(() => {
            return {
              type: UserActions.USER_UPDATE_BUSINESS,
              payload: { updatedBusiness: payload.updatedBusiness}
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('updateBusiness', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: UserActions.OPERATION_ERROR,
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
  profileGetOpinions = this.actions$.pipe(
    ofType(UserActions.TRY_GET_OPINIONS_USER),
    map((action: UserActions.TryGetOpinionsUser) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),

    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'ratings/user/' + payload.id + '?limit=' + payload.limit + '&page=' + payload.page;
        const token = authState.token;
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);

        return this.httpClient.get(apiEndpointUrl, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            message: any[],
            data: any[],
            total: number,
          }) => {
             console.log(res);
            return {
              type: UserActions.SET_OPINIONS_USER,
              payload: res,
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('getOpinionsUser', err));
            return [
              {
                type: UserActions.OPERATION_ERROR,
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
