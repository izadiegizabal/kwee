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

class TResourceMeshArrayAnimation {

  constructor(meshesArray){
    this.meshes = meshesArray;
    this.index = 0;
  }

  beginDraw() {
    this.draw();
  }

  endDraw() {
  }

  draw(){
    if(this.index > this.meshes.length -1){
      this.index = this.meshes.length -1;
    }
    this.meshes[this.index].draw();
  }

  setCount(index){
    this.index = index;
  }

}

class TResourceMeshArray {

  constructor(meshesArray, tiers){
    this.meshes = meshesArray;
    this.index = 0;
    this.color = null;
    this.tiers = tiers;
  }

  beginDraw() {
    this.draw();
  }

  endDraw() {
  }

  draw(){
    if(this.meshes != null && this.meshes.length != 0){
      if(this.index > this.meshes.length -1){
        this.index = this.meshes.length -1;
      }

      if(global.status == 1){
        // Update LOD while checking zoom
        if(global.zoom < this.tiers[0]){
          // draw little one
          this.setCount(2);
        }
        else if(global.zoom < this.tiers[1]){

          this.setCount(1);
        }
        else{
          this.setCount(0);
        }
      }
      this.meshes[this.index].draw();
    }
  }

  setColor(color){
    this.color = color;
    if(this.meshes!=null){
      for(let i = 0; i<this.meshes.length; i++){
        this.meshes[i].setColor(color);
      }
    }
  }
  setCount(index){
    this.index = index;
  }

  addMesh(mesh){
    mesh.setColor(this.color);
    this.meshes.push(mesh);
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

    this.color = null;

    this.boundingBox = null;
    this.enableBBox = false
  }

