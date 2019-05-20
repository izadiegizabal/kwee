////////// AUTHOR: WATERMELON CORP. - MULTIMEDIA ENGINEERING : TAG - UNIVERSITY OF ALICANTE
///////
////

import {TEntity, mango} from './commons';
import {getBezierPoints, convertLatLonToVec3, degrees, convertLatLonToVec3Rotated, quatFromVectors, getEuler} from './tools/utils.js';
import {TResourceMesh, TResourceMeshArray} from './resourceManager';


//TEntity.stack = new Stack();

// Structures and entities

// TAG.06
class TTransform extends TEntity {

    constructor(matrix) {
        super();
        this.matrix = glMatrix.mat4.create();
    }

    identity() {
        this.matrix = glMatrix.mat4.create();
    }

    load(matrix) {
        this.matrix = matrix;
    }

// TAG.07
    transpose() {
        return glMatrix.mat4.transpose(this.matrix, this.matrix);
    }

    translate(translation) {
        return glMatrix.mat4.translate(this.matrix, this.matrix, glMatrix.vec3.fromValues(...translation));
    }

    rotateX(angle) {
        return glMatrix.mat4.rotateX(this.matrix, this.matrix, glMatrix.glMatrix.toRadian(angle));
    }

    rotateY(angle) {
        return glMatrix.mat4.rotateY(this.matrix, this.matrix, glMatrix.glMatrix.toRadian(angle));
    }

    rotateZ(angle) {
        return glMatrix.mat4.rotateZ(this.matrix, this.matrix, glMatrix.glMatrix.toRadian(angle));
    }

    rotate(angle, axis) {
        return glMatrix.mat4.rotate(this.matrix, this.matrix, glMatrix.glMatrix.toRadian(angle), axis);
    }

    scale(scalation) {
        return glMatrix.mat4.scale(this.matrix, this.matrix, scalation);
    }

    invert() {
        return glMatrix.mat4.invert(this.matrix, this.matrix);
    }

    add(addition) {
        return glMatrix.mat4.add(this.matrix, this.matrix, addition);
    }

    multiply(mult) {
        return glMatrix.mat4.multiply(this.matrix, this.matrix, mult);
    }

    mul(out, first, second) {
        return glMatrix.mat4.mul(out, first, second);
    }

    multiplyScalar(out, a, b) {
        return glMatrix.mat4.multiplyScalar(out, a, b);
    }

    equals(a, b) {
        return glMatrix.mat4.equals(a, b);
    }

    subtract(out, a, b) {
        glMatrix.mat4.sub(out, a, b);
    }

    getMatrix() {
        return this.matrix;
    }


    setTranslation(t){
        this.matrix[12] = t[0];
        this.matrix[13] = t[1];
        this.matrix[14] = t[2];
    }

    setRotation(t){
        this.matrix[0] = t[0];
        this.matrix[1] = t[1];
        this.matrix[2] = t[2];
        this.matrix[4] = t[3];
        this.matrix[5] = t[4];
        this.matrix[6] = t[5];
        this.matrix[8] = t[6];
        this.matrix[9] = t[7];
        this.matrix[10] = t[8];
    }

// TAG.03 -> ha sido mejorar el motor para que haga el recorrido de forma correcta (y la Model y View sean lo que son -estaban mal-)
// TAG.08
    beginDraw() {
        // push the model matrix
        mango.stack.push( mango.modelMatrix.slice(0) );
        
        // multiply the current model matrix with the TTransform matrix with
        glMatrix.mat4.multiply(mango.modelMatrix, mango.modelMatrix, this.matrix);

    }

    endDraw() {
        // pop and set the current model matrix
        mango.modelMatrix = mango.stack.pop();
        
    }

}

// TAG.13
class TLight extends TEntity {

