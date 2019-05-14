// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, global, angle, TEntity, loadAttribAndUniformsLocations, ease} from './commons.js';

import {getBezierPoints, convertLatLonToVec3, quatFromVectors, getEuler, degrees, convertLatLonToVec3Rotated} from './tools/utils.js'

let draw = true;
let rotateMeshBool = false;
let manager = null;
let allowActions = {
  value: false,
  card: false,
  p: null,
  v: null,
  point: 0,
  random: 0
};
let arr = [[-41.28664, 174.77557], [10.500000, -66.916664], [41.89193, 12.51133], [-33.865143, 151.209900], [35.6895, 139.69171], [40.415363, -3.707398]];
let Motor = null;
let Scene = null;
let Land = null;
let Sphere = null;
let MeshArray = null;
let Cam = null;

let SceneWidth = 0;

let lastFrameTime = 0.0;

function  setSceneWidth(value){
  SceneWidth = value;
}

async function mainInit() {
  return new Promise(async resolve => {

    //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue

    // (0.435, 0.909, 0.827, 0.0); // our blue
    // (0.266, 0.294, 0.329, 1.0); // our grey

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


    global.gl.useProgram(global.program);
    draw = true;
    allowActions.value = true;

    loadAttribAndUniformsLocations();

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
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    Motor = motor;
    let scene = motor.createRootNode();
    Scene = scene;


    global.lastFrameTime = await Date.now();


    global.gl.useProgram(global.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EARTH
    //let land = await motor.loadMesh(scene, 'earth_LP.json');
    let land = await motor.loadMesh(scene, 'earth_LP_high.json');
    land.entity.mesh.setColor( [ 0.2, 0.9, 0.2, 1.0] );
    Land = land;
    // motor.scale(land, [5.0, 5.0, 5.0]);
    // motor.scale(land, [0.25, 0.25, 0.25]);

    // if (texture) {
    //   let tex = await manager.getResource('continents.jpg');
    //   land.entity.mesh.tex = tex;
    //    console.log(land);
    // } else {
    //   //land.entity.mesh.tex = undefined;
    // }
    
    // SEA
    let sphere = await motor.loadMesh(scene, 'sea.json');
    sphere.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    Sphere = sphere;
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         Markers
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Madrid 40.415363, -3.707398
    // let point1 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point1, [0.01, 0.01, 0.01]);
    // motor.translate(point1, convertLatLonToVec3(10.500000, -66.916664));
    // // Caracas 10.500000, -66.916664
    // let point2 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point2, [0.01, 0.01, 0.01]);
    // motor.translate(point2, convertLatLonToVec3(40.415363, -3.707398));
    // // Roma 41.89193, 12.51133
    // let point3 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point3, [0.01, 0.01, 0.01]);
    // motor.translate(point3, convertLatLonToVec3(41.89193, 12.51133));
    // // Sydney -33.865143, 151.209900
    // let point4 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point4, [0.01, 0.01, 0.01]);
    // motor.translate(point4, convertLatLonToVec3(-33.865143, 151.209900));
    // // Wellington -41.28664, 174.77557
    // let point5 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point5, [0.01, 0.01, 0.01]);
    // motor.translate(point5, convertLatLonToVec3(-41.28664, 174.77557));
    // // Tokyo 35.6895, 139.69171
    // let point6 = await motor.loadMesh(land, 'marker.json');
    // motor.scale(point6, [0.01, 0.01, 0.01]);
    // motor.translate(point6, convertLatLonToVec3(35.6895, 139.69171));
    
    ///// 0 === false ; 1 === true
    // let uWireframe = global.gl.getUniformLocation(global.program, 'uWireframe');
    // global.gl.uniform1i(uWireframe, 0);
    // let uUseVertexColor = global.gl.getUniformLocation(global.program, 'uUseVertexColor');
    // global.gl.uniform1i(uUseVertexColor, 0);
    // let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
    // global.gl.uniform1i(uUseTextures, 0);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         particles
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    let positionTFocus = [-1.0,0.0,0.0];
    let targetPos = [-2.0, 2.0, 0.0];

    let particleVector = glMatrix.vec3.fromValues(0,5,0);
    // 1- calc TargetVector (target - origen)
    let targetVector = glMatrix.vec3.fromValues( targetPos[0]-positionTFocus[0], targetPos[1]-positionTFocus[1], targetPos[2]-positionTFocus[2] );

    let quaternion = glMatrix.quat.create();
    quatFromVectors(quaternion, particleVector, targetVector);

    console.log("quaternion");
    console.log(quaternion);

    let rotations = glMatrix.vec3.create();
    rotations = getEuler(quaternion);
    
    console.log(rotations);
    console.log(Math.PI/4);

    let TFocus = motor.createFocus(scene, 50, positionTFocus );

    // motor.rotate(TFocus, rotations[0], 'x');
    // motor.rotate(TFocus, rotations[1], 'y');   
    // motor.rotate(TFocus, rotations[2]*100, 'z');

    motor.rotate(TFocus, rotations[2]*Math.PI/180, 'y');
    // motor.targetTo( TFocus,
    //   positionTFocus,
    //   targetPos);


    // motor.targetTo( TFocus2,
    //   [1.0, 0.0, 0.0],
    //   targetPos);

//    motor.cameraLookAt(TFocus, positionTFocus, targetPos)
    
    let origin = await motor.loadMesh(scene, 'marker.json');
    motor.scale(origin, [0.1, 0.1, 0.1]);
    motor.translate(origin, positionTFocus);
    origin.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 0.5] );

    let target = await motor.loadMesh(scene, 'marker.json');
    motor.scale(target, [0.1, 0.1, 0.1]);
    motor.translate(target, targetPos);
    target.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


*/
    ///////////
    // cities
    ///////////

    let madrid = await motor.loadMesh(land, 'marker.json');
    motor.scale(madrid, [0.01, 0.01, 0.01]);
    motor.translate(madrid, convertLatLonToVec3(40.415363, -3.707398));

    let roma = await motor.loadMesh(land, 'marker.json');
    motor.scale(roma, [0.01, 0.01, 0.01]);
    motor.translate(roma, convertLatLonToVec3(41.8905, 12.4942));

    let paris = await motor.loadMesh(land, 'marker.json');
    motor.scale(paris, [0.01, 0.01, 0.01]);
    motor.translate(paris, convertLatLonToVec3(48.8667, 2.33333));


    let particlesTexture = await manager.getResource('spark.png');

    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    Cam = cam;
    motor.enableCam(cam);

    //let radius = 1.7; // normal
    let radius = 3; // debug
    // motor.translate(cam, [0.0 , 0.0, -radius]);
    
    //motor.cameraLookAt(cam, [0,5,0], [0,0,0], [1,0,0])
    let camPos = [];

    let point = convertLatLonToVec3(40.415363, -3.707398);
    global.targetPoint =  convertLatLonToVec3(40.415363, -3.707398);
    allowActions.p = global.targetPoint;

    let vec3Cross = glMatrix.vec3.create();
    vec3Cross = glMatrix.vec3.cross(vec3Cross, point, [0,1,0]);

    let rot = glMatrix.mat4.create();
    glMatrix.mat4.rotate(rot, rot, -20 * (Math.PI / 180), vec3Cross);
    // glMatrix.mat4.rotateY(rot, rot, 30 * (Math.PI / 180));

    glMatrix.vec3.transformMat4(point, point, rot);
    // Array.prototype.push.apply(vegetables, moreVegs);
    camPos.push(point[0] * radius);
    camPos.push(point[1] * radius);
    camPos.push(point[2] * radius);

    /*
    motor.cameraLookAt( cam, [
      radius * Math.sin(0*Math.PI/180),
      radius,
      radius * Math.cos(0*Math.PI/180)
    ],
    [0,0,0],
    [0,1,0]);
    */
    motor.cameraLookAt( cam, [...camPos],
      [0,0,0],
      [0,1,0]);

    // motor.cameraLookAt( cam, [
    //   0,
    //   -3,
    //   0
    // ]);

    motor.calculateViews();


    ///// CARD

    // let card = await motor.loadMesh(scene, 'card.json');
    // motor.rotate(card, 0, 'z');
    // motor.rotate(card, 90, 'y');
    // motor.translate(card, [-5, 0, 0] );
    // motor.scale(card, [0.2, 0.1, 0.2] );
    // motor.translate(card, convertLatLonToVec3(40.415363, -3.707398));

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient      specular       diffuse         direction
    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], null, [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

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
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let number = 0;
    var loop = async function (now) {
      if (draw) {
        
        global.gl.useProgram(global.program);

        global.time = await Date.now();
      



        ////////////////////////////////////////////////////////////////
        
        /*motor.cameraLookAt( cam, [
          radius * Math.sin(number*Math.PI/180),
          radius,
          radius * Math.cos(number*Math.PI/180),
        ],
        [0,0,0],
        [0,1,0]);

       
        motor.calculateViews();*/

        // global.gl.uniform3f(global.programUniforms.uLightDirection, 
        //   radius * Math.sin(number*Math.PI/180),
        //   radius,
        //   radius * Math.cos(number*Math.PI/180)
        // );
        motor.calculateViews();
        requestAnimationFrame(loop);

        global.gl.uniform3f(global.programUniforms.uLightDirection,
            ...global.viewPos
          );
        motor.draw();
        
        ////////////////////////////////////////////////////////////////
      

        global.lastFrameTime = global.time;


      }
      number = number + 0.3;
      if(number>360) number = 0;
    };

    motor.init();
    requestAnimationFrame(loop);
    requestAnimationFrame(animation);

  }
}


