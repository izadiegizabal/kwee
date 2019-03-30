// TNode
import {TNode} from './TNode.js';
// TEntity
import {TCamera, TLight, TMesh, TTransform} from './TEntity.js';
// TResourceManager
import {loadImage, TResourceManager} from './resourceManager.js';
// TMotor
// Commons
import {gl, program, shared, texture} from './commons.js';

// Globals
var manager = new TResourceManager();

async function main() {

  // Shared initialises global (to provide export/import to other files)
  // - gl
  // - program
  // - canvas
  shared();

  await setupShaders();

  await scene();

  render();
}

async function setupShaders() {
  let vShader = await manager.getResource('shader.vs');
  let fShader = await manager.getResource('shader.fs');


  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  /////////////////////
  // LINKING SHADERS
  /////////////////////
  gl.shaderSource(vertexShader, vShader);
  gl.shaderSource(fragmentShader, fShader);

  // VERTEX SHADER
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
    return;
  }

  // FRAGMENT SHADER
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

}

async function scene() {
  let Escena = new TNode();
  let RotaLuz = new TNode(Escena);
  let RotaCam = new TNode(Escena);
  let RotaMalla = new TNode(Escena);
  Escena.addChild(RotaLuz);
  Escena.addChild(RotaCam);
  Escena.addChild(RotaMalla);
  let TraslaLuz = new TNode(RotaLuz);
  let TraslaCam = new TNode(RotaCam);
  let TraslaMalla = new TNode(RotaMalla);
  RotaLuz.addChild(TraslaLuz);
  RotaCam.addChild(TraslaCam);
  RotaMalla.addChild(TraslaMalla);

  //---- Añadir las entidades a los nodos ----

  let TransfRotaLuz = new TTransform();
  let TransfRotaCam = new TTransform();
  let TransfRotaCam2 = new TTransform();
  let TransfRotaMalla = new TTransform();

  RotaLuz.setEntity(TransfRotaLuz);
  RotaCam.setEntity(TransfRotaCam2);
  RotaMalla.setEntity(TransfRotaMalla);

  // type, ambient = intensity, specular, diffuse
  let EntLuz = new TLight('type1', [0.0, 0.0, 0.0], [0.8, 0.8, 0.8], [0.4, 1.4, 0.4]);
  let EntCam = new TCamera();
  let MallaChasis = await new TMesh('earth_uv.json');


}

function render() {
  // Clear screen things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
}

export {
  main
}
