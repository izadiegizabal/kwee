import * as glMatrix from "./dependencies/gl-matrix";


let canvas = null;
var global = {
  gl: null,
  program: null,
  particlesProgram: null,
  modelViewMatrix: null,
  projectionMatrix: null,
  auxMatrix: null,
  time: null,
  lastFrameTime: null,
  stack : null,
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
  }
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
        global.modelViewMatrix = await glMatrix.mat4.create();
        global.projectionMatrix = await glMatrix.mat4.create();
        global.projectionMatrix = await glMatrix.mat4.perspective(global.projectionMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        // mvMatrix to be multiplied when exploring the tree
        global.auxMatrix = await glMatrix.mat4.create();

        // Stack to save mvMatrix multiplied
        global.stack = new Stack(); 

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
