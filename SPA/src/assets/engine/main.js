// TNode
// TEntity
// TResourceManager
import {TResourceManager} from './resourceManager.js';
// TMotor
import {TMotorTAG} from './TMotorTAG.js';
// Commons
import {canvas, changeAngle, global, angle} from './commons.js';

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
    let quat = glMatrix.quat.create();
    console.log(quat);
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
    let sphere = await motor.loadMesh(scene, 'sea.json');
    //motor.rotate(sphere, -90, 'z');
    motor.scale(sphere, [0.995, 0.995, 0.995]);

    //////////////////////////////////
    ///////           Markers
    //////////////////////////////////
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
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // console.log("scene:");
    // console.log(scene);

    motor.lookAt(cam, [0, 0, 2], [0, 0, 1], [0, 1, 0]);

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

    console.log('Bezier');
    const arc = getBezierPoints(10.500000, -66.916664,40.415363, -3.707398);

    var Caracas = convertLatLonToVec3(10.500000, -66.916664, true);
    var Madrid = convertLatLonToVec3(40.415363, -3.707398, true);


    /*var vertices = [
      Madrid[0],Madrid[1],Madrid[2],
      Caracas[0],Caracas[1],Caracas[2]
    ];*/

    var vertices = [
      ...arc[0],
      ...arc[1],
      ...arc[1],
      ...arc[2],
      ...arc[2],
      ...arc[3],
      ...arc[3],
      ...arc[4],
      ...arc[4],
      ...arc[5],
      ...arc[5],
      ...arc[6],
      ...arc[6],
      ...arc[7],
      ...arc[7],
      ...arc[8],
      ...arc[8],
      ...arc[9],
      ...arc[9],
      ...arc[10],
      ...arc[10],
      ...arc[11],
      ...arc[11],
      ...arc[12],
      ...arc[12],
      ...arc[13],
      ...arc[13],
      ...arc[14],
      ...arc[14],
      ...arc[15],
      ...arc[15],
      ...arc[16],
      ...arc[16],
      ...arc[17],
      ...arc[17],
      ...arc[18],
      ...arc[18],
      ...arc[19],
      ...arc[19],
      ...arc[20],
      ...arc[20],
      ...arc[21],
      ...arc[21],
      ...arc[22],
      ...arc[22],
      ...arc[23],
      ...arc[23],
      ...arc[24],
      ...arc[24],
      ...arc[25],
      ...arc[25],
      ...arc[26],
      ...arc[26],
      ...arc[27],
      ...arc[27],
      ...arc[28],
      ...arc[28],
      ...arc[29],
      ...arc[29],
      ...arc[30],
      ...arc[30],
      ...arc[31],
      ...arc[31],
      ...arc[32],
    ];

    // Create an empty buffer object
    var vertex_buffer = global.gl.createBuffer();

    // Bind appropriate array buffer to it
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(vertices), global.gl.STATIC_DRAW);

    // Unbind the buffer
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
    let uMaterialDiffuse = global.gl.getUniformLocation(global.program, 'uMaterialDiffuse');
    let uMaterialAmbient = global.gl.getUniformLocation(global.program, 'uMaterialAmbient');
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var loop = function () {
      if (draw) {
        //global.gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        //global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
        changeAngle(performance.now() / 1000 / 3 * 2 * Math.PI);
        changeAngle(angle * 25);
        motor.setRotation(land, angle, 'y');
        // glMatrix.mat4.getRotation(quat,land.father.father.entity.matrix);
        // console.log(quat);
        motor.setRotation(sphere, angle, 'y');
        scene.draw();


        // Bind vertex buffer object
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertex_buffer);

        // Get the attribute location
        var coord = global.gl.getAttribLocation(global.program, "aVertexPosition");

        // Point an attribute to the currently bound VBO
        global.gl.vertexAttribPointer(coord, 3, global.gl.FLOAT, false, 0, 0);

        // Enable the attribute
        global.gl.enableVertexAttribArray(coord);
        global.gl.uniform4fv(uMaterialDiffuse, [1, 0.039, 0.231, 1.0]);
        global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        global.gl.uniform1i(uUseTextures, 0);
        global.gl.drawArrays(global.gl.LINES, 0, 64);


        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }
}

