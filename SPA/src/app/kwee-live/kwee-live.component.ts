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


// import {TMotorTAG} from '../../assets/engine/TMotorTAG.js';
// import {glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4} from 'gl-matrix';

// import { main } from '../../assets/engine/run.js'
// import * as test from '../../assets/test.js';

// import 'gl-matrix';
// import '../../assets/engine/TEntity.js';
// import '../../assets/engine/TNode.js';
// import '../../assets/engine/resourceManager.js';
// import '../../assets/engine/TMotorTag.js';


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
  showCard: boolean;
  boundingbox: boolean;
  auxCanvas = null;
  context2d = null;
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
    this.query= {...this.query, status: 0};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 25, params: this.query, order: '0'}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.offersState.pipe(
      select(s => s)
    ).subscribe(
      (value) => {
        // console.log(value);
      });

    // this.auxCanvas = document.getElementById('auxkweelive');
    // this.context2d = this.auxCanvas.getContext("2d");
    // this.context2d.translate(0.5,0.5);
  }

  bbox() {
    // toggle bounding box
    console.log(this.boundingbox);
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

  getShowCard() {
    // return true;
    if (allowActions.card) {
      // console.log([(1 + allowActions.point[0]/allowActions.point[3])*this.auxCanvas.width/2, (1 - allowActions.point[1]/allowActions.point[3])*this.auxCanvas.height/2]);
      // this.drawTriangle([(1 + allowActions.point[0]/allowActions.point[3])*this.auxCanvas.width/2, (1 - allowActions.point[1]/allowActions.point[3])*this.auxCanvas.height/2]);
    }
    return allowActions.card;
  }

  drawHollow() {
    resetCanvas();
    mainR(false, this.particles);
  }

  draw() {
    resetCanvas();
    mainR(true, this.particles);
  }

  drawLine() {
    resetCanvas();
    mainR(false, null, true);
  }

  drawParticles() {
    this.particles = !this.particles;
    resetCanvas();
    mainR(false, this.particles);
  }

  async reset() {
    resetCanvas();
  }

  ngOnDestroy() {
    resetCanvas();
  }

  decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -this.decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

}
