const GLOBE_RADIUS = 1.27227*50;
const CURVE_MIN_ALTITUDE = 1;
const CURVE_MAX_ALTITUDE = 2;

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

// functions from https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
export function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getBezierPoints(startLat, startLon, endLat, endLon, quality){
  const start = convertLatLonToVec3(startLat,startLon,true);
  const end = convertLatLonToVec3(endLat,endLon,true);

  const altitude = clamp(glMatrix.vec3.dist(start,end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);

  const interpolate = geoInterpolate([startLon, startLat], [endLon, endLat]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = convertLatLonToVec3(midCoord1[1], midCoord1[0], true,altitude);
  const mid2 = convertLatLonToVec3(midCoord2[1], midCoord2[0], true,altitude);

  let arc = [];
  const q = 1/quality;
  let auxVec = glMatrix.vec3.create();
  for (let i = 0; i <= 1 ; i+=q) {
    arc.push(glMatrix.vec3.fromValues(...glMatrix.vec3.bezier(auxVec,start,mid1,mid2,end, i)));
  }
  return arc;
  // return [start,mid1,mid2,end];
}


function convertLatLonToVec3 ( lat, lon, bool, altitude ) {
  lon -= 0.8;
  lat += 0.8;
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
  var r = 0.62;
  if (bool) {
    r = 0.65;
  }
  if(altitude) {
    r = 0.1 + altitude;
  }
  return glMatrix.vec3.fromValues(Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r);
  // return[Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r];
}

function convertLatLonToVec3offsetY ( lat, lon, offsetY) {
  lon -= 0.8;
  lat += 0.8;
  let latRad = lat * (Math.PI / 180);
  let lonRad = -lon * (Math.PI / 180);
  let r = 0.62;
  let point = glMatrix.vec3.fromValues(Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r);

  let vec3Cross = glMatrix.vec3.create();
  vec3Cross = glMatrix.vec3.cross(vec3Cross, point, [0,1,0]);

  let rot = glMatrix.mat4.create();
  glMatrix.mat4.rotate(rot, rot, offsetY * radians, vec3Cross);

  glMatrix.vec3.transformMat4(point, point, rot);

  return point;
}

function convertLatLonToVec3RandomOffset(lat, lon, scene) {
  lon -= 0.8;
  lat += 0.8;
  let latRad = lat * (Math.PI / 180);
  let lonRad = -lon * (Math.PI / 180);
  let r = 0.62;
  let point = glMatrix.vec3.fromValues(Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r);
  let init = glMatrix.vec3.fromValues(...point);
  let randomRotate = 0;
  switch (scene) {
    case  1:
      randomRotate = getRandomInt(0, 1);
      break;
    case  2:
      // randomRotate = getRandomInt(2, 4);
      randomRotate = getRandomInt(0, 1);
      if(randomRotate === 0){
        randomRotate = 2;
      } else { randomRotate = 4; }
      break;
    case  3:
      randomRotate = getRandomInt(5, 8);
      break;
  }

  let offsetY = 0;
  let offsetX = 0;

  switch (randomRotate) {
    case  0:
      offsetX = -10;
      break;
    case  1:
      offsetX = -30;
      break;
    case  2:
      offsetX = -30;
      offsetY = 30;
      break;
    case  3:
      // down
      // offsetX = -10;
      break;
    case  4:
      offsetX = -30;
      offsetY = -30;
      break;
    case  5:
      offsetX = -30;
      offsetY = 30;
      break;
    case  6:
      offsetX = -30;
      break;
    case  7:
      offsetX = -30;
      offsetY = -30;
      break;
    case  8:
      offsetX = -10;
      break;
  }

  let vec3Cross = glMatrix.vec3.create();
  vec3Cross = glMatrix.vec3.cross(vec3Cross, point, [0,1,0]);
  let rot = glMatrix.mat4.create();
  let rot2 = glMatrix.mat4.create();
  glMatrix.mat4.rotate(rot, rot, offsetX * radians, vec3Cross);
  glMatrix.mat4.rotateY(rot2, rot2, offsetY * radians);
  glMatrix.vec3.transformMat4(point, point, rot);
  glMatrix.vec3.transformMat4(point, point, rot2);

  return {coord: point, random: randomRotate, coordWithoutRotation: init};
}

function convertLatLonToVec3Rotated ( lat, lon, rotationMat) {
  lon += -25.7;
  lat -= 0.5;
  var latRad = lat * (Math.PI / 180);
  var lonRad = -lon * (Math.PI / 180);
  var r = 1.27227*50;
  var aux = glMatrix.vec3.create();
  var vec3 = glMatrix.vec3.fromValues(Math.cos(latRad) * Math.cos(lonRad) * r , Math.sin(latRad) * r , Math.cos(latRad) * Math.sin(lonRad) * r);
  var rotations = getPureEuler(rotationMat);
  glMatrix.vec3.rotateX(vec3, vec3, [0, 0, 0], rotations[0] * degrees);
  glMatrix.vec3.rotateY(vec3, vec3, [0, 0, 0], rotations[1] * degrees);
  glMatrix.vec3.rotateZ(vec3, vec3, [0, 0, 0], rotations[2] * degrees);
  return vec3;
}


function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}


// function from d3-geo's source code https://github.com/d3/d3-geo
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

// function from THREE.js's source code https://github.com/mrdoob/three.js/
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;
let tmpvec3 = vec3.create();
const xUnitVec3 = vec3.fromValues(1,0,0);
const yUnitVec3 = vec3.fromValues(0,1,0);

function quatFromVectors(out, a, b) {
  a = vec3.normalize(a,a);
  b = vec3.normalize(b,b);
  let dot = vec3.dot(a, b);
  if (dot < -0.999999) {
    vec3.cross(tmpvec3, xUnitVec3, a);
    if (vec3.length(tmpvec3) < 0.000001)
      vec3.cross(tmpvec3, yUnitVec3, a);
    vec3.normalize(tmpvec3, tmpvec3);
    quat.setAxisAngle(out, tmpvec3, Math.PI);
  } else if (dot > 0.999999) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
  } else {
    vec3.cross(tmpvec3, a, b);
    out[0] = tmpvec3[0];
    out[1] = tmpvec3[1];
    out[2] = tmpvec3[2];
    out[3] = 1 + dot;
    return quat.normalize(out, out);
  }
};