    // type 0 = putual ; 1 = dirigido
    // intensity vec4: r g b a
    // specular vec4: r g b a ?
    // direction vec4: x y z ?
    // s coeficient
// TAG.14 y 15 @todo luces dirigida y puntual
    constructor(typ, intensity /* = ambient */, specular, diffuse, direction, coef) {
        super();
        this.typ = typ;
        this.intensity = glMatrix.vec4.create();
        if (intensity) {
            this.intensity = (intensity.length === 4)
                ? glMatrix.vec4.fromValues(...intensity)
                : glMatrix.vec4.fromValues(...intensity, 1.0);
        }
        this.specular = glMatrix.vec4.create();
        if (specular) {
            this.specular = (specular.length === 4)
                ? glMatrix.vec4.fromValues(...specular)
                : glMatrix.vec4.fromValues(...specular, 1.0);
        }
        this.direction = glMatrix.vec4.create();
        if (direction) {
            this.direction = (direction.length === 3)
                ? glMatrix.vec3.fromValues(...direction)
                : null;
        }
        this.diffuse = glMatrix.vec4.create();
        if (diffuse) {
            this.diffuse = (diffuse.length === 4)
                ? glMatrix.vec4.fromValues(...diffuse)
                : glMatrix.vec4.fromValues(...diffuse, 1.0);
        }

        this.coef = glMatrix.vec4.create();
        if(coef){
            this.coef = (coef.length == 4 )
                ? glMatrix.vec4.fromValues(...coef)
                : glMatrix.vec4.fromValues(...coef, 1.0);
        }
    }
// diffuse, ambient=intensity and specular
    setIntensity(intensity) {
        this.intensity = intensity;
    }

    getIntensity() {
        return this.intensity;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }

    setSpecular(specular) {
        this.specular = specular;
    }

    getSpecular() {
        return this.specular;
    }

    setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }

    getDiffuse() {
        return this.diffuse;
    }

    setS(s) {
        this.s = s;
    }

    getS() {
        return this.s;
    }

    getType() {
        return this.typ;
    }

    beginDraw() {
        // console.log(this);
    }

    endDraw() {
    }
}

class TAnimation extends TEntity {

  constructor() {
      super();
  }

  beginDraw() { }

  endDraw() { }

  update(){ }

}

// TAG.20
class TArcAndMeshAnimation extends  TAnimation {
  constructor(object, count, timeAnim, endAnim) {
    super();
    this.auxCount = 0;
    this.endCount = 0;
    this.count = count;

// TAG.21
    this.object = object;
    // The end of animation must be greater than timeAnim, else default 2 * timeAnim
    if(endAnim === -1) {
      this.updateMethod = this.updateNotDie;
    } else{
      this.updateMethod = this.updateDie;
      if(endAnim <= timeAnim){
        this.endAnim = timeAnim * 2;
      } else { this.endAnim = endAnim; }
      // End of animation count
      this.maxCount = count + (count * (this.endAnim / timeAnim));
    }
    // increment
    this.increment = count / timeAnim;
  }

  beginDraw() { }

  endDraw() { }

// TAG.23
// TAG.22
  update(dx) {
    return this.updateMethod(dx);
  }

  updateDie(dx) {
    if (this.endCount > this.maxCount) {
      return false;
    }
    this.auxCount += dx * this.increment;
    this.endCount += dx * this.increment;
    // las position of count must be <= count
    if (this.auxCount > this.maxCount) {
      this.auxCount = 0;
      this.endCount = 0;
    }
    if (this.auxCount > this.count) {
      this.auxCount = this.count;
    }
    this.object.entity.setCount(Math.floor(this.auxCount));
    return true;
  }
  updateNotDie(dx) {
    this.auxCount += dx * this.increment;
    // las position of count must be <= count
    if(this.auxCount > (this.count + 1)){
      this.auxCount = 0;
    }
    if(this.auxCount > this.count){
      this.auxCount = this.count;
    }
    this.object.entity.setCount(Math.floor(this.auxCount));
    return true;
  }

}

class TRotationAnimation extends TAnimation {

  constructor(object, timeAnim, startLat, startLon, endLat, endLon, initPoint, endPos) {
    super();
    this.auxCount = 0;
    this.timeAnim = timeAnim;
    this.object = object;
    this.type = -1;
    this.quat = glMatrix.quat.create();
    this.auxQuat = glMatrix.quat.create();
    this.lastVec3 = glMatrix.vec3.create();
    this.increment = 0;

    if(initPoint){
      this.vec3 =  glMatrix.vec3.fromValues(...initPoint);
    } else {
      this.vec3 = convertLatLonToVec3(startLat, startLon);
    }

    if(endPos){
      this.vecEnd =  glMatrix.vec3.fromValues(...endPos);
    } else {
      this.vecEnd = convertLatLonToVec3(endLat, endLon);
    }
    this.quat = quatFromVectors(this.quat, this.vec3, this.vecEnd);
  }

  beginDraw() { }

  endDraw() { }

