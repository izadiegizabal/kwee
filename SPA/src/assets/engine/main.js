/*var last = 0; // timestamp of the last render() call

function render(now) {
    // each 2 seconds call the createNewObject() function
    if(!last || now - last >= 40) {
        last = now;
        ////loop
    }
    window.requestAnimationFrame(render);


    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}*/

// TNode
import {
    TNode,
    calculateViews,
    calculateLights,
    goToRoot,
    getLigthsViews
} from './TNode.js';
// TEntity
import {
    TTransform,
    TCamera,
    TLight,
    TAnimation,
    TMesh
} from './TEntity.js';
// TResourceManager
import {
    TResourceManager,
    TResourceMesh,
    TResourceMaterial,
    TResourceTexture,
    TResourceShader,
    loadImage
} from './resourceManager.js';
// TMotor
import { TMotorTAG } from './TMotorTAG.js';

// Commons
import {
    canvas,
    gl,
    program,
    TEntity,
    angle,
    changeAngle,
    texture
} from './commons.js';

let draw = true;
let manager = null;
let allowActions = {
  value: false
};

async function mainInit(){
  return new Promise(resolve => {

  gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  console.log('== Loading Image ==');
  const image = new Image();
  image.onload = async function(){
    console.log('== Image loaded ==');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.sampler, 0);



    manager = new TResourceManager();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, manager.map.get('shader.vs').shader);
    gl.shaderSource(fragmentShader, manager.map.get('shader.fs').shader);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
      return;
    }

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
    console.log('== Ready to run ==');
    draw = true;
    allowActions.value = true;
    resolve(allowActions.value);
  }
  image.src = '../assets/assets/textures/continents.jpg';
  });
}

function pls (){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('asd');
    }, 2000);
  });
}

async function resetCanvas(){
  draw = false;
  gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  /*
    ///////// DELETE BUFFERS
    var numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    for (var unit = 0; unit < numTextureUnits; ++unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Delete all your resources
    // Note!!!: You'd have to change this code to delete the resources YOU created.
    gl.deleteTexture(someTexture);
    gl.deleteTexture(someOtherTexture);
    gl.deleteBuffer(someBuffer);
    gl.deleteBuffer(someOtherBuffer);
    gl.deleteRenderbuffer(someRenderbuffer);
    gl.deleteFramebuffer(someFramebuffer);

    ///////// DELETE ATTRIBUTES
    // var buf = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // var numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    // for (var attrib = 0; attrib < numAttributes; ++attrib) {
    //     gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
    // }

    ///////// LOOSE ALL
    // gl.getExtension('WEBGL_lose_context').loseContext();
  */
}


