import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TAnimation, TCamera, TEntity, TLight, TMesh, TTransform} from '../../assets/engine/TEntity';
import {TNode} from '../../assets/engine/TNode';
import {TResourceManager, TResourceMaterial, TResourceMesh, TResourceShader, TResourceTexture} from '../../assets/engine/resourceManager';

import {main, mainTest, pls} from '../../assets/engine/main.js';
import {shared} from '../../assets/engine/commons';
import {allowActions, mainInit, mainR, resetCanvas} from '../../assets/engine/main';

// import {glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4} from 'gl-matrix';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  disabled: boolean;
  particles: boolean;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor() {
    this.disabled = true;
  }

  async ngOnInit() {
    this.disabled = false;
    shared();
    await mainInit();
    this.drawHollow();
  }

  getAllow() {
    return !allowActions.value;
  }

  drawHollow() {
    resetCanvas();
    mainR('hollow', this.particles);
  }

  async reset() {
    resetCanvas();
  }

}
