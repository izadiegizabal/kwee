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

import { MTLFile } from './dependencies/MTLFile.js';

var vec3 = glMatrix.vec3;

class TResourceManager {
    // map --> store resources
    
    constructor() {
        this.map = new Map();
        console.log("== Constructor ==");
        console.log(this.map);
    }
    
    // getResource --> The resource filename must be the same as "name"
    async getResource(name) {
        console.log("== getResource " + name + " ==");
        var resource = this.map.has(name);
        console.log("Does map have " + name + " ? => " + resource);

        let type = name.split('.');

        if( resource == false ){
            // create resource
            switch(type[1]){
                case 'json': {
                    // Mesh
                    console.log("-> Creating TResourceMesh " + name + "...");
                    resource = new TResourceMesh(name);
                    break;
                }
                case 'texture': {
                    console.log("-> Creating TResourceTexture " + name + "...");
                    resource = new TResourceTexture(name);
                    break;
                }
                case 'mtl': {
                    // material
                    console.log("-> Creating TResourceMaterial " + name + "...");
                    resource = new TResourceMaterial(name);
                    break;
                }
                case 'vs': 
                case 'fs': {
                    // shader
                    console.log("-> Creating TResourceShader " + name + "...");
                    resource = new TResourceShader(name);
                    break;
                }
            }
            // load resource
            var file = await resource.loadFile(name);
            
            resource = this.map.set(name, file);
        }
        else{
            resource = this.map.get(name);
        }
        console.log("end getResource map status:");
        console.log(this.map);

        return resource;
    }
}

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
        this.alias;
    }

    async loadFile(file){

        console.log("== loadFile(" + file + ") ==");

        // mesh file code
        const jsonMesh = await loadJSON(file);

        this.alias = jsonMesh.alias;

        this.vertices = jsonMesh.vertices;
        this.triVertices = jsonMesh.indices;

        this.normals = jsonMesh.normals;

        // this.textures = jsonMesh.texcoords.UVMap;

        this.nTris = jsonMesh.indices.length;
        this.nVertices = jsonMesh.vertices.length;

        // material
        let name = jsonMesh.alias.split('_');
        let material = new TResourceMaterial(name[1]);
        console.log("Mesh material: " + material.name);
        material.loadValues(jsonMesh);

        let output = [];
        output.push(this);
        output.push(material);
        return output;
    }

    draw(){

        /// object buffers
        var meshPosVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var meshIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
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

        gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT, 0);


    }
}

class TResourceMaterial extends TResource{
    constructor(name){
        super(name);

        this.name = undefined;
        this.Ka = [] // ambient color
        this.Kd = [] // diffuse reflectance
        this.Ks = [] // specular reflectance
        this.Ke = []
        this.Ni = 0 // 
        this.Ns = 0 // specular exponent
        this.d = 0  // dissolves
        this.illum = 0 // illumination model
        this.map_Kd = null// @todo map_Kd

        return this;
    }

    async loadFile(file){
        
        // const mtl = await loadJSON(file);
        const mtl_file = loadMTL(file);
        const mtl = new MTLFile(mtl_file);
        console.log(mtl);

        // material
        this.name = mtl.name;
        this.Ka = mtl.Ka;  // ambient color
        this.Kd = mtl.Kd;  // diffuse reflectance
        this.Ks = mtl.Ks;  // specular reflectance
        this.Ke = mtl.Ke; 
        this.Ni = mtl.Ni; // 
        this.Ns = mtl.Ns; // specular exponent
        this.d = mtl.d;  // dissolves
        this.illum = mtl.illum; // illumination model
        // @todo map_Kd
    
        return this;
    }

    async loadValues(material) {
        
        // material
        this.name = material.newmtl;
        this.Ka = material.Ka;  // ambient color
        this.Kd = material.Kd;  // diffuse reflectance
        this.Ks = material.Ks;  // specular reflectance
        this.Ke = material.Ke; 
        this.Ni = material.Ni; // 
        this.Ns = material.Ns; // specular exponent
        this.d = material.d;  // dissolves
        this.illum = material.illum; // illumination model
        // @todo map_Kd

        return this;
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
    this.shader = await load(name);
    return this;
  }

  getShader() {
    return this.shader;
  }
}


async function loadJSON(filename){

    let host = "http://localhost:4200";
    let path = '/assets/assets/JSON/';
    let url = `${host + path + filename}`;
    
    console.log(`Fetching JSON resource from url: ${ url }`);
    
    let json;
    await fetch( url )
        .then( function(response) { return response.json(); } )
        .then( responseJSON => {
            console.log("== fetch JSON ok ==");
            console.log(responseJSON);
            json = responseJSON;
        });

    return json;
}

async function load(filename){

    let host = "http://localhost:4200";
    let path = '/assets/engine/shaders/';
    let url = `${host + path + filename}`;
    
    console.log(`Fetching ${filename} resource from url: ${ url }`);
    
    let file;
    await fetch( url )
        .then( response => response.text() )
        .then( res => {
            console.log("== fetch file ok ==");
            console.log(res);
            file = Promise.resolve(res);
        });

    return file;
}

async function loadMTL(filename){

    let host = "http://localhost:4200";
    let path = '/assets/assets/JSON/';
    let url = `${host + path + filename}`;
    
    console.log(`Fetching ${filename} resource from url: ${ url }`);
    
    let file;
    await fetch( url )
        .then( response => response.text() )
        .then( res => {
            console.log("== fetch file ok ==");
            console.log(res);
            file = Promise.resolve(res);
        });

    return file;
}

var mainRM = async function () {
    
    var manager = new TResourceManager();

    let mesh = await manager.getResource('part1.json');
    let VShader = await manager.getResource('shader.vs');
    let FShader = await manager.getResource('shader.fs');
}

export {
    TResourceManager,
    TResourceMaterial,
    TResourceMesh,
    TResourceShader,
    TResourceTexture
}