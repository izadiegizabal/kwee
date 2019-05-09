import {Component, Input, OnInit} from '@angular/core';
import {LanguageLevels} from '../../../../models/Candidate.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-candidate-more-info',
  templateUrl: './candidate-more-info.component.html',
  styleUrls: ['./candidate-more-info.component.scss']
})
export class CandidateMoreInfoComponent implements OnInit {
  @Input() candidate: any;
  @Input() isPremium = false;

  infoNAMess = 'Information not available.';

  proficiencies = Object
    .keys(LanguageLevels)
    .filter(isStringNotANumber)
    .map(key => ({value: LanguageLevels[key], viewValue: key}));

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  getProf(level: any) {
    for (const proficiency of this.proficiencies) {
      if (proficiency.value === level) {
        return proficiency.viewValue;
      }
    }
  }

  searchSkill(skill) {
    console.log(skill);
    this.router.navigate(['/search-candidates'], {queryParams: {skill: skill}});

  }
}
