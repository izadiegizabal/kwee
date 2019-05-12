import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | boolean {

    let isAdmin = false;

    this.auth.getUserType().subscribe(
      (user) => {
        if (user && user === 'admin') {
          isAdmin = true;
        } else {
          this.router.navigate(['error/403']);
          isAdmin = false;
        }
      }
    );

    return isAdmin;
  }
}
