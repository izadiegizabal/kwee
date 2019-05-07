// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, global, angle} from './commons.js';

import {getBezierPoints, convertLatLonToVec3, quatFromVectors, getEuler, degrees, convertLatLonToVec3Rotated} from './tools/utils.js'
let Motor = null;
let Scene = null;
let Land = null;
let Sphere = null;
let MeshArray = null;
let draw = true;
let rotateMeshBool = false;
let manager = null;
let allowActions = {
  value: false
};

let lastFrameTime = 0.0;

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

    // PARTICLES
    let particlesFragmentSource = await manager.getResource('particles.fs');
    let particlesVertexSource = await manager.getResource('particles.vs');
    let vertexBuffer = global.gl.createShader(global.gl.VERTEX_SHADER);
    let fragmentBuffer = global.gl.createShader(global.gl.FRAGMENT_SHADER);

    global.gl.shaderSource(vertexBuffer, particlesVertexSource);
    global.gl.shaderSource(fragmentBuffer, particlesFragmentSource);

    global.gl.compileShader(vertexBuffer);
    if (!global.gl.getShaderParameter(vertexBuffer, global.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', global.gl.getShaderInfoLog(vertexBuffer));
      return;
    }

    global.gl.compileShader(fragmentBuffer);
    if (!global.gl.getShaderParameter(fragmentBuffer, global.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader', global.gl.getShaderInfoLog(fragmentBuffer));
      return;
    }

    global.gl.attachShader(global.particlesProgram, vertexBuffer);
    global.gl.attachShader(global.particlesProgram, fragmentBuffer);

    global.gl.linkProgram(global.particlesProgram);
    if (!global.gl.getProgramParameter(global.particlesProgram, global.gl.LINK_STATUS)) {
      console.error('ERROR linking particlesProgram', global.gl.getProgramInfoLog(global.particlesProgram));
      return;
    }
    global.gl.validateProgram(global.particlesProgram);
    if (!global.gl.getProgramParameter(global.particlesProgram, global.gl.VALIDATE_STATUS)) {
      console.error('ERROR validating particlesProgram', global.gl.getProgramInfoLog(global.particlesProgram));
      return;
    }


    console.log('== Ready to run ==');
    draw = true;
    allowActions.value = true;
    resolve(allowActions.value);
  });
}

function rotateMesh() {
  rotateMeshBool = true;
}

async function resetCanvas() {
  draw = false;
  global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
}


