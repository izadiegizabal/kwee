import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SingupService {
  candidateURL = 'https://kwee.ovh/api/user';

  constructor(private http: HttpClient) {
  }

  newUser(candidate: any) {
    const body = JSON.stringify(candidate);

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxOSwibmFtZSI6InBydWViYTIiLCJlbWFpbCI6InBydWViYTJAYWEuYSIsInJvb3QiOnRydWUsImNyZWF0ZWRBdCI6IjIwMTgtMTEtMTdUMTg6MzQ6NDIuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMTEtMTdUMTg6MzQ6NDIuMDAwWiIsImRlbGV0ZWRBdCI6bnVsbH0sImlhdCI6MTU0MjQ4ODE4NCwiZXhwIjoxODYyNDg0OTg0fQ.id5OUQjtLqbHIhnwKeSLwW0l2ZeLlC-cdrXvJH-9w54');

    // console.log(body);
    // console.log(headers);
    return this.http.post(this.candidateURL, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(this.handleError('PostCandidate', []))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
