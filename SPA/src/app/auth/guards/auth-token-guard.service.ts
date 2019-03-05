import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthTokenGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | boolean {

    const authedStateObservable = this.auth.isAuthenticated();
    authedStateObservable.subscribe(
      (authed) => {
        if (authed) {
          return true;
        } else {
          this.router.navigate(['signin']);
          return false;
        }
      }
    );

    return authedStateObservable;
  }
}
