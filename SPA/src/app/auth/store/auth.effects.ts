import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, share, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { TRY_SIGNUP_LINKEDIN } from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNIN),
    map((action: AuthActions.TrySignin) => {
      return action.payload;
    }),
    switchMap(
      (authData: { email: string, password: string }) => {
        const body = JSON.stringify({email: authData.email, password: authData.password});
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.apiUrl + 'login', body, {headers: headers}).pipe(
          mergeMap((res: {
            token: string,
            data: {
              email: string
              id: number
              name: string
              root: boolean
              lastAccess: Date
            }
          }) => {
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
                  root: res.data.root
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

  @Effect()
  authSignupGoogle = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNUP_GOOGLE),
    switchMap(
      () => {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.get(environment.apiUrl + 'auth/google', {headers: headers}).pipe(
          mergeMap((res) => {
            console.log(res);
            return [
              {
                type: AuthActions.TRY_SIGNUP_GOOGLE,
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signUp', err));
            console.log('ERRRROOOORRRR: ', err);
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
  authSignupGitHub = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNUP_GITHUB),
    switchMap(
      () => {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.get(environment.apiUrl + 'auth/github', {headers: headers}).pipe(
          mergeMap((res) => {
            console.log(res);
            return [
              {
                type: AuthActions.TRY_SIGNUP_GITHUB,
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signUp', err));
            console.log('ERRRROOOORRRR: ', err);
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
  authSignupLinkedIn = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNUP_LINKEDIN),
    switchMap(
      () => {
        return this.httpClient.get(environment.apiUrl + 'auth/linkedin').pipe(
          mergeMap((res) => {
            console.log(res);
            return [
              {
                type: AuthActions.TRY_SIGNUP_LINKEDIN,
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signUp', err));
            console.log('ERRRROOOORRRR: ', err);
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
      () => this.router.navigate(['/'])
    )
  );

  constructor(private actions$: Actions, private router: Router, private httpClient: HttpClient) {
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
