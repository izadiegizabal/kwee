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
        meshPosVertexBufferObject = gl.createBuffer();
        meshIndexBufferObject = gl.createBuffer();
        texCoordVertexBufferObject = gl.createBuffer();
        normalBufferObject = gl.createBuffer();
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
        var vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        var normalBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        var indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), gl.STATIC_DRAW);

        this.vbo = vertexBufferObject;
        this.ibo = indexBufferObject;
        this.nbo = normalBufferObject;

        if (this.textures !== null) {
          var colorBufferObject = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textures), gl.STATIC_DRAW);
          this.cbo = colorBufferObject;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);

        return this;
    }

    draw(){
      ///////////////////////////////////////////////////////////////////////////////////////////// ""MATERIALS"" (NOPE)
      let uMaterialDiffuse = gl.getUniformLocation(program, 'uMaterialDiffuse');
      let uMaterialAmbient = gl.getUniformLocation(program, 'uMaterialAmbient');
      /// CHAPUZA CHANGE COLORS
      if (this.name === 'sea.json'){
        gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949,1.0]);
        gl.uniform4fv(uMaterialAmbient, [1.0,1.0,1.0,1.0]);
      }
      else {
        gl.uniform4fv(uMaterialDiffuse, [0.258, 0.960, 0.6,1.0]);
        gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        /*gl.uniform4fv(uMaterialDiffuse, [1.0,1.0,1.0,1.0]);
        gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);*/
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex.tex );
        gl.uniform1i(program.sampler, 0);
      }
      ///// BOTH FALSE
      var uWireframe = gl.getUniformLocation(program, 'uWireframe');
      gl.uniform1i(uWireframe, false);
      var uUseVertexColor = gl.getUniformLocation(program, 'uUseVertexColor');
      gl.uniform1i(uUseVertexColor, false);

      ///// TRUE IF TEXTURES ARE NEEDED
      var uUseTextures = gl.getUniformLocation(program, 'uUseTextures');
      gl.uniform1i(uUseTextures, false);

      ///////////////////////////////////////////////////////////////////////////////////////////// BIND BUFFERS
      var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
      var texCoordAttribLocation = gl.getAttribLocation(program, 'aVertexTextureCoords');
      var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(normalAttribLocation);


      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.enableVertexAttribArray(positionAttribLocation);


      gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
      gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.enableVertexAttribArray(normalAttribLocation);


      if (this.textures !== null) {
        gl.enableVertexAttribArray(texCoordAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);
        gl.vertexAttribPointer(texCoordAttribLocation,2,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(texCoordAttribLocation);
      }


      ///////////////////////////////////////////////////////////////////////////////// POSITION & ROTATION STUFF
      var worldMatrix = TEntity.Model;
      var rotation = glMatrix.mat4.create();
      glMatrix.mat4.rotate(rotation, worldMatrix, angle, [0, 1, 0]);


      var matWorldUniformLocation = gl.getUniformLocation(program, 'uMVMatrix');
      gl.uniformMatrix4fv(matWorldUniformLocation, false, rotation);

      let aux = glMatrix.mat4.create();
      /// SORRRRRY, I HAD TO
      glMatrix.mat4.set( aux,1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 1);
      let auxAux = glMatrix.mat4.create();
      glMatrix.mat4.multiply(auxAux, rotation, aux);

      glMatrix.mat4.invert(auxAux, auxAux);
      glMatrix.mat4.transpose(auxAux, auxAux);

      var normal = gl.getUniformLocation(program, 'uNMatrix');
      gl.uniformMatrix4fv(normal, false, auxAux);
      ///////////////////////////////////////////////////////////////////////////////// DRAW
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.drawElements(gl.TRIANGLES, this.nTris, gl.UNSIGNED_SHORT,0);
      ///////////////////////////////////////////////////////////////////////////////// CLEAR ALL BUFFERS
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
        this.tex = gl.createTexture();
        this.image = new Image();
    }

    bindTexture() {
        console.info('loading image '+this.image.src);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
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
