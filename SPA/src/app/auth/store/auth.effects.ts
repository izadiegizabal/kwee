import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, share, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import * as OfferManageActions from '../../offer/offer-manage/store/offer-manage.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNIN),
    map((action: AuthActions.TrySignin) => {
      return action.payload;
    }),
    switchMap(
      (authData) => {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let body = JSON.stringify({email: authData.email, password: authData.password});

        if (authData.token) {
          if (authData.password) {
            body = JSON.stringify({token: authData.token, password: authData.password});
          } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', authData.token);
          }
        }

        return this.httpClient.post(environment.apiUrl + 'login', body, {headers: headers}).pipe(
          mergeMap((res: {
            token: string,
            data: {
              email: string
              id: number
              name: string
              type: string
              lastAccess: Date
              notifications: number,
              premium: number,
            }
          }) => {
            console.log(res);

            switch (res.data.type) {
              case 'offerer':
                res.data.type = 'business';
                break;
              case 'applicant':
                res.data.type = 'candidate';
                break;
            }

            return [
              {
                type: AuthActions.SIGNIN
              },
              {
                type: AuthActions.SET_TOKEN,
                payload: res.token
              },
              {
                type: AuthActions.SET_USER,
                payload: {
                  email: res.data.email,
                  id: res.data.id,
                  name: res.data.name,
                  type: res.data.type,
                  notifications: res.data.notifications,
                  premium: res.data.premium,
                }
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            console.log(err);
            throwError(this.handleError('signIn', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AuthActions.AUTH_ERROR,
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
  authSignupCandidate = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNUP_CANDIDATE),
    map((action: AuthActions.TrySignupCandidate) => {
      return action.payload;
    }),
    switchMap(
      (authData: {
        password: string,
        email: string,
      }) => {
        const body = JSON.stringify(authData);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.apiUrl + 'applicant', body, {headers: headers}).pipe(
          mergeMap((res) => {
            console.log(res);
            return [
              {
                type: AuthActions.SIGNUP,
              },
              {
                type: AuthActions.TRY_SIGNIN,
                payload: {email: authData.email, password: authData.password}
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signUp', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: error
              }
            ];
          }),
        );
      }
    ),
    share()
  );


  // Inicio de sesión con Oauth

  @Effect()
  signinSN = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNIN_SN),
    map((action: AuthActions.TrySigninSN) => {
      return action.payload;
    }),
    switchMap((payload) => {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', payload.token);
        const body = JSON.stringify({});

        console.log(headers);
        console.log(body);

        return this.httpClient.post(environment.apiUrl + 'login', body, {headers: headers}).pipe(
          mergeMap((res: {
            token: string,
            data: {
              email: string
              id: number
              name: string
              type: string
              lastAccess: Date
              notifications: number,
              premium: number,
            }
          }) => {
            console.log(res);
            switch (res.data.type) {
              case 'offerer':
                res.data.type = 'business';
                break;
              case 'applicant':
                res.data.type = 'candidate';
                break;
            }

            return [
              {
                type: AuthActions.SIGNIN
              },
              {
                type: AuthActions.SET_TOKEN,
                payload: res.token
              },
              {
                type: AuthActions.SET_USER,
                payload: {
                  email: res.data.email,
                  id: res.data.id,
                  name: res.data.name,
                  type: res.data.type,
                  notifications: res.data.notifications,
                  premium: res.data.premium,
                }
              },
              {
                type: AuthActions.TRY_SN_CANDIDATE,
                payload: {
                  type: payload.type,
                  user: payload.user,
                  token: payload.token,
                }
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            console.log(err);
            throwError(this.handleError('signIn', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AuthActions.AUTH_ERROR,
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
  authSNCandidate = this.actions$.pipe(
    ofType(AuthActions.TRY_SN_CANDIDATE),
    map((action: AuthActions.TrySNCandidate) => {
      return action.payload;
    }),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    switchMap(([payload, authState]) => {
        const apiEndpointUrl = environment.apiUrl + 'user/social?type=' + payload.type;
        const body = JSON.stringify(payload.user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', authState.token);

        console.log('ACTUALIZAMOS EL PERFIL');
        console.log(apiEndpointUrl);
        console.log(body);
        console.log(headers);

        return this.httpClient.put(apiEndpointUrl, body, {headers: headers}).pipe(
          map((res) => {
            console.log(res);
            return {
              type: AuthActions.SN_CANDIDATE,
              payload: payload.user
            };
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('authSNCandidate', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: error
              }
            ];
          }),
        );
      }
    ),
    share()
  );

  @Effect()
  authSignupBusiness = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNUP_BUSINESS),
    map((action: AuthActions.TrySignupBusiness) => {
      return action.payload;
    }),
    switchMap(
      (authData: {
        password: string,
        email: string,
      }) => {
        const body = JSON.stringify(authData);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.apiUrl + 'offerer', body, {headers: headers}).pipe(
          mergeMap(() => {
            return [
              {
                type: AuthActions.SIGNUP,
              },
              {
                type: AuthActions.TRY_SIGNIN,
                payload: {email: authData.email, password: authData.password}
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signUp', err));
            const error = err.error.message ? err.error.message : err;
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: error
              }
            ];
          }),
        );
      }
    ),
    share()
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(
      () => {
        this.router.navigate(['/']);
        this.store$.dispatch(new OfferManageActions.EmptyState());
      }
    )
  );

  constructor(private actions$: Actions, private router: Router, private httpClient: HttpClient, private store$: Store<fromApp.AppState>) {
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
