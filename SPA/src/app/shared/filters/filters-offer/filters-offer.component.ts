import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSidenav} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {
  ContractType,
  Distances,
  isStringNotANumber,
  PublishTime,
  SalaryFrequency,
  SeniorityLevel,
  WorkLocationType
} from '../../../../models/Offer.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-filters-offer',
  templateUrl: './filters-offer.component.html',
  styleUrls: ['./filters-offer.component.scss']
})
export class FiltersOfferComponent implements OnInit {

  // Filter sidebar
  @ViewChild('drawer') drawer: MatSidenav;
  // Helper
  filters: FormGroup;

  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));
  workLocations = Object.keys(WorkLocationType)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkLocationType[key], viewValue: key}));
  jobTypes = Object.keys(ContractType)
    .filter(isStringNotANumber)
    .map(key => ({value: ContractType[key], viewValue: key}));
  frequencies = Object.keys(SalaryFrequency)
    .filter(isStringNotANumber)
    .map(key => ({value: SalaryFrequency[key], viewValue: key}));
  auxCurrencies: any[];
  experienceLevels = Object.keys(SeniorityLevel)
    .filter(isStringNotANumber)
    .map(key => ({value: SeniorityLevel[key], viewValue: key}));
  publishTimes = Object.keys(PublishTime)
    .filter(isStringNotANumber)
    .map(key => ({value: PublishTime[key], viewValue: key}));


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public media: BreakpointObserver,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.filters = new FormGroup({
        'location': new FormControl(),
        // 'distance': new FormControl(),
        'workLocation0': new FormControl(),
        'workLocation1': new FormControl(),
        'workLocation2': new FormControl(),
        'jobType0': new FormControl(),
        'jobType1': new FormControl(),
        'jobType2': new FormControl(),
        'jobType3': new FormControl(),
        'salary': new FormControl(),
        'currency': new FormControl('EUR'),
        'frequency': new FormControl(2),
        'seniority0': new FormControl(),
        'seniority1': new FormControl(),
        'seniority2': new FormControl(),
        'seniority3': new FormControl(),
        'publishDate': new FormControl(),
        'minBusinessIndex': new FormControl(0),
      }
    );


    this.filters.controls['location'].valueChanges.subscribe(() => {
      if (!this.filters.controls['location'].value) {
        this.router.navigate(['/candidate-home'],
          {queryParams: {location: null}, queryParamsHandling: 'merge'});
      } else {
        this.router.navigate(['/candidate-home'],
          {queryParams: {location: this.filters.controls['location'].value}, queryParamsHandling: 'merge'});
      }
    });

    // this.filters.controls['distance'].valueChanges.subscribe(() => {
    //   this.router.navigate(['/candidate-home'],
    //     {queryParams: {distance: this.filters.controls['distance'].value}, queryParamsHandling: 'merge'});
    // });

    this.filters.controls['workLocation0'].valueChanges.subscribe(() => {
      this.countWorkLocation();
    });

    this.filters.controls['workLocation1'].valueChanges.subscribe(() => {
      this.countWorkLocation();
    });

    this.filters.controls['workLocation2'].valueChanges.subscribe(() => {
      this.countWorkLocation();
    });

    this.filters.controls['jobType0'].valueChanges.subscribe(() => {
      this.countContractType();
    });

    this.filters.controls['jobType1'].valueChanges.subscribe(() => {
      this.countContractType();
    });

    this.filters.controls['jobType2'].valueChanges.subscribe(() => {
      this.countContractType();
    });

    this.filters.controls['jobType3'].valueChanges.subscribe(() => {
      this.countContractType();
    });


    this.filters.controls['salary'].valueChanges.subscribe(() => {
      this.router.navigate(['/candidate-home'],
        {queryParams: {salaryAmount_gte: this.filters.controls['salary'].value}, queryParamsHandling: 'merge'});
    });

    this.filters.controls['currency'].valueChanges.subscribe(() => {
      this.router.navigate(['/candidate-home'],
        {queryParams: {salaryCurrency: this.filters.controls['currency'].value}, queryParamsHandling: 'merge'});
    });

    this.filters.controls['frequency'].valueChanges.subscribe(() => {
      this.router.navigate(['/candidate-home'],
        {queryParams: {salaryFrequency: this.filters.controls['frequency'].value}, queryParamsHandling: 'merge'});
    });

    this.filters.controls['seniority0'].valueChanges.subscribe(() => {
      this.countSeniority();
    });

    this.filters.controls['seniority1'].valueChanges.subscribe(() => {
      this.countSeniority();
    });

    this.filters.controls['seniority2'].valueChanges.subscribe(() => {
      this.countSeniority();
    });

    this.filters.controls['seniority3'].valueChanges.subscribe(() => {
      this.countSeniority();
    });

    // this.filters.controls['publishDate'].valueChanges.subscribe(() => {
    //   this.router.navigate(['/candidate-home'],
    //     {queryParams: {publishDate_gte: this.filters.controls['publishDate'].value}, queryParamsHandling: 'merge'});
    // });

    // this.filters.controls['minBusinessIndex'].valueChanges.subscribe(() => {
    //   this.router.navigate(['/candidate-home'],
    //     {queryParams: {offererIndex_gte: this.filters.controls['minBusinessIndex'].value}, queryParamsHandling: 'merge'});
    // });


    this.getJSON().subscribe(data => {
      const evrp = Object.keys(data);
      const gr = [];
      for (const prop of evrp) {
        gr.push(data[prop]);
      }
      this.auxCurrencies = gr;
    });


  }


  getJSON(): Observable<any> {
    return this.http.get('./assets/CurrenciesISO.json');
  }


  countWorkLocation() {
    const queryWorkL = [];

    if (this.filters.controls['workLocation0'].value) {
      queryWorkL.push(0);
    }
    if (this.filters.controls['workLocation1'].value) {
      queryWorkL.push(1);
    }
    if (this.filters.controls['workLocation2'].value) {
      queryWorkL.push(2);
    }

    this.router.navigate(['/candidate-home'],
      {queryParams: {workLocation: queryWorkL}, queryParamsHandling: 'merge'});
  }

  countContractType() {
    const queryCT = [];

    if (this.filters.controls['jobType0'].value) {
      queryCT.push(0);
    }
    if (this.filters.controls['jobType1'].value) {
      queryCT.push(1);
    }
    if (this.filters.controls['jobType2'].value) {
      queryCT.push(2);
    }
    if (this.filters.controls['jobType3'].value) {
      queryCT.push(3);
    }

    this.router.navigate(['/candidate-home'],
      {queryParams: {contractType: queryCT}, queryParamsHandling: 'merge'});
  }

  countSeniority() {
    const queryS = [];

    if (this.filters.controls['seniority0'].value) {
      queryS.push(0);
    }
    if (this.filters.controls['seniority1'].value) {
      queryS.push(1);
    }
    if (this.filters.controls['seniority2'].value) {
      queryS.push(2);
    }
    if (this.filters.controls['seniority3'].value) {
      queryS.push(3);
    }

    this.router.navigate(['/candidate-home'],
      {queryParams: {seniority: queryS}, queryParamsHandling: 'merge'});
  }


}
