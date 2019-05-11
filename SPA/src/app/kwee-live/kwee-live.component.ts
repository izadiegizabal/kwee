import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {shared} from '../../assets/engine/commons.js';
import {allowActions, mainInit, mainR, resetCanvas} from '../../assets/engine/main.js';
import {Title} from '@angular/platform-browser';
import * as KweeLiveActions from './store/kwee-live.actions';
import * as fromApp from '../store/app.reducers';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';


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
  styleUrls: ['./kwee-live.component.scss']
})
export class KweeLiveComponent implements OnInit, OnDestroy {

  disabled: boolean;
  particles: boolean;

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

  drawHollow() {
    resetCanvas();
    mainR(false, this.particles);
  }

  draw() {
    resetCanvas();
    mainR(true, this.particles);
  }

  async reset() {
    resetCanvas();
  }

  drawParticles() {
    this.particles = !this.particles;
    console.log('Particles ' + this.particles);
  }

  ngOnDestroy() {
    resetCanvas();
  }

}