async function mainR(texture, particles, line) {
  rotateMeshBool = false;
  if(global.gl && global.program) {
    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    Motor = motor;
    let scene = motor.createRootNode();
    Scene = scene;
    let quats = glMatrix.quat.create();
    let quatsRot = glMatrix.quat.create();
    let auxQuat = glMatrix.quat.create();
    const vec3 = glMatrix.vec3;
    var quatsArray = [];
    var quatQ = 1 / 16;
    var quatBQ = 16;

    quats = quatFromVectors(quats, convertLatLonToVec3(40.415363, -3.707398), vec3.fromValues(0,0,100));
    for (let i = 0 ; i < quatBQ ; i += quatQ){
      quatsArray.push(glMatrix.quat.fromValues(...glMatrix.quat.slerp(auxQuat, glMatrix.quat.create(), quats ,i)));
    }


    /*
    quats = quatFromVectors(quats, convertLatLonToVec3(40.415363, -3.707398), vec3.fromValues(0,0,100));
    for (let i = 0 ; i < quatBQ ; i += quatQ){
      quatsArray.push(glMatrix.quat.fromValues(...glMatrix.quat.slerp(auxQuat, glMatrix.quat.create(), quats ,i)));
    }
    convertLatLonToVec3Rotated
     */
    // console.log(quatsArray);
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
    /*let meshArray = await motor.loadMeshArray(scene, ['card.json', 'earthobj.json', 'sea.json']);
    MeshArray = meshArray;
    motor.rotate(meshArray, 0, 'z');
    motor.rotate(meshArray, 90, 'y');
    motor.translate(meshArray, [-5, 0, 0] );
    motor.scale(meshArray, [0.2, 0.1, 0.2] );*/
    // motor.animate(meshArray, 3, 1);
    // let card = await motor.loadMesh(scene, 'card.json');
    // motor.rotate(card, 0, 'z');
    // motor.rotate(card, 90, 'y');
    // motor.translate(card, [-5, 0, 0] );
    // motor.scale(card, [0.2, 0.1, 0.2] );
    //motor.translate(card, convertLatLonToVec3(40.415363, -3.707398));
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
    Land = land;
    //motor.rotate(land, -90, 'z');
    let sphere = await motor.loadMesh(scene, 'sea.json');
    Sphere = sphere;
    //motor.rotate(sphere, -90, 'z');
    motor.scale(sphere, [0.995, 0.995, 0.995]);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         Markers
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Madrid 40.415363, -3.707398
    let point1 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point1, [0.01, 0.01, 0.01]);
    motor.translate(point1, convertLatLonToVec3(10.500000, -66.916664));
    // Caracas 10.500000, -66.916664
    let point2 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point2, [0.01, 0.01, 0.01]);
    motor.translate(point2, convertLatLonToVec3(40.415363, -3.707398));
    // Roma 41.89193, 12.51133
    let point3 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point3, [0.01, 0.01, 0.01]);
    motor.translate(point3, convertLatLonToVec3(41.89193, 12.51133));
    // Sydney -33.865143, 151.209900
    let point4 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point4, [0.01, 0.01, 0.01]);
    motor.translate(point4, convertLatLonToVec3(-33.865143, 151.209900));
    // Wellington -41.28664, 174.77557
    let point5 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point5, [0.01, 0.01, 0.01]);
    motor.translate(point5, convertLatLonToVec3(-41.28664, 174.77557));
    // Tokyo 35.6895, 139.69171
    let point6 = await motor.loadMesh(land, 'marker.json');
    motor.scale(point6, [0.01, 0.01, 0.01]);
    motor.translate(point6, convertLatLonToVec3(35.6895, 139.69171));


    ///// 0 === false ; 1 === true
    let uWireframe = global.gl.getUniformLocation(global.program, 'uWireframe');
    global.gl.uniform1i(uWireframe, 0);
    let uUseVertexColor = global.gl.getUniformLocation(global.program, 'uUseVertexColor');
    global.gl.uniform1i(uUseVertexColor, 0);
    let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
    global.gl.uniform1i(uUseTextures, 0);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         particles
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let TFocus = motor.createFocus(scene,100,[1,1,1]).entity;

    let particlesTexture = await manager.getResource('spark.png');


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // console.log("scene:");
    // console.log(scene);

    motor.lookAt(cam, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

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



    console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         ARCS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // const animatedArc = motor.createAndAnimateArc(scene, 10.500000, -66.916664,40.415363, -3.707398, 24, 1.5);
    // const animatedArc2 = motor.createAndAnimateArc(scene, 35.6895, 139.69171,40.415363, -3.707398, 24, 1.5, 3);

    // const animaLand = motor.animate(land, 32, 1,40.415363, -3.707398, land.father.father.entity.matrix);
    // const animeSphere = motor.animate(sphere, 32, 1,40.415363, -3.707398,  land.father.father.entity.matrix);
    /*const Narc = motor.createArc(scene, 10.500000, -66.916664,40.415363, -3.707398, 32);
    const arc = Narc.entity.arc;
    var vertices = [];

    for (let i = 0 ; i < arc.length ; i++) {
      vertices.push(...arc[i]);
      if (!(i === 0 || i === (arc.length - 1))) {
        vertices.push(...arc[i]);
      }
    }

    // Create an empty buffer object
    var vertex_buffer = global.gl.createBuffer();

    // Bind appropriate array buffer to it
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(vertices), global.gl.STATIC_DRAW);

    // Unbind the buffer
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
    let uMaterialDiffuse = global.gl.getUniformLocation(global.program, 'uMaterialDiffuse');
    let uMaterialAmbient = global.gl.getUniformLocation(global.program, 'uMaterialAmbient');*/
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var last = 0;
    var last2 = 0;
    var num = 0;
    var rotation = -1;
    //var maxLines = vertices.length/3;

    var sceneTime = 0.0;

    var loop = async function (now, now2) {
      if (draw) {
        global.gl.useProgram(global.program);
        //global.gl.clearColor(0.435, 0.909, 0.827, 1.0); // our blue
        //global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);


        //changeAngle(performance.now() / 1000 / 3 * 2 * Math.PI);
        //changeAngle(angle * 25);
        //motor.setRotation(land, angle, 'y');
        //motor.setRotation(sphere, angle, 'y');


        scene.draw();

        if(rotateMeshBool) {
          if(!last2 || now2 - last >= 1*1000) {
            last2 = now2;
            rotation++;
            if(rotation>16){
              rotation = 16;
              rotateMeshBool = false;
            }
          }
          let vec = getEuler(quatsArray[rotation]);
          motor.setRotation(land, vec[0] * degrees, 'x');
          motor.rotate(land, vec[1] * degrees, 'y');
          motor.rotate(land, vec[2] * degrees, 'z');
          motor.setRotation(sphere, vec[0] * degrees, 'x');
          motor.rotate(sphere, vec[1] * degrees, 'y');
          motor.rotate(sphere, vec[2] * degrees, 'z');
        }


        //await particlesDraw();
        requestAnimationFrame(loop);
      }
    };
    let particlesDraw = async function() {

      var time = Date.now();

      // Update the particle positions
      motor.updateParticles((time - lastFrameTime) / 1000.0);

      lastFrameTime = time;

      // gl.viewport(0, 0, c_width, c_height);
      // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      try{


        global.gl.enable(global.gl.BLEND);

        //gl.bindAttribLocation(particlesProgram, 0 , "aVertexPosition");
        global.gl.useProgram(global.particlesProgram);
        //gl.enableVertexAttribArray(0);


        // //let pMatrix = new Float32Array(16);
        // let camera = motor.positionCameras[0]; // viewMatrix = TEntity.AuxViews[0];
        // let mvMatrix = glMatrix.mat4.create();
        // let pMatrix = glMatrix.mat4.create();
        // let nMatrix = glMatrix.mat4.create();
        // let cMatrix = glMatrix.mat4.create();

        // // calculate Model View
        // let m = glMatrix.mat4.create();
        // glMatrix.mat4.invert(camera,m)
        // mvMatrix = m;

        // // setMatrixUniforms() = calcNormal + mapUniforms
        // //  calcNormal()
        // glMatrix.mat4.identity(nMatrix);
        // glMatrix.mat4.set(mvMatrix, nMatrix);
        // glMatrix.mat4.invert(nMatrix, nMatrix);
        // glMatrix.mat4.transpose(nMatrix, nMatrix);

        //  mapUniforms()
        let uniformMVMatrix = global.gl.getUniformLocation(global.particlesProgram, "uMVMatrix");
        let uniformPMatrix = global.gl.getUniformLocation(global.particlesProgram, "uPMatrix");
        global.gl.uniformMatrix4fv(uniformMVMatrix, false, viewMatrix);  //Maps the Model-View matrix to the uniform prg.uMVMatrix
        global.gl.uniformMatrix4fv(uniformPMatrix, false, projMatrix);    //Maps the Perspective matrix to the uniform prg.uPMatrix



        // uPointSize = size of each particle
        let uniformPointSize = global.gl.getUniformLocation(global.particlesProgram, "uPointSize");
        global.gl.uniform1f(uniformPointSize, 14.0);
        // console.log(TFocus);
        let attributeParticle = global.gl.getAttribLocation(global.particlesProgram, "aParticle");
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, TFocus.getBuffer());
        global.gl.vertexAttribPointer(attributeParticle, 4, global.gl.FLOAT, false, 0, 0);
        global.gl.enableVertexAttribArray(attributeParticle);

        global.gl.activeTexture(global.gl.TEXTURE1);

        global.gl.bindTexture(global.gl.TEXTURE_2D, particlesTexture.tex);
        let uniformSampler = global.gl.getUniformLocation(global.particlesProgram, "uSampler");
        global.gl.uniform1i(uniformSampler, 1);
        global.gl.drawArrays(global.gl.POINTS, 0, TFocus.getParticles());
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);

        /////////
        // hard try
        /////////

      }
      catch(err){
        //alert(err);
        console.error(err);
      }
    }
    requestAnimationFrame(loop);
    requestAnimationFrame(animation);
  }

}


