////////// AUTHOR: WATERMELON CORP. - MULTIMEDIA ENGINEERING : TAG - UNIVERSITY OF ALICANTE
///////
////

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

// Static attribute stack
TEntity.stack = new Stack();

// Structures and entities

class TMeshSource {
    // TColor
    constructor() {
    }

    draw() {
        console.log('draw mesh');
    }
}

class TFile {
    // TColor
    constructor() {
    }
}

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
        console.log(this);
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
    constructor(typ, intensity, specular, direction, s) {
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


    }

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
        console.log(this);
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
        console.log(this);
    }

    endDraw() {
    }

}

class TMesh extends TEntity {

    constructor(mesh) {
        super();
        this.mesh = mesh;
    }

	async loadMesh(file){
		await manager.getResource(file, 'mesh');
		this.mesh = manager.map.get(`${file} mesh`);
		
	}

	beginDraw() {
		console.log(this);
		if(this.mesh !== null){
			this.mesh.draw();
		}

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
        console.log(this);
    }

    endDraw() {
    }
}

class TNode {
    // WARNING: TE FATHER IS REQUIRED
    constructor(father, entity, children) {
        this.entity = entity;
        this.father = father;
        this.children = [];
        if (children) {
            children.forEach((e) => {
                this.children.push(e);
            });
        }
    }

    addChild(child) {
        this.children.push(child);
    }

    remChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
        // WARNING: remove from the Lights and Cameras arrays
        if (this.entity instanceof TLight) {
            TEntity.Lights.push(this);
        }
        if (this.entity instanceof TCamera) {
            TEntity.Views.push(this);
        }
    }

    setEntity(entity) {
        this.entity = entity;
        // WARNING: add to the Lights and Cameras arrays
        if (this.entity instanceof TLight) {
            TEntity.Lights.push(this);
        }
        if (this.entity instanceof TCamera) {
            TEntity.Views.push(this);
        }
    }

    getEntity() {
        return this.entity;
    }

    getfather() {
        return this.father;
    }

    draw() {
        console.log('Nodo: ');
        console.log(this);
        if (this.entity && this.entity != null) {
            this.entity.beginDraw();
        }
        if (this.children && this.children.length > 0) {
            this.children.forEach((e) => {
                e.draw();
            });
        }
        if (this.entity && this.entity != null) {
            this.entity.endDraw();
        }
    }

}

// WARNING: MONTER function we will not probably use // DO NOT REMOVE
function deepClone(obj) {

    if (obj === null || typeof obj !== "object")
        return obj
    var props = Object.getOwnPropertyDescriptors(obj);
    for (var prop in props) {
        props[prop].value = deepClone(props[prop].value)
    }

    return Object.create(
        Object.getPrototypeOf(obj),
        props
    )
}

// WARNING: MEH function we will not probably use // DO NOT REMOVE
function copyClone(obj) {
    return Object.assign(Object.create(obj.prototype), obj);
}

// WARNING: we will need it if we need to copy simple objects // DO NOT REMOVE
function copy(obj) {
    return Object.assign({}, obj);
}

// WARNING: Go over the tree and get all the lights and cameras // DO NOT REMOVE
function getLigthsViews(obj) {
    if (obj.entity instanceof TLight) {
        TEntity.Lights.push(obj);
    }
    if (obj.entity instanceof TCamera) {
        TEntity.Views.push(obj);
    }
    obj.children.forEach((e) => {
        getLigthsViews(e);
    });
}

// calculate all the light matices from the Lighs static array and drop them into the AuxLights array
function calculateLights() {
    let aux = glMatrix.mat4.create();
    TEntity.Lights.forEach((e) => {
        goToRoot(e);
        for (let i = TEntity.Aux.length - 1; i >= 0; i--) {
            glMatrix.mat4.mul(aux, aux, TEntity.Aux[i])
        }
        TEntity.AuxLights.push(aux);
        TEntity.Aux = [];
    });
}

// same as calculateLights but for the Cameras
function calculateViews() {
    let aux = glMatrix.mat4.create();
    TEntity.Views.forEach((e) => {
        goToRoot(e);
        for (let i = TEntity.Aux.length - 1; i >= 0; i--) {
            glMatrix.mat4.mul(aux, aux, TEntity.Aux[i])
        }
        TEntity.AuxViews.push(aux);
        TEntity.Aux = [];
    });
}

// go from the leaf to the root
function goToRoot(obj) {
    if (obj.entity instanceof TTransform) {
        TEntity.Aux.push(obj.entity.matrix);
    }
    if (obj.father) {
        goToRoot(obj.father);
    }
}

/// AKA MAIN
var InitDemo = function () {

    /// DEMO
    //---- Crear la estructura del árbol ----

    let Escena = new TNode();
    let RotaLuz = new TNode(Escena);
    let RotaCam = new TNode(Escena);
    let RotaCoche = new TNode(Escena);
    Escena.addChild(RotaLuz);
    Escena.addChild(RotaCam);
    Escena.addChild(RotaCoche);
    let TraslaLuz = new TNode(RotaLuz);
    let TraslaCoche = new TNode(RotaCam);
    let TraslaCam = new TNode(RotaCoche);
    RotaLuz.addChild(TraslaLuz);
    RotaCam.addChild(TraslaCam);
    RotaCoche.addChild(TraslaCoche);

    //---- Añadir las entidades a los nodos ----

    let TransfRotaLuz = new TTransform();
    TransfRotaLuz.load(glMatrix.mat4.set(TransfRotaLuz.matrix, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4));
    let TransfRotaCam = new TTransform();
    let TransfRotaCam2 = new TTransform();
    TransfRotaCam2.load(glMatrix.mat4.set(TransfRotaCam2.matrix, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5))
    let TransfRotaCoche = new TTransform();
    TransfRotaCoche.load(glMatrix.mat4.set(TransfRotaCoche.matrix, 4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1));

    RotaLuz.setEntity(TransfRotaLuz);
    RotaCam.setEntity(TransfRotaCam);
    RotaCoche.setEntity(TransfRotaCoche);

    let EntLuz = new TLight();
    let EntCam = new TCamera();
    let MallaChasis = new TMesh();

    /// Esto no estaba en las transparencias

    let NLuz = new TNode(TraslaLuz);
    let NCam = new TNode(TraslaCam);
    let NChasis = new TNode(TraslaCoche);

    NLuz.setEntity(EntLuz);
    NCam.setEntity(EntCam);
    NChasis.setEntity(MallaChasis);

    TraslaLuz.addChild(NLuz);
    TraslaCoche.addChild(NChasis);
    TraslaCam.addChild(NCam);

    TraslaLuz.setEntity(TransfRotaLuz);
    TraslaCoche.setEntity(TransfRotaCoche);
    TraslaCam.setEntity(TransfRotaCam2);

    //---- Recorrer el árbol (dibujarlo) ----

    Escena.draw();

    // DO NOT USE NOW
    // getLigthsViews(Escena);

    // Calculate all matrices and print their values
    calculateLights();
    calculateViews();
    console.log('Lights array: ');
    console.log(TEntity.AuxLights);
    console.log('Views/cameras array: ');
    console.log(TEntity.AuxViews);

};

function initWebGL() {
    // @todo
    var ctx = null; // Canvas context
    var prg = null // fragment-shader + vertex-shader;
}
