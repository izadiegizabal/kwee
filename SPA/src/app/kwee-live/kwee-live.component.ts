import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {TCamera, TMesh, TAnimation, TLight, TTransform, TEntity} from '../../assets/engine/TEntity';
import {TNode} from '../../assets/engine/TNode';
import {TResourceManager, TResourceMaterial, TResourceMesh, TResourceShader, TResourceTexture} from '../../assets/engine/resourceManager';
import {shared} from '../../assets/engine/commons.js';
import {main, mainInit, mainR, interactiveMain, resetCanvas, allowActions, pls, rotateMesh} from '../../assets/engine/main.js';

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

  constructor() {
    this.disabled = true;
  }

  async ngOnInit() {
    this.disabled = false;
    await shared();
    await mainInit();
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


  ngOnDestroy() {
    resetCanvas();
  }

}
