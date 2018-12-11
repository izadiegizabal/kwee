import {Injectable} from '@angular/core';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, throwError} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';

const apiLocation = 'h203.eps.ua.es/api/';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGNIN),
    map((action: AuthActions.TrySignup) => {
      return action.payload;
    }),
    switchMap(
      (authData: { userName: string, password: string }) => {
        const body = JSON.stringify({'email': authData.userName, 'password': authData.password});
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        console.log(body);
        return this.httpClient.post(apiLocation + 'login', body, {headers: headers}).pipe(
          mergeMap((res: {
            ok: string,
            token: string,
            user: {}
          }) => {
            this.router.navigate(['/']);
            return [
              {
                type: AuthActions.SIGNIN
              },
              {
                type: AuthActions.SET_TOKEN,
                payload: res.token
              }
            ];
          }),
          catchError(err => throwError(this.handleError('signIn', err)))
        );
      }
    )
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
