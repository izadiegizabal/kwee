import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, share, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNIN),
    map((action: AuthActions.TrySignup) => {
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
            this.router.navigate(['/']);
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
                  name: res.user.name
                }
              }
            ];
          }),
          catchError(err => {
            throwError(this.handleError('signIn', err));
            return [
              {
                type: AuthActions.AUTH_ERROR
              }
            ];
          })
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

  constructor(private actions$: Actions, private router: Router, private httpClient: HttpClient) {
  }
}
