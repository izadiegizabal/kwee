

let canvas = null;
let gl = null;
let program = null;
let texture = null;
var angle = 30;

function shared() {
    canvas = document.getElementById('kweelive');
    
    gl = canvas.getContext('webgl');
    
    program = gl.createProgram();
    
    texture = gl.createTexture();
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

function getEntity(){
    return TEntity;
}

function setEntity(ent){
    TEntity = ent;
}

export {
    shared,
    canvas,
    gl,
    program,
    TEntity,
    getEntity,
    setEntity,
    changeAngle,
    angle,
    texture
}
