import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SingupService {
  // candidateURL = 'https://kwee.ovh/api/user';
  candidateURL = 'http://h203.eps.ua.es/api/user';

  constructor(private http: HttpClient) {
  }

  newUser(candidate: any) {
    const body = JSON.stringify(candidate);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // console.log(body);
    // console.log(headers);
    return this.http.post(this.candidateURL, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(err => throwError(this.handleError('newUser', err)))
    );
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
