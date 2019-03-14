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
import { gl, program, TEntity, angle, texture } from './commons';


var vec3 = glMatrix.vec3;

class TResourceManager {
    // map --> store resources
    constructor() {
        this.map = new Map();
    }
    
    // getResource --> The resource filename must be the same as "name"
    async getResource(name) {
        // console.log("== getResource " + name + " ==");
        let resource = this.map.has(name);

        let type = name.split('.');

        if( resource == false ){
            // create resource
            switch(type[1]){
                case 'json': {
                    // Mesh
                    // console.log("-> Creating TResourceMesh " + name + "...");
                    resource = new TResourceMesh(name);
                    break;
                }
                case 'texture': {
                    // console.log("-> Creating TResourceTexture " + name + "...");
                    resource = new TResourceTexture(name);
                    break;
                }
                case 'mtl': {
                    // material
                    // console.log("-> Creating TResourceMaterial " + name + "...");
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

            return this.getResource(name);
        }
        else{
            // return resource
            
            switch(type[1]){
                case 'json': {
                    let value = this.map.get(name); 
                    resource = value.json;
                    
                    break;
                }
                case 'texture': {
                    let value = this.map.get(name); 
                    resource = value.texture;
                    
                    break;
                }
                case 'mtl': {
                    let value = this.map.get(name); 
                    resource = value.mtl;
                    
                    break;
                }
                case 'vs': 
                case 'fs': {
                    let value = this.map.get(name); 
                    resource = value.shader;

                    break;
                }
            }
            
            return resource;
        }

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

        console.log("== loadFile TResourceMesh(" + file + ") ==");

        // mesh file code
        const jsonMesh = await loadJSON(file);

        this.alias = jsonMesh.alias;

        if( file == "earth_fbx.json"){

            this.vertices = jsonMesh.meshes[0].vertices;
            this.triVertices = [].concat.apply([], jsonMesh.meshes[0].faces);
            this.textures = jsonMesh.meshes[0].texturecoords[0];
            this.normals = jsonMesh.meshes[0].normals;

        } else if (file == "test.json") {
            this.alias = file;

            this.vertices = jsonMesh.model.vertices[0].position.data;
            this.triVertices = jsonMesh.model.meshes[0].indices;
            this.textures = jsonMesh.model.vertices[0].texCoord0.data;
            this.normals = jsonMesh.model.vertices[0].normal.data;

        }
        else{
            console.log("sin mat");

            this.vertices = jsonMesh.vertices;
            this.triVertices = jsonMesh.indices;
            this.textures = jsonMesh.uvs;
            this.normals = jsonMesh.normals;

        }

        this.nTris = this.triVertices.length;
        this.nVertices = this.vertices.length;

        return this;
    }

    draw(){

        // /// object buffers
        // var meshPosVertexBufferObject = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // var meshIndexBufferObject = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
        // var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        // gl.vertexAttribPointer(
        //     positionAttribLocation, // Attribute location
        //     3, // Number of elements per attribute
        //     gl.FLOAT, // Type of elements
        //     gl.FALSE,
        //     3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        //     0 // Offset from the beginning of a single vertex to this attribute
        // );
        // gl.enableVertexAttribArray(positionAttribLocation);

        // gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        // gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT, 0);


        /*var meshPosVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

        var meshIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        var worldMatrix = new Float32Array(16);
        glMatrix.mat4.identity(worldMatrix);
        worldMatrix = TEntity.Model;


        // rotation stuff
        var rotation = glMatrix.mat4.create();
        glMatrix.mat4.rotate(rotation, worldMatrix, angle, [0, 1, 0]);

        var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        gl.uniformMatrix4fv(matWorldUniformLocation, false, rotation);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT, 0);*/


        ///////////////////////////////////////////////////////////////////////////////////////////     Vertex
        var meshPosVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);


        // gl.bindBuffer(gl.ARRAY_BUFFER, meshPosVertexBufferObject);
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
      ///////////////////////////////////////////////////////////////////////////////////////////     Index
        var meshIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      ///////////////////////////////////////////////////////////////////////////////////////////     Normals & TexCoords
        var susanTexCoords = this.textures;
        var susanNormals = this.normals;

        var susanTexCoordVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.DYNAMIC_DRAW);

        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.uniform1i(program.sampler, 0);
        var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        gl.vertexAttribPointer(
          texCoordAttribLocation, // Attribute location
          2, // Number of elements per attribute
          gl.FLOAT, // Type of elements
          gl.FALSE,
          2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
          0
        );
        gl.enableVertexAttribArray(texCoordAttribLocation);



        var susanNormalBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals), gl.DYNAMIC_DRAW);

        var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
        gl.vertexAttribPointer(
          normalAttribLocation,
          3, gl.FLOAT,
          gl.TRUE,
          3 * Float32Array.BYTES_PER_ELEMENT,
          0
        );
        gl.enableVertexAttribArray(normalAttribLocation);

        //
        // Create texture
        //
        // var susanTexture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, susanTexture);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texImage2D(
        //     gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        //     gl.UNSIGNED_BYTE,
        //     document.getElementById("image")
        // );
        // gl.bindTexture(gl.TEXTURE_2D, null);

        //gl.clearColor(0.435, 0.909, 0.827, 1.0) // our blue
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        var worldMatrix = TEntity.Model;


        // rotation stuff

        var rotation = glMatrix.mat4.create();
        glMatrix.mat4.rotate(rotation, worldMatrix, angle, [1, 0, 0]);

        var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        gl.uniformMatrix4fv(matWorldUniformLocation, false, rotation);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshIndexBufferObject);
        gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);



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
        console.log("== loadFile TResourceMaterial(" + file + ") ==");
        const mtl_file = loadMTL(file);
        const mtl = new MTLFile(mtl_file);
        // console.log(mtl);

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
    
    // console.log(`Fetching JSON resource from url: ${ url }`);
    
    let json;
    await fetch( url )
        .then( function(response) { return response.json(); } )
        .then( responseJSON => {
            // console.log("== fetch JSON ok ==");
            // console.log(responseJSON);
            json = responseJSON;
        });

    return json;
}

