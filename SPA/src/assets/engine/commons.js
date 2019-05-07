import * as glMatrix from "./dependencies/gl-matrix";


let canvas = null;
var global = {
  gl: null,
  program: null,
  particlesProgram: null,
  modelMatrix: null,      // model Matrix
  viewMatrix: null,       // view Matrix
  projectionMatrix: null, // projection Matrix
  stack : null,           // stack of models Matrix
  auxMatrix: null,
  time: null,
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
    uMaterialDiffuse: null,
  },
  particlesAttributes: {
    aParticle: null,
  },
  particlesUniforms: {
    uMVMatrix: null,
    uPMatrix: null,
    uPointSize: null,
  },
  AMORTIZATION: null,
  drag: false,
  THETA: null,
  PHI: null,
  dX: null,
  dY: null,
  orbitSpeed: null,
  orbitMaxY: null
}
let angle = 0;

function shared() {
  return new Promise(async resolve => {
    canvas = document.getElementById('kweelive');
    if (canvas) {
        global.gl = canvas.getContext('webgl');

        // init programs
        global.program = global.gl.createProgram();
        global.particlesProgram = global.gl.createProgram();

        // init matrix
        global.modelMatrix = await glMatrix.mat4.create();
        global.viewMatrix = await glMatrix.mat4.create();
        global.projectionMatrix = await glMatrix.mat4.create();
        global.projectionMatrix = await glMatrix.mat4.perspective(global.projectionMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        // mvMatrix to be multiplied when exploring the tree
        // global.auxMatrix = await glMatrix.mat4.create();

        // Stack to save mvMatrix multiplied
        global.stack = new Stack(); 
        global.stack.push(global.modelMatrix);

        // Interactive stuff
        global.drag = false;
        global.AMORTIZATION = 0.95;
        global.dX = 0;
        global.dY = 0;
        global.THETA = 0;
        global.PHI = 0;
        // Orbit setup
        global.orbitSpeed = 8;
        global.orbitMaxY = 11;

        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);
        canvas.addEventListener("mouseout", mouseUp, false);
        canvas.addEventListener("mousemove", mouseMove, false);

    }
    resolve(true);
  });
}

function loadAttribAndUniformsLocations(){
    // @todo
    // Init uniforms and attributes for Particles program
    global.particlesUniforms.uMVMatrix              = global.gl.getUniformLocation(global.particlesProgram, "uMVMatrix");
    global.particlesUniforms.uPMatrix               = global.gl.getUniformLocation(global.particlesProgram, "uPMatrix");
    global.particlesUniforms.uPointSize             = global.gl.getUniformLocation(global.particlesProgram, "uPointSize");

    global.particlesAttributes.aParticle            = global.gl.getUniformLocation(global.particlesProgram, "aParticle");
    
    // Init uniforms and attributes for program
    global.programUniforms.uMVMatrix                = global.gl.getUniformLocation(global.program, "uMVMatrix");
    global.programUniforms.uPMatrix                 = global.gl.getUniformLocation(global.program, "uPMatrix");
    global.programUniforms.uNMatrix                 = global.gl.getUniformLocation(global.program, "uNMatrix");

    global.programUniforms.uLightAmbient            = global.gl.getUniformLocation(global.program, "uLightAmbient");
    global.programUniforms.uLightDirection          = global.gl.getUniformLocation(global.program, "uLightDirection");
    global.programUniforms.uLightDiffuse            = global.gl.getUniformLocation(global.program, "uLightDiffuse");
    global.programUniforms.uMaterialDiffuse         = global.gl.getUniformLocation(global.program, "uMaterialDiffuse");

    global.programAttributes.aVertexPosition        = global.gl.getAttribLocation(global.program, "aVertexPosition");
    global.programAttributes.aVertexNormal          = global.gl.getAttribLocation(global.program, "aVertexNormal");
    global.programAttributes.aVertexColor           = global.gl.getAttribLocation(global.program, "aVertexColor");
    global.programAttributes.aVertexTextureCoords   = global.gl.getAttribLocation(global.program, "aVertexTextureCoords");

}

var AMORTIZATION = 0.95;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
  global.drag = true;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp = function(e){
  global.drag = false;
};

var mouseMove = function(e) {
  if (!global.drag) return false;
  global.dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
  global.dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
  global.THETA+= global.dX;
  global.PHI+=global.dY;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
};


function changeAngle(degrees) {
    angle = degrees;
}

// Virtual class
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
    global,
    TEntity,
    getEntity,
    setEntity,
    changeAngle,
    angle,
    loadAttribAndUniformsLocations
}
