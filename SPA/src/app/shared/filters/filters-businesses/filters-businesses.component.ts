import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Distances, isStringNotANumber} from '../../../../models/Offer.model';
import {BusinessIndustries, BusinessSize} from '../../../../models/Business.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filters-businesses',
  templateUrl: './filters-businesses.component.html',
  styleUrls: ['./filters-businesses.component.scss']
})
export class FiltersBusinessesComponent implements OnInit {


  // FILTERS
  filters: FormGroup;

  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));
  industries = Object.keys(BusinessIndustries)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessIndustries[key], viewValue: key}));
  openOfferNum = [
    {value: 0, viewValue: 'Doesn\'t matter'},
    {value: 1, viewValue: 'More than 1'},
    {value: 3, viewValue: 'More than 3'},
    {value: 8, viewValue: 'More than 8'},
    {value: 12, viewValue: 'More than 12'},
  ];

  companySizes = Object
    .keys(BusinessSize)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessSize[key], viewValue: key}));


  constructor(private router: Router) {
  }

  ngOnInit() {

    this.filters = new FormGroup({
        'location': new FormControl(),
        'distance': new FormControl(),
        'industry': new FormControl(),
        'foundationDate': new FormControl(),
        'minIndex': new FormControl(0),
        'minRatings': new FormControl(0),
        'openOffers': new FormControl(),
        'companySize': new FormControl(),
        // TODO: complete this
      }
    );

    this.filters.controls['location'].valueChanges.subscribe(() => {
      if (!this.filters.controls['location'].value) {
        this.router.navigate(['/search-businesses'],
          {queryParams: {address: null}, queryParamsHandling: 'merge'});
      } else {
        this.router.navigate(['/search-businesses'],
          {queryParams: {address: this.filters.controls['location'].value}, queryParamsHandling: 'merge'});
      }
    });

    this.filters.controls['minIndex'].valueChanges.subscribe(() => {
      this.router.navigate(['/search-businesses'],
        {
          queryParams: {
            index: JSON.stringify({'gte': this.filters.controls['minIndex'].value})
          }, queryParamsHandling: 'merge'
        });
    });

    this.filters.controls['companySize'].valueChanges.subscribe(() => {
      this.router.navigate(['/search-businesses'],
        {
          queryParams: {companySize: this.filters.controls['companySize'].value}, queryParamsHandling: 'merge'
        });
    });

    this.filters.controls['foundationDate'].valueChanges.subscribe(() => {
      this.router.navigate(['/search-businesses'],
        {
          queryParams: {
            year: JSON.stringify({'gte': this.filters.controls['foundationDate'].value})
          }, queryParamsHandling: 'merge'
        });
    });
  }

}
