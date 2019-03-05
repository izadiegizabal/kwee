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
        switch (type) {
          case '':
            isVisitor = true;
            break;
          case 'admin':
            this.router.navigate(['admin']);
            break;
          case 'candidate':
            this.router.navigate(['candidate-home']);
            break;
          case 'business':
            this.router.navigate(['business-home']);
            break;
        }
      }
    );
    return isVisitor;
  }
}
