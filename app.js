////////// AUTHOR: WATERMELON CORP. - MULTIMEDIA ENGINEERING : TAG - UNIVERSITY OF ALICANTE
///////
////
//// WEBGL MATRIX STACK ???
class MatrixStack {

	constructor(){
		this.stack = [];
		this.pop();
	}

	pop(){
	    // Never let the stack be totally empty
	    if (this.stack.length < 1) {
	     this.stack[0] = glMatrix.mat4.create();
	    }
	    return this.stack.pop();
	}

	multiply(matrix){
		var mult = glMatrix.mat4.mul(this.getCurrentMatrix(), matrix, this.getCurrentMatrix());
		this.setCurrentMatrix(mult);
	}

	push(){
		this.stack.push(this.getCurrentMatrix());
	}

	getCurrentMatrix() {
		if (this.stack.length < 1) {
	     this.stack[0] = glMatrix.mat4.create();
	    }
	  return this.stack[this.stack.length - 1].slice();
	}

	setCurrentMatrix(matrix) {
		if (this.stack.length < 1) {
	     this.stack[0] = glMatrix.mat4.create();
	    }
	  	return this.stack[this.stack.length - 1] = matrix;
	}

}
//// SIMULATE GLOBAL STACK
var GStack = new MatrixStack();

class TColor {
	// TColor
	constructor(){}
}

class TMeshSource {
	// TColor
	constructor(){}

	draw(){
		console.log('draw mesh');
	}
}

class TMatrix4x4 {
	/// TMatrix
	/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
	constructor(numbers){
		this.value = glMatrix.mat4.create();
		try{
			if(numbers && numbers != null && Array.isArray(numbers)){
				if(!(numbers.length == 16)) throw 'The matrix must have 16 elements';
				numbers.forEach ( (e) => {
					if(isNaN(e)) throw 'An element of the matrix it is not a number';
				});
				glMatrix.mat4.set(this.value, numbers[0], numbers[1], numbers[2], numbers[3], 
					numbers[4], numbers[5], numbers[6], numbers[7],numbers[8],numbers[9], 
					numbers[10], numbers[11], numbers[12], numbers[13],numbers[14], numbers[15]);
			}
		} catch (err) {
			console.log('Error: '+err);
		}
	
	}
}

class TFile { 
	// TColor
	constructor(){}
}

class TEntity {

	beginDraw() {}
	endDraw() {}

}

