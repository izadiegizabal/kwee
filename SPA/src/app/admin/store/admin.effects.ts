import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, share, withLatestFrom} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import * as AdminActions from './admin.actions';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

@Injectable()
export class AdminEffects {
  @Effect()
  adminGetCandidates = this.actions$.pipe(
    ofType(AdminActions.TRY_GET_CANDIDATES),
    withLatestFrom(this.store$.pipe(select(state => state.auth))),
    mergeMap(([action, authState]) => {
        const getUrl = environment.apiUrl + 'applicants';
        const token = authState.token;
        const headers = new HttpHeaders().set('token', token);
        return this.httpClient.get(getUrl, {headers: headers}).pipe(
          map((res: {
            ok: boolean,
            applicants: any[]
          }) => {
            return {
              type: AdminActions.SET_CANDIDATES,
              payload: res.applicants
            };
          }),
          catchError(err => throwError(this.handleError('getApplicants', err)))
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