async function load(filename){

    let host = "http://localhost:4200";
    let path = '/assets/engine/shaders/';
    let url = `${host + path + filename}`;
    
    // console.log(`Fetching ${filename} resource from url: ${ url }`);
    
    let file;
    await fetch( url )
        .then( response => response.text() )
        .then( res => {
            // console.log("== fetch file ok ==");
            // console.log(res);
            file = Promise.resolve(res);
        });

    return file;
}

async function loadMTL(filename){

    let host = "http://localhost:4200";
    let path = '/assets/assets/JSON/';
    let url = `${host + path + filename}`;
    
    // console.log(`Fetching ${filename} resource from url: ${ url }`);
    
    let file;
    await fetch( url )
        .then( response => response.text() )
        .then( res => {
            // console.log("== fetch file ok ==");
            // console.log(res);
            file = Promise.resolve(res);
        });

    return file;
}

async function loadImage(filename){

  let img = new Image();
  img.src = '../assets/assets/textures/'+filename;
  img.id = 'image';

  let host = "http://localhost:4200";
  let path = '/assets/assets/textures/';
  let url = `${host + path + filename}`;

  console.log(`Fetching ${filename} resource from url: ${ url }`);
  let file;
  await fetch( url )
    .then( response => response.blob() )
    .then( res => {
      console.log("== fetch file ok ==");
      var objectURL = URL.createObjectURL(res);
      //img.src = '../assets/textures/'+filename;
    });

  return file;
}

var loadImg = async function (url, callback) {
  var image = new Image();
  image.onload = async function () {
    await callback(null, image);
  };
  image.src = url;
};

export {
    TResourceManager,
    TResourceMaterial,
    TResourceMesh,
    TResourceShader,
    TResourceTexture,
    loadImage
}
