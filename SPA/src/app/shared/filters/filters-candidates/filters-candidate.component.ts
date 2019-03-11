import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {WorkFields} from '../../../../models/Candidate.model';
import {Distances, isStringNotANumber} from '../../../../models/Offer.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filters-candidate',
  templateUrl: './filters-candidate.component.html',
  styleUrls: ['./filters-candidate.component.scss']
})
export class FiltersCandidateComponent implements OnInit {


  // FILTERS
  filters: FormGroup;
  isSkill = 0;
  isLang = 0;

  workfields = Object.keys(WorkFields)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkFields[key], viewValue: key}));
  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));


  constructor(private router: Router) {
  }

  ngOnInit() {

    this.filters = new FormGroup({
        'location': new FormControl(),
        // 'distance': new FormControl(),
        'workfield0': new FormControl(),
        'workfield1': new FormControl(),
        'workfield2': new FormControl(),
        'workfield3': new FormControl(),
        'workfield4': new FormControl(),
        'workfield5': new FormControl(),
        'workfield6': new FormControl(),
        'workfield7': new FormControl(),
        'workfield8': new FormControl(),
        'minAge': new FormControl(),
        'maxAge': new FormControl(),
        'minIndex': new FormControl(0),
        'minRatings': new FormControl(0),
        'skills': new FormArray([new FormControl(null)]),
        'languages': new FormArray([new FormControl(null)]),
      }
    );

    this.filters.controls['location'].valueChanges.subscribe(() => {
      if (!this.filters.controls['location'].value) {
        this.router.navigate(['/search-candidates'],
          {queryParams: {city: null}, queryParamsHandling: 'merge'});
      } else {
        this.router.navigate(['/search-candidates'],
          {queryParams: {city: this.filters.controls['location'].value}, queryParamsHandling: 'merge'});
      }
    });

    this.filters.controls['minIndex'].valueChanges.subscribe(() => {
      this.router.navigate(['/search-candidates'],
        {
          queryParams: {
            index: JSON.stringify({'gte': this.filters.controls['minIndex'].value})
          }, queryParamsHandling: 'merge'
        });
    });

    this.filters.controls['workfield0'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield1'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield2'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield3'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield4'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield5'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield6'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield7'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield8'].valueChanges.subscribe(() => {
      this.countWorkField();
    });

    this.filters.controls['minAge'].valueChanges.subscribe(() => {
      this.minDateSearch();
    });

    this.filters.controls['maxAge'].valueChanges.subscribe(() => {
      this.maxDateSearch();
    });

  }

  addSkillSearch() {
    const skills = [];

    for (let i = 0; i < this.formSkills.length - 1; i++) {
      skills.push(this.formSkills.controls[i].value);
    }

    this.router.navigate(['/search-candidates'],
      {queryParams: {skills: skills}, queryParamsHandling: 'merge'});
  }

  addLanguageSearch() {
    const lang = [];

    for (let i = 0; i < this.formLanguages.length - 1; i++) {
      lang.push(this.formLanguages.controls[i].value);
    }

    this.router.navigate(['/search-candidates'],
      {queryParams: {languages: lang}, queryParamsHandling: 'merge'});
  }

  get formSkills() {
    return <FormArray>this.filters.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.filters.get('languages');
  }

  addSkill() {
    (<FormArray>this.filters.controls['skills']).push(new FormControl(null));
    this.isSkill++;
    // console.log(this.formSkills.length);
    setTimeout(() => {
      document.getElementById(`skill${this.isSkill}`).focus();
    }, 1);
    this.addSkillSearch();
  }

  deleteSkill(i) {
    (<FormArray>this.filters.controls['skills']).removeAt(i);
    this.isSkill--;
    this.addSkillSearch();
  }

  addLang() {
    (<FormArray>this.filters.controls['languages']).push(new FormControl(null));
    this.isLang++;
    setTimeout(() => {
      document.getElementById(`language${this.isLang}`).focus();
    }, 1);
    this.addLanguageSearch();
  }

  delLang(i) {
    (<FormArray>this.filters.controls['languages']).removeAt(i);
    this.isLang--;
    this.addLanguageSearch();
  }

  countWorkField() {
    const queryWorkF = [];

    if (this.filters.controls['workLocation0'].value) {
      queryWorkF.push(0);
    }
    if (this.filters.controls['workLocation1'].value) {
      queryWorkF.push(1);
    }
    if (this.filters.controls['workLocation2'].value) {
      queryWorkF.push(2);
    }
    if (this.filters.controls['workLocation3'].value) {
      queryWorkF.push(3);
    }
    if (this.filters.controls['workLocation4'].value) {
      queryWorkF.push(4);
    }
    if (this.filters.controls['workLocation5'].value) {
      queryWorkF.push(5);
    }
    if (this.filters.controls['workLocation6'].value) {
      queryWorkF.push(6);
    }
    if (this.filters.controls['workLocation7'].value) {
      queryWorkF.push(7);
    }
    if (this.filters.controls['workLocation8'].value) {
      queryWorkF.push(8);
    }

    this.router.navigate(['/candidate-home'],
      {queryParams: {workLocation: queryWorkF}, queryParamsHandling: 'merge'});
  }

  minDateSearch() {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - this.filters.controls['minAge'].value, today.getMonth(), today.getDay());

    this.router.navigate(['/search-candidates'],
      {
        queryParams: {
          dateBorn: JSON.stringify({'lte': mdate})
        }, queryParamsHandling: 'merge'
      });
  }

  maxDateSearch() {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - this.filters.controls['maxAge'].value, today.getMonth(), today.getDay());

    this.router.navigate(['/search-candidates'],
      {
        queryParams: {
          dateBorn: JSON.stringify({'gte': mdate})
        }, queryParamsHandling: 'merge'
      });
  }

}