  update(dx) {
    this.auxCount += dx;
    if(this.auxCount > (this.timeAnim + 1)){
      this.auxCount = 0;
    }
    if(this.auxCount > this.timeAnim){
      return 1
    }
    // this.increment = this.auxCount / this.timeAnim; //this.BezierBlend((this.auxCount/ this.timeAnim));
    this.increment = this.ease((this.auxCount / this.timeAnim));
    return glMatrix.vec3.transformQuat(this.lastVec3, this.vec3, glMatrix.quat.slerp(this.auxQuat, glMatrix.quat.create(), this.quat , this.auxCount / this.timeAnim));
    // return this.vec3;
  }

  ease(t) {
    return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
  }

  InOutQuadBlend(t) {
    if(t <= 0.5){
      return 2.0 * Math.sqrt(t);
    }
    t -= 0.5;
    return 2.0 * t * (1.0 - t) + 0.5;
  }

  BezierBlend(t) {
  return Math.sqrt(t) * (3 - 2 * t);
  }

  ParametricBlend(t) {
    let sqt = Math.sqrt(t);
    return sqt / (2.0 * (sqt - t) + 1.0);
  }

  updateRotate(count){
    if(count > 0) {
      let vec = getEuler(this.quatsArray[count]);
      this.setRotation(this.object, vec[0] * degrees, 'x');
      this.rotate(this.object, vec[1] * degrees, 'y');
      this.rotate(this.object, vec[2] * degrees, 'z');
    }
  };

  rotate( node, angle, axis ) {
    switch (axis) {
      case 'x':
        node.father.father.entity.rotateX(angle);
        break;
      case 'y':
        node.father.father.entity.rotateY(angle);
        break;
      case 'z':
        node.father.father.entity.rotateZ(angle);
        break;
      default:
        node.father.father.entity.rotate(angle, axis);
        break;
    }
  }

  setRotation( node, angle, axis ) {
    node.father.father.entity.identity();
    switch (axis) {
      case 'x':
        node.father.father.entity.rotateX(angle);
        break;
      case 'y':
        node.father.father.entity.rotateY(angle);
        break;
      case 'z':
        node.father.father.entity.rotateZ(angle);
        break;
      default:
        node.father.father.entity.rotate(angle, axis);
        break;
    }
  }


}


// TAG.34
class TMaterial {
  constructor( diffuse, specular, shininess){
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }
}

class TArc extends TEntity {

  constructor(startLat, startLon, endLat, endLon, quality) {
  super();
  this.count = 0;
  this.arc = getBezierPoints(startLat, startLon, endLat, endLon, quality);

  let vertices = [];

  for (let i = 0 ; i < this.arc.length ; i++) {
    vertices.push(...this.arc[i]);
    if (!(i === 0 || i === (this.arc.length - 1))) {
      vertices.push(...this.arc[i]);
    }
  }

  let vertexBuffer = mango.gl.createBuffer();
  mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, vertexBuffer);
  mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(vertices), mango.gl.STATIC_DRAW);
  this.buffer = vertexBuffer;

  mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);
  mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);

  // this.uMaterialDiffuse = mango.gl.getUniformLocation(mango.program, 'uMaterialDiffuse');
  // this.uMaterialAmbient = mango.gl.getUniformLocation(mango.program, 'uMaterialAmbient');
  // this.uUseTextures = mango.gl.getUniformLocation(mango.program, 'uUseTextures');
  }

  setCount(value){
  this.count = value;
  }

  getCount(){
  return this.count;
  }

  getArc(){
    return this.arc;
  }

  create(startLat, startLon, endLat, endLon, quality) {
    this.arc = getBezierPoints(startLat, startLon, endLat, endLon, quality);
  }

  setArc(arc){
    this.arc = arc;
  }

  beginDraw() {
    this.draw();
  }
  endDraw() {}

  draw() {
    if(this.count > 0) {
      if(!mango.useTextures) {
        // mango.gl.useProgram(mango.program);
        // Bind vertex buffer object
        mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.buffer);
        // Get the attribute location
        // let aVertexPosition = mango.gl.getAttribLocation(mango.program, "aVertexPosition");

        // Point an attribute to the currently bound VBO
        mango.gl.vertexAttribPointer(mango.programAttributes.aVertexPosition, 3, mango.gl.FLOAT, false, 0, 0);

        // Enable the attribute
        mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexPosition);
        mango.gl.uniform4fv(mango.programUniforms.uMaterialDiffuse, [1, 0.25, 0.51, 1]);
        // mango.gl.uniform4fv(this.uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        mango.gl.drawArrays(mango.gl.LINES, 0, this.count * 2);
      } else {
        mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.buffer);
        // Get the attribute location
        let aVertexPosition = mango.gl.getAttribLocation(mango.textureProgram, "aVertexPosition");

        // Point an attribute to the currently bound VBO
        mango.gl.vertexAttribPointer(aVertexPosition, 3, mango.gl.FLOAT, false, 0, 0);

        // Enable the attribute
        mango.gl.enableVertexAttribArray(aVertexPosition);
        mango.gl.uniform4fv(mango.gl.getUniformLocation(mango.textureProgram, 'uMaterialDiffuse'), [1.0, 0.0, 0.0, 1.0]);
        mango.gl.uniform4fv(mango.gl.getUniformLocation(mango.textureProgram, 'uMaterialAmbient'), [1.0, 1.0, 1.0, 1.0]);
        mango.gl.uniform1i(mango.gl.getUniformLocation(mango.textureProgram, 'uUseTextures'), 0);
        // mango.gl.uniform4fv(this.uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        mango.gl.drawArrays(mango.gl.LINES, 0, this.count * 2);
      }
    }
  }
}