class TTransform extends TEntity {
	/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
	constructor(matrix){
		super();
		try{
			if(matrix && !(matrix instanceof TMatrix4x4)) throw 'the mesh you passed it is not a TMatrix4x4';
			this.matrix = matrix ? new TMatrix4x4(Array.prototype.slice.call(matrix.value)) : new TMatrix4x4();
			//this.matrix = matrix ? Object.assign(Object.create(Object.getPrototypeOf(matrix)), matrix) : null;

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	identity(){
		this.matrix.value = glMatrix.mat4.create();
	}

	load(matrix){
		try{
			if(matrix && !(matrix instanceof TMatrix4x4)) throw 'the mesh you passed it is not a TMatrix4x4';
			this.matrix = matrix;

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	transpose(){
		glMatrix.mat4.transpose(this.matrix.value, this.matrix.value);
	}

	translate(translation){
		glMatrix.mat4.translate(this.matrix.value, this.matrix.value, translation);
	}

	rotateX(angle){
		glMatrix.mat4.rotateX(this.matrix.value, this.matrix.value, glMatrix.toRadian(angle));
	}

	rotateY(angle){
		glMatrix.mat4.rotateY(this.matrix.value, this.matrix.value, glMatrix.toRadian(angle));
	}

	rotateZ(angle){
		glMatrix.mat4.rotateZ(this.matrix.value, this.matrix.value, glMatrix.toRadian(angle));
	}

	rotate(angle, axis){
		glMatrix.mat4.rotate(this.matrix.value, this.matrix.value, glMatrix.toRadian(angle), axis);
	}

	scale(scalation){
		glMatrix.mat4.scale(this.matrix.value, this.matrix.value, scalation);
	}

	invert(){
		glMatrix.mat4.invert(this.matrix.value, this.matrix.value);
	}

	add(addition) { 
		glMatrix.mat4.add(this.matrix.value, this.matrix.value, addition);
	}

	multiply(mult) {
		glMatrix.mat4.multiply(this.matrix.value,this.matrix.value,mult);
	}

	mul(out, first, second){
		glMatrix.mat4.mul(out, first, second);
	}

	multiplyScalar(out, a, b){
		glMatrix.mat4.multiplyScalar(out, a, b);
	}

	ortho(out, left, right, bottom, top, near, far){
		glMatrix.mat4.ortho(out, left, right, bottom, top, near, far);
	}

	perspective(out, fovy, aspect, near, far){
		// fovy: Vertical field of view in radians;
		// aspect: Aspect ratio. typically viewport width/height;
		glMatrix.mat4.perspective(out, fovy, aspect, near, far);
	}

	targetTo(out, eye, center, up){
		// Generates a matrix that makes something look at something else.
		glMatrix.mat4.targetTo(out, eye, center, up);
	}

	lookAt(out, eye, center, up){
		// Generates a look-at matrix with the given eye position, focal point, and up axis.
		glMatrix.mat4.lookAt(out, eye, center, up);
	}

	equals(a, b){
		return glMatrix.mat4.equals(a, b);
	}

	subtract(out, a, b){
		glMatrix.mat4.sub(out, a, b);
	}

	getMatrix() {
		return this.matrix;
	}

	beginDraw() {
		GStack.push();
		GStack.multiply(this.matrix.value);
		console.log(GStack);
		console.log(this);
	}

	endDraw() {
		const last = GStack.pop();
		GStack.setCurrentMatrix(last);
		console.log(GStack);
		console.log(this);
	}
	
}

class TLight extends TEntity {
	/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
	constructor(intensity){
		super();
		try{
			if(intensity && !(intensity instanceof TColor)) throw 'the intensity you passed it is not a TColor';
			this.intensity = intensity ? intensity : null;

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	setIntensity(intensity){
		try{
			if( !(intensity instanceof TColor)) throw 'the intensity you passed it is not a TColor';
			this.intensity = intensity;

		} catch (err){
			console.log('Error: '+err);
		}
	}

	getIntensity(){
		return this.intensity;
	}

	beginDraw() {
		console.log(this);
	}

	endDraw() {}

}

class TMesh extends TEntity {
	/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
	constructor(mesh){
		super();
		try{
			if(mesh && !(mesh instanceof TMeshSource)) throw 'the mesh you passed it is not a TMeshSource';
			this.mesh = mesh ? mesh : null;

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	loadMesh(file){
		try{
			if( !(file instanceof TFile)) throw 'the mesh you passed it is not a TMeshSource';
			// load mesh

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	beginDraw() {
		console.log(this);
	}

	endDraw() {}
}

class TCamera extends TEntity {
	/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
	constructor(isPerspective, near, far, right, left, top, bottom) {
		super();
		try{
			if (isPerspective && !(isPerspective instanceof Boolean)) throw 'isPerspective it is not a boolean';
			this.isPerspective = isPerspective ? isPerspective: false;
			if (near && !(near instanceof Number)) throw 'near it is not a number';
			this.near = (near && near != null) ? near : Number.MAX_SAFE_INTEGER;
			if (far && !(far instanceof Number)) throw 'far it is not a number';
			this.far = (far && far != null) ? far : Number.MAX_SAFE_INTEGER;
			if (right && !(right instanceof Number)) throw 'right it is not a number';
			this.right = (right && right != null) ? right : Number.MAX_SAFE_INTEGER;
			if (left && !(left instanceof Number)) throw 'left it is not a number';
			this.left = (left && left != null) ? left : Number.MAX_SAFE_INTEGER;
			if (top && !(top instanceof Number)) throw 'top it is not a number';
			this.top = (top && top != null) ? top : Number.MAX_SAFE_INTEGER;
			if (bottom && !(bottom instanceof Number)) throw 'bottom it is not a number';
			this.bottom = (bottom && bottom != null) ? bottom : Number.MAX_SAFE_INTEGER;
		} catch (err){
			console.log('Error: '+err);
		}
	}

	setter(near, far, right, left, top, bottom){
		try{
			if(!(near && near != null && near instanceof Number)) throw 'near it is not a number'
			if(!(far && far != null && far instanceof Number)) throw 'far it is not a number'
			if(!(right && right != null && right instanceof Number)) throw 'right it is not a number'
			if(!(left && left != null && left instanceof Number)) throw 'left it is not a number'
			if(!(top && top != null && top instanceof Number)) throw 'top it is not a number'
			if(!(bottom && bottom != null && bottom instanceof Number)) throw 'bottom it is not a number'
			this.near = near;
			this.far = far;
			this.right = right;
			this.left = left;
			this.top = top;
			this.bottom = bottom;
		} catch (err){
			console.log('Error: '+err);
		}
	}

	setPerspective(near, far, right, left, top, bottom){
		setter(near, far, right, left, top, bottom);
		// Set Perspective ??? 
		this.isPerspective = true;
	}

	setParalel(near, far, right, left, top, bottom){
		setter(near, far, right, left, top, bottom);
		// Set paralel ???
		this.isPerspective = false;
	}

	beginDraw() {
		console.log(this);
	}

	endDraw() {}
}

class TNode{

	constructor(entity, children, father){
		/// YOU CAN CALL AN EMPTY CONSTRUCTOR, BUT IF YOU PASS ANY PARAMETER, YOU MUST DO IT RIGHT
		try {
			if (entity && !(entity instanceof TEntity)) throw 'entity it is not a TEntity';
			this.entity = entity ? deepClone(entity) : null;
			if(this.entity && this.entity.matrix){ 
				var arr = Object.values(this.entity.matrix.value);
				var newer = new Float32Array(16);
				for (var i = 16 - 1; i >= 0; i--) {
					newer[i] = arr[i];
				}
				this.entity.matrix.value = newer;
			}

			this.children = [];
			if(Array.isArray(children) && children.length > 0){
				children.forEach((e)=>{
					if (e instanceof TNode){
						this.children.push(e);
					}
				})
			}
			else{
				if (children && !(children instanceof TNode)) throw 'the children must be a TNode';
				if(children!=null){
					this.children.push(children);
				}				
			}
			if (father && !(father instanceof TEntity)) throw 'father it is not a TEntity';
			this.father = father ? father : null;

		} catch(err) {
			console.log('Error: '+err);
		}
	}

	addChild(child){
		try{
			if(!(child instanceof TNode)) throw 'the child you want to add it is not a TNode';
			this.children.push(child);

		} catch(err){
			console.log('Error: '+err);
		}
	}

	remChild(child){
		try{
			if (!(child instanceof TNode)) throw 'the child you want to remove it is not a TNode';
			if (this.children.indexOf(child) === -1) throw 'the node does not contain the child you want to remove'
			this.children.splice(this.children.indexOf(child),1);

		} catch(err){
			console.log('Error: '+err);
		}
	}

	setEntity(entity){
		try{
			if (!(entity instanceof TEntity)) throw 'the entity you want to set it is not a TEntity'
			this.entity = entity;
		} catch(err) {
			console.log('Error: '+err);
		}
	}

	getEntity(){
		return this.entity;
	}

	getfather(){
		return this.father;
	}

	draw(){
		console.log(this);
		if(this.entity && this.entity != null){
			this.entity.beginDraw();
		}
		if(this.children && this.children.length>0){
			this.children.forEach( (e) => {
				e.draw();
			});
		}
		if(this.entity && this.entity != null){
			this.entity.endDraw();
		}
	}

}

/// DEEPCLONING TO COPY ENTITIES CORRECTLY
function deepClone(obj) {
  if (obj === null || typeof obj !== "object")
    return obj
  var props = Object.getOwnPropertyDescriptors(obj);
  for (var prop in props) {
    props[prop].value = deepClone(props[prop].value)
  }
  /// DO NOT REMOVE PLS
  /*if(obj instanceof Float32Array){
  	var arr = [];
  	for (var i = 0; i < 16; i++){
    	arr.push(props[i].value);
	}
	props = arr;
  }*/

  return Object.create(
    Object.getPrototypeOf(obj), 
    props
  )
}
/// AKA MAIN
var InitDemo = function () {

	/// DEMO
	//---- Crear la estructura del árbol ----

	let Escena = new TNode();
	let RotaLuz = new TNode();
	let RotaCam = new TNode();
	let RotaCoche = new TNode();
	Escena.addChild(RotaLuz);
	Escena.addChild(RotaCam);
	Escena.addChild(RotaCoche);
	let TraslaLuz = new TNode();
	let TraslaCoche = new TNode();
	let TraslaCam = new TNode();
	RotaLuz.addChild(TraslaLuz);
	RotaCam.addChild(TraslaCam);
	RotaCoche.addChild(TraslaCoche);

	//---- Añadir las entidades a los nodos ----

	let TransfRotaLuz = new TTransform();
	let TransfRotaCam = new TTransform();
	let TransfRotaCoche = new TTransform();

	RotaLuz.setEntity(TransfRotaLuz);
	RotaCam.setEntity(TransfRotaCam);
	RotaCoche.setEntity(TransfRotaCoche);

	let EntLuz = new TLight(); 
	let EntCam = new TCamera(); 
	let MallaChasis = new TMesh();

	/// Esto no estaba en las transparencias

	let NLuz = new TNode();
	let NCam = new TNode();
	let NChasis = new TNode();

	NLuz.setEntity(EntLuz);
	NCam.setEntity(EntCam);
	NChasis.setEntity(MallaChasis);

	TraslaLuz.addChild(NLuz);
	TraslaCoche.addChild(NChasis);
	TraslaCam.addChild(NCam);

	TraslaLuz.setEntity(TransfRotaLuz);
	TraslaCoche.setEntity(TransfRotaCoche);
	TraslaCam.setEntity(TransfRotaCam);

	//---- Recorrer el árbol (dibujarlo) ----

	Escena.draw();

};