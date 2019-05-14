import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {shared} from '../../assets/engine/commons.js';
import {allowActions, mainInit, mainR, resetCanvas, interactiveMain, rotateMesh} from '../../assets/engine/main.js';
import {Title} from '@angular/platform-browser';
import * as KweeLiveActions from './store/kwee-live.actions';
import * as fromApp from '../store/app.reducers';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {canvas} from "../../assets/engine/commons";


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
  auxCanvas = null;
  context2d = null;

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

    this.auxCanvas = document.getElementById('auxkweelive');
    this.context2d = this.auxCanvas.getContext("2d");
    // this.context2d.translate(0.5,0.5);
  }

  getAllow() {
    return !allowActions.value;
  }

  getShowCard() {
    // return true;
    if(allowActions.card){
      // console.log([(1 + allowActions.point[0]/allowActions.point[3])*this.auxCanvas.width/2, (1 - allowActions.point[1]/allowActions.point[3])*this.auxCanvas.height/2]);
      this.drawTriangle([(1 + allowActions.point[0]/allowActions.point[3])*this.auxCanvas.width/2, (1 - allowActions.point[1]/allowActions.point[3])*this.auxCanvas.height/2]);
    }
    return allowActions.card;
  }

  drawTriangle(array){
    let point = [];
    let aux = 0;
    array.forEach( (e) => {
      aux = Math.round(e);//this.decimalAdjust('round', e,1);
      if (aux % 2 !== 0){
        point.push(aux + 1);
      } else { point.push(aux); }
    });
    // console.log(point);
    // the triangle

    // this.context2d.translate(0.5,0.5);
    this.context2d.beginPath();
    this.context2d.moveTo(365 * 2, 180 * 2);
    this.context2d.lineTo(335 * 2, 180 * 2);
    this.context2d.lineTo(point[0], point[1] - 6);
    this.context2d.closePath();

    this.context2d.strokeStyle = '#FFF';
    this.context2d.lineWidth = 2;
    this.context2d.stroke();

    this.context2d.fillStyle = "#FFF";
    this.context2d.fill();

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