class TMarker extends TEntity {

  constructor() {
    super();
  }

  beginDraw() {}
  endDraw() {}
}

// TAG.17
class TMesh extends TEntity {

    constructor(mesh) {
        super();
        this.mesh = mesh;
        return this;
    }

    // TAG.19
	beginDraw() {
		if(this.mesh !== null){
			this.mesh.draw();
  }
        // console.log(this);

	}

  endDraw() {
  }

}

// TAG.09
class TCamera extends TEntity {

    constructor(isPerspective, near, far, right, left, top, bottom) {
        super();
        this.isPerspective = isPerspective;
        this.near = near;
        this.far = far;
        this.right = right;
        this.left = left;
        this.top = top;
        this.bottom = bottom;
        this.projection = glMatrix.mat4.create();
    }

    setter(near, far, right, left, top, bottom) {
        this.near = near;
        this.far = far;
        this.right = right;
        this.left = left;
        this.top = top;
        this.bottom = bottom;
    }

    setPerspective(fovy, aspect, near, far) {
        // fovy: Vertical field of view in radians;
        // aspect: Aspect ratio. typically viewport width/height;
        glMatrix.mat4.perspective(this.projection, fovy, aspect, near, far);
        this.isPerspective = true;
    }

    setParallel(left, right, bottom, top, near, far) {
        glMatrix.mat4.ortho(this.projection, left, right, bottom, top, near, far);
        this.isPerspective = false;
    }

    targetTo(eye, center, up) {
        // Generates a matrix that makes something look at something else.
        glMatrix.mat4.targetTo(this.projection, eye, center, up);
    }

    lookAt(eye, center, up) {
        // Generates a look-at matrix with the given eye position, focal point, and up axis.
        glMatrix.mat4.lookAt(this.projection, eye, center, up);
    }

    beginDraw() {
        // console.log(this);
    }

    endDraw() {
    }
}

// TAG.61
class TFocus extends TEntity {
  // @todo => position to lat&long coords

