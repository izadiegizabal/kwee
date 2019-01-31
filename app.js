class TColor {
	// TColor
	constructor(){}
}

class TMeshSource {
	// TColor
	constructor(){}
}

class TMatrix4x4 {
	// TMatrix
	constructor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33){
		this.matrix = glMatrix.mat4.create();
		glMatrix.mat4.set(this.matrix, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
	}
}

class TFile { 
	// TColor
	constructor(){}
}

class TEntity {

	beginDraw() {
		console.log(this);
	}

	endDraw() {
		console.log(this);
	}

}

class TTransform extends TEntity {

	constructor(matrix, m){
		super();
		try{
			if( !(matrix instanceof TMatrix4x4)) throw 'the mesh you passed it is not a TMatrix4x4';
			this.matrix = matrix;

			this.m = glMatrix.mat4.create();

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	identity(){
		this.matrix = glMatrix.mat4.create();
	}

	load(matrix){
		try{
			if( !(matrix instanceof TMatrix4x4)) throw 'the mesh you passed it is not a TMatrix4x4';
			this.matrix = matrix;

		} catch (err) {
			console.log('Error: '+err);
		}
	}

	transpose(){
		glMatrix.mat4.transpose(this.matrix.matrix, this.matrix.matrix);
	}

	translate(translation){
		glMatrix.mat4.translate(this.matrix, this.matrix, translation);
	}

	rotateX(angle){
		glMatrix.mat4.rotateX(this.matrix, this.matrix, glMatrix.toRadian(angle));
	}

	rotateY(angle){
		glMatrix.mat4.rotateY(this.matrix, this.matrix, glMatrix.toRadian(angle));
	}

	rotateZ(angle){
		glMatrix.mat4.rotateZ(this.matrix, this.matrix, glMatrix.toRadian(angle));
	}

	rotate(angle, axis){
		glMatrix.mat4.rotate(this.matrix, this.matrix, glMatrix.toRadian(angle), axis);
	}

	scale(scalation){
		glMatrix.mat4.scale(this.matrix, this.matrix, scalation);
	}

	invert(){
		glMatrix.mat4.invert(this.matrix.matrix, this.matrix.matrix);
	}

	add(out, first, second) { 
		glMatrix.mat4.add(out, first, second);
	}

	multiply(out, first, second) {
		glMatrix.mat4.multiply(out, first, second);
	}

	getMatrix() {
		return this.matrix;
	}

	beginDraw() {
		console.log(this);
	}

	endDraw() {
		console.log(this);
	}


	asdas(){
		var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
	}
	
}

class TLight extends TEntity {
	
	constructor(intensity){
		super();
		try{
			if( !(intensity instanceof TColor)) throw 'the intensity you passed it is not a TColor';
			this.intensity = intensity;

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

	endDraw() {
		console.log(this);
	}

}

class TMesh extends TEntity {
	
	constructor(mesh){
		super();
		try{
			if( !(mesh instanceof TMeshSource)) throw 'the mesh you passed it is not a TMeshSource';
			this.mesh = mesh;

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

	endDraw() {
		console.log(this);
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
	}

	setPerspective(near, far, right, left, top, bottom){
		try{
			// Set perspective
		} catch (err){
			console.log('Error: '+err);
		}
		this.isPerspective = true;
	}

	setParalel(near, far, right, left, top, bottom){
		try{
			// Set paralel
		} catch (err){
			console.log('Error: '+err);
		}
		this.isPerspective = false;
	}

	beginDraw() {
		console.log(this);
	}

	endDraw() {
		console.log(this);
	}
}

class TNode{

	constructor(entity, children, father){

		try {
			if (!(entity instanceof TEntity)) throw 'entity no es de tipo TEntity';
			this.entity = entity;

			this.children = [];
			if(Array.isArray(children)){
				children.forEach((e)=>{
					if (e instanceof TNode){
						this.children.push(e);
					}
				})
			}
			else{
				if (!(children instanceof TNode)) throw 'the children TNode';
				this.children.push(children);
				
			}
			if (!(father instanceof TEntity)) throw 'father no es de tipo TEntity';
			this.father = father;

		} catch(err) {
			console.log('Error: '+err);
		}
	}

	addChild(child){
		try{
			if(!(entity instanceof TNode)) throw 'the child you want to add it is not a TNode';
			this.children.push(child);

		} catch(err){
			console.log('Error: '+err);
		}
	}

	remChild(child){
		try{
			if (!(entity instanceof TNode)) throw 'the child you want to remove it is not a TNode';
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
		if(this.children.length>0){
			children.forEach( (e) => {
				console.log('asdasds');
			});
		}
	}

}

var InitDemo = function () {

	//////// PRUEBAS
	var matrix = new TMatrix4x4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,19);
	var node = new TTransform(matrix);
	node.add(node.m,node.getMatrix().matrix,node.getMatrix().matrix)
	console.log(node.m);
};