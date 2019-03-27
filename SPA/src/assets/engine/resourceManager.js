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
import { global, TEntity, angle } from './commons';
import { constants } from './tools/constants.js';

var vec3 = glMatrix.vec3;

let meshPosVertexBufferObject = null;
var meshIndexBufferObject = null;
var texCoordVertexBufferObject = null;
var normalBufferObject = null;

class TResourceManager {
    // map --> store resources
    constructor() {
        this.map = new Map();
        meshPosVertexBufferObject = global.gl.createBuffer();
        meshIndexBufferObject = global.gl.createBuffer();
        texCoordVertexBufferObject = global.gl.createBuffer();
        normalBufferObject = global.gl.createBuffer();
    }
    
    // getResource --> The resource filename must be the same as "name"
    async getResource(name) {
        // console.log("== getResource " + name + " ==");
        let resource = this.map.has(name);

        let type = name.split('.');

        if( resource == false ){
            // console.log(name + " DOESN'T EXISTS. Creating...");
            // create resource
            switch(type[1]){
                case 'json': {
                    // Mesh
                    // console.log("-> Creating TResourceMesh " + name + "...");
                    resource = new TResourceMesh(name);
                    break;
                }
                case 'jpg':
                case 'png': {
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
                    // console.log("-> Creating TResourceShader " + name + "...");
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
            // console.log(name + " EXISTS. Returning...");
            
            switch(type[1]){
                case 'json': {
                    let value = await this.map.get(name); 
                    resource = value;

                    break;
                }
                case 'jpg':
                case 'png': {
                    let value = await this.map.get(name); 
                    resource = value;
                    
                    break;
                }
                case 'mtl': {
                    let value = await this.map.get(name); 
                    resource = value.mtl;
                    
                    break;
                }
                case 'vs': 
                case 'fs': {
                    let value = await this.map.get(name); 
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

        this.cbo;
        this.nbo;
        this.ibo;
        this.vbo;
    }

    async loadFile(file){

        console.log("== loadFile TResourceMesh(" + file + ") ==");

        // mesh file code
        const jsonMesh = await loadJSON(file);

      ///////////////////////////////////////////////////////////////////////////////// GET INFO FROM FILE

        this.alias = jsonMesh.alias;

        if( file == "earth_fbx.json" ||
          file == "earthfbx.json" ||
          file == "earthobj.json" ||
          file == "mesh_continentsObj.json"
        ){

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
        else if (file == "test1.json" ||
          file == "test2.json" ||
          file == "ballNormals.json" ||
          file == "ballNoNormals.json" ||
          file == "textured_earth.json" ||
          file == "sea.json" ||
          file == "mesh_continents.json" ||
          file == "earth.json") {
          this.alias = file;

          this.vertices = jsonMesh.positions;
          this.triVertices = jsonMesh.indices;
          this.textures = jsonMesh.texcoords ? jsonMesh.texcoords.UVMap : null;
          this.normals = jsonMesh.normals;

        }
        else{

            this.vertices = jsonMesh.vertices;
            this.triVertices = jsonMesh.indices;
            this.textures = jsonMesh.uvs;
            this.normals = jsonMesh.normals;

        }

        this.nTris = this.triVertices.length;
        this.nVertices = this.vertices.length;

      ///////////////////////////////////////////////////////////////////////////////// CREATE BUFFERS
      if(global.gl && global.program) {
        let vertexBufferObject = global.gl.createBuffer();
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, vertexBufferObject);
        global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.vertices), global.gl.STATIC_DRAW);

        let normalBufferObject = global.gl.createBuffer();
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, normalBufferObject);
        global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.normals), global.gl.STATIC_DRAW);

        let indexBufferObject = global.gl.createBuffer();
        global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        global.gl.bufferData(global.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), global.gl.STATIC_DRAW);

        this.vbo = vertexBufferObject;
        this.ibo = indexBufferObject;
        this.nbo = normalBufferObject;

        if (this.textures) {
          let colorBufferObject = global.gl.createBuffer();
          global.gl.bindBuffer(global.gl.ARRAY_BUFFER, colorBufferObject);
          global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.textures), global.gl.STATIC_DRAW);
          this.cbo = colorBufferObject;
        }

        global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, null);
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
      }

        return this;
    }

    draw(){
      if(global.gl && global.program) {
        ///////////////////////////////////////////////////////////////////////////////////////////// ""MATERIALS"" (NOPE)
        let uMaterialDiffuse = global.gl.getUniformLocation(global.program, 'uMaterialDiffuse');
        let uMaterialAmbient = global.gl.getUniformLocation(global.program, 'uMaterialAmbient');
        let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
        global.gl.uniform1i(uUseTextures, false);
        /// CHAPUZA CHANGE COLORS
        if (this.name === 'sea.json') {
          global.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
          global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        } else {
          if (this.tex && this.tex.tex) {

            global.gl.uniform4fv(uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
            global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
            global.gl.activeTexture(global.gl.TEXTURE0);
            global.gl.bindTexture(global.gl.TEXTURE_2D, this.tex.tex);
            global.gl.uniform1i(global.program.sampler, 0);
            global.gl.uniform1i(uUseTextures, true);
          } else {
            global.gl.uniform4fv(uMaterialDiffuse, [0.258, 0.960, 0.6, 1.0]);
            global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
          }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////// BIND BUFFERS
        let positionAttribLocation = global.gl.getAttribLocation(global.program, 'aVertexPosition');
        let texCoordAttribLocation = global.gl.getAttribLocation(global.program, 'aVertexTextureCoords');
        let normalAttribLocation = global.gl.getAttribLocation(global.program, 'aVertexNormal');
        global.gl.enableVertexAttribArray(positionAttribLocation);
        global.gl.enableVertexAttribArray(normalAttribLocation);


        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.vbo);
        global.gl.vertexAttribPointer(positionAttribLocation, 3, global.gl.FLOAT, global.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        global.gl.enableVertexAttribArray(positionAttribLocation);


        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.nbo);
        global.gl.vertexAttribPointer(normalAttribLocation, 3, global.gl.FLOAT, global.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        global.gl.enableVertexAttribArray(normalAttribLocation);


        if (this.tex && this.tex.tex) {
          global.gl.enableVertexAttribArray(texCoordAttribLocation);
          global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.cbo);
          global.gl.vertexAttribPointer(texCoordAttribLocation, 2, global.gl.FLOAT, global.gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
          global.gl.enableVertexAttribArray(texCoordAttribLocation);
        }


        ///////////////////////////////////////////////////////////////////////////////// POSITION & ROTATION STUFF
        var worldMatrix = TEntity.Model;
        var rotation = glMatrix.mat4.create();
        glMatrix.mat4.rotate(rotation, worldMatrix, angle, [0, 1, 0]);


        var matWorldUniformLocation = global.gl.getUniformLocation(global.program, 'uMVMatrix');
        global.gl.uniformMatrix4fv(matWorldUniformLocation, false, rotation);

        let aux = glMatrix.mat4.create();
        /// SORRRRRY, I HAD TO
        glMatrix.mat4.set(aux, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 1);
        let auxAux = glMatrix.mat4.create();
        glMatrix.mat4.multiply(auxAux, rotation, aux);

        glMatrix.mat4.invert(auxAux, auxAux);
        glMatrix.mat4.transpose(auxAux, auxAux);

        var normal = global.gl.getUniformLocation(global.program, 'uNMatrix');
        global.gl.uniformMatrix4fv(normal, false, auxAux);
        ///////////////////////////////////////////////////////////////////////////////// DRAW
        global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        global.gl.drawElements(global.gl.TRIANGLES, this.nTris, global.gl.UNSIGNED_SHORT, 0);
        ///////////////////////////////////////////////////////////////////////////////// CLEAR ALL BUFFERS
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
        global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, null);
      }
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
        this.tex = global.gl.createTexture();
        this.image = new Image();
    }

    bindTexture() {
        console.info('loading image '+this.image.src);
        global.gl.bindTexture(global.gl.TEXTURE_2D, this.tex);
        global.gl.pixelStorei(global.gl.UNPACK_FLIP_Y_WEBGL, true);
        global.gl.texImage2D(global.gl.TEXTURE_2D, 0, global.gl.RGBA, global.gl.RGBA, global.gl.UNSIGNED_BYTE, this.image);
        global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_MIN_FILTER, global.gl.LINEAR);
        global.gl.bindTexture(global.gl.TEXTURE_2D, null);
    }
    
    async loadFile(name) {
      return new Promise(resolve => {
        let url = constants.URL + '/assets/assets/textures/' + name;
        let self = this;
        this.image.onload = async function () {
          self.bindTexture();
          resolve(self);
        }
        this.image.src = url;

      });
    }

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

    //let host = "http://localhost:4200";
    let host = constants.URL;
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

    // let host = "http://localhost:4200";
    let host = constants.URL;    
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

    // let host = "http://localhost:4200";
    let host = constants.URL;    
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

export {
    TResourceManager,
    TResourceMaterial,
    TResourceMesh,
    TResourceShader,
    TResourceTexture
}
