import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {shared} from '../../assets/engine/commons.js';
import {allowActions, mainInit, mainR, resetCanvas, interactiveMain, demoMain} from '../../assets/engine/main.js';
import {Title} from '@angular/platform-browser';
import * as KweeLiveActions from './store/kwee-live.actions';
import * as fromApp from '../store/app.reducers';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {trigger, state, style, animate, transition, query} from '@angular/animations';
import {canvas} from '../../assets/engine/commons';
import {Observable} from "rxjs";
import * as fromKweeLive from "./store/kwee-live.reducers";
import * as OffersActions from "../offer/store/offers.actions";
import * as fromOffers from '../offer/store/offers.reducers';

@Component({
  selector: 'app-kwee-live',
  templateUrl: './kwee-live.component.html',
  styleUrls: ['./kwee-live.component.scss'],
  animations: [
    trigger('EnterLeave', [
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class KweeLiveComponent implements OnInit, OnDestroy {

  disabled: boolean;
  particles: boolean;
  boundingbox: boolean;
  kweeState: Observable<fromKweeLive.State>;
  offersState: Observable<fromOffers.State>;
  query: any;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor(private titleService: Title, private http: HttpClient, private store$: Store<fromApp.AppState>) {
    this.disabled = true;
    this.boundingbox = false;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Kwee Live');
    this.disabled = false;
    await shared();
    await mainInit();
    demoMain( [0, 0, 0], this.boundingbox);

    this.store$.dispatch(new KweeLiveActions.TryGetApplications({page: 1, limit: 5}));

    this.kweeState = this.store$.pipe(select('kweeLive'));

    this.kweeState.pipe(
      select(s => s.applications)
    ).subscribe(
      (applications) => {
        // console.log(applications);
      });
    this.query= {...this.query, status: '0'};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 25, params: this.query, order: '0'}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.offersState.pipe(
      select(s => s)
    ).subscribe(
      (value) => {
        // console.log(value);
      });

  }

  bbox() {
    // toggle bounding box
    // console.log(this.boundingbox);
    this.boundingbox = !this.boundingbox;
    this.interactive([0, 0, 0]);
  }

  async interactive(target) {
    await resetCanvas();
    demoMain(target, this.boundingbox);
  }

  getAllow() {
    return !allowActions.value;
  }


  async reset() {
    resetCanvas();
  }

  ngOnDestroy() {
    resetCanvas();
  }


}
