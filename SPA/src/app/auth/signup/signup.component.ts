import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  selectedIndex = 1;

  constructor(private titleService: Title,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Sign Up');
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'business') {
        this.changeTab(1);
      } else {
        this.changeTab(0);
      }
    });
  }

  changeTab(tabIndex: number) {
    this.selectedIndex = tabIndex;
    let userType = '';
    if (tabIndex === 1) {
      userType = 'business';
    } else {
      userType = 'candidate';
    }
    this.router.navigate(['/signup'], {queryParams: {type: userType}, queryParamsHandling: 'merge'});
  }
}