// function from THREE.js's source code https://github.com/mrdoob/three.js/
function getEuler(quaternion) {

  var te = [];
  let position = [0, 0, 0];
  let scale = [1, 1, 1];

  var x = quaternion[0], y = quaternion[1], z = quaternion[2], w = quaternion[3];
  var x2 = x + x,	y2 = y + y, z2 = z + z;
  var xx = x * x2, xy = x * y2, xz = x * z2;
  var yy = y * y2, yz = y * z2, zz = z * z2;
  var wx = w * x2, wy = w * y2, wz = w * z2;

  var sx = scale[0], sy = scale[1], sz = scale[2];

  te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
  te[ 1 ] = ( xy + wz ) * sx;
  te[ 2 ] = ( xz - wy ) * sx;
  te[ 3 ] = 0;

  te[ 4 ] = ( xy - wz ) * sy;
  te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
  te[ 6 ] = ( yz + wx ) * sy;
  te[ 7 ] = 0;

  te[ 8 ] = ( xz + wy ) * sz;
  te[ 9 ] = ( yz - wx ) * sz;
  te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
  te[ 11 ] = 0;

  te[ 12 ] = position[0];
  te[ 13 ] = position[0];
  te[ 14 ] = position[0];
  te[ 15 ] = 1;

  return getPureEuler(glMatrix.mat4.fromValues(...te));

}
// function from THREE.js's source code https://github.com/mrdoob/three.js/
function getPureEuler( te) {

  let x = 0, y, z = 0;

  var m11 = te[0], m12 = te[4], m13 = te[8];
  var m21 = te[1], m22 = te[5], m23 = te[9];
  var m31 = te[2], m32 = te[6], m33 = te[10];

  y = Math.asin( clamp( m13, - 1, 1 ) );

  if ( Math.abs( m13 ) < 0.99999 ) {

    x = Math.atan2( - m23, m33 );
    z = Math.atan2( - m12, m11 );

  } else {

    x = Math.atan2( m32, m22 );
    z = 0;

  }

  return [x, y, z];
}

function rotateVec3(point, roll, yaw, pitch) {
  let cosa = Math.cos(yaw);
  let sina = Math.sin(yaw);

  let cosb = Math.cos(pitch);
  let sinb = Math.sin(pitch);

  let cosc = Math.cos(roll);
  let sinc = Math.sin(roll);

  let Axx = cosa*cosb;
  let Axy = cosa*sinb*sinc - sina*cosc;
  let Axz = cosa*sinb*cosc + sina*sinc;

  let Ayx = sina*cosb;
  let Ayy = sina*sinb*sinc + cosa*cosc;
  let Ayz = sina*sinb*cosc - cosa*sinc;

  let Azx = -sinb;
  let Azy = cosb*sinc;
  let Azz = cosb*cosc;

  let px = point[0];
  let py = point[1];
  let pz = point[2];

  return  [ Axx*px + Axy*py + Axz*pz, Ayx*px + Ayy*py + Ayz*pz, Azx*px + Azy*py + Azz*pz];
}

export {
  getBezierPoints,
  convertLatLonToVec3,
  convertLatLonToVec3offsetY,
  convertLatLonToVec3Rotated,
  convertLatLonToVec3RandomOffset,
  geoInterpolate,
  quatFromVectors,
  getEuler,
  degrees
}
