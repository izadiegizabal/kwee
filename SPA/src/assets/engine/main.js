// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, global, angle, TEntity, loadAttribAndUniformsLocations} from './commons.js';

import {getBezierPoints, convertLatLonToVec3, quatFromVectors, getEuler, degrees, convertLatLonToVec3Rotated} from './tools/utils.js'

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

    console.log('== Ready to run ==');
    draw = true;
    allowActions.value = true;

    loadAttribAndUniformsLocations()

    resolve(allowActions.value);
  });
}

function rotateMesh() {
  rotateMeshBool = true;
}

async function resetCanvas() {
  draw = false;
  //global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
}


async function mainR(texture, particles, line) {
  rotateMeshBool = false;
  if(global.gl && global.program) {


    draw = true;
    allowActions.value = false;
    let motor = new TMotorTAG(manager);
    let scene = motor.createRootNode();
    let quats = glMatrix.quat.create();
    let quatsRot = glMatrix.quat.create();
    let auxQuat = glMatrix.quat.create();
    const vec3 = glMatrix.vec3;
    var quatsArray = [];
    var quatQ = 1 / 16;
    var quatBQ = 16;

    global.lastFrameTime = await Date.now();


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



    global.gl.useProgram(global.program);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // let card = await motor.loadMesh(scene, 'card.json');
    // motor.rotate(card, 0, 'z');
    // motor.rotate(card, 90, 'y');
    // motor.translate(card, [-5, 0, 0] );
    // motor.scale(card, [0.2, 0.1, 0.2] );
    //motor.translate(card, convertLatLonToVec3(40.415363, -3.707398));

    // EARTH
    //let land = await motor.loadMesh(scene, 'earth_LP.json');
    let land = await motor.loadMesh(scene, 'earth_LP_high.json');
    land.entity.mesh.setColor( [ 0.2, 0.9, 0.2, 1.0] );

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

    //let TFocus = motor.createFocus(scene, 50, convertLatLonToVec3(-33.865143, 151.209900) ).entity;
//    let positionTFocus = [0.0,0.0,-1.0];
    let positionTFocus = [-1.0,0.0,0.0];
    let targetPos = [0.0, 0.7, 0.0]
    let TFocus = motor.createFocus(scene, 50, positionTFocus );
    //motor.rotate(TFocus, 45, 'x')
    
    let origin = await motor.loadMesh(scene, 'marker.json');
    motor.scale(origin, [0.1, 0.1, 0.1]);
    motor.translate(origin, positionTFocus);
    origin.entity.mesh.setColor( [ 0.3, 0.3, 0.8, 0.5] );

    // let target = await motor.loadMesh(scene, 'marker.json');
    // motor.scale(target, [0.1, 0.1, 0.1]);
    // motor.translate(target, targetPos);
    // target.entity.mesh.setColor( [ 1, 0.3, 0.8, 1] );
    
    let particlesTexture = await manager.getResource('spark.png');


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    motor.enableCam(cam);

    let radius = 1.7; // normal
    //let radius = 5; // debug
    //motor.translate(cam, [0.0 , 0.0, -radius]);
    
    motor.cameraLookAt( cam, [
      radius * Math.sin(0*Math.PI/180),
      0,
      radius * Math.cos(0*Math.PI/180)
    ]);

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
    /////////////////////                                         ARCS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const Narc = motor.createArc(scene, 10.500000, -66.916664,40.415363, -3.707398, 32);
    const arc = Narc.entity.arc;
    var vertices = [];

    for (let i = 0 ; i < arc.length ; i++) {
      vertices.push(...arc[i]);
      if (!(i === 0 || i === (arc.length - 1))) {
        vertices.push(...arc[i]);
      }
    }


    // ====================
    // drawing arcs --> to TArc:: draw()
    // ====================

    // Create an empty buffer object
    var vertex_buffer = global.gl.createBuffer();

    // Bind appropriate array buffer to it
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(vertices), global.gl.STATIC_DRAW);

    // Unbind the buffer
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);


    console.log(scene);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var last = 0;
    var last2 = 0;
    var num = 0;
    var rotation = -1;
    var maxLines = vertices.length/3;
    let number = 0;
    var loop = async function (now, now2) {
      if (draw) {
        
        global.gl.useProgram(global.program);

        global.time = await Date.now();
      
        ////////////////////////////////////////////////////////////////
        
        motor.cameraLookAt( cam, [
          radius * Math.sin(number*Math.PI/180),
          0,
          radius * Math.cos(number*Math.PI/180),
        ]);

       
        motor.calculateViews();

        global.gl.uniform3f(global.programUniforms.uLightDirection, 
          radius * Math.sin(number*Math.PI/180),
          0,
          radius * Math.cos(number*Math.PI/180)
        );

        motor.draw();
        
        ////////////////////////////////////////////////////////////////
        
       
        // @todo Replace now2 and last with global.time and global.lastFrameTime
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
        if(line){
          if(!last || now - last >= 0.02*1000) {
            last = now;
            num+=2;
            if(num > maxLines) {
              num = maxLines;
            }
          }


          // Bind vertex buffer object
          global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertex_buffer);

          // Get the attribute location
          var coord = global.gl.getAttribLocation(global.program, "aVertexPosition");

          // Point an attribute to the currently bound VBO
          global.gl.vertexAttribPointer(coord, 3, global.gl.FLOAT, false, 0, 0);

          // Enable the attribute
          global.gl.enableVertexAttribArray(coord);
          global.gl.uniform4fv(uMaterialDiffuse, [1, 0.019, 0.792, 1]);
          global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
          global.gl.uniform1i(uUseTextures, 0);
          global.gl.drawArrays(global.gl.LINES, 0, num);
        }

        global.lastFrameTime = global.time;

        requestAnimationFrame(loop);
      }
      number = number + 0.3;
      if(number>360) number = 0;
    };

    motor.init();
    loop();

  }
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions,
  rotateMesh
}
