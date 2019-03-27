// TNode
// TEntity
// TResourceManager
import {loadImage, TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, global} from './commons.js';

let draw = true;
let manager = null;
let allowActions = {
  value: false
};

async function mainInit() {
  return new Promise(async resolve => {

    //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);


    manager = new TResourceManager();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');


    let vertexShader = global.gl.createShader(global.gl.VERTEX_SHADER);
    let fragmentShader = global.gl.createShader(global.gl.FRAGMENT_SHADER);

    global.gl.shaderSource(vertexShader, VShader);
    global.gl.shaderSource(fragmentShader, FShader);

    global.gl.compileShader(vertexShader);
    if (!global.gl.getShaderParameter(vertexShader, global.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', global.gl.getShaderInfoLog(vertexShader));
      return;
    }

    global.gl.compileShader(fragmentShader);
    if (!global.gl.getShaderParameter(fragmentShader, global.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader', global.gl.getShaderInfoLog(fragmentShader));
      return;
    }

    global.gl.attachShader(global.program, vertexShader);
    global.gl.attachShader(global.program, fragmentShader);
    global.gl.linkProgram(global.program);
    if (!global.gl.getProgramParameter(global.program, global.gl.LINK_STATUS)) {
      console.error('ERROR linking global.program', global.gl.getProgramInfoLog(global.program));
      return;
    }
    global.gl.validateProgram(global.program);
    if (!global.gl.getProgramParameter(global.program, global.gl.VALIDATE_STATUS)) {
      console.error('ERROR validating global.program', global.gl.getProgramInfoLog(global.program));
      return;
    }
    console.log('== Ready to run ==');
    draw = true;
    allowActions.value = true;
    resolve(allowActions.value);


  });
}

async function resetCanvas() {
  draw = false;
  global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
}


async function mainR(texture) {
  if(global.gl && global.program) {
    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // global.gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
    //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
    global.gl.enable(global.gl.DEPTH_TEST);
    global.gl.enable(global.gl.CULL_FACE);
    global.gl.frontFace(global.gl.CCW);
    global.gl.cullFace(global.gl.BACK);

    /// @todo: CREATE global.PROGRAM OBJECT
    global.gl.useProgram(global.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    let cam = motor.createCamera(scene);
    let light = motor.createLight(scene);
    let land;
    land = await motor.loadMesh(scene, 'earthobj.json');
    if (texture) {
      let tex = await manager.getResource('continents.jpg');
      land.entity.mesh.tex = tex;
      // console.log(land);
    } else {
      land.entity.mesh.tex = undefined;
    }
    //motor.rotate(land, -90, 'z');
    let sphere = await motor.loadMesh(scene, 'sea.json');
    //motor.rotate(sphere, -90, 'z');
    motor.scale(sphere, [0.995, 0.995, 0.995]);


    let uWireframe = global.gl.getUniformLocation(global.program, 'uWireframe');
    global.gl.uniform1i(uWireframe, global.gl.FALSE);
    let uUseVertexColor = global.gl.getUniformLocation(global.program, 'uUseVertexColor');
    global.gl.uniform1i(uUseVertexColor, global.gl.FALSE);
    let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
    global.gl.uniform1i(uUseTextures, global.gl.FALSE);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // console.log("scene:");
    // console.log(scene);

    motor.lookAt(cam, [0, 0, 2], [0, 1, 0], [0, 1, 0]);

    motor.calculateLights();
    motor.calculateViews();

    // @todo: DEAL WITH UMVMATRIX
    let projMatrix = new Float32Array(16);
    let viewMatrix = motor.positionCameras[0]; // viewMatrix = TEntity.AuxViews[0];
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    let matViewUniformLocation = global.gl.getUniformLocation(global.program, 'uVMatrix');
    let matProjUniformLocation = global.gl.getUniformLocation(global.program, 'uPMatrix');

    global.gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
    global.gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

    let off = global.gl.getUniformLocation(global.program, 'uOffscreen');
    global.gl.uniform1i(off, false);
    global.gl.bindFramebuffer(global.gl.FRAMEBUFFER, null);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let lightPos = global.gl.getUniformLocation(global.program, 'uLightPosition');
    let lightAmb = global.gl.getUniformLocation(global.program, 'uLightAmbient');
    let lightDiff = global.gl.getUniformLocation(global.program, 'uLightDiffuse');
    let alpha = global.gl.getUniformLocation(global.program, 'uAlpha');

    /// @todo: MOVE TO TNODE
    global.gl.uniform3fv(lightPos, [5, 5, 5]);
    global.gl.uniform4fv(lightAmb, [0.0, 0.0, 0.0, 1.0]);
    global.gl.uniform4fv(lightDiff, [1.0, 1.0, 1.0, 1.0]);
    global.gl.uniform1f(alpha, 1.0);


    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var loop = function () {
      if (draw) {
        //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        //global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
        changeAngle(performance.now() / 1000 / 12 * 2 * Math.PI);
        scene.draw();
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions
}