async function mainR( model ){
  draw = true;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         INIT CONFIG
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
  gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);


  gl.useProgram(program);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         TREE & RESOURCES
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let cam = motor.createCamera(scene);
    let light = motor.createLight(scene);
    let mesh = await motor.loadMesh(scene, 'simplest.json');

  //---- Añadir las entidades a los nodos ----

  // let TransfRotaLuz = new TTransform();
  // let TransfRotaCam = new TTransform();
  // let TransfRotaCam2 = new TTransform();
  // let TransfRotaCoche = new TTransform();
  // TransfRotaCoche.rotateZ(135);
  // let TransfRotaCoche2 = new TTransform();
  // let TransfRotaCoche3 = new TTransform();

  RotaLuz.setEntity(TransfRotaLuz);
  RotaCam.setEntity(TransfRotaCam2);
  RotaCoche.setEntity(TransfRotaCoche);
  RotaCoche2.setEntity(TransfRotaCoche2);
  let MallaChasis = null;
  let EntLuz = new TLight();
  let EntCam = new TCamera();
  if (model === 'hollow') {
    MallaChasis = await new TMesh('earth_fbx.json');
  } else {
    MallaChasis = await new TMesh('textured_earth.json');
  }



  //let MallaChasi2 = new TMesh();
  //await MallaChasi2.loadMesh('earth.json');

  console.log(MallaChasis.mesh);

  /*await loadImage('continents.jpg', await function (imgErr, img) {
    if (imgErr) {
      alert('Fatal error getting texture (see console)');
      console.error(imgErr);
    } else {

      image = img;
      console.log(image);
    }
  });*/


  // let NLuz = new TNode(TraslaLuz);
  // let NCam = new TNode(TraslaCam);
  // let NChasis = new TNode(TraslaCoche);
  // //let NChasi2 = new TNode(TraslaCoche2);

  // NLuz.setEntity(EntLuz);
  // NCam.setEntity(EntCam);
  // NChasis.setEntity(MallaChasis);
  // //NChasi2.setEntity(MallaChasi2);

  // TraslaLuz.addChild(NLuz);
  // TraslaCoche.addChild(NChasis);
  // //TraslaCoche2.addChild(NChasi2);
  // TraslaCam.addChild(NCam);

  // TraslaLuz.setEntity(TransfRotaLuz);
  // //TransfRotaLuz.translate([2, 0, 0]);
  // TraslaCoche.setEntity(TransfRotaCoche);
  // TraslaCam.setEntity(TransfRotaCam);
  //TraslaCoche2.setEntity(TransfRotaCoche3);
  //TraslaCoche2.entity.translate([2, -1, 0]);

  /*var motor = new TMotorTAG();
  motor.lookAt(NCam, [0, 0, -10], [0, 0, 0], [0, 1, 0]);

  //// matrices
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  viewMatrix = TEntity.AuxViews[0];
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);*/

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         CAMERAS
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  console.log("scene:");
  console.log(scene);

  motor.lookAt(cam, [0, 0, 2], [0, 0, 0], [0, 1, 0]);

  motor.calculateLights();
  motor.calculateViews();
//   console.log('Lights : ');
//   console.log(TEntity.Lights);
//   console.log('Views/cameras: ');
//   console.log(TEntity.Views);
//   console.log('Lights array: ');
//   console.log(TEntity.AuxLights);
//   console.log('Views/cameras array: ');
//   console.log(TEntity.AuxViews);
// console.log('Lights : ');
//   console.log(motor.allLights);
//   console.log('Views/cameras: ');
//   console.log(motor.allCameras);
//  console.log('Lights array: ');
//   console.log(TEntity.AuxLights);
//   console.log('Views/cameras array: ');
//   console.log(TEntity.AuxViews);


  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  
  viewMatrix = motor.positionCameras[0]; // viewMatrix = TEntity.AuxViews[0];

  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
  
  gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         LIGHTNING
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //gl.useProgram(program);

  var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
  var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
  var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

  gl.uniform3f(ambientUniformLocation, 0.266, 0.294, 0.329);
  gl.uniform3f(sunlightDirUniformLocation, 0.0, 0.0, 2.0);
  gl.uniform3f(sunlightIntUniformLocation, 1, 1, 1);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////                                         LOOP
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var loop = function () {
    if(draw) {
      gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      changeAngle(performance.now() / 1000 / 6 * 2 * Math.PI);
      Escena.draw();
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);

}