  // size     => integer
  // position => [0,0,0] e.g.
  constructor(size, type, position, target = [3.0, 25.0, 3.0], velocity, extra, life = 3, color){
    super();
    this.size = size;                               // Focus size
    this.position = position;                       // Focus position
    this.type = type                                // Dispersion or Straight particles
    this.target = target;                           // "lookAt" particles
    this.velocity = velocity;
    this.extra = extra;                                // helper value for calc velocity values
    this.life = life
    this.color = color;

    this.particleArray = new Float32Array(size*4);  // bind to vertexShader
    this.particles = [];                            // array of <Particles>

    for(let i = 0; i<size; i++){
      let particle = {};

      this.resetParticle(particle);
      // particleArray = [posX,posY,posZ,vLifeSpan]
      // aParticle(?)      x     y    z     w  ==>> vertexShader
      this.particleArray[(i*4)+0] = particle.pos[0];
      this.particleArray[(i*4)+1] = particle.pos[1];
      this.particleArray[(i*4)+2] = particle.pos[2];
      this.particleArray[(i*4)+3] = particle.remainingLife / particle.lifespan;

      particle.id = i;
      // Store particle object
      this.particles.push(particle);
    }
    mango.gl.useProgram(mango.gl.particlesProgram);

    this.buffer = mango.gl.createBuffer();
    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.buffer);
    mango.gl.bufferData(mango.gl.ARRAY_BUFFER, this.particleArray, mango.gl.DYNAMIC_DRAW);
    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);

    mango.gl.useProgram(mango.program);

  }
  beginDraw() {
    // draw
    try{

      // update particles
      this.updateParticle( (mango.time - mango.lastFrameTime)/ 1000.0 );

      mango.gl.useProgram(mango.particlesProgram);

      //  mapUniforms
      let viewModel = [];
      let aux = mango.modelMatrix;
      glMatrix.mat4.mul(viewModel, mango.viewMatrix, mango.modelMatrix);
      mango.gl.uniformMatrix4fv(mango.particlesUniforms.uMVMatrix, false, viewModel);  //Maps the Model-View matrix to the uniform prg.uMVMatrix

      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.getBuffer());
      mango.gl.vertexAttribPointer(mango.particlesAttributes.aParticle, 4, mango.gl.FLOAT, false, 4*Float32Array.BYTES_PER_ELEMENT, 0);
      mango.gl.enableVertexAttribArray(mango.particlesAttributes.aParticle);

      // ---- @todo texture variable
      // mango.gl.activeTexture(mango.gl.TEXTURE1);
      // mango.gl.bindTexture(mango.gl.TEXTURE_2D, particlesTexture.tex);
      // let uniformSampler = mango.gl.getUniformLocation(mango.particlesProgram, "uSampler");
      // mango.gl.uniform1i(uniformSampler, 1);
      
      this.color
        ? mango.gl.uniform4fv(mango.particlesUniforms.uColor, this.color)
        : mango.gl.uniform4fv(mango.particlesUniforms.uColor, [1.0, 0.0, 0.0, 1.0]);



      // Update particles size while zooming
      mango.gl.uniform1f(mango.particlesUniforms.uPointSize, 60 * Math.pow( Math.min(Math.max(mango.zoom,mango.minZoom),mango.maxZoom), -1 ) );

      mango.gl.drawArrays(mango.gl.POINTS, 0, this.getParticles());
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);

      mango.gl.useProgram(mango.program);

    }
    catch(err){
      console.error(err);
    }
  }

  endDraw() { }


  resetParticle(particle){
    // Initial position
    particle.pos = [0,0,0];

    // Initial velocity
    // ---- working with lookAt (no dispersion D:)
    // particle.vel = [
    //     this.velocity[0] * ( (Math.random() * 0.8) + this.extra[0] ),
    //     this.velocity[1] * ( (Math.random() * 0.8) + this.extra[1] ),
    //     this.velocity[2] * ( (Math.random() * 0.8) + this.extra[2] ),
    // ];
    particle.vel = [
      (Math.random() * this.velocity[0]) + this.extra[0] ,
      (Math.random() * this.velocity[1]) + this.extra[1] ,
      (Math.random() * this.velocity[2]) + this.extra[2] ,
    ];


    // 360 degrees particles
    // particle.vel = [
    // (Math.random() * 3) -1,
    // (Math.random() * 3) -1,
    // (Math.random() * 3) -1,
    // ];

    // Lifespan
    if(this.type=="fireworks"){
      particle.lifespan = this.life; // fireworks
    }
    else{
      particle.lifespan = (Math.random() * this.life);
    }
    // particle.lifespan = 3; // fireworks

    // RemainingLife
    particle.remainingLife = particle.lifespan;
  }

  updateParticle(elapsedTime){

    for(let i = 0; i<this.particles.length; i++){
      let particle = this.particles[i];

      particle.remainingLife -= elapsedTime;
      if(particle.remainingLife<=0){
        // If particle die, restart
        this.resetParticle(particle);
      }


      particle.pos[0] += particle.vel[0] * elapsedTime;
      particle.pos[1] += particle.vel[1] * elapsedTime;
      particle.pos[2] += particle.vel[2] * elapsedTime;

      // Update particleArray
      this.particleArray[(i*4)+0] = particle.pos[0];
      this.particleArray[(i*4)+1] = particle.pos[1];
      this.particleArray[(i*4)+2] = particle.pos[2];
      this.particleArray[(i*4)+3] = particle.remainingLife/particle.lifespan;

    }
    // Once we are done looping through all the particles, update the buffer once

    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.buffer);
    mango.gl.bufferData(mango.gl.ARRAY_BUFFER, this.particleArray, mango.gl.STATIC_DRAW);
    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);

  }

  getSize(){
    return this.size;
  }

  getPosition(){
    return this.position;
  }

  getBuffer(){
    return this.buffer;
  }

  getParticles(){
    return this.particles.length;
  }
}

export {
    TCamera,
    TMesh,
    TAnimation,
    TLight,
    TTransform,
    TEntity,
    TArc,
    TFocus,
    TRotationAnimation,
    TArcAndMeshAnimation,
    TMaterial
}





