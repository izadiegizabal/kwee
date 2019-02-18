//const constants = require('./tools/constants');
//import { constants, check } from './tools/constants';

/*

                    TResourceManager
                      	   |
                  	   TResource
                     /     |     \
                   /       |       \
                 /         |         \
               /           |           \
    TResourceMesh  TResourceMaterial  TResourceTexture        

*/

class TResourceManager {
    // map --> store resources
    
    constructor() {
        this.map = new Map();
        console.log(this.map);
    }
    
    // getResource --> The resource filename must be the same as "name"
    async getResource(name, type) {
        console.log("------");
        var resource = this.map.has(name);
        console.log(resource);

        if( resource == false ){
            // create resource
            switch(type){
                case 'mesh': {
                    console.log("-> Creating TResourceMesh " + name + "...");
                    resource = new TResourceMesh(name);
                    break;
                }
                case 'texture': {
                    console.log("-> Creating TResourceTexture " + name + "...");
                    resource = new TResourceTexture(name);
                    break;
                }
                case 'material': {
                    console.log("-> Creating TResourceMaterial " + name + "...");
                    resource = new TResourceMaterial(name);
                    break;
                }
                case 'shader': {
                    console.log("-> Creating TResourceShader " + name + "...");
                    resource = new TResourceShader(name);
                    break;
                }
            }
            // load resource
            var file = await resource.loadFile(name);
            // add to our map
            var finalName = `${ name } ${ type }`;
            resource = this.map.set(finalName, file);
        }
        console.log("-> Return " + name + ' ' + type);
        console.log(this.map);
        console.log("------");

        return resource;
    }
}
// Map static¿¿?¿?¿

class TResource {
    constructor(name){
        this.name = name;
        //this.file = resource;

        return this;
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    loadFile(){

    }
}

class TResourceMesh extends TResource{

    constructor(name){
        super(name);

        // vertices positions
        this.vertices = [];
        // vertices indices
        this.triVertices = [];

        // normals
        this.normals = [];
        // ¿¿??
        this.triNormals;

        // texture coords
        this.textures = [];
        // ¿¿??
        this.triTextures;

        this.nTris;
        this.nVertices;
    }

    async loadFile(file){

        // mesh file code
        const jsonMesh = await loadJSON(file);
        
        // update variables vertices, normals, textures...
        
        this.vertices = jsonMesh.positions;
        this.triVertices = jsonMesh.indices;

        this.normals = jsonMesh.normals;

        // this.textures = jsonMesh.texcoords.UVMap;

        this.nTris = jsonMesh.indices_count;
        this.nVertices = jsonMesh.vertices_count;

        // return file ??
        //   return jsonMesh;
        return this;
    }

    draw(){
        var earthPosVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, earthPosVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var earthIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, earthIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

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

        var worldMatrix = new Float32Array(16);
        var viewMatrix = new Float32Array(16);
        var projMatrix = new Float32Array(16);
        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.lookAt(viewMatrix, [0, 0, -1.5], [0, 0.63, 0], [0, 1, 0]);
        glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        // console.log(TEntity.Model);

        var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');


        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);





    gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, earthIndexBufferObject);
    gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT, 0);


    }
}

class TResourceMaterial extends TResource{
    constructor(name){
        super(name);

        this.color = [];
        this.draw_count = null;
        this.draw_first = null;
        this.emit = null;
        this.fresnel = null;
        this.fresnel_factor = null;
        this.hardness = null;
        this.intensity = null;
        this.roughness = null;
    }

    async loadFile(file){
        
        const jsonMaterial = await loadJSON(file);

        const materialsLength = Object.keys(jsonMaterial.materials).length;

        console.log("jsonMaterial");
        console.log(jsonMaterial);

        console.log("jsonMaterial.materials length: " + materialsLength);
        // If we have more than 1 material in the JSON
        // --> return materials[material, material, material....]
        if(Object.keys(jsonMaterial.materials).length>1) {

            var materials = [];
    
            for(var material in jsonMaterial.materials){
                
                if (jsonMaterial.materials.hasOwnProperty(material)) {
                    let nMaterial = new TResourceMaterial();

                    nMaterial.color = jsonMaterial.materials[material].color;
                    nMaterial.draw_count = jsonMaterial.materials[material].draw_count;
                    nMaterial.draw_first = jsonMaterial.materials[material].draw_first;
                    nMaterial.emit = jsonMaterial.materials[material].emit;
                    nMaterial.fresnel = jsonMaterial.materials[material].fresnel;
                    nMaterial.fresnel_factor = jsonMaterial.materials[material].fresnel_factor;
                    nMaterial.hardness = jsonMaterial.materials[material].hardness;
                    nMaterial.intensity = jsonMaterial.materials[material].intensity;
                    nMaterial.roughness = jsonMaterial.materials[material].roughness;

                    nMaterial.name = material
        
                    materials.push(nMaterial);
                }
            }

            return materials;
        }
        else{
            // If we only have 1 material --> return material
            this.color = jsonMaterial.color;
            this.draw_count = jsonMaterial.draw_count;
            this.draw_first = jsonMaterial.draw_first;
            this.emit = jsonMaterial.emit;
            this.fresnel = jsonMaterial.fresnel;
            this.fresnel_factor = jsonMaterial.fresnel_factor;
            this.hardness = jsonMaterial.hardness;
            this.intensity = jsonMaterial.intensity;
            this.roughness = jsonMaterial.roughness;
     
            return this;
        }


    }
}

class TResourceTexture extends TResource{
    constructor(name){
        super(name);
    }
    
    loadFile(){}
}

class TResourceShader extends TResource {
  constructor(name) {
    super(name);
    this.shader = null;
  }

  async loadFile(name) {
    let cargado, shader;
    this.shader = await loadShader(name);
    return this;
  }

  getShader() {
    return this.shader;
  }
}

var mainRM = function () {

    var manager = new TResourceManager();

    // console.log("Pido primer recurso");
    // manager.getResource('primer recurso');
    // console.log("Pido segundo recurso");
    // manager.getResource('segundo recurso');
    // console.log("Pido primer recurso (debe estar en el map)");
    // manager.getResource('primer recurso')

    let mesh = manager.getResource('earth', 'mesh');
    let meshMaterial = manager.getResource('earth','material');
    let VShader = manager.getResource('shader.vs','shader');
    let FShader = manager.getResource('shader.fs','shader');
}

async function loadJSON(filename){

    let host = "http://localhost";
    let path = '/kwee-live/JSON/';
    let url = `${host + path + filename}.json`;
    
    console.log(`Fetching JSON resource from url: ${ url }`);
    
    let json;
    await fetch( url )
        .then(function(response) {
            return response.json();
        })
        .then(function(responseJSON) {
            console.log(responseJSON);
            json = responseJSON;
        });

    return json;
}

async function loadShader(filename){

    let host = "http://localhost";
    let path = '/kwee-live/shaders/';
    let url = `${host + path + filename}.glsl`;
    
    console.log(`Fetching ${filename} shader resource from url: ${ url }`);
    
    let file;
    await fetch( url )
        .then( response => { return response.text();})
        .then( res => {
            console.log(res);
            file = Promise.resolve(res);
        });

    return file;
}