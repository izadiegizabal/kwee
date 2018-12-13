import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url = 'https://kwee.ovh/api';

  // url = 'http://h203.eps.ua.es/api';


  constructor(private http: HttpClient) {
  }

  getUser(type: number) {

    let getURL = this.url + '/applicants';

    if (type !== 0) {
      getURL = this.url + '/offerers';
    }

    const headers = new HttpHeaders().set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy' +
      'Ijp7ImlkIjo0LCJuYW1lIjoiQWxiYSIsImVtYWlsIjoiYWxiYTJAZ21haWwuY29tIiwic25fc2lnbmluIjpmYWxzZS' +
      'wicm9vdCI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMTgtMTItMTJUMTI6Mjk6NDQuMDAwWiIsInVwZGF0ZWRBdCI6IjIw' +
      'MTgtMTItMTJUMTI6Mjk6NDQuMDAwWiIsImRlbGV0ZWRBdCI6bnVsbH0sImlhdCI6MTU0NDYxNzgwNiwiZXhwIjoxOD' +
      'Y0NjE0NjA2fQ.GNkWHTHXizvW0L3Q9WYbwg6717lmUBP9hmW0MaVwWgo');

    // console.log(body);
    // console.log(headers);
    return this.http.get(getURL, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(err => throwError(this.handleError('getApplicants', err)))
    );
  }

  updateUser(type: number, id: number, form: any) {
    let updateURL = this.url + '/applicant';

    if (type !== 0) {
      updateURL = this.url + '/offerer';
    }
    const body = JSON.stringify(form);

    const headers = new HttpHeaders().set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy' +
      'Ijp7ImlkIjo0LCJuYW1lIjoiQWxiYSIsImVtYWlsIjoiYWxiYTJAZ21haWwuY29tIiwic25fc2lnbmluIjpmYWxzZS' +
      'wicm9vdCI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMTgtMTItMTJUMTI6Mjk6NDQuMDAwWiIsInVwZGF0ZWRBdCI6IjIw' +
      'MTgtMTItMTJUMTI6Mjk6NDQuMDAwWiIsImRlbGV0ZWRBdCI6bnVsbH0sImlhdCI6MTU0NDYxNzgwNiwiZXhwIjoxOD' +
      'Y0NjE0NjA2fQ.GNkWHTHXizvW0L3Q9WYbwg6717lmUBP9hmW0MaVwWgo');

    console.log(body);
    // console.log(headers);
    console.log(updateURL + '/' + id);
    return this.http.put(updateURL + '/' + id, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        return res;
      }),
      catchError(err => throwError(this.handleError('updateUser', err)))
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
