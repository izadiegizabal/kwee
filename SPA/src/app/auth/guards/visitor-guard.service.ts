import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class VisitorGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | boolean {

    let isVisitor = false;

    this.auth.getUserType().subscribe(
      (type) => {
        if (type === '') {
          isVisitor = true;
        } else {
          this.router.navigate(['/']);
        }
      }
    );
    return isVisitor;
  }
}