let then = 0;
let last = 0;
let arcsSec = 0;
let arrVal = 0;
/*
  Fases
  0 => rotate
  1 => show & animate card
  2 => wait 3 seconds
  3 => remove card
 */
let fase = -1;
let arcs = [];
let auxArc = null;


//let fpsInterval = 1000/30;
function animation(now) {

  if(now - arcsSec >= 1000) {
    arcsSec = now;
    // Motor.createAndAnimateArc(Sphere, generateRandomLat(), generateRandomLong(), generateRandomLat(), generateRandomLong(), 24, 1.5, 3);
    // Motor.createAndAnimateArc(Sphere, generateRandomLat(), generateRandomLong(), generateRandomLat(), generateRandomLong(), 24, 1.5, 3);
  }

  switch (fase) {
    case 0:
      if(now - last >= 5000) {
        // console.log(0);
        // console.log(global.auxViewMatrix);
        // console.log(MeshArray.entity);
        // auxArc = Motor.createAndAnimateArc(Scene, 10.500000, -66.916664,40.415363, -3.707398, 24, 1.5);
        last = now;
        fase = 1;
        if(arrVal === arr.length){
          arrVal = 0;
        }
        // Motor.rotateCamToWithYOffset( ...arr[arrVal]);
        //arrVal++;
      }
      break;
    case 1:
      if(now - last >= 1000) {
        last = now;
        //console.log(1);
        fase = 2;


        /*let pereza = glMatrix.mat4.create();
        let perezaMax = glMatrix.vec4.create();
        let one = glMatrix.mat4.mul(pereza, global.projectionMatrix, global.viewMatrix);
        allowActions.point = glMatrix.vec4.transformMat4(perezaMax, [...global.targetPoint, 1], pereza);*/
        //allowActions.p = global.projectionMatrix;
        //allowActions.p = global.projectionMatrix;
        //allowActions.card = true;

        allowActions.card = false;
        // console.log(allowActions.point);
        allowActions.random = Motor.rotateCamToRandomXYOffset(arr[arrVal][0],arr[arrVal][1], 1, SceneWidth);
        document.body.click();

        //Motor.rotateCamTo(arr[arrVal][0],arr[arrVal][0]);
      }
      break;
    case 2:
      if(now - last >= 1500) {
        //console.log(2);
        //console.log(global.auxViewMatrix);
        let pvMat4 = glMatrix.mat4.create();
        let uselessMat4 = glMatrix.vec4.create();
        pvMat4 = glMatrix.mat4.mul(pvMat4, global.projectionMatrix, global.auxViewMatrix);
        allowActions.point = glMatrix.vec4.transformMat4(uselessMat4, [...global.targetPoint, 1], pvMat4);
        allowActions.card = true;
        // console.log(allowActions.point);
        document.body.click();




        //Motor.rotateCamToWithYOffset( 40.415363, -3.707398);
        // Motor.animateMesh(MeshArray, 3, 1, 5);
        //Motor.deleteArc(auxArc);
        //console.log(Scene);
        //console.log(Motor.allCountAnimations);
        // const animaLand = Motor.animate(Land, 32, 1,10.500000, -66.916664, Land.father.father.entity.matrix);
        // const animeSphere = Motor.animate(Sphere, 32, 1,10.500000, -66.916664,  Sphere.father.father.entity.matrix);
        last = now;
        fase = 0;
        arrVal++;
      }
      break;
    default:
      //console.log(-1);
        fase = 0;
      break;
  }

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

  Motor.allCamAnimations.forEach( (e, i) => {
    let val = e.update(deltaTime);
    if(val !== 1){
      // let mat = glMatrix.mat4.create();
      // let mat4 = glMatrix.mat4.fromQuat(mat, val);
      // mat4 = glMatrix.mat4.mul(mat4, global.viewMatrix, mat4);
      // console.log(mat4);
      // Motor.setView(Cam, mat4)

      let radius = 2; // debug

      val[0] = val[0] * radius;
      val[1] = val[1] * radius;
      val[2] = val[2] * radius;

      Motor.cameraLookAt( Cam, [...val],
        [0,0,0],
        [0,1,0]);
    } else {
      Motor.calculateViews();
      global.auxViewMatrix = glMatrix.mat4.fromValues(...global.viewMatrix);
      Motor.allCamAnimations.splice(i, 1);
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

async function demoMain(){
  rotateMeshBool = false;
  if(global.gl && global.program) {

    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();

    global.lastFrameTime = await Date.now();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    global.gl.useProgram(global.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // // EARTH
    // let land = await motor.loadMesh(scene, 'earth_LP_high.json');
    // land.entity.mesh.setColor( [ 0.2, 0.9, 0.2, 1.0] );
    // motor.enableBoundingBox(land);

    // // SEA
    // let sphere = await motor.loadMesh(scene, 'sea.json');
    // sphere.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(sphere);

    // // SEA
    // let earth = await motor.loadMesh(scene, '0_earth.json');
    // earth.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(earth);

    // // SEA
    // let sphere = await motor.loadMesh(scene, '0_sea.json');
    // sphere.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(sphere);

    // low quality ... to ... high quality
    // sea: http://h203.eps.ua.es/assets/assets/JSON/sea.json
    // earth: http://h203.eps.ua.es/assets/assets/JSON/earthobj.json

    // Correct ones:
    // let LOD_earth = motor.dynamicMeshArray(scene, ['0_earth.json','earth_LP_high.json'], [ 0.2, 0.9, 0.2, 1.0]);
    // let LOD_sea = motor.dynamicMeshArray(scene, ['0_sea.json','sea.json'], [ 0.3, 0.3, 0.8, 1.0]);

    let LOD_earth = motor.loadMeshArray(scene, ['0_earth.json','1_earth.json','2_earth.json'], [ 0.2, 0.9, 0.2, 1.0], [3,6]);
    let LOD_sea = motor.loadMeshArray(scene, ['0_sea.json','1_sea.json','2_sea.json'], [ 0.3, 0.3, 0.8, 1.0], [3,6]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         particles
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let positionTFocus = [-1.0,0.0,0.0];
    let targetPos = [1,1,1];
    let newYorkPos = convertLatLonToVec3(40.730610, -73.935242);
    let madridPos = convertLatLonToVec3(40.4165, -3.70256);
    let hongKongPos = convertLatLonToVec3(22.28552, 114.15769);
    let australiaPos = convertLatLonToVec3(-33.865143, 151.209900);
    let middleOcean = convertLatLonToVec3(36.482797, -41.634668);
    let upperPos = convertLatLonToVec3(66.326023, -31.565348);
    let argentina = convertLatLonToVec3(-51.755200, -70.611091);

    // New York focus
    let TFocus6 = motor.createFocus(scene, 100, 'straight', newYorkPos, 'normal' );
    let TFocusA = motor.createFocus(scene, 100, 'dispersion', newYorkPos);

    // // Madrid focus
    let TFocus5 = motor.createFocus(scene, 100, 'straight', madridPos , 'normal');


    // // Ocean focus
    let TFocus99 = motor.createFocus(scene, 100, 'dispersion', middleOcean , 'normal');

    let TFocusAA = motor.createFocus(scene, 100, 'fireworks', hongKongPos , 'normal', 1);



    // // Madrid mesh
    // let madrid = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(madrid, [0.05, 0.05, 0.05]);
    // motor.translate(madrid, madridPos);
    // madrid.entity.mesh.setColor( [ 1, 1, 0, 1.0] );


    // // Hong Kong focus
    // let TFocus7 = motor.createFocus(scene, 100, 'dispersion', hongKongPos, 'normal' );
    // // Hong Kong mesh
    // let hk = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(hk, [0.05, 0.05, 0.05]);
    // motor.translate(hk, hongKongPos);
    // hk.entity.mesh.setColor( [ 1, 1, 0, 1.0] );

    // // Australia focus
    // let TFocus8 = motor.createFocus(scene, 100, 'dispersion', australiaPos, 'normal' );
    // // Australia mesh
    // let au = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(au, [0.05, 0.05, 0.05]);
    // motor.translate(au, australiaPos);
    // au.entity.mesh.setColor( [ 1, 1, 0, 1.0] );

    // Axis focus
    // let focusX = motor.createFocus(scene,100, 'straight', [0,0,0], [1,0,0])
    // let focusY = motor.createFocus(scene,100, 'straight', [0,0,0], [0,1,0])
    // let focusZ = motor.createFocus(scene,100, 'straight', [0,0,0], [0,0,1])

    // let testing = motor.createFocus(scene, 100, 'dispersion', [0,0,0], positionTFocus);


    // let origin = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(origin, [0.1, 0.1, 0.1]);
    // motor.translate(origin, positionTFocus);
    // motor.enableBoundingBox(origin)
    // origin.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 0.5] );

    // let target = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(target, [0.1, 0.1, 0.1]);
    // motor.translate(target, targetPos);
    // target.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


    // let vertical = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(vertical, [0.1, 0.1, 0.1]);
    // motor.translate(vertical, [positionTFocus[0], positionTFocus[1]+1.7, positionTFocus[2] ] );
    // vertical.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


    ///////////
    // cities
    ///////////

    let particlesTexture = await manager.getResource('spark.png');



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    motor.enableCam(cam);

    // motor.cameraLookAt( cam, [
    //   global.zoom * Math.sin(0*Math.PI/180),
    //   global.zoom,
    //   global.zoom * Math.cos(0*Math.PI/180)
    // ],
    // [0,0,0],
    // [0,1,0]);

    motor.calculateViews();


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient      specular       diffuse         direction
    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], null, [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();

    const whiteTexture = global.gl.createTexture();
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);
    global.gl.texImage2D(
      global.gl.TEXTURE_2D, 0, global.gl.RGBA, 1, 1, 0,
      global.gl.RGBA, global.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    global.gl.useProgram(global.program);
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);



    console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let number = 0;
    let auxTHETA = 0;
    let auxPHI = 0;
    var loop = async function (now, now2) {

      if (!global.drag && (auxPHI!=global.orbitLimit && auxPHI!=-global.orbitLimit) ) {
        global.dX *= global.AMORTIZATION, global.dY*=global.AMORTIZATION;
        global.THETA+=global.dX, global.PHI+=global.dY;
      }

      global.gl.useProgram(global.program);

      global.time = await Date.now();

      ////////////////////////////////////////////////////////////////

      auxTHETA = global.orbitSpeed*global.THETA*(Math.PI/180);
      auxPHI = Math.max(Math.min(((global.orbitSpeed*global.PHI)*(Math.PI/180)),global.orbitLimit), -global.orbitLimit);

      let camX = global.zoom * Math.sin(auxTHETA) * Math.cos(auxPHI);
      let camY = global.zoom * Math.sin(auxPHI);
      let camZ = global.zoom * -Math.cos(auxTHETA) * Math.cos(auxPHI);

      motor.cameraLookAt( cam, [
          camX,
          camY,
          camZ,
        ],
        [0,0,0],
        //positionTFocus,
        [0,1,0]);

      // Old camera lookAt (rotating Y-axis camera)
      // motor.cameraLookAt( cam, [
      //   global.zoom * Math.sin(number*Math.PI/180),
      //   global.zoom,
      //   global.zoom * Math.cos(number*Math.PI/180),
      // ],
      // [0,0,0],
      // [0,1,0]);


      motor.calculateViews();

      // global.gl.uniform3f(global.programUniforms.uLightDirection,
      //   global.zoom * Math.sin(number*Math.PI/180),
      //   global.zoom,
      //   global.zoom * Math.cos(number*Math.PI/180)
      // );

      global.gl.uniform3f(global.programUniforms.uLightDirection,
        camX, camY, camZ
      );


      motor.draw();

      ////////////////////////////////////////////////////////////////

      global.lastFrameTime = global.time;

      number = number + 0.3;

      requestAnimationFrame(loop);
    }

    motor.init();
    loop();
  }; //
}

async function interactiveMain(){
  if(global.gl && global.program) {

    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();

    global.lastFrameTime = await Date.now();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    global.gl.useProgram(global.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // // EARTH
    // let land = await motor.loadMesh(scene, 'earth_LP_high.json');
    // land.entity.mesh.setColor( [ 0.2, 0.9, 0.2, 1.0] );
    // motor.enableBoundingBox(land);

    // // SEA
    // let sphere = await motor.loadMesh(scene, 'sea.json');
    // sphere.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(sphere);

    // // SEA
    // let earth = await motor.loadMesh(scene, '0_earth.json');
    // earth.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(earth);

    // // SEA
    // let sphere = await motor.loadMesh(scene, '0_sea.json');
    // sphere.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 1.0] );
    // motor.enableBoundingBox(sphere);

    // low quality ... to ... high quality
    // sea: http://h203.eps.ua.es/assets/assets/JSON/sea.json
    // earth: http://h203.eps.ua.es/assets/assets/JSON/earthobj.json

    // Correct ones:
    // let LOD_earth = motor.dynamicMeshArray(scene, ['0_earth.json','earth_LP_high.json'], [ 0.2, 0.9, 0.2, 1.0]);
    // let LOD_sea = motor.dynamicMeshArray(scene, ['0_sea.json','sea.json'], [ 0.3, 0.3, 0.8, 1.0]);

    // to do: load 2 MESHES ONLY
    let LOD_earth = motor.dynamicMeshArray(scene, ['0_earth.json','1_earth.json','2_earth.json'], [ 0.2, 0.9, 0.2, 1.0], [3,6]);
    let LOD_sea = motor.dynamicMeshArray(scene, ['0_sea.json','1_sea.json','2_sea.json'], [ 0.3, 0.3, 0.8, 1.0], [3,6]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         particles
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let positionTFocus = [-1.0,0.0,0.0];
    let targetPos = [1,1,1];
    let newYorkPos = convertLatLonToVec3(40.730610, -73.935242);
    let madridPos = convertLatLonToVec3(40.4165, -3.70256);
    let hongKongPos = convertLatLonToVec3(22.28552, 114.15769);
    let australiaPos = convertLatLonToVec3(-33.865143, 151.209900);
    let middleOcean = convertLatLonToVec3(36.482797, -41.634668);
    let upperPos = convertLatLonToVec3(66.326023, -31.565348);
    let argentina = convertLatLonToVec3(-51.755200, -70.611091);

    // New York focus
    let TFocus6 = motor.createFocus(scene, 100, 'straight', newYorkPos, 'normal' );
    let TFocusA = motor.createFocus(scene, 100, 'dispersion', newYorkPos);

    // // Madrid focus
    let TFocus5 = motor.createFocus(scene, 100, 'straight', madridPos , 'normal');


    // // Ocean focus
    let TFocus99 = motor.createFocus(scene, 100, 'dispersion', middleOcean , 'normal');

    let TFocusAA = motor.createFocus(scene, 100, 'fireworks', hongKongPos , 'normal', 1);



    // // Madrid mesh
    // let madrid = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(madrid, [0.05, 0.05, 0.05]);
    // motor.translate(madrid, madridPos);
    // madrid.entity.mesh.setColor( [ 1, 1, 0, 1.0] );


    // // Hong Kong focus
    // let TFocus7 = motor.createFocus(scene, 100, 'dispersion', hongKongPos, 'normal' );
    // // Hong Kong mesh
    // let hk = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(hk, [0.05, 0.05, 0.05]);
    // motor.translate(hk, hongKongPos);
    // hk.entity.mesh.setColor( [ 1, 1, 0, 1.0] );

    // // Australia focus
    // let TFocus8 = motor.createFocus(scene, 100, 'dispersion', australiaPos, 'normal' );
    // // Australia mesh
    // let au = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(au, [0.05, 0.05, 0.05]);
    // motor.translate(au, australiaPos);
    // au.entity.mesh.setColor( [ 1, 1, 0, 1.0] );

    // Axis focus
    // let focusX = motor.createFocus(scene,100, 'straight', [0,0,0], [1,0,0])
    // let focusY = motor.createFocus(scene,100, 'straight', [0,0,0], [0,1,0])
    // let focusZ = motor.createFocus(scene,100, 'straight', [0,0,0], [0,0,1])

    // let testing = motor.createFocus(scene, 100, 'dispersion', [0,0,0], positionTFocus);


    let origin = await motor.loadMesh(scene, 'marker.json');
    motor.scale(origin, [0.1, 0.1, 0.1]);
    motor.translate(origin, positionTFocus);
    motor.enableBoundingBox(origin)
    origin.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 0.5] );

    let target = await motor.loadMesh(scene, 'marker.json');
    motor.scale(target, [0.1, 0.1, 0.1]);
    motor.translate(target, targetPos);
    target.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


    let vertical = await motor.loadMesh(scene, 'marker.json');
    motor.scale(vertical, [0.1, 0.1, 0.1]);
    motor.translate(vertical, [positionTFocus[0], positionTFocus[1]+1.7, positionTFocus[2] ] );
    vertical.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


    ///////////
    // cities
    ///////////

    let particlesTexture = await manager.getResource('spark.png');



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    motor.enableCam(cam);

    global.zoom = global.maxZoom;

    ease({
      startValue: global.zoom,
      endValue: 1.7,
      durationMs: 5000,
      onStep: x => global.zoom = x,
      onComplete: () => {
        global.status = 1;
      }
    })

    // motor.cameraLookAt( cam, [
    //   global.zoom * Math.sin(0*Math.PI/180),
    //   global.zoom,
    //   global.zoom * Math.cos(0*Math.PI/180)
    // ],
    // [0,0,0],
    // [0,1,0]);

    motor.calculateViews();


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient      specular       diffuse         direction
    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], null, [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();

    const whiteTexture = global.gl.createTexture();
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);
    global.gl.texImage2D(
      global.gl.TEXTURE_2D, 0, global.gl.RGBA, 1, 1, 0,
      global.gl.RGBA, global.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    global.gl.useProgram(global.program);
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);



    console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let number = 0;
    let auxTHETA = 0;
    let auxPHI = 0;
    var loop = async function (now, now2) {

      if (!global.drag && (auxPHI!=global.orbitLimit && auxPHI!=-global.orbitLimit) ) {
//      if (!global.drag && (auxPHI!=1.2 && auxPHI!=-1.2) ) {
        global.dX *= global.AMORTIZATION, global.dY*=global.AMORTIZATION;
        global.THETA+=global.dX, global.PHI+=global.dY;

        // move to particles
        global.gl.useProgram(global.particlesProgram);
        // Update particles size while zooming
        global.gl.uniform1f(global.particlesUniforms.uPointSize, 60 * Math.pow( Math.min(Math.max(global.zoom,global.minZoom),global.maxZoom), -1 ) );
        global.gl.useProgram(global.program);

      }

      global.gl.useProgram(global.program);

      global.time = await Date.now();

      ////////////////////////////////////////////////////////////////

      auxTHETA = global.orbitSpeed*global.THETA*(Math.PI/180);
      auxPHI = Math.max(Math.min(((global.orbitSpeed*global.PHI)*(Math.PI/180)),global.orbitLimit), -global.orbitLimit);

      let camX = global.zoom * Math.sin(auxTHETA) * Math.cos(auxPHI);
      let camY = global.zoom * Math.sin(auxPHI);
      let camZ = global.zoom * -Math.cos(auxTHETA) * Math.cos(auxPHI);

      motor.cameraLookAt( cam, [
          camX,
          camY,
          camZ,
        ],
        [0,0,0],
        //positionTFocus,
        [0,1,0]);

      // Old camera lookAt (rotating Y-axis camera)
      // motor.cameraLookAt( cam, [
      //   global.zoom * Math.sin(number*Math.PI/180),
      //   global.zoom,
      //   global.zoom * Math.cos(number*Math.PI/180),
      // ],
      // [0,0,0],
      // [0,1,0]);


      motor.calculateViews();

      // global.gl.uniform3f(global.programUniforms.uLightDirection,
      //   global.zoom * Math.sin(number*Math.PI/180),
      //   global.zoom,
      //   global.zoom * Math.cos(number*Math.PI/180)
      // );

      global.gl.uniform3f(global.programUniforms.uLightDirection,
        camX, camY, camZ
      );


      motor.draw();

      ////////////////////////////////////////////////////////////////

      global.lastFrameTime = global.time;

      number = number + 0.3;

      requestAnimationFrame(loop);
    }

    motor.init();
    loop();
  }; //
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions,
  rotateMesh,
  interactiveMain,
  setSceneWidth
}
//
