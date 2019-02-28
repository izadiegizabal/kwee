/*var last = 0; // timestamp of the last render() call

function render(now) {
    // each 2 seconds call the createNewObject() function
    if(!last || now - last >= 40) {
        last = now;
        ////loop
    }
    window.requestAnimationFrame(render);
}*/
//var manager = new TResourceManager();

var canvas = null;
var gl = null;
var program = null;

async function mainR(){

	canvas = document.getElementById('game-surface');
	gl = canvas.getContext('webgl');

	// gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
	gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	
   
    // let meshMaterial = await manager.getResource('cube','material');
    let VShader = await manager.getResource('shader.vs','shader');
    let FShader = await manager.getResource('shader.fs','shader');

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, manager.map.get('shader.vs shader').shader);
	gl.shaderSource(fragmentShader, manager.map.get('shader.fs shader').shader);

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

	program = gl.createProgram();
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


    //// matrices
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


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
	let TransfRotaCam = new TTransform();
	let TransfRotaCoche = new TTransform();

	RotaLuz.setEntity(TransfRotaLuz);
	RotaCam.setEntity(TransfRotaCam);
	RotaCoche.setEntity(TransfRotaCoche);

	let EntLuz = new TLight(); 
	let EntCam = new TCamera(); 
	let MallaChasis = new TMesh();
	await MallaChasis.loadMesh('part1');


    let MallaChasi2 = new TMesh();
    await MallaChasi2.loadMesh('partt');

	console.log(MallaChasis.mesh);

	/// Esto no estaba en las transparencias

	let NLuz = new TNode(TraslaLuz);
	let NCam = new TNode(TraslaCam);
	let NChasis = new TNode(TraslaCoche);
    let NChasi2 = new TNode(TraslaCoche);

	NLuz.setEntity(EntLuz);
	NCam.setEntity(EntCam);
	NChasis.setEntity(MallaChasis);
    NChasi2.setEntity(MallaChasi2);

	TraslaLuz.addChild(NLuz);
	TraslaCoche.addChild(NChasis);
    TraslaCoche.addChild(NChasi2);
	TraslaCam.addChild(NCam);

	TraslaLuz.setEntity(TransfRotaLuz);
	TraslaCoche.setEntity(TransfRotaCoche);
	TraslaCam.setEntity(TransfRotaCam);


	Escena.draw();

}

async function main(){
	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	// gl.clearColor(0.266, 0.294, 0.329, 1.0); // our grey
	gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var manager = new TResourceManager();
    let mesh = await manager.getResource('part1.json');
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
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.435, 0.909, 0.827, 1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        // gl.bindTexture(gl.TEXTURE_2D, earthTexture);
        // gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, earthIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);


}



class TMotorTAG{

    constructor(resourceManager) {
        this.scene = new TNode();
        
        this.allLights = [];
        this.activeLights = [];

        this.allCameras = [];
        this.activeCamera = -1;

        this.resourceManager = resourceManager;
    }

    createRootNode(){
        TMotorTAG.rootNode = new TNode(null,'root');
        return TMotorTAG.rootNode;
    }

    createNode(father, entity){
        var node = new TNode(father, entity);
        father.addChild(node);
        return node;
    }

    createTransform(){

    }

    createCamera( father, isPerspective, near, far, right, left, top, bottom ){

        // node rotation
        let TransfRotaCam = new TTransform();
        let nodeRotation = createNode(father, TransfRotaCam );

        // node traslation
        let TransfTransCam = new TTransform();
        let nodeTranslation = createNode(nodeRotation, TransfTransCam );
          
        // isPerspective, near, far, right, left, top, bottom
        let cam = new TCamera(isPerspective, near, far, right, left, top, bottom);
        createNode(nodeTranslation, cam);

        this.allCameras.push(cam);

        return cam;
    }

    deleteCamera( TNodeCam ) {
        let array = TMotorTAG.allCameras;
        TNodeCam.father.father.father.remChild(TNodeCam.father.father);
        array.splice(array.indexOf(TNodeCam),1);
    }
    /**
     * 
     * @param {*} TNodeCam Camera to rotate
     * @param {*} angle Angle to rotate
     * @param {*} axis Axis to rotate. If different for values 'x', 'y' or 'z', will use that axis
     */
    rotateCamera( TNodeCam, angle, axis ) {
        switch (axis) {
            case 'x':
                TNodeCam.father.father.entity.rotateX(angle);
                break;
            case 'y':
                TNodeCam.father.father.entity.rotateY(angle);
                break;
            case 'z':
                TNodeCam.father.father.entity.rotateZ(angle);
                break;
            default:
                TNodeCam.father.father.entity.rotate(angle, axis);
                break;
        }
    }

    translateCamera( TNodeCam, units ) {
        TNodeCam.father.entity.translate(units);
    }

    lookAt( TNodeCam ) {
        // to do
    }

    createLight(father, typ, intensity, specular, direction, s){

        // node rotation
        let TransfRotaLight = new TTransform();
        let nodeRotation = createNode(father, TransfRotaLight );

        // node traslation
        let TransfTransLight = new TTransform();
        let nodeTranslation = createNode(nodeRotation, TransfTransLight );
          
        // typ, intensity, specular, direction, s
        let light = new TLight(typ, intensity, specular, direction, s);
        createNode(nodeTranslation, light);

        this.allLights.push(light);

        return light;
    }

    async loadMesh(father, file){

        //Crear la malla a partir del recurso malla y devolverla
        let meshResource = await this.resourceManager.getResource(file); // WARNING: CORREGIR GETRESOURCE(FILE)
        let mesh = new TMesh(meshResource);
        return createNode(father, mesh);
    }

    draw(){
        /// ESTO ESTA MAL
        var loop = function () {
            // default color
            gl.clearColor(0.435, 0.909, 0.827, 1.0)
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            //////
            // gl.bindTexture(gl.TEXTURE_2D, earthTexture);
            // gl.activeTexture(gl.TEXTURE0);

            gl.drawElements(gl.TRIANGLES, gl.UNSIGNED_SHORT, 0);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

    }

    /*Métodos para el registro y manejo de las cámaras Métodos para el registro 
    y manejo de las luces Métodos para el registro y manejo de los viewports*/

}

// Static attributes of TMotorTag
TMotorTAG.rootNode = null;









