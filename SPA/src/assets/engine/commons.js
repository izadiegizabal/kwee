

let canvas = null;
let gl = null;
let program = null;
var angle = 30;

function shared() {
    canvas = document.getElementById('kweelive');
    // console.log(canvas);
    gl = canvas.getContext('webgl');
    // console.log(gl);
    program = gl.createProgram();
    // console.log(program);
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


export {
    shared,
    canvas,
    gl,
    program,
    TEntity,
    changeAngle,
    angle
}