import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {shared} from '../../assets/engine/commons.js';
import {allowActions, mainInit, mainR, resetCanvas, interactiveMain, rotateMesh} from '../../assets/engine/main.js';
import {Title} from '@angular/platform-browser';
import * as KweeLiveActions from './store/kwee-live.actions';
import * as fromApp from '../store/app.reducers';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import { trigger, state, style, animate, transition } from '@angular/animations';


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

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor(private titleService: Title, private http: HttpClient, private store$: Store<fromApp.AppState>) {
    this.disabled = true;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Kwee Live');
    this.disabled = false;
    await shared();
    await mainInit();

    this.store$.dispatch(new KweeLiveActions.TryGetApplications({page: 1, limit: 5}));
  }

  getAllow() {
    return !allowActions.value;
  }

  getShowCard() {
    // return true;
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

  interactive() {
    resetCanvas();
    interactiveMain();
  }

  rotate() {
    rotateMesh();
  }

  async reset() {
    resetCanvas();
  }

  changeShowCard() {
    this.showCard = !this.showCard;
    /*if (this.showCard) {
      window.document.getElementById('miniOffer').style.visibility = 'visible';
    } else {
      window.document.getElementById('miniOffer').style.visibility = 'hidden';
    }*/
    /*if (this.showCard) {
      // window.document.getElementById('miniOffer').style.display = 'initial';
      const frag = document.createRange().createContextualFragment(`
        <app-mini-offer
        [@EnterLeave]="'flyIn'"
        id="miniOfferContent"
        [index]="50"
        [id]="240"
        [name]="'Facebook'"
        [offer]="'Direct Accountability Specialist'"
        [location]="'Alicante'"
        [work]="'Full-Time'"
        [image]="'image'"
        [url]="'akjbdsabksadb'"></app-mini-offer>
      `);
      window.document.getElementById('miniOffer').appendChild(frag);
    } else {
      window.document.getElementById('miniOffer').removeChild(window.document.getElementById('miniOfferContent'));
    }*/
  }

  ngOnDestroy() {
    resetCanvas();
  }

}