const GLOBE_RADIUS = 1.27227*50;
const CURVE_MIN_ALTITUDE = 1;
const CURVE_MAX_ALTITUDE = 2;
const DEGREE_TO_RADIAN = Math.PI / 180;

export function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

function getBezierPoints(startLat,startLon,endLat,endLon){
    const start = convertLatLonToVec3(startLat,startLon,true);
    const end = convertLatLonToVec3(endLat,endLon,true);

  const altitude = clamp(glMatrix.vec3.dist(start,end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);

  const interpolate = geoInterpolate([startLon, startLat], [endLon, endLat]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = convertLatLonToVec3(midCoord1[1], midCoord1[0], true,altitude);
  const mid2 = convertLatLonToVec3(midCoord2[1], midCoord2[0], true,altitude);

  let arc = [];
  const q = 1/32;
  let auxVec = glMatrix.vec3.create();
  for (let i = 0; i <= 1 ; i+=q) {
    arc.push(glMatrix.vec3.fromValues(...glMatrix.vec3.bezier(auxVec,start,mid1,mid2,end, i)));
  }
  return arc;
  // return [start,mid1,mid2,end];
}


function convertLatLonToVec3 ( lat, lon, bool, altitude ) {
  lon += -25.7;
  lat -= 0.5;
  /*lat =  lat * Math.PI / 180.0;
  lon = -lon * Math.PI / 180.0;
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon)];*/
  /*var cosLat = Math.cos(lat * Math.PI / 180.0);
  var sinLat = Math.sin(lat * Math.PI / 180.0);
  var cosLon = Math.cos(lon * Math.PI / 180.0);
  var sinLon = Math.sin(lon * Math.PI / 180.0);
  var rad = 1.27227*50;
  return [(rad * cosLat * cosLon), (rad * cosLat * sinLon), (rad * sinLat)];
  return [(rad * cosLat * cosLon)-49, (rad * cosLat * sinLon)+11, (rad * sinLat)+22];*/
  var latRad = lat * (Math.PI / 180);
  var lonRad = -lon * (Math.PI / 180);
  var r = 1.27227*50;
  if (bool) {
    r = 0.65;
  }
  if(altitude) {
    r = 0.1 + altitude;
  }
  return glMatrix.vec3.fromValues(Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r);
  // return[Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r];
}

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var tau = pi * 2;

var degrees = 180 / pi;
var radians = pi / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;
var log = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt = Math.sqrt;
var tan = Math.tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}

function geoInterpolate(a, b) {
  let x0 = a[0] * radians,
    y0 = a[1] * radians,
    x1 = b[0] * radians,
    y1 = b[1] * radians,
    cy0 = cos(y0),
    sy0 = sin(y0),
    cy1 = cos(y1),
    sy1 = sin(y1),
    kx0 = cy0 * cos(x0),
    ky0 = cy0 * sin(x0),
    kx1 = cy1 * cos(x1),
    ky1 = cy1 * sin(x1),
    d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
    k = sin(d);

  let interpolate = d ? function(t) {
    let B = sin(t *= d) / k,
      A = sin(d - t) / k,
      x = A * kx0 + B * kx1,
      y = A * ky0 + B * ky1,
      z = A * sy0 + B * sy1;
    return [
      atan2(y, x) * degrees,
      atan2(z, sqrt(x * x + y * y)) * degrees
    ];
  } : function() {
    return [x0 * degrees, y0 * degrees];
  };

  interpolate.distance = d;

  return interpolate;
}

export {
  mainInit,
  mainR,
  resetCanvas,
  allowActions
}
