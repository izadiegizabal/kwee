import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../signup/signup-candidate/signup-candidate.component.scss']
})
export class SigninComponent implements OnInit {
  user: FormGroup;
  hide = false;

  constructor(private _formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  

    this.user = this._formBuilder.group({
        'email': new FormControl(null, [Validators.required,  Validators.email]),
        'password': new FormControl(null, Validators.required),
    });
  }

  signIn() {    
    this.authService.signIn(this.user.value)
      .subscribe(
        (response)=> {
              this.router.navigate(['/']); 
              console.log(response)
        },
        (error)=> console.log(error)
    )

  }

}
