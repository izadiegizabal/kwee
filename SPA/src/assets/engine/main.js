// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
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
    // global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
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
       console.log(land);
    } else {
      //land.entity.mesh.tex = undefined;
    }
    //motor.rotate(land, -90, 'z');
    //let sphere = await motor.loadMesh(scene, 'sea.json');
    //motor.rotate(sphere, -90, 'z');
    //motor.scale(sphere, [0.995, 0.995, 0.995]);

    console.log(convertLatLonToVec3(40.415363, -3.707398));
    let point = await motor.loadMesh(scene, 'sea.json');
    motor.scale(point, [0.01, 0.01, 0.01]);
    motor.translate(point, convertLatLonToVec3(40.415363, -3.707398))
    ///// 0 === false ; 1 === true
    let uWireframe = global.gl.getUniformLocation(global.program, 'uWireframe');
    global.gl.uniform1i(uWireframe, 0);
    let uUseVertexColor = global.gl.getUniformLocation(global.program, 'uUseVertexColor');
    global.gl.uniform1i(uUseVertexColor, 0);
    let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
    global.gl.uniform1i(uUseTextures, 0);


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
    global.gl.uniform1i(off, 0);
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
    /////////////////////                                         FAKE TEXTURE
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
      If seems that it doesn't matter if the shader only accesses the texture when uUseTextures is true.
      What matters is the shader uses a texture at all.

      Instead of using two different pair of shader, we are going to bind a one pixel white texture to avoid the error.
      It is said to be a good practice.Then, we overwrite it in case we need to use textures.

      link: https://gamedev.stackexchange.com/questions/166886/render-warning-there-is-no-texture-bound-to-the-unit-0-when-not-rendering-tex
     */
    const whiteTexture = global.gl.createTexture();
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);
    global.gl.texImage2D(
      global.gl.TEXTURE_2D, 0, global.gl.RGBA, 1, 1, 0,
      global.gl.RGBA, global.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    global.gl.useProgram(global.program);
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var loop = function () {
      if (draw) {
        //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        //global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
        //changeAngle(performance.now() / 1000 / 12 * 2 * Math.PI);
        scene.draw();
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }
}


function convertLatLonToVec3 ( lat, lon ) {
  /*lat =  lat * Math.PI / 180.0;
  lon = -lon * Math.PI / 180.0;
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon)];*/
  var cosLat = Math.cos(lat * Math.PI / 180.0);
  var sinLat = Math.sin(lat * Math.PI / 180.0);
  var cosLon = Math.cos(lon * Math.PI / 180.0);
  var sinLon = Math.sin(lon * Math.PI / 180.0);
  var rad = 1.27227*50;
  var f = 1.0 / 298.257224;
  var C = 1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
  var S = (1.0 - f) * (1.0 - f) * C;
  var h = 0.0;
  return [(rad * C + h) * cosLat * cosLon, (rad * C + h) * cosLat * sinLon, (rad * S + h) * sinLat];
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions
}
