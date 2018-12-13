import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SingupService {
  // candidateURL = 'https://kwee.ovh/api/applicant';
  // offererURL = 'https://kwee.ovh/api/offerer';
  // candidateURL = 'http://h203.eps.ua.es/api/user';
  candidateURL = 'localhost:3000/applicant';
  offererURL = 'localhost:3000/offerer';

  constructor(private http: HttpClient) {
  }

  newApplicant(candidate: any) {
    const body = JSON.stringify(candidate);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    /* headers = headers.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy' +
      'Ijp7ImlkIjoxOSwibmFtZSI6InBydWViYTIiLCJlbWFpbCI6InBydWViYTJAYWEuYSIsInJvb3' +
      'QiOnRydWUsImNyZWF0ZWRBdCI6IjIwMTgtMTEtMTdUMTg6MzQ6NDIuMDAwWiIsInVwZGF0ZWRB' +
      'dCI6IjIwMTgtMTEtMTdUMTg6MzQ6NDIuMDAwWiIsImRlbGV0ZWRBdCI6bnVsbH0sImlhdCI6MT' +
      'U0MjQ4ODE4NCwiZXhwIjoxODYyNDg0OTg0fQ.id5OUQjtLqbHIhnwKeSLwW0l2ZeLlC-cdrXvJH-9w54');
    */
    // console.log(body);
    // console.log(headers);
    return this.http.post(this.candidateURL, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(err => throwError(this.handleError('newApplicant', err)))
    );
  }


  newOfferer(offerer: any) {
    const body = JSON.stringify(offerer);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // console.log(body);
    // console.log(headers);
    return this.http.post(this.offererURL, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(err => throwError(this.handleError('newOfferer', err)))
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