let then = 0;
let last = 0;
let arcsSec = 0;
/*
  Fases
  0 => rotate
  1 => show & animate card
  2 => wait 3 seconds
  3 => remove card
 */
let fase = 0;
let arcs = [];
let auxArc = null;

//let then = Date.now();
//let fpsInterval = 1000/30;
function animation(now) {

  if(now - arcsSec >= 1000) {
    arcsSec = now;
    Motor.createAndAnimateArc(Scene, generateRandomLat(), generateRandomLong(), generateRandomLat(), generateRandomLong(), 24, 1.5, 3);
    Motor.createAndAnimateArc(Scene, generateRandomLat(), generateRandomLong(), generateRandomLat(), generateRandomLong(), 24, 1.5, 3);
  }

  /*switch (fase) {
    case 0:
      if(now - last >= 5000) {
        // console.log(MeshArray.entity);
        console.log(0);
        // auxArc = Motor.createAndAnimateArc(Scene, 10.500000, -66.916664,40.415363, -3.707398, 24, 1.5);
        last = now;
        fase = 1;
      }
      break;
    case 1:
      if(now - last >= 10000) {
        console.log(1);
        // Motor.animateMesh(MeshArray, 3, 1, 5);
        //Motor.deleteArc(auxArc);
        //console.log(Scene);
        //console.log(Motor.allCountAnimations);
        // const animaLand = Motor.animate(Land, 32, 1,10.500000, -66.916664, Land.father.father.entity.matrix);
        // const animeSphere = Motor.animate(Sphere, 32, 1,10.500000, -66.916664,  Sphere.father.father.entity.matrix);
        last = now;
        fase = 0;
      }
      break;
    default:
      break;
  }*/

  // Convert the time to second
  now *= 0.001;
  // Subtract the previous time from the current time
  var deltaTime = now - then;
  // Remember the current time for the next frame.
  then = now;

  Motor.allCountAnimations.forEach( (e, i) => {
    if(!e.update(deltaTime)){
      Motor.allCountAnimations.splice(i, 1);
      if(Motor.isArcAnimation(e)){
        Motor.deleteArc(e.object);
      }
    }
  });

  //

  /*

  if(cont > 16){
    cont = 0;
    console.log('!!!!!!!!!!!!!!!!!!!!!!');
  }

  //console.log(deltaTime);
  //console.log(Math.floor(deltaTime * (16 / 2)));
  cont += deltaTime * (16 / 2);
  console.log(Math.floor(cont));

   */

  //let now = Date.now();
  //let elapsed = now - then;

  if(draw) {
    requestAnimationFrame(animation);
  }
}

// LONGITUDE -180 to + 180
function generateRandomLong() {
  return (Math.random() * (180 - (-180)) + (-180)).toFixed(3) * 1;
}
// LATITUDE -90 to +90
function generateRandomLat() {
  return (Math.random() * (90 - (-90)) + (-90)).toFixed(3) * 1;
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions,
  rotateMesh
}
