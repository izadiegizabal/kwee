// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, mango, angle, TEntity, loadAttribAndUniformsLocations, ease} from './commons.js';

import {getBezierPoints, convertLatLonToVec3, quatFromVectors, getEuler, degrees, convertLatLonToVec3Rotated} from './tools/utils.js'

let draw = true;

let manager = null;
let allowActions = {
  value: false,
  card: false,
  p: null,
  v: null,
  point: 0,
  random: 0
};
let arr = [[10.500000, -66.916664],[-41.28664, 174.77557], [10.500000, -66.916664], [41.89193, 12.51133], [-33.865143, 151.209900], [35.6895, 139.69171], [40.415363, -3.707398]];
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

async function mainInitExplicit() {
  return new Promise(async resolve => {

    //mango.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue

    // (0.435, 0.909, 0.827, 0.0); // our blue
    // (0.266, 0.294, 0.329, 1.0); // our grey

    manager = new TResourceManager();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');


    let vertexShader = mango.gl.createShader(mango.gl.VERTEX_SHADER);
    let fragmentShader = mango.gl.createShader(mango.gl.FRAGMENT_SHADER);

    mango.gl.shaderSource(vertexShader, VShader);
    mango.gl.shaderSource(fragmentShader, FShader);

    mango.gl.compileShader(vertexShader);
    if (!mango.gl.getShaderParameter(vertexShader, mango.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', mango.gl.getShaderInfoLog(vertexShader));
      return;
    }

    mango.gl.compileShader(fragmentShader);
    if (!mango.gl.getShaderParameter(fragmentShader, mango.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader', mango.gl.getShaderInfoLog(fragmentShader));
      return;
    }

    mango.gl.attachShader(mango.program, vertexShader);
    mango.gl.attachShader(mango.program, fragmentShader);
    mango.gl.linkProgram(mango.program);
    if (!mango.gl.getProgramParameter(mango.program, mango.gl.LINK_STATUS)) {
      console.error('ERROR linking mango.program', mango.gl.getProgramInfoLog(mango.program));
      return;
    }
    mango.gl.validateProgram(mango.program);
    if (!mango.gl.getProgramParameter(mango.program, mango.gl.VALIDATE_STATUS)) {
      console.error('ERROR validating mango.program', mango.gl.getProgramInfoLog(mango.program));
      return;
    }

    VShader = await manager.getResource('particles.vs');
    FShader = await manager.getResource('particles.fs');


    vertexShader = mango.gl.createShader(mango.gl.VERTEX_SHADER);
    fragmentShader = mango.gl.createShader(mango.gl.FRAGMENT_SHADER);

    mango.gl.shaderSource(vertexShader, VShader);
    mango.gl.shaderSource(fragmentShader, FShader);

    mango.gl.compileShader(vertexShader);
    if (!mango.gl.getShaderParameter(vertexShader, mango.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', mango.gl.getShaderInfoLog(vertexShader));
      return;
    }

    mango.gl.compileShader(fragmentShader);
    if (!mango.gl.getShaderParameter(fragmentShader, mango.gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader', mango.gl.getShaderInfoLog(fragmentShader));
      return;
    }

    mango.gl.attachShader(mango.particlesProgram, vertexShader);
    mango.gl.attachShader(mango.particlesProgram, fragmentShader);
    mango.gl.linkProgram(mango.particlesProgram);
    if (!mango.gl.getProgramParameter(mango.particlesProgram, mango.gl.LINK_STATUS)) {
      console.error('ERROR linking mango.program', mango.gl.getProgramInfoLog(mango.particlesProgram));
      return;
    }
    mango.gl.validateProgram(mango.particlesProgram);
    if (!mango.gl.getProgramParameter(mango.particlesProgram, mango.gl.VALIDATE_STATUS)) {
      console.error('ERROR validating mango.program', mango.gl.getProgramInfoLog(mango.particlesProgram));
      return;
    }

    // Use default
    mango.gl.useProgram(mango.program);
    draw = true;
    allowActions.value = true;

    loadAttribAndUniformsLocations();

    resolve(allowActions.value);
  });
}

async function mainInit(motor) {
  return new Promise(async resolve => {

    //mango.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue

    // (0.435, 0.909, 0.827, 0.0); // our blue
    // (0.266, 0.294, 0.329, 1.0); // our grey

    manager = new TResourceManager();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    await motor.attachProgram(mango.program, manager, 'shader.vs', 'shader.fs');
    await motor.attachProgram(mango.particlesProgram, manager, 'particles.vs', 'particles.fs');

    // Use default
    mango.gl.useProgram(mango.program);
    draw = true;
    allowActions.value = true;

    loadAttribAndUniformsLocations();

    resolve(allowActions.value);
  });
}


async function resetCanvas() {
  draw = false;
  mango.gl.clear(mango.gl.COLOR_BUFFER_BIT | mango.gl.DEPTH_BUFFER_BIT);
}


async function mainR(texture, particles, line) {
  if(mango.gl && mango.program) {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    Motor = motor;
    let scene = motor.createRootNode();
    Scene = scene;


    mango.lastFrameTime = await Date.now();


    mango.gl.useProgram(mango.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // EARTH
    let landMaterial = motor.createMaterial( 
      /* color */    [0.258, 0.960, 0.6, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0] , 
      /* shiny */    3 );

      //let LOD_earth = motor.dynamicMeshArrayLazyLoading(scene, ['sea.json','earthobj.json'], landMaterial);
      let LOD_earth = motor.dynamicMeshArrayLazyLoading(scene, ['0_earth.json','2_earth_SS.json'], landMaterial);
      
      let seaMaterial = motor.createMaterial( 
        /* color */    [0.313, 0.678, 0.949, 1.0],
        /* specular */ [1.0, 1.0, 1.0, 1.0], 
        /* shiny */    15 );
      
      let LOD_sea = motor.dynamicMeshArrayLazyLoading(scene, ['0_sea.json','2_sea_SS.json'], seaMaterial);



  //   //let land = await motor.loadMesh(scene, 'earth_LP.json');
  //   let land = await motor.loadMesh(scene, '2_earth.json');
  //   land.entity.mesh.setMaterial( landMaterial );
  //   Land = land;
  //   // motor.scale(land, [5.0, 5.0, 5.0]);
  //   // motor.scale(land, [0.25, 0.25, 0.25]);

  //   // if (texture) {
  //   //   let tex = await manager.getResource('continents.jpg');
  //   //   land.entity.mesh.tex = tex;
  //   //    console.log(land);
  //   // } else {
  //   //   //land.entity.mesh.tex = undefined;
  //   // }
    
 
  //  // SEA
  //   let seaMaterial = motor.createMaterial( 
  //   /* color */    [0.3, 0.3, 0.8, 1.0],
  //   /* specular */ [1.0, 1.0, 1.0, 1.0], 
  //   /* shiny */    15 );
  //   let sphere = await motor.loadMesh(scene, '2_sea.json');
  //   sphere.entity.mesh.setMaterial( seaMaterial );
  //   Sphere = sphere;
    
    
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
    // let uWireframe = mango.gl.getUniformLocation(mango.program, 'uWireframe');
    // mango.gl.uniform1i(uWireframe, 0);
    // let uUseVertexColor = mango.gl.getUniformLocation(mango.program, 'uUseVertexColor');
    // mango.gl.uniform1i(uUseVertexColor, 0);
    // let uUseTextures = mango.gl.getUniformLocation(mango.program, 'uUseTextures');
    // mango.gl.uniform1i(uUseTextures, 0);


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

// http://h203.eps.ua.es/assets/assets/JSON/sea.json
// http://h203.eps.ua.es/assets/assets/JSON/earthobj.json
    ///////////
    // cities
    ///////////

    // let madrid = await motor.loadMesh(land, 'marker.json');
    // motor.scale(madrid, [0.01, 0.01, 0.01]);
    // motor.translate(madrid, convertLatLonToVec3(40.415363, -3.707398));

    // let roma = await motor.loadMesh(land, 'marker.json');
    // motor.scale(roma, [0.01, 0.01, 0.01]);
    // motor.translate(roma, convertLatLonToVec3(41.8905, 12.4942));

    // let paris = await motor.loadMesh(land, 'marker.json');
    // motor.scale(paris, [0.01, 0.01, 0.01]);
    // motor.translate(paris, convertLatLonToVec3(48.8667, 2.33333));


    // let particlesTexture = await manager.getResource('spark.png');

    

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
    mango.targetPoint =  convertLatLonToVec3(40.415363, -3.707398);
    allowActions.p = mango.targetPoint;
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
    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], [1.0,1.0,1.0,1.0], [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();

    // console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let number = 0;
    var loop = async function (now) {
      if (draw) {
        
        mango.gl.useProgram(mango.program);

        mango.time = await Date.now();
      



        ////////////////////////////////////////////////////////////////
        
        /*motor.cameraLookAt( cam, [
          radius * Math.sin(number*Math.PI/180),
          radius,
          radius * Math.cos(number*Math.PI/180),
        ],
        [0,0,0],
        [0,1,0]);

       
        motor.calculateViews();*/

        // mango.gl.uniform3f(mango.programUniforms.uLightDirection,
        //   radius * Math.sin(number*Math.PI/180),
        //   radius,
        //   radius * Math.cos(number*Math.PI/180)
        // );
        motor.calculateViews();
        requestAnimationFrame(loop);

        mango.gl.uniform3f(mango.programUniforms.uLightDirection,
            ...mango.viewPos
          );
        motor.draw();
        
        ////////////////////////////////////////////////////////////////
      

        mango.lastFrameTime = mango.time;


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
        // console.log(mango.auxViewMatrix);
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
        let one = glMatrix.mat4.mul(pereza, mango.projectionMatrix, mango.viewMatrix);
        allowActions.point = glMatrix.vec4.transformMat4(perezaMax, [...mango.targetPoint, 1], pereza);*/
        //allowActions.p = mango.projectionMatrix;
        //allowActions.p = mango.projectionMatrix;
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
        //console.log(mango.auxViewMatrix);
        let pvMat4 = glMatrix.mat4.create();
        let uselessMat4 = glMatrix.vec4.create();
        pvMat4 = glMatrix.mat4.mul(pvMat4, mango.projectionMatrix, mango.auxViewMatrix);
        allowActions.point = glMatrix.vec4.transformMat4(uselessMat4, [...mango.targetPoint, 1], pvMat4);
        allowActions.card = true;
        Motor.createFocus(Scene, 100, 'straight', mango.targetPoint , 'normal', null, [1,0.25,0.51, 1.0]);
        let fireworks = Motor.createFocus(Scene, 150, 'fireworks', mango.targetPoint , 'normal', null, [1,0.5,0.67, 1.0]);
        setTimeout(() => {
          Motor.deleteFocus(fireworks);
        }, 800);
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
        last = now;
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
      // mat4 = glMatrix.mat4.mul(mat4, mango.viewMatrix, mat4);
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
      mango.auxViewMatrix = glMatrix.mat4.fromValues(...mango.viewMatrix);
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

async function demoMain(target, boundingBox = false){
  
  if(mango.gl && mango.program) {

    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();

    mango.lastFrameTime = await Date.now();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    mango.gl.useProgram(mango.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // // EARTH
    let landMaterial = motor.createMaterial( 
      /* color */    [0.2, 0.9, 0.2, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0] , 
      /* shiny */    3 );
    let earth0 = await motor.loadMesh(scene, '0_earth.json');
    earth0.entity.mesh.setMaterial( landMaterial );
    motor.translate(earth0, [2,0,0])
    boundingBox ? motor.enableBoundingBox(earth0) : 0;

    let earth1 = await motor.loadMesh(scene, '1_earth.json');
    earth1.entity.mesh.setMaterial( landMaterial );
    motor.translate(earth1, [4,0,0])
    boundingBox ? motor.enableBoundingBox(earth1) : 0;

    let earth2 = await motor.loadMesh(scene, '2_earth.json');
    earth2.entity.mesh.setMaterial( landMaterial );
    motor.translate(earth2, [6,0,0])
    boundingBox ? motor.enableBoundingBox(earth2) : 0;


    // SEA

    let seaMaterial = motor.createMaterial( 
      /* color */    [0.3, 0.3, 0.8, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0], 
      /* shiny */    15 );
      
    let sea0 = await motor.loadMesh(scene, '0_sea.json');
    motor.translate(sea0, [2,0,-2]);
    sea0.entity.mesh.setMaterial( seaMaterial );
    boundingBox ? motor.enableBoundingBox(sea0) : 0;

    let sea1 = await motor.loadMesh(scene, '1_sea.json');
    motor.translate(sea1, [4,0,-2]);
    sea1.entity.mesh.setMaterial( seaMaterial );
    boundingBox ? motor.enableBoundingBox(sea1) : 0;

    let sea2 = await motor.loadMesh(scene, '2_sea.json');
    motor.translate(sea2, [6,0,-2]);
    sea2.entity.mesh.setMaterial( seaMaterial );
    boundingBox ? motor.enableBoundingBox(sea2) : 0;

    // LOD earth and sea
    let LOD_earth = motor.loadMeshArray(scene, ['0_earth.json','1_earth.json','2_earth.json'], landMaterial, [3,6]);
    let LOD_sea = motor.loadMeshArray(scene, ['0_sea.json','1_sea.json','2_sea.json'], seaMaterial, [3,6]);

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

    ////// TARGETED FOCUSES (ON EARTH)
    //// BOTH focus
    let TFocus6 = motor.createFocus(scene, 100, 'straight', newYorkPos, 'normal' );
    let TFocusA = motor.createFocus(scene, 100, 'dispersion', newYorkPos);

    //// STRAIGHT focus
    let TFocus5 = motor.createFocus(scene, 100, 'straight', madridPos , 'normal');

    //// DISPERSION focus
    let TFocus99 = motor.createFocus(scene, 100, 'dispersion', middleOcean , 'normal');

    //// FIREWORKS focus
    let TFocusAA = motor.createFocus(scene, 100, 'fireworks', hongKongPos , 'normal', 1);


    ////// SAMPLE FOCUSES
    // STRAIGHT
    let focus1 = motor.createFocus(scene, 100, 'straight', [-2,0,0] , 'y');
    // STRAIGHT TARGETED
    let focus11 = motor.createFocus(scene, 100, 'straight', [-2,0,-2] , [-2,-2,-2]);
    let focus11_mesh = await motor.loadMesh(scene, 'marker.json');
    motor.scale(focus11_mesh, [0.2, 0.2, 0.2]);
    motor.translate(focus11_mesh, [-2,-2,-2]);
    boundingBox ? motor.enableBoundingBox(focus11_mesh) : 0;
    // DISPERSION
    let focus2 = motor.createFocus(scene, 100, 'dispersion', [-4,0,0]);
    // FIREWORKS
    let fireworks = motor.createFocus(scene, 100, 'fireworks', [-6,0,0]);

    let arrayBuilding = [];
    for(let i = 0; i<20; i++){
      let name = "cube"+i+".json";
      arrayBuilding.push(name);
    }
    // ANIMATION
    let animationBuilding = await motor.loadAnimation(scene, arrayBuilding, landMaterial, 100, 5000);
    motor.translate(animationBuilding, [0,0,-2])

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    motor.enableCam(cam);

    mango.maxZoom = 15;

    // motor.cameraLookAt( cam, [
    //   mango.zoom * Math.sin(0*Math.PI/180),
    //   mango.zoom,
    //   mango.zoom * Math.cos(0*Math.PI/180)
    // ],
    // [0,0,0],
    // [0,1,0]);

    motor.calculateViews();


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient            specular       diffuse         direction
//    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], [1.0,1.0,1.0,1.0], [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);
    let light = motor.createLight(scene, 1, [0.06,0.06,0.06,1.0], [1.0,1.0,1.0,1.0], [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);
   //let light = motor.createLight(scene, 1, [0.9 ,0.9 ,0.9 ,1.0], [1.0,1.0,1.0,1.0], [0.7,0.7,0.7,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let number = 0;
    let auxTHETA = 0;
    let auxPHI = 0;
    var loop = async function (now, now2) {
      if(draw){

        if (!mango.drag && (auxPHI!=mango.orbitLimit && auxPHI!=-mango.orbitLimit) ) {
          mango.dX *= mango.AMORTIZATION, mango.dY*=mango.AMORTIZATION;
          mango.THETA+=mango.dX, mango.PHI+=mango.dY;
        }

        mango.gl.useProgram(mango.program);

        mango.time = await Date.now();

        ////////////////////////////////////////////////////////////////

        auxTHETA = mango.orbitSpeed*mango.THETA*(Math.PI/180);
        auxPHI = Math.max(Math.min(((mango.orbitSpeed*mango.PHI)*(Math.PI/180)),mango.orbitLimit), -mango.orbitLimit);

        let camX = mango.zoom * Math.sin(auxTHETA) * Math.cos(auxPHI);
        let camY = mango.zoom * Math.sin(auxPHI);
        let camZ = mango.zoom * -Math.cos(auxTHETA) * Math.cos(auxPHI);

        motor.cameraLookAt( cam, [
            camX,
            camY,
            camZ,
          ],
          target,
          //[0,0,0], // target
          //positionTFocus,
          [0,1,0]);

        // Old camera lookAt (rotating Y-axis camera)
        // motor.cameraLookAt( cam, [
        //   mango.zoom * Math.sin(number*Math.PI/180),
        //   mango.zoom,
        //   mango.zoom * Math.cos(number*Math.PI/180),
        // ],
        // [0,0,0],
        // [0,1,0]);


        motor.calculateViews();

        // mango.gl.uniform3f(mango.programUniforms.uLightDirection,
        //   mango.zoom * Math.sin(number*Math.PI/180),
        //   mango.zoom,
        //   mango.zoom * Math.cos(number*Math.PI/180)
        // );

        mango.gl.uniform3f(mango.programUniforms.uLightDirection,
          camX, camY, camZ
        );


        motor.draw();

        ////////////////////////////////////////////////////////////////

        mango.lastFrameTime = mango.time;

        number = number + 0.3;

        requestAnimationFrame(loop);
      }
    }

    motor.init();
    loop();
  }; //
}

async function interactiveMain(){
  if(mango.gl && mango.program) {

    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();

    mango.lastFrameTime = await Date.now();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    mango.gl.useProgram(mango.program);

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

    let landMaterial = motor.createMaterial( 
      /* color */    [0.2, 0.9, 0.2, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0] , 
      /* shiny */    3 );
   let seaMaterial = motor.createMaterial( 
      /* color */    [0.3, 0.3, 0.8, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0], 
      /* shiny */    15 );
    // to do: load 2 MESHES ONLY
    let LOD_earth = motor.loadMeshArray(scene, ['0_earth.json','1_earth.json','2_earth.json'], landMaterial, [3,6]);
    let LOD_sea = motor.loadMeshArray(scene, ['0_sea.json','1_sea.json','2_sea.json'], seaMaterial, [3,6]);

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
    //let TFocus5 = motor.createFocus(scene, 100, 'straight', madridPos , 'normal');


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
    // origin.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 0.5] );

    let target = await motor.loadMesh(scene, 'marker.json');
    motor.scale(target, [0.1, 0.1, 0.1]);
    motor.translate(target, targetPos);
    // target.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );


    let vertical = await motor.loadMesh(scene, 'marker.json');
    motor.scale(vertical, [0.1, 0.1, 0.1]);
    motor.translate(vertical, [positionTFocus[0], positionTFocus[1]+1.7, positionTFocus[2] ] );
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

    mango.zoom = mango.maxZoom;

    ease({
      startValue: mango.zoom,
      endValue: 1.7,
      durationMs: 5000,
      onStep: x => mango.zoom = x,
      onComplete: () => {
        mango.status = 1;
      }
    })

    // motor.cameraLookAt( cam, [
    //   mango.zoom * Math.sin(0*Math.PI/180),
    //   mango.zoom,
    //   mango.zoom * Math.cos(0*Math.PI/180)
    // ],
    // [0,0,0],
    // [0,1,0]);

    motor.calculateViews();


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient      specular       diffuse         direction
    let light = motor.createLight(scene, 1, [0.2,0.2,0.2,1.0], [1.0, 1.0, 1.0, 1.0], [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLights();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();

    const whiteTexture = mango.gl.createTexture();
    mango.gl.bindTexture(mango.gl.TEXTURE_2D, whiteTexture);
    mango.gl.texImage2D(
      mango.gl.TEXTURE_2D, 0, mango.gl.RGBA, 1, 1, 0,
      mango.gl.RGBA, mango.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    mango.gl.useProgram(mango.program);
    mango.gl.bindTexture(mango.gl.TEXTURE_2D, whiteTexture);

    //////////////
    // dynamic focus

    setTimeout(() => {
      let focusNode = motor.createFocus(scene, 100, 'fireworks', madridPos);
      motor.createFocus(scene, 100, 'straight', madridPos, 'normal');
      motor.createFocus(scene, 100, 'little', convertLatLonToVec3(48.864716, 2.349014), 'normal');
      setTimeout(() => {
        motor.deleteFocus(focusNode);
      }, 1800);
    }, 5000);


    console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let number = 0;
    let auxTHETA = 0;
    let auxPHI = 0;
    var loop = async function (now, now2) {

      if (!mango.drag && (auxPHI!=mango.orbitLimit && auxPHI!=-mango.orbitLimit) ) {
//      if (!mango.drag && (auxPHI!=1.2 && auxPHI!=-1.2) ) {
        mango.dX *= mango.AMORTIZATION, mango.dY*=mango.AMORTIZATION;
        mango.THETA+=mango.dX, mango.PHI+=mango.dY;

      }

      mango.gl.useProgram(mango.program);

      mango.time = await Date.now();

      ////////////////////////////////////////////////////////////////

      auxTHETA = mango.orbitSpeed*mango.THETA*(Math.PI/180);
      auxPHI = Math.max(Math.min(((mango.orbitSpeed*mango.PHI)*(Math.PI/180)),mango.orbitLimit), -mango.orbitLimit);

      let camX = mango.zoom * Math.sin(auxTHETA) * Math.cos(auxPHI);
      let camY = mango.zoom * Math.sin(auxPHI);
      let camZ = mango.zoom * -Math.cos(auxTHETA) * Math.cos(auxPHI);

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
      //   mango.zoom * Math.sin(number*Math.PI/180),
      //   mango.zoom,
      //   mango.zoom * Math.cos(number*Math.PI/180),
      // ],
      // [0,0,0],
      // [0,1,0]);


      motor.calculateViews();

      // mango.gl.uniform3f(mango.programUniforms.uLightDirection,
      //   mango.zoom * Math.sin(number*Math.PI/180),
      //   mango.zoom,
      //   mango.zoom * Math.cos(number*Math.PI/180)
      // );

      mango.gl.uniform3f(mango.programUniforms.uLightDirection,
        camX, camY, camZ
      );


      motor.draw();

      ////////////////////////////////////////////////////////////////

      mango.lastFrameTime = mango.time;

      number = number + 0.3;

      requestAnimationFrame(loop);
    }

    motor.init();
    loop();
  }; //
}

async function mainTextures(texture, particles, line) {
  if(mango.gl && mango.textureProgram) {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    Motor = motor;
    let scene = motor.createRootNode();
    Scene = scene;

    mango.lastFrameTime = await Date.now();

    mango.useTextures = true;
    await motor.attachProgram(mango.textureProgram, manager, 'textures.vs', 'textures.fs');
    mango.gl.useProgram(mango.textureProgram);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //let land = await motor.loadMesh(scene, 'earth_LP.json');
      let land = await motor.loadMesh(scene, 'earthobj.json');
      // land.entity.mesh.setMaterial( landMaterial );
      // motor.scale(land, [5.0, 5.0, 5.0]);
      // motor.scale(land, [0.25, 0.25, 0.25]);

      let tex = await manager.getResource('continents.jpg');
      land.entity.mesh.tex = tex;

      let sphere = await motor.loadMesh(scene, '2_sea_SS.json');


    ///// 0 === false ; 1 === true
    mango.gl.useProgram(mango.textureProgram);
    let uWireframe = mango.gl.getUniformLocation(mango.textureProgram, 'uWireframe');
    mango.gl.uniform1i(uWireframe, 0);
    let uUseVertexColor = mango.gl.getUniformLocation(mango.textureProgram, 'uUseVertexColor');
    mango.gl.uniform1i(uUseVertexColor, 0);
    let uUseTextures = mango.gl.getUniformLocation(mango.textureProgram, 'uUseTextures');
    mango.gl.uniform1i(uUseTextures, 0);


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
    mango.targetPoint =  convertLatLonToVec3(40.415363, -3.707398);
    allowActions.p = mango.targetPoint;
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



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                           father  type    ambient      specular       diffuse         direction
    let light = motor.createLight(scene, 1, [0.5,0.5,0.5,1.0], [1.0,1.0,1.0,1.0], [0.5,0.5,0.5,1.0], [10.0, 10.0, 10.0]);

    motor.calculateLightsTextures();

    ///////// CHAPUZA MASTER AYY LMAO
    allowActions.value = true;
    // document.getElementById("kweelive").click();
    document.body.click();

    // console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Avoid error unit 0

    let number = 0;

    var loop = async function (now) {
      if (draw) {

        mango.gl.useProgram(mango.textureProgram);

        mango.time = await Date.now();

        motor.calculateViews();

        requestAnimationFrame(loop);

        motor.draw();

        ////////////////////////////////////////////////////////////////

        mango.lastFrameTime = mango.time;

      }
      number = number + 0.3;
      if(number>360) number = 0;
    };

    motor.initTextures();
    requestAnimationFrame(loop);

  }
}

export {
  mainInit,
  mainInitExplicit,
  mainR,
  resetCanvas,
  allowActions,
  interactiveMain,
  setSceneWidth,
  demoMain,
  mainTextures
}
//
