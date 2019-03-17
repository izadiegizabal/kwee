////////// AUTHOR: WATERMELON CORP. - MULTIMEDIA ENGINEERING : TAG - UNIVERSITY OF ALICANTE
///////
////

import {TResourceManager, TResourceMesh, TResourceMaterial, TResourceTexture, TResourceShader} from './resourceManager.js';
import {TEntity} from './commons.js';


// Our stack class
class Stack {

    constructor() {
        this.items = [TEntity.Model];
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


TEntity.stack = new Stack();

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
        return glMatrix.mat4.translate(this.matrix, this.matrix, translation);
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
        TEntity.stack.push(TEntity.Model);
        // multiply the current model matrix with the TTransform matrix with
        glMatrix.mat4.multiply(TEntity.Model, TEntity.Model, this.matrix);
        /*console.log('--------');
        console.log('----------------------');
        console.log('-------------------------------------- Stack');
        console.log(TEntity.stack);
        console.log(TEntity.Model);
        console.log('-----------------------------------');
        console.log('----------------------');
        console.log('-------');*/
        // console.log(this);
    }

    endDraw() {
        // pop and set the current model matrix
        TEntity.Model = TEntity.stack.pop();
    }

}

 class TLight extends TEntity {

    // type 0 = putual ; 1 = dirigido
    // intensity vec4: r g b a
    // specular vec4: r g b a ?
    // direction vec4: x y z ?
    // s coeficient
    constructor(typ, intensity /* = ambient */, specular, diffuse, direction, s) {
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
            this.direction = (direction.length === 4)
                ? glMatrix.vec4.fromValues(...direction)
                : glMatrix.vec4.fromValues(...direction, 1.0);
        }
        this.diffuse = glMatrix.vec4.create();
        if (diffuse) {
            this.diffuse = (diffuse.length === 4)
                ? glMatrix.vec4.fromValues(...diffuse)
                : glMatrix.vec4.fromValues(...diffuse, 1.0);
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

 class TMesh extends TEntity {

    constructor(mesh) {
        super();
        return (async () => {
            // Mesh = TResourceMesh();
            if(mesh == undefined){
                console.log("NO MESH in constructor TMesh(undefined)");
            }
            else{
                this.mesh = await this.loadMesh(mesh);
            }
            return this;
        })();
        

    }

	async loadMesh(file){
        let resourceMesh = new TResourceMesh();
        await resourceMesh.loadFile(file);
        return resourceMesh;
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

export {
    TCamera,
    TMesh,
    TAnimation,
    TLight,
    TTransform,
    TEntity
}





