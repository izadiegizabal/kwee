import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, share, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

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
            ok: string,
            token: string,
            user: {
              createdAt: Date
              deletedAt: Date
              email: string
              id: number
              name: string
              root: boolean
              sn_signin: boolean
              updatedAt: Date
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
                  email: res.user.email,
                  id: res.user.id,
                  name: res.user.name,
                  root: res.user.root
                }
              }
            ];
          }),
          catchError((err: HttpErrorResponse) => {
            throwError(this.handleError('signIn', err));
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: err.error.err.message
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
        name: string,
        password: string,
        email: string,
        city: string,
        dateBorn: Date,
        premium: string,
        rol: string
      }) => {
        const body = JSON.stringify(authData);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.apiUrl + 'applicant', body, {headers: headers}).pipe(
          mergeMap((res: {
            message: string,
            ok: boolean,
          }) => {
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
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: err.error.error
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
        name: string,
        password: string,
        email: string,
        address: string,
        cif: string,
        workField: string,
        year: Date,
        premium: string,
        companySize: string
      }) => {
        const body = JSON.stringify(authData);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.apiUrl + 'offerer', body, {headers: headers}).pipe(
          mergeMap((res: {
            message: string,
            ok: boolean,
          }) => {
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
            return [
              {
                type: AuthActions.AUTH_ERROR,
                payload: err.error.error
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
