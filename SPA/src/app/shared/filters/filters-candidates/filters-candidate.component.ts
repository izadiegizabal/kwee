import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {WorkFields} from '../../../../models/Candidate.model';
import {Distances, isStringNotANumber} from '../../../../models/Offer.model';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-filters-candidate',
  templateUrl: './filters-candidate.component.html',
  styleUrls: ['./filters-candidate.component.scss']
})
export class FiltersCandidateComponent implements OnInit {

  @ViewChild('drawer') drawer: MatSidenav;

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


  constructor(private router: Router, public media: BreakpointObserver) {
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
        'workfield9': new FormControl(),
        'workfield10': new FormControl(),
        'workfield11': new FormControl(),
        'workfield12': new FormControl(),
        'workfield13': new FormControl(),
        'workfield14': new FormControl(),
        'workfield15': new FormControl(),
        'workfield16': new FormControl(),
        'workfield17': new FormControl(),
        'workfield18': new FormControl(),
        'workfield19': new FormControl(),
        'workfield20': new FormControl(),
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
      if (this.filters.controls['minIndex'].value > 0) {
        this.router.navigate(['/search-candidates'],
          {
            queryParams: {index: this.filters.controls['minIndex'].value}, queryParamsHandling: 'merge'
          });
      } else {
        this.router.navigate(['/search-candidates'],
          {
            queryParams: {index: null}, queryParamsHandling: 'merge'
          });
      }
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
    this.filters.controls['workfield9'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield10'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield11'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield12'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield13'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield14'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield15'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield16'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield17'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield18'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield19'].valueChanges.subscribe(() => {
      this.countWorkField();
    });
    this.filters.controls['workfield20'].valueChanges.subscribe(() => {
      this.countWorkField();
    });

    this.filters.controls['minAge'].valueChanges.subscribe(() => {
      this.minDateSearch();
    });

    this.filters.controls['maxAge'].valueChanges.subscribe(() => {
      this.minDateSearch();
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
    let queryWorkF = '';

    if (this.filters.controls['workfield0'].value) {
      queryWorkF += '0 ';
    }
    if (this.filters.controls['workfield1'].value) {
      queryWorkF += '1 ';
    }
    if (this.filters.controls['workfield2'].value) {
      queryWorkF += '2 ';
    }
    if (this.filters.controls['workfield3'].value) {
      queryWorkF += '3 ';
    }
    if (this.filters.controls['workfield4'].value) {
      queryWorkF += '4 ';
    }
    if (this.filters.controls['workfield5'].value) {
      queryWorkF += '5 ';
    }
    if (this.filters.controls['workfield6'].value) {
      queryWorkF += '6 ';
    }
    if (this.filters.controls['workfield7'].value) {
      queryWorkF += '7 ';
    }
    if (this.filters.controls['workfield8'].value) {
      queryWorkF += '8 ';
    }
    if (this.filters.controls['workfield9'].value) {
      queryWorkF += '9 ';
    }
    if (this.filters.controls['workfield10'].value) {
      queryWorkF += '10 ';
    }
    if (this.filters.controls['workfield11'].value) {
      queryWorkF += '11 ';
    }
    if (this.filters.controls['workfield12'].value) {
      queryWorkF += '12 ';
    }
    if (this.filters.controls['workfield13'].value) {
      queryWorkF += '13 ';
    }
    if (this.filters.controls['workfield14'].value) {
      queryWorkF += '14 ';
    }
    if (this.filters.controls['workfield15'].value) {
      queryWorkF += '15 ';
    }
    if (this.filters.controls['workfield16'].value) {
      queryWorkF += '16 ';
    }
    if (this.filters.controls['workfield17'].value) {
      queryWorkF += '17 ';
    }
    if (this.filters.controls['workfield18'].value) {
      queryWorkF += '18 ';
    }
    if (this.filters.controls['workfield19'].value) {
      queryWorkF += '19 ';
    }
    if (this.filters.controls['workfield20'].value) {
      queryWorkF += '20 ';
    }
    if (queryWorkF === '') {
      this.router.navigate(['/search-candidates'],
        {queryParams: {rol: null}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate(['/search-candidates'],
        {queryParams: {rol: queryWorkF}, queryParamsHandling: 'merge'});
    }
  }

  minDateSearch() {
    const today = new Date();
    let mindate = '';

    let dia = '' + today.getDate();
    if (today.getDate() < 10) {
      dia = '0' + today.getDate();
    }
    let mes = '' + today.getMonth();
    if (today.getMonth() < 10) {
      mes = '0' + today.getMonth();
    }

    if (this.filters.controls['minAge'].value) {
      mindate +=
        'lte:' + (today.getFullYear() - this.filters.controls['minAge'].value) + '-' + mes + '-' + dia + ':';
    }

    if (this.filters.controls['maxAge'].value) {
      mindate += 'gte:' + (today.getFullYear() - this.filters.controls['maxAge'].value) + '-' + mes + '-' + dia;
    }

    this.router.navigate(['/search-candidates'],
      {
        queryParams: {
          dateBorn: mindate
        }, queryParamsHandling: 'merge'
      });
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

}
