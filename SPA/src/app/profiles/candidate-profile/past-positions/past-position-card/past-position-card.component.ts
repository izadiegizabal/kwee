import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducers';

@Component({
  selector: 'app-past-position-card',
  templateUrl: './past-position-card.component.html',
  styleUrls: ['./past-position-card.component.scss']
})
export class PastPositionCardComponent implements OnInit {

  apiURL = environment.apiUrl;

  @Input() offer = {
    id: 5,
    title: 'SEO Expert',
    fk_offerer: 28,
    offererName: 'Demizz',
    offererIndex: 32,
    'avg': {
      'salaryAVG': 0,
      'environmentAVG': 0,
      'partnersAVG': 0,
      'servicesAVG': 0,
      'installationsAVG': 0,
      'satisfactionAVG': 0
    },
    dateStart: '2019-06-13T22:00:00.000Z',
    location: 'Budapest',
    img: 'uploads/offerers/1555020388829.png',
  };

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    if (this.offer[0]) {
      this.offer = this.offer[0];
    }
  }

}
