/*var last = 0; // timestamp of the last render() call

function render(now) {
    // each 2 seconds call the createNewObject() function
    if(!last || now - last >= 40) {
        last = now;
        ////loop
    }
    window.requestAnimationFrame(render);
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
    TResourceShader
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
    changeAngle
} from './commons.js';


async function mainR(){
   
    const manager = new TResourceManager();
	// canvas = document.getElementById('kweelive');
	// gl = canvas.getContext('webgl');

	// gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
	gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	
   
    // let meshMaterial = await manager.getResource('cube','material');

    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');

    console.log("manager.getmap: ");
    console.log(VShader);

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

	gl.useProgram(program);


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
    let TransfRotaCoche2 = new TTransform();
    let TransfRotaCoche3 = new TTransform();

	RotaLuz.setEntity(TransfRotaLuz);
	RotaCam.setEntity(TransfRotaCam2);
    RotaCoche.setEntity(TransfRotaCoche);
	RotaCoche2.setEntity(TransfRotaCoche2);

	let EntLuz = new TLight(); 
    let EntCam = new TCamera(); 
    let MallaChasis = await new TMesh('part1.json');

    //let MallaChasi2 = await new TMesh('partt.json');


    // await loadImage('guitars.png', await function (imgErr, img) {
    //     if (imgErr) {
    //         alert('Fatal error getting Susan texture (see console)');
    //         console.error(imgErr);
    //     } else { 

    //         image = img;
    //         console.log(image);
    //     }
    // });

    //image = await loadImage('guitars.png');

	/// Esto no estaba en las transparencias

	let NLuz = new TNode(TraslaLuz);
	let NCam = new TNode(TraslaCam);
	let NChasis = new TNode(TraslaCoche);
    //let NChasi2 = new TNode(TraslaCoche2);

	NLuz.setEntity(EntLuz);
	NCam.setEntity(EntCam);
	NChasis.setEntity(MallaChasis);
    // NChasi2.setEntity(MallaChasi2);

	TraslaLuz.addChild(NLuz);
	TraslaCoche.addChild(NChasis);
    // TraslaCoche2.addChild(NChasi2);
	TraslaCam.addChild(NCam);

	TraslaLuz.setEntity(TransfRotaLuz);
    //TransfRotaLuz.translate([2, 0, 0]);
	TraslaCoche.setEntity(TransfRotaCoche);
	TraslaCam.setEntity(TransfRotaCam);
    // TraslaCoche2.setEntity(TransfRotaCoche3);
    // TraslaCoche2.entity.translate([2, -1, 0]);

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
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    */

    var motor = new TMotorTAG();
    console.log("node cam:");
    console.log(NCam);
    motor.lookAt(NCam, [0, 0, 2], [0, 0, 0], [0, 1, 0]); 

    calculateLights();
    calculateViews();
    console.log("========= scene setup =========");
    console.log('Lights : ');
    console.log(TEntity.Lights);
    console.log('Views/cameras: ');
    console.log(TEntity.Views);
    console.log('Lights array: ');
    console.log(TEntity.AuxLights);
    console.log('Views/cameras array: ');
    console.log(TEntity.AuxViews);

    console.log(Escena);
    console.log("========= scene setup =========");
    

    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    viewMatrix = TEntity.AuxViews[0];
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

    
    var loop = function () {
        gl.clearColor(0.435, 0.909, 0.827, 0.0) // our blue
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        changeAngle(performance.now() / 1000 / 6 * 2 * Math.PI);   
        Escena.draw();

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

}


async function main(){
	var canvas = document.getElementById('kweelive');
	var gl = canvas.getContext('webgl');

	// gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
	// gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var manager = new TResourceManager();
    let mesh = await manager.getResource('part1.json');
    let material = await manager.getResource('earth.mtl');
    // let meshMaterial = await manager.getResource('cube','material');
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										SHADERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    var program = gl.createProgram();
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										VERTEX BUFFERS & MORE.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var earthVertices = await manager.map.get('part1.json').vertices;
    var earthIndices = await manager.map.get('part1.json').triVertices
    // var earthTexCoords = manager.map.get('earth mesh').textures;
    // var earthNormals = manager.map.get('earth mesh').normals;

    var earthPosVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, earthPosVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(earthVertices), gl.STATIC_DRAW);

    //var earthTexCoordVertexBufferObject = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, earthTexCoordVertexBufferObject);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(earthTexCoords), gl.STATIC_DRAW);

    var earthIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, earthIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(earthIndices), gl.STATIC_DRAW);

    /*var earthNormalBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, earthNormalBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(earthNormals), gl.STATIC_DRAW);*/

    gl.bindBuffer(gl.ARRAY_BUFFER, earthPosVertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    /*gl.bindBuffer(gl.ARRAY_BUFFER, earthTexCoordVertexBufferObject);
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0
    );
    gl.enableVertexAttribArray(texCoordAttribLocation);*/

    /*gl.bindBuffer(gl.ARRAY_BUFFER, earthNormalBufferObject);
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalAttribLocation,
        3, gl.FLOAT,
        gl.TRUE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(normalAttribLocation);*/

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										TEXTURES
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*var susanTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, susanTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        SusanImage
    );
    gl.bindTexture(gl.TEXTURE_2D, null);*/
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										PROGRAM
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										LIGHTNING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    
    /*gl.useProgram(program);

    var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
    var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
    var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

	gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
	gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
	gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9);*/

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// 										LOOP
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        // gl.clearColor(0.435, 0.909, 0.827, 1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        // gl.bindTexture(gl.TEXTURE_2D, earthTexture);
        // gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, earthIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);


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


export {
    main,
    mainR
}