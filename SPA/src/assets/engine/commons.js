

// TAG.66
import * as glMatrix from "./dependencies/gl-matrix";


let canvas = null;
let mango = {
  gl: null,
  program: null,
  particlesProgram: null,
  textureProgram: null,
  useTextures: null,
  lastThis: null,
  modelMatrix: null,      // model Matrix
  viewMatrix: null,       // view Matrix
  viewPos: null,       // view Vec3 position
  projectionMatrix: null, // projection Matrix
  stack : null,           // stack of models Matrix
  auxMatrix: null,
  time: null,
  targetPoint: null,
  auxViewMatrix: null,
  lastFrameTime: null,
  programAttributes: {
    aVertexPosition: null,
    aVertexNormal: null,
    aVertexColor: null,
    aVertexTextureCoords: null,
  },
  programUniforms: {
    uMVMatrix: null,
    uPMatrix: null,
    uNMatrix: null,
    uLightDirection: null,
    uLightAmbient: null,
    uLightDiffuse: null,
    uLightSpecular: null,
    uMaterialDiffuse: null,
    uMaterialSpecular: null,
    uShininess: null,
  },
  particlesAttributes: {
    aParticle: null,
  },
  particlesUniforms: {
    uMVMatrix: null,
    uPMatrix: null,
    uPointSize: null,
    uColor: null
  },
  AMORTIZATION: null,
  drag: false,
  THETA: null,
  PHI: null,
  dX: null,
  dY: null,
  orbitSpeed: null,
  orbitMaxY: null,
  orbitLimit: null,
  zoom: null,
  maxZoom: null,
  minZoom: null,
  status: null
}
let angle = 0;

function shared(landing) {
  return new Promise(async resolve => {
    canvas = document.getElementById('kweelive');
    if (canvas) {

// TAG.39
      mango.gl = canvas.getContext('webgl');

      // init programs
      mango.program = mango.gl.createProgram();
      mango.particlesProgram = mango.gl.createProgram();
      mango.textureProgram = mango.gl.createProgram();
      mango.useTextures = false;

      // init matrix
      mango.modelMatrix = await glMatrix.mat4.create();
      mango.viewMatrix = await glMatrix.mat4.create();
      mango.projectionMatrix = await glMatrix.mat4.create();
      // todo TAG.10 (paralela)
      // TAG.11
      mango.projectionMatrix = await glMatrix.mat4.perspective(mango.projectionMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

      // Stack to save mvMatrix multiplied
      mango.stack = new Stack();
      mango.stack.push(mango.modelMatrix);

      // Interactive stuff
      mango.drag = false;
      mango.AMORTIZATION = 0.95;
      mango.dX = 0;
      mango.dY = 0;
      mango.THETA = 0;
      mango.PHI = 0;
      // Orbit setup
      mango.orbitSpeed = 20;
      mango.orbitMaxY = 11;
      mango.orbitLimit = 1.4 // default is 1.2
      mango.zoom = 1.7;  // 5 for debug purposes

      mango.maxZoom = 7;
      mango.minZoom = 0.9;


      /*
      STATUS:
       0 - loading
       1 - everything ready
      */
      mango.status = 0;



      canvas.addEventListener("mousedown", mouseDown, false);
      canvas.addEventListener("mouseup", mouseUp, false);
      canvas.addEventListener("mouseout", mouseUp, false);
      canvas.addEventListener("mousemove", mouseMove, false);

      // Prevent mouse scroll
      if(!landing){
        canvas.addEventListener('wheel', mouseWheel, false);
        canvas.addEventListener('mousewheel', mouseWheel, false);
      }


    }
    resolve(true);
  });
}

function loadAttribAndUniformsLocations(){
  // Init uniforms and attributes for program
  mango.programAttributes.aVertexPosition        = mango.gl.getAttribLocation(mango.program, "aVertexPosition");
  mango.programAttributes.aVertexNormal          = mango.gl.getAttribLocation(mango.program, "aVertexNormal");
  mango.programAttributes.aVertexColor           = mango.gl.getAttribLocation(mango.program, "aVertexColor");
  mango.programAttributes.aVertexTextureCoords   = mango.gl.getAttribLocation(mango.program, "aVertexTextureCoords");

  mango.programUniforms.uMVMatrix                = mango.gl.getUniformLocation(mango.program, "uMVMatrix");
  mango.programUniforms.uPMatrix                 = mango.gl.getUniformLocation(mango.program, "uPMatrix");
  mango.programUniforms.uNMatrix                 = mango.gl.getUniformLocation(mango.program, "uNMatrix");

  mango.programUniforms.uLightAmbient            = mango.gl.getUniformLocation(mango.program, "uLightAmbient");
  mango.programUniforms.uLightDirection          = mango.gl.getUniformLocation(mango.program, "uLightDirection");
  mango.programUniforms.uLightDiffuse            = mango.gl.getUniformLocation(mango.program, "uLightDiffuse");
  mango.programUniforms.uLightSpecular           = mango.gl.getUniformLocation(mango.program, "uLightSpecular");
  mango.programUniforms.uMaterialDiffuse         = mango.gl.getUniformLocation(mango.program, "uMaterialDiffuse");
  mango.programUniforms.uMaterialSpecular        = mango.gl.getUniformLocation(mango.program, "uMaterialSpecular");
  mango.programUniforms.uShininess               = mango.gl.getUniformLocation(mango.program, "uShininess");


  // @todo
  // Init uniforms and attributes for Particles program
  mango.particlesUniforms.uMVMatrix              = mango.gl.getUniformLocation(mango.particlesProgram, "uMVMatrix");
  mango.particlesUniforms.uPMatrix               = mango.gl.getUniformLocation(mango.particlesProgram, "uPMatrix");
  mango.particlesUniforms.uPointSize             = mango.gl.getUniformLocation(mango.particlesProgram, "uPointSize");
  mango.particlesUniforms.uColor             = mango.gl.getUniformLocation(mango.particlesProgram, "uColor");


  mango.particlesAttributes.aParticle            = mango.gl.getUniformLocation(mango.particlesProgram, "aParticle");
}

var AMORTIZATION = 0.95;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
  mango.drag = true;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp = function(e){
  mango.drag = false;
};

var mouseMove = function(e) {
  let auxPHI = Math.max(Math.min(((mango.orbitSpeed*mango.PHI)*(Math.PI/180)),mango.orbitLimit), -mango.orbitLimit);
  if (!mango.drag && auxPHI != mango.orbitLimit && auxPHI != -mango.orbitLimit ) return false;
  mango.dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
    mango.dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
  mango.THETA+= mango.dX;
  mango.PHI+=mango.dY;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
};

var mouseWheel = function(e) {
  let tmp = mango.zoom;
  ( mango.zoom + (e.deltaY/40) ) > mango.maxZoom ?
    mango.zoom = mango.maxZoom : ( ((tmp + e.deltaY/40) < mango.minZoom) ? mango.zoom = mango.minZoom : (tmp +=e.deltaY/40) )

  mango.zoom = tmp;

  e.preventDefault();
}

function ease({
                startValue = 0,
                endValue = 1,
                durationMs = 200,
                onStep,
                onComplete = () => {},
              }) {
  const raf = window.requestAnimationFrame || (func => window.setTimeout(func, 16));

  const stepCount = durationMs / 16;
  const valueIncrement = (endValue - startValue) / stepCount;
  const sinValueIncrement = Math.PI / stepCount;

  let currentValue = startValue;
  let currentSinValue = 0;

  function step() {
    currentSinValue += sinValueIncrement;
    currentValue += valueIncrement * (Math.sin(currentSinValue) ** 2) * 2;

    if (currentSinValue < Math.PI) {
      onStep(currentValue);
      raf(step);
    } else {
      onStep(endValue);
      onComplete();
    }
  }

  raf(step);
}


function changeAngle(degrees) {
    angle = degrees;
}

// Virtual class
// TAG.04
class TEntity {
    beginDraw() {
    }

    endDraw() {
    }
}

// Static attributes
// WARNING: current matrix in the drawing process
TEntity.Model = glMatrix.mat4.create();
TEntity.View = [];
TEntity.Views = [];
TEntity.AuxViews = [];
TEntity.Light = [];
TEntity.Lights = [];
TEntity.AuxLights = [];
TEntity.Aux = [];
// Static attribute stack
TEntity.stack = null;
TEntity.buffer = null;

function getEntity(){
    return TEntity;
}

function setEntity(ent){
    TEntity = ent;
}


// Our stack class
// TAG.05
class Stack {

  constructor() {
      this.items = [];
  }

  push(el) {
      // WARNING: slice arrays to avoid memory reference problems
      this.items.push(el.slice());
  }

  pushLast() {
      this.items.push(peek());
  }

  pop() {
      return this.items.pop();
  }

  peek() {
      return this.items[this.items.length - 1];
  }

  isEmpty() {
      return (this.items.length === 0) ? true : false;
  }

}

export {
    shared,
    canvas,
    mango,
    TEntity,
    getEntity,
    setEntity,
    changeAngle,
    angle,
    loadAttribAndUniformsLocations,
    ease
}