async function mainR(){

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         INIT CONFIG
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let manager = new TResourceManager();
  
    // gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
    gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
  
  
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');
  
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
    gl.shaderSource(vertexShader, VShader);
    gl.shaderSource(fragmentShader, FShader);
  
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
      return;
    }
  
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
  
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         TREE & RESOURCES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let Escena = new TNode();
    let RotaLuz = new TNode(Escena);
    let RotaCam = new TNode(Escena);
    let RotaCoche = new TNode(Escena);
    let RotaCoche2 = new TNode(Escena);
    Escena.addChild(RotaLuz);
    Escena.addChild(RotaCam);
    Escena.addChild(RotaCoche);
    Escena.addChild(RotaCoche2);
    let TraslaLuz = new TNode(RotaLuz);
    let TraslaCam = new TNode(RotaCam);
    let TraslaCoche = new TNode(RotaCoche);
    let TraslaCoche2 = new TNode(RotaCoche2);
    RotaLuz.addChild(TraslaLuz);
    RotaCam.addChild(TraslaCam);
    RotaCoche.addChild(TraslaCoche);
    RotaCoche2.addChild(TraslaCoche2);
  
    //---- Añadir las entidades a los nodos ----
  
    let TransfRotaLuz = new TTransform();
    let TransfRotaCam = new TTransform();
    let TransfRotaCam2 = new TTransform();
    let TransfRotaCoche = new TTransform();
    TransfRotaCoche.rotateZ(135);
    let TransfRotaCoche2 = new TTransform();
    let TransfRotaCoche3 = new TTransform();
  
    RotaLuz.setEntity(TransfRotaLuz);
    RotaCam.setEntity(TransfRotaCam2);
    RotaCoche.setEntity(TransfRotaCoche);
    RotaCoche2.setEntity(TransfRotaCoche2);
  
    let EntLuz = new TLight();
    let EntCam = new TCamera();
    let meshResource = await manager.getResource('earth_fbx.json');
    let MallaChasis = await new TMesh(meshResource);
  
  
    //let MallaChasi2 = new TMesh();
    //await MallaChasi2.loadMesh('earth.json');
  
    console.log(MallaChasis);
  
    /*await loadImage('continents.jpg', await function (imgErr, img) {
      if (imgErr) {
        alert('Fatal error getting texture (see console)');
        console.error(imgErr);
      } else {
        image = img;
        console.log(image);
      }
    });*/
  
  
    let NLuz = new TNode(TraslaLuz);
    let NCam = new TNode(TraslaCam);
    let NChasis = new TNode(TraslaCoche);
    //let NChasi2 = new TNode(TraslaCoche2);
  
    NLuz.setEntity(EntLuz);
    NCam.setEntity(EntCam);
    NChasis.setEntity(MallaChasis);
    //NChasi2.setEntity(MallaChasi2);
  
    TraslaLuz.addChild(NLuz);
    TraslaCoche.addChild(NChasis);
    //TraslaCoche2.addChild(NChasi2);
    TraslaCam.addChild(NCam);
  
    TraslaLuz.setEntity(TransfRotaLuz);
    //TransfRotaLuz.translate([2, 0, 0]);
    TraslaCoche.setEntity(TransfRotaCoche);
    TraslaCam.setEntity(TransfRotaCam);
    //TraslaCoche2.setEntity(TransfRotaCoche3);
    //TraslaCoche2.entity.translate([2, -1, 0]);
  
    /*var motor = new TMotorTAG();
    motor.lookAt(NCam, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    //// matrices
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    viewMatrix = TEntity.AuxViews[0];
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);*/
  
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         CAMERAS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var motor = new TMotorTAG();
    motor.lookAt(NCam, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
  
    calculateLights();
    calculateViews();
    // console.log('Lights : ');
    // console.log(TEntity.Lights);
    // console.log('Views/cameras: ');
    // console.log(TEntity.Views);
    // console.log('Lights array: ');
    // console.log(TEntity.AuxLights);
    console.log('Views/cameras array: ');
    console.log(TEntity.AuxViews);
  
    console.log(Escena);
  
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    viewMatrix = TEntity.AuxViews[0];
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gl.useProgram(program);
  
    var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
    var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
    var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');
  
    gl.uniform3f(ambientUniformLocation, 0.4, 0.4, 0.4);
    gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
    gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////                                         LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var loop = function () {
      gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      changeAngle(performance.now() / 1000 / 6 * 2 * Math.PI);
      Escena.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  
  }

export {
    mainInit,
    mainR,
    init,
    resetCanvas,
    allowActions,
  pls
}
