import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-offer-manage-business',
  templateUrl: './offer-manage-business.component.html',
  styleUrls: ['./offer-manage-business.component.scss']
})
export class OfferManageBusinessComponent implements OnInit {
  selectedIndex = 2;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.changeTab(params['id']);
      } else {
        this.changeTab(1);
      }
    });
  }

  changeTab(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this.router.navigate(['my-offers', this.selectedIndex]);
  }
}
