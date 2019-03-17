import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

// import {glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4} from 'gl-matrix';

import {
  TCamera,
  TMesh,
  TAnimation,
  TLight,
  TTransform,
  TEntity } from '../../assets/engine/TEntity';
import { TNode } from '../../assets/engine/TNode';
import {
  TResourceManager,
  TResourceMaterial,
  TResourceMesh,
  TResourceShader,
  TResourceTexture } from '../../assets/engine/resourceManager';
import { TMotorTAG } from '../../assets/engine/TMotorTAG.js';
import { shared, canvas } from '../../assets/engine/commons.js';

import { mainR, mainTest, main } from '../../assets/engine/main.js';

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
export class KweeLiveComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor() {
  }

  ngOnInit() {
    shared();
    // mainR();
    main();
  }

}
