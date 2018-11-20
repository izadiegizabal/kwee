import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../signup/signup-candidate/signup-candidate.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  signIn() {
    this.authService.signIn();
    this.router.navigate(['/']);
  }

}
