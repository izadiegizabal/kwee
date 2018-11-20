import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
  signedIn = false;

  signIn() {
    this.signedIn = true;
  }

  signOut() {
    this.signedIn = false;
  }

  isSignedIn() {
    return this.signedIn.valueOf();
  }
}
