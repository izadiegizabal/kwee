////////// AUTHOR: WATERMELON CORP. - MULTIMEDIA ENGINEERING : TAG - UNIVERSITY OF ALICANTE
///////
////

import {TEntity} from './commons.js';
import {getBezierPoints, convertLatLonToVec3, degrees} from './tools/utils.js';
import {global} from "./commons";




//TEntity.stack = new Stack();

// Structures and entities

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

    beginDraw() {
        // push the model matrix
        global.stack.push( global.modelMatrix.slice(0) );
        
        // multiply the current model matrix with the TTransform matrix with
        glMatrix.mat4.multiply(global.modelMatrix, global.modelMatrix, this.matrix);

       
        /*console.log('--------');
        console.log('----------------------');
        console.log('-------------------------------------- Stack');
        console.log(TEntity.stack);
        console.log(MVMatrix);
        console.log('-----------------------------------');
        console.log('----------------------');
        console.log('-------');*/
        // console.log(this);
    }

    endDraw() {
        // pop and set the current model matrix
        global.modelMatrix = global.stack.pop();
        
    }

}

 class TLight extends TEntity {

    // type 0 = putual ; 1 = dirigido
    // intensity vec4: r g b a
    // specular vec4: r g b a ?
    // direction vec4: x y z ?
    // s coeficient
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

    constructor(animationMeshes) {
        super();
        this.animation = animationMeshes;   // Array of meshes for the different positions
    }

    beginDraw() {
        // console.log(this);
    }

    endDraw() {
    }

}

class TArc extends TEntity {

  constructor(startLat, startLon, endLat, endLon, quality) {
    super();
    this.arc = getBezierPoints(startLat, startLon, endLat, endLon, quality);
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

  }
  endDraw() {

  }
}

class TMarker extends TEntity {

  constructor() {
    super();
  }

  beginDraw() {}
  endDraw() {}
}

 class TMesh extends TEntity {

    constructor(mesh) {
        super();
        this.mesh = mesh;
        return this;
    }

	beginDraw() {
		if(this.mesh !== null){
			this.mesh.draw();
        }
        // console.log(this);

	}

    endDraw() {
    }

}

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

class TFocus extends TEntity {
    // @todo => position to lat&long coords

    // size     => integer
    // position => [0,0,0] e.g.
    constructor(size, position){
        super();
        this.size = size;                               // Focus size
        this.position = position;                       // Focus position
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
        global.gl.useProgram(global.gl.particlesProgram);

        this.buffer = global.gl.createBuffer();
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.buffer);
        global.gl.bufferData(global.gl.ARRAY_BUFFER, this.particleArray, global.gl.STATIC_DRAW);
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);

        global.gl.useProgram(global.program);

    }
    beginDraw() {

    }

    endDraw() {
        // update particles
        this.updateParticle( (global.time - global.lastFrameTime)/ 1000.0 );

        // draw
        try{

            global.gl.useProgram(global.particlesProgram);
    
            //  mapUniforms
            
            let viewModel = [];
            glMatrix.mat4.mul(viewModel, global.viewMatrix, global.modelMatrix);
            global.gl.uniformMatrix4fv(global.particlesUniforms.uMVMatrix, false, viewModel);  //Maps the Model-View matrix to the uniform prg.uMVMatrix            
            global.gl.uniformMatrix4fv(global.particlesUniforms.uPMatrix, false, global.projectionMatrix);    //Maps the Perspective matrix to the uniform prg.uPMatrix
            
    
            // uPointSize = size of each particle
            global.gl.uniform1f(global.particlesUniforms.uPointSize, 14.0);
            
            // let attributeParticle = global.gl.getAttribLocation(global.particlesProgram, "aParticle");
            global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.getBuffer());
            global.gl.vertexAttribPointer(global.particlesAttributes.aParticle, 4, global.gl.FLOAT, false, 4*Float32Array.BYTES_PER_ELEMENT, 0);
            global.gl.enableVertexAttribArray(global.particlesAttributes.aParticle);
    
            // ---- @todo texture variable
            // global.gl.activeTexture(global.gl.TEXTURE1);
            // global.gl.bindTexture(global.gl.TEXTURE_2D, particlesTexture.tex);
            // let uniformSampler = global.gl.getUniformLocation(global.particlesProgram, "uSampler");
            // global.gl.uniform1i(uniformSampler, 1);
    
            global.gl.drawArrays(global.gl.POINTS, 0, this.getParticles());
            global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
    
          }
          catch(err){
            //alert(err);
            console.error(err);
          }
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
    resetParticle(particle){
        // Initial position
        particle.pos = [...this.position];

        // Initial velocity
        particle.vel = [
        (Math.random() * 3.0) -1,
        (Math.random() * 25.0),
        (Math.random() * 3.0) -1,
        ];
        // Lifespan
        particle.lifespan = (Math.random() * 3.0);
        // RemainingLife
        particle.remainingLife = particle.lifespan;
        //console.log("particle reset " + particle.id);
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

        //   if(particle.id==1){
        //       console.log(particle.remainingLife);
        //   }
        }
        global.gl.useProgram(global.particlesProgram);
        // Once we are done looping through all the particles, update the buffer once

        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.buffer);
        global.gl.bufferData(global.gl.ARRAY_BUFFER, this.particleArray, global.gl.STATIC_DRAW);
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);

        global.gl.useProgram(global.program);
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
    TFocus
}





