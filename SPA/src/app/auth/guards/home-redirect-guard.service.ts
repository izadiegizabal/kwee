import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HomeRedirectGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | boolean {

    this.auth.getUserType().subscribe(
      (type) => {
        switch (type) {
          case '':
            this.router.navigate(['/home']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'candidate':
            this.router.navigate(['/candidate-home']);
            break;
          case 'business':
            this.router.navigate(['/my-offers']);
            break;
        }
      }
    );
    return true;
  }
}
