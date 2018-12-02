import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';



@Injectable({providedIn: 'root'})
export class AuthService {


  loginURL:string="https://kwee.ovh/api/login";
  signedIn = false;

  constructor(private httpClient: HttpClient) {  }


  signIn(user:any) {


    let body=JSON.stringify(user);
    let headers=new HttpHeaders().set('Content-Type','application/json');

    console.log(body);
    return this.httpClient.post(this.loginURL, body, {headers:headers}).pipe(
          map(res=>{
            //console.log(res);
            this.signedIn = true;
            return res;
          }),
         catchError(this.handleError('signIn', []))
    )
  }



  signOut() {
    this.signedIn = false;
  }

  isSignedIn() {
    return this.signedIn.valueOf();
  }



    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
     
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
     
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
     
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

}
