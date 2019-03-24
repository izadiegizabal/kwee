import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-offer-manage-candidate',
  templateUrl: './offer-manage-candidate.component.html',
  styleUrls: ['./offer-manage-candidate.component.scss']
})
export class OfferManageCandidateComponent implements OnInit {
  selectedIndex = 1;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.changeTab(params['id']);
      }
    });
  }

  changeTab(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this.router.navigate(['my-offers', this.selectedIndex]);
  }
}