  enableBB(value) {
    this.enableBBox = value;
    this.boundingBox = {
      vertices: [],
      vertsToCalc: this.vertices.slice(0),
      vMin: [],
      vMax: [],
      indices: [
        0,1, 1,2, 2,3, 3,0,   // floor
        4,5, 5,6, 6,7, 7,4,   // cap
        0,4, 1,5, 2,6, 3,7 ], // vertical vertices
      vbo: global.gl.createBuffer(),
      ibo: global.gl.createBuffer()
    }

    let xMin = this.boundingBox.vertsToCalc[1];;
    let xMax = this.boundingBox.vertsToCalc[1];
    let yMin = this.boundingBox.vertsToCalc[2];
    let yMax = this.boundingBox.vertsToCalc[2];
    let zMin = this.boundingBox.vertsToCalc[3];
    let zMax = this.boundingBox.vertsToCalc[3];
    let count = this.boundingBox.vertsToCalc.length;

    for(let i=0; i<count; i=i+3){
      // X
      if( this.boundingBox.vertsToCalc[i] < xMin ) xMin = this.boundingBox.vertsToCalc[i];
      if( this.boundingBox.vertsToCalc[i] > xMax ) xMax = this.boundingBox.vertsToCalc[i];
      // Y
      if( this.boundingBox.vertsToCalc[i+1] < yMin ) yMin = this.boundingBox.vertsToCalc[i+1];
      if( this.boundingBox.vertsToCalc[i+1] > yMax ) yMax = this.boundingBox.vertsToCalc[i+1];
      // Z
      if( this.boundingBox.vertsToCalc[i+2] < zMin ) zMin = this.boundingBox.vertsToCalc[i+2];
      if( this.boundingBox.vertsToCalc[i+2] > zMax ) zMax = this.boundingBox.vertsToCalc[i+2];
    }

    this.boundingBox.vMin = [xMin, yMin, zMin];
    this.boundingBox.vMax = [xMax, yMax, zMax];

    this.boundingBox.vertices = [
      this.boundingBox.vMin[0], this.boundingBox.vMin[1], this.boundingBox.vMin[2],
      this.boundingBox.vMax[0], this.boundingBox.vMin[1], this.boundingBox.vMin[2],
      this.boundingBox.vMax[0], this.boundingBox.vMin[1], this.boundingBox.vMax[2],
      this.boundingBox.vMin[0], this.boundingBox.vMin[1], this.boundingBox.vMax[2],
      this.boundingBox.vMin[0], this.boundingBox.vMax[1], this.boundingBox.vMin[2],
      this.boundingBox.vMax[0], this.boundingBox.vMax[1], this.boundingBox.vMin[2],
      this.boundingBox.vMax[0], this.boundingBox.vMax[1], this.boundingBox.vMax[2],
      this.boundingBox.vMin[0], this.boundingBox.vMax[1], this.boundingBox.vMax[2]
    ];

    global.gl.useProgram(global.program);

    this.boundingBox.vbo = global.gl.createBuffer();
    this.boundingBox.Ibo = global.gl.createBuffer();

    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.boundingBox.vbo);
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.boundingBox.vertices), global.gl.STATIC_DRAW);

    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.boundingBox.ibo);
    global.gl.bufferData(global.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.boundingBox.indices), global.gl.STATIC_DRAW);

    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, null);

  }

  setColor( value ){
    this.color = value;
  }

  async loadFile(file){

    // console.log("== loadFile TResourceMesh(" + file + ") ==");

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

      // console.log("== greentoken.de loader ==");

    } else if (file == "test.json") {
      this.alias = file;

      this.vertices = jsonMesh.model.vertices[0].position.data;
      this.triVertices = jsonMesh.model.meshes[0].indices;
      this.textures = jsonMesh.model.vertices[0].texCoord0.data;
      this.normals = jsonMesh.model.vertices[0].normal.data;

      // console.log("== Playcanvas loader ==");

    }
    else if (file == "test1.json" ||
      file == "test2.json" ||
      file == "ballNormals.json" ||
      file == "ballNoNormals.json" ||
      file == "textured_earth.json" ||
      file == "sea.json" ||
      file == "marker.json" ||
      file == "card.json" ||
      file == "mesh_continents.json" ||
      file == "earth.json" ||
      file == "earth_fixed.json" ||
      file == "earthOriginal_simple.json") {
      // Blender JSON Mesh exporter
      this.alias = file;

      this.vertices = jsonMesh.positions;
      this.triVertices = jsonMesh.indices;
      this.textures = jsonMesh.texcoords ? jsonMesh.texcoords.UVMap : null;
      //this.normals = jsonMesh.normals;
      this.normals = calculateNormals(this.vertices, this.triVertices);
      //console.log("== json mesh exporter ==");

    }
    else if(jsonMesh.indices!=undefined && jsonMesh.verts != undefined){
      this.vertices = jsonMesh.verts;
      this.triVertices = jsonMesh.indices;
      //this.normals = jsonMesh.normals;
      this.normals = calculateNormals(this.vertices, this.triVertices);

      //console.log("== kurilo.su loader ==");
    }
    else{
      // python OBJ -> json
      this.vertices = jsonMesh.vertices;
      this.triVertices = jsonMesh.indices;
      this.textures = jsonMesh.uvs;
      this.normals = jsonMesh.normals;

      //console.log("== python loader ==");
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

    global.gl.useProgram(global.program);


    // if(global.gl && global.program) {
    ///////////////////////////////////////////////////////////////////////////////////////////// ""MATERIALS"" (NOPE)
    // let uMaterialDiffuse = global.gl.getUniformLocation(global.program, 'uMaterialDiffuse');
    // let uMaterialAmbient = global.gl.getUniformLocation(global.program, 'uMaterialAmbient');
    // let uUseTextures = global.gl.getUniformLocation(global.program, 'uUseTextures');
    /// CHAPUZA CHANGE COLORS
    // if (this.name === 'sea.json') {
    //   global.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
    //   global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   global.gl.uniform1i(uUseTextures, 0);
    // } else if (this.name === 'marker.json') {
    //   global.gl.uniform4fv(uMaterialDiffuse, [1, 0.039, 0.231, 1.0]);
    //   global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   global.gl.uniform1i(uUseTextures, 0);
    // } else if (this.name === 'card.json') {
    //   global.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
    //   global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   global.gl.uniform1i(uUseTextures, 0);
    // } else {
    //   if (this.tex && this.tex.tex) {
    //     global.gl.uniform4fv(uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
    //     global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //     global.gl.activeTexture(global.gl.TEXTURE0);
    //     global.gl.bindTexture(global.gl.TEXTURE_2D, this.tex.tex);
    //     global.gl.uniform1i(global.program.sampler, 0);
    //     global.gl.uniform1i(uUseTextures, 1);
    //   } else {
    //     global.gl.uniform4fv(uMaterialDiffuse, [0.258, 0.960, 0.6, 1.0]);
    //     global.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //     global.gl.uniform1i(uUseTextures, 0);
    //   }
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////// BIND BUFFERS

    // global.gl.enableVertexAttribArray(global.programAttributes.aVertexPosition);
    // global.gl.enableVertexAttribArray(global.programAttributes.aVertexNormal);

    this.color ? global.gl.uniform4fv(global.programUniforms.uMaterialDiffuse, this.color) : global.gl.uniform4fv(global.programUniforms.uMaterialDiffuse, [1,0,0,1]);



    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.vbo);
    global.gl.vertexAttribPointer(global.programAttributes.aVertexPosition, 3, global.gl.FLOAT, global.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    global.gl.enableVertexAttribArray(global.programAttributes.aVertexPosition);


    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.nbo);
    global.gl.vertexAttribPointer(global.programAttributes.aVertexNormal, 3, global.gl.FLOAT, global.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    global.gl.enableVertexAttribArray(global.programAttributes.aVertexNormal);


    // if (this.tex && this.tex.tex) {
    //   let texCoordAttribLocation = global.gl.getAttribLocation(global.program, 'aVertexTextureCoords');
    //   global.gl.enableVertexAttribArray(texCoordAttribLocation);
    //   global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.cbo);
    //   global.gl.vertexAttribPointer(texCoordAttribLocation, 2, global.gl.FLOAT, global.gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    //   global.gl.enableVertexAttribArray(texCoordAttribLocation);
    // }


    ///////////////////////////////////////////////////////////////////////////////// POSITION & ROTATION STUFF

    let aux = global.modelMatrix;
    // console.log(`
    //     modelMatrix (mesh):
    //     ${ aux[0] } ${ aux[1] } ${ aux[2] } ${ aux[3] }
    //     ${ aux[4] } ${ aux[5] } ${ aux[6] } ${ aux[7] }
    //     ${ aux[8] } ${ aux[9] } ${ aux[10] } ${ aux[11] }
    //     ${ aux[12] } ${ aux[13] } ${ aux[14] } ${ aux[15] }
    // `);

    // MVMatrix = model * view
    let viewModel = [];
    glMatrix.mat4.multiply(viewModel, global.viewMatrix, global.modelMatrix);
    global.gl.uniformMatrix4fv(global.programUniforms.uMVMatrix, false, viewModel);

    // uPMatrix * uMVMatrix (on shader)

    // NMatrix
    let normalMatrix = glMatrix.mat4.create();
    glMatrix.mat4.invert(normalMatrix, viewModel);
    glMatrix.mat4.transpose(normalMatrix, normalMatrix);
    global.gl.uniformMatrix4fv(global.programUniforms.uNMatrix, false, normalMatrix);

    ///////////////////////////////////////////////////////////////////////////////// DRAW
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    global.gl.drawElements(global.gl.TRIANGLES, this.nTris, global.gl.UNSIGNED_SHORT, 0);
    ///////////////////////////////////////////////////////////////////////////////// CLEAR ALL BUFFERS
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, null);
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, null);

    // bounding box if available
    if(this.enableBBox){

      // draw
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.boundingBox.vbo);
      global.gl.vertexAttribPointer(global.programAttributes.aVertexPosition, 3, global.gl.FLOAT, global.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
      global.gl.enableVertexAttribArray(global.programAttributes.aVertexPosition);
      // Set lines to black
      global.gl.uniform4fv(global.programUniforms.uMaterialDiffuse, [0.0, 0.0, 0.0, 1.0])

      global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.boundingBox.ibo);

      global.gl.drawElements(global.gl.LINES, this.boundingBox.indices.length, global.gl.UNSIGNED_SHORT, 0);
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

    async bindTexture() {
      return new Promise(async resolve => {
        console.log('== loading TResourceTexture(' + this.name + ') ==');
        // console.info('loading image '+this.image.src);
        global.gl.bindTexture(global.gl.TEXTURE_2D, this.tex);
        global.gl.pixelStorei(global.gl.UNPACK_FLIP_Y_WEBGL, 1);
        global.gl.texImage2D(global.gl.TEXTURE_2D, 0, global.gl.RGBA, global.gl.RGBA, global.gl.UNSIGNED_BYTE, this.image);
        global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_MIN_FILTER, global.gl.LINEAR);
        global.gl.bindTexture(global.gl.TEXTURE_2D, null);
        resolve(true);
      });
    }
    
    async loadFile(name) {
      return new Promise(async resolve => {
        let url = constants.URL + '/assets/assets/textures/' + name;
        let self = this;
        this.image.onload = async function () {
          await self.bindTexture();
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

function calculateNormals(vs, ind){
  var x=0; 
  var y=1;
  var z=2;
  
  var ns = [];
  for(var i=0;i<vs.length;i++){ //for each vertex, initialize normal x, normal y, normal z
      ns[i]=0.0;
  }
  
  for(var i=0;i<ind.length;i=i+3){ //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
      var v1 = [];
      var v2 = [];
      var normal = [];
      //p1 - p0
       v1[x] = vs[3*ind[i+1]+x] - vs[3*ind[i]+x];
       v1[y] = vs[3*ind[i+1]+y] - vs[3*ind[i]+y];
       v1[z] = vs[3*ind[i+1]+z] - vs[3*ind[i]+z];
     // p0 - p1
       v2[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
       v2[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
       v2[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];            
      //p2 - p1
      // v1[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
      // v1[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
      // v1[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];
     // p0 - p1
      // v2[x] = vs[3*ind[i]+x] - vs[3*ind[i+1]+x];
      // v2[y] = vs[3*ind[i]+y] - vs[3*ind[i+1]+y];
      // v2[z] = vs[3*ind[i]+z] - vs[3*ind[i+1]+z];
      //cross product by Sarrus Rule
      normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
      normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
      normal[z] = v1[x]*v2[y] - v1[y]*v2[x];
      
      // ns[3*ind[i]+x] += normal[x];
      // ns[3*ind[i]+y] += normal[y];
      // ns[3*ind[i]+z] += normal[z];
       for(let j=0;j<3;j++){ //update the normals of that triangle: sum of vectors
          ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
           ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
           ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
       }
  }
  //normalize the result
  for(var i=0;i<vs.length;i=i+3){ //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
  
      var nn=[];
      nn[x] = ns[i+x];
      nn[y] = ns[i+y];
      nn[z] = ns[i+z];
      
      var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
      if (len == 0) len = 0.00001;
      
      nn[x] = nn[x]/len;
      nn[y] = nn[y]/len;
      nn[z] = nn[z]/len;
      
      ns[i+x] = nn[x];
      ns[i+y] = nn[y];
      ns[i+z] = nn[z];
  }
  
  return ns;
}


export {
    TResourceManager,
    TResourceMaterial,
    TResourceMesh,
    TResourceShader,
    TResourceTexture,
    TResourceMeshArray,
    TResourceMeshArrayAnimation
}
