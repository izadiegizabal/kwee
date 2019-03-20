// TNode
import {
    TNode,
    calculateViews,
    calculateLights,
    goToRoot,
    getLigthsViews
} from './TNode.js';
// TEntity
import {
    TTransform,
    TCamera,
    TLight,
    TAnimation,
    TMesh
} from './TEntity.js';
// TResourceManager
import {
    TResourceManager,
    TResourceMesh,
    TResourceMaterial,
    TResourceTexture,
    TResourceShader,
    loadImage
} from './resourceManager.js';
// TMotor
import { TMotorTAG } from './TMotorTAG.js';

// Commons
import {
    canvas,
    gl,
    program,
    TEntity,
    angle,
    changeAngle,
    texture
} from './commons.js';

let draw = true;
let manager = null;
let allowActions = {
  value: false
};

async function mainInit(){
  return new Promise(async resolve => {

  //gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    manager = new TResourceManager();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let VShader = await manager.getResource('shader.vs');
      let FShader = await manager.getResource('shader.fs');


    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, VShader);
    gl.shaderSource(fragmentShader, FShader);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
      return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program', gl.getProgramInfoLog(program));
      return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('ERROR validating program', gl.getProgramInfoLog(program));
      return;
    }
    console.log('== Ready to run ==');
    draw = true;
    allowActions.value = true;
    resolve(allowActions.value);


  });
}

async function resetCanvas(){
  draw = false;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


async function mainR( model ){
  draw = true;
  allowActions.value = false;
  let motor = new TMotorTAG(manager);
  let scene = motor.createRootNode();
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         INIT CONFIG
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
  //gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  /// @todo: CREATE PROGRAM OBJECT
  gl.useProgram(program);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         TREE & RESOURCES
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let tex = await manager.getResource('continents.jpg');

  let cam = motor.createCamera(scene);
  let light = motor.createLight(scene);
  let land = null;
  if (model === 'hollow') {
    land = await motor.loadMesh(scene, 'earthobj.json');
    land.entity.mesh.tex = tex;
    console.log(land);
    //motor.rotate(land, -90, 'z');
  } else {
    land = await motor.loadMesh(scene, 'textured_earth.json');
    motor.rotate(land, -90, 'z');
  }

  let sphere = null
  if (model === 'hollow') {
    sphere = await motor.loadMesh(scene, 'sea.json');
    //motor.rotate(sphere, -90, 'z');
    motor.scale(sphere, [0.995,0.995,0.995]);
  } else {
    sphere = await motor.loadMesh(scene, 'textured_earth.json');
    motor.rotate(sphere, -90, 'z');
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         CAMERAS
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  console.log("scene:");
  console.log(scene);

  motor.lookAt(cam, [0, 0, 2], [0, 1, 0], [0, 1, 0]);

  motor.calculateLights();
  motor.calculateViews();
  //   console.log('Lights : ');
  //   console.log(TEntity.Lights);
  //   console.log('Views/cameras: ');
  //   console.log(TEntity.Views);
  //   console.log('Lights array: ');
  //   console.log(TEntity.AuxLights);
  //   console.log('Views/cameras array: ');
  //   console.log(TEntity.AuxViews);
  //   console.log('Lights : ');
  //   console.log(motor.allLights);
  //   console.log('Views/cameras: ');
  //   console.log(motor.allCameras);
  //   console.log('Lights array: ');
  //   console.log(TEntity.AuxLights);
  //   console.log('Views/cameras array: ');
  //   console.log(TEntity.AuxViews);


  // @todo: DEAL WITH UMVMATRIX
  let projMatrix = new Float32Array(16);
  let viewMatrix = motor.positionCameras[0]; // viewMatrix = TEntity.AuxViews[0];
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
  let matViewUniformLocation = gl.getUniformLocation(program, 'uVMatrix');
  let matProjUniformLocation = gl.getUniformLocation(program, 'uPMatrix');
  
  gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

  let off = gl.getUniformLocation(program, 'uOffscreen');
  gl.uniform1i(off, false);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         LIGHTNING
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let lightPos = gl.getUniformLocation(program, 'uLightPosition');
  let lightAmb = gl.getUniformLocation(program, 'uLightAmbient');
  let lightDiff = gl.getUniformLocation(program, 'uLightDiffuse');
  let alpha = gl.getUniformLocation(program, 'uAlpha');

  /// @todo: MOVE TO TNODE
  gl.uniform3fv(lightPos,   [5,5,5]);
  gl.uniform4fv(lightAmb,    [0.0,0.0,0.0,1.0]);
  gl.uniform4fv(lightDiff,    [1.0,1.0,1.0,1.0]);
  gl.uniform1f(alpha, 1.0);


  ///////// CHAPUZA MASTER AYY LMAO
  allowActions.value = true;
  document.getElementById("kweelive").click();
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         LOOP
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var loop = function () {
    if(draw) {
      //gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      changeAngle(performance.now() / 1000 / 12 * 2 * Math.PI);
      scene.draw();
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);

}

export {
    mainInit,
    mainR,
    resetCanvas,
    allowActions
}
