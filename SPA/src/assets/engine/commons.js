import * as glMatrix from "./dependencies/gl-matrix";


let canvas = null;
let global = {
  gl: null,
  program: null
};
let angle = 30;

function shared() {
  return new Promise(async resolve => {
    canvas = document.getElementById('kweelive');
    if (canvas) {
      global.gl = canvas.getContext('webgl');
      global.program = global.gl.createProgram();
    }
    resolve(true);
  });
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

function getEntity() {
  return TEntity;
}

function setEntity(ent) {
  TEntity = ent;
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
}
