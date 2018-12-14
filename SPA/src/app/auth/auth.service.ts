import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthService {


   // loginURL = 'https://kwee.ovh/api/login';
  loginURL = 'http://h203.eps.ua.es/api/login';
  signedIn = false;

  constructor(private httpClient: HttpClient) {
  }


  signIn(user: any) {


    const body = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

      console.log(headers);
    console.log(body);
    return this.httpClient.post(this.loginURL, body, {headers: headers}).pipe(
      map(res => {
        // console.log(res);
        this.signedIn = true;
        return res;
      }),
      catchError(err => throwError(this.handleError('signIn', err)))
    );
  }


  signOut() {
    this.signedIn = false;
  }

  isSignedIn() {
    return this.signedIn.valueOf();
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
