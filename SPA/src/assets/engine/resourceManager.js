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
import { mango, TEntity, angle } from './commons';
import { constants } from './tools/constants.js';

var vec3 = glMatrix.vec3;


// TAG.24
// TAG.25
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
            // console.log(name + " DOESN'T EXISTS. Creating...");
            // create resource
            switch(type[1]){
                case 'json': {
                    // Mesh
                    // console.log("-> Creating TResourceMesh " + name + "...");
                    if (mango.useTextures) {
                      resource = new TResourceMeshWithTexture(name);
                    } else {
                      resource = new TResourceMesh(name);
                    }
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


// TAG.26
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

  constructor(meshesArray, material){
    this.meshes = meshesArray;
    this.index = 0;
    this.material = material;
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

  addMesh(mesh){
    mesh.setMaterial(this.material);
    this.meshes.push(mesh);
  }

}

// lod (demo Rafa)
class TResourceMeshArray {

  constructor(meshesArray, material, tiers){
    this.meshes = meshesArray;
    this.material = null;

    this.setMaterial(material);
    this.index = 0;
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

      if(mango.status == 1){
        // Update LOD while checking zoom
        if(mango.zoom < this.tiers[0]){
          // draw little one
          this.setCount(2);
        }
        else if(mango.zoom < this.tiers[1]){

          this.setCount(1);
        }
        else{
          this.setCount(0);
        }
      }
      this.meshes[this.index].draw();
    }
  }

  setMaterial(material){
    this.material = material;
    if(this.meshes!=null && this.meshes.length>0){
      for(let i = 0; i<this.meshes.length; i++){
        this.meshes[i].setMaterial(material);
      }
    }
  }
  setCount(index){
    this.index = index;
  }

  addMesh(mesh){
    mesh.setMaterial(this.material);
    this.meshes.push(mesh);
  }

}

class TResourceMeshArrayDynamic {

  constructor(meshesArray, material){
    this.meshes = meshesArray;
    this.material = null;

    this.setMaterial(material);
    this.index = 0;
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
      this.meshes[this.index].draw();
    }
  }

  setMaterial(material){
    this.material = material;
    if(this.meshes!=null && this.meshes.length>0){
      for(let i = 0; i<this.meshes.length; i++){
        this.meshes[i].setMaterial(material);
      }
    }
  }
  setCount(index){
    this.index = index;
  }

  addMesh(mesh){
    mesh.setMaterial(this.material);
    this.meshes.push(mesh);
  }

}

// TAG.27
class TResourceMesh extends TResource{

  constructor(name){
    super(name);
// TAG.18


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
    this.specular = null;
    this.shininess = null;

    this.boundingBox = null;
    this.enableBBox = false
  }

// TAG.53  
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
      vbo: mango.gl.createBuffer(),
      ibo: mango.gl.createBuffer()
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

    mango.gl.useProgram(mango.program);

    this.boundingBox.vbo = mango.gl.createBuffer();
    this.boundingBox.Ibo = mango.gl.createBuffer();

    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.boundingBox.vbo);
    mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.boundingBox.vertices), mango.gl.STATIC_DRAW);

    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, this.boundingBox.ibo);
    mango.gl.bufferData(mango.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.boundingBox.indices), mango.gl.STATIC_DRAW);

    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);

  }

  setMaterial( material ){
    this.color = material.diffuse;
    this.specular = material.specular;
    this.shininess = material.shininess;
  }


// TAG.28
// TAG.29
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
    if(mango.gl && mango.program) {
      let vertexBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, vertexBufferObject);
      mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.vertices), mango.gl.STATIC_DRAW);

      let normalBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, normalBufferObject);
      mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.normals), mango.gl.STATIC_DRAW);

      let indexBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
      mango.gl.bufferData(mango.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), mango.gl.STATIC_DRAW);

      this.vbo = vertexBufferObject;
      this.ibo = indexBufferObject;
      this.nbo = normalBufferObject;

      if (this.textures) {
        let colorBufferObject = mango.gl.createBuffer();
        mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, colorBufferObject);
        mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.textures), mango.gl.STATIC_DRAW);
        this.cbo = colorBufferObject;
      }

      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
    }

    return this;
  }

// TAG.30
  draw(){


    mango.gl.useProgram(mango.program);


// TAG.33
    // if(mango.gl && mango.program) {
    ///////////////////////////////////////////////////////////////////////////////////////////// ""MATERIALS"" (NOPE)
    // let uMaterialDiffuse = mango.gl.getUniformLocation(mango.program, 'uMaterialDiffuse');
    // let uMaterialAmbient = mango.gl.getUniformLocation(mango.program, 'uMaterialAmbient');
    // let uUseTextures = mango.gl.getUniformLocation(mango.program, 'uUseTextures');
    /// CHAPUZA CHANGE COLORS
    // if (this.name === 'sea.json') {
    //   mango.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
    //   mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   mango.gl.uniform1i(uUseTextures, 0);
    // } else if (this.name === 'marker.json') {
    //   mango.gl.uniform4fv(uMaterialDiffuse, [1, 0.039, 0.231, 1.0]);
    //   mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   mango.gl.uniform1i(uUseTextures, 0);
    // } else if (this.name === 'card.json') {
    //   mango.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
    //   mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //   mango.gl.uniform1i(uUseTextures, 0);
    // } else {
    //   if (this.tex && this.tex.tex) {
    //     mango.gl.uniform4fv(uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
    //     mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //     mango.gl.activeTexture(mango.gl.TEXTURE0);
    //     mango.gl.bindTexture(mango.gl.TEXTURE_2D, this.tex.tex);
    //     mango.gl.uniform1i(mango.program.sampler, 0);
    //     mango.gl.uniform1i(uUseTextures, 1);
    //   } else {
    //     mango.gl.uniform4fv(uMaterialDiffuse, [0.258, 0.960, 0.6, 1.0]);
    //     mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
    //     mango.gl.uniform1i(uUseTextures, 0);
    //   }
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////// BIND BUFFERS

    // mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexPosition);
    // mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexNormal);


// TAG.36
    // Set material before drawing
    this.color 
      ? mango.gl.uniform4fv(mango.programUniforms.uMaterialDiffuse, this.color)
      : mango.gl.uniform4fv(mango.programUniforms.uMaterialDiffuse, [1,0,0,1]);
    this.specular 
      ? mango.gl.uniform4fv(mango.programUniforms.uMaterialSpecular, this.specular)
      : mango.gl.uniform4fv(mango.programUniforms.uMaterialSpecular, [1,1,1,1]);
    this.shininess
      ? mango.gl.uniform1f(mango.programUniforms.uShininess, this.shininess)
      : mango.gl.uniform1f(mango.programUniforms.uShininess, 100.0);

     

    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.vbo);
    mango.gl.vertexAttribPointer(mango.programAttributes.aVertexPosition, 3, mango.gl.FLOAT, mango.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexPosition);


    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.nbo);
    mango.gl.vertexAttribPointer(mango.programAttributes.aVertexNormal, 3, mango.gl.FLOAT, mango.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexNormal);


    // if (this.tex && this.tex.tex) {
    //   let texCoordAttribLocation = mango.gl.getAttribLocation(mango.program, 'aVertexTextureCoords');
    //   mango.gl.enableVertexAttribArray(texCoordAttribLocation);
    //   mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.cbo);
    //   mango.gl.vertexAttribPointer(texCoordAttribLocation, 2, mango.gl.FLOAT, mango.gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    //   mango.gl.enableVertexAttribArray(texCoordAttribLocation);
    // }


    ///////////////////////////////////////////////////////////////////////////////// POSITION & ROTATION STUFF

    // MVMatrix = model * view
    let viewModel = [];
    glMatrix.mat4.multiply(viewModel, mango.viewMatrix, mango.modelMatrix);
    mango.gl.uniformMatrix4fv(mango.programUniforms.uMVMatrix, false, viewModel);

    // uPMatrix * uMVMatrix (on shader)

    // NMatrix
    let normalMatrix = glMatrix.mat4.create();
    glMatrix.mat4.invert(normalMatrix, viewModel);
    glMatrix.mat4.transpose(normalMatrix, normalMatrix);
    mango.gl.uniformMatrix4fv(mango.programUniforms.uNMatrix, false, normalMatrix);

    ///////////////////////////////////////////////////////////////////////////////// DRAW
    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    mango.gl.drawElements(mango.gl.TRIANGLES, this.nTris, mango.gl.UNSIGNED_SHORT, 0);
    ///////////////////////////////////////////////////////////////////////////////// CLEAR ALL BUFFERS
    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);

    // bounding box if available
    if(this.enableBBox){

      // draw
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.boundingBox.vbo);
      mango.gl.vertexAttribPointer(mango.programAttributes.aVertexPosition, 3, mango.gl.FLOAT, mango.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
      mango.gl.enableVertexAttribArray(mango.programAttributes.aVertexPosition);
      // Set lines to black
      mango.gl.uniform4fv(mango.programUniforms.uMaterialDiffuse, [0.0, 0.0, 0.0, 1.0])

      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, this.boundingBox.ibo);

      mango.gl.drawElements(mango.gl.LINES, this.boundingBox.indices.length, mango.gl.UNSIGNED_SHORT, 0);

      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);
    }


  }

}


// TAG.34 
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

// TAG.35
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

// TAG.31
class TResourceTexture extends TResource{
  constructor(name){
    super(name);
    this.tex = mango.gl.createTexture();
    this.image = new Image();
  }
  
  async bindTexture() {
    return new Promise(async resolve => {
      console.log('== loading TResourceTexture(' + this.name + ') ==');
      // console.info('loading image '+this.image.src);
      mango.gl.bindTexture(mango.gl.TEXTURE_2D, this.tex);
      mango.gl.pixelStorei(mango.gl.UNPACK_FLIP_Y_WEBGL, 1);
      mango.gl.texImage2D(mango.gl.TEXTURE_2D, 0, mango.gl.RGBA, mango.gl.RGBA, mango.gl.UNSIGNED_BYTE, this.image);
      mango.gl.texParameteri(mango.gl.TEXTURE_2D, mango.gl.TEXTURE_MIN_FILTER, mango.gl.LINEAR);
      mango.gl.bindTexture(mango.gl.TEXTURE_2D, null);
      resolve(true);
    });
  }
  
  // TAG.32
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

// TAG.37
class TResourceShader extends TResource {
  constructor(name) {
    super(name);
    this.shader = null;
  }

// TAG.38
  async loadFile(name) {
    this.shader = await load(name);
    return this;
  }

  getShader() {
    return this.shader;
  }
}


class TResourceMeshWithTexture extends TResource{

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

      //jsonMesh.meshes.forEach( (e, i) => {
        this.vertices = jsonMesh.meshes[0].vertices;
        this.triVertices = [].concat.apply([], jsonMesh.meshes[0].faces);
        this.textures = jsonMesh.meshes[0].texturecoords[0];
        this.normals = jsonMesh.meshes[0].normals;

      this.vertices.concat(jsonMesh.meshes[1].vertices);
      this.triVertices.concat([].concat.apply([], jsonMesh.meshes[1].faces));
      this.textures.concat(jsonMesh.meshes[1].texturecoords[0]);
      this.normals.concat(jsonMesh.meshes[1].normals);
      //});


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
      file == "marker.json" ||
      file == "card.json" ||
      file == "mesh_continents.json" ||
      file == "textureLand.json" ||
      file == "earth.json") {
      this.alias = file;

      this.vertices = jsonMesh.positions;
      this.triVertices = jsonMesh.indices;
      this.textures = jsonMesh.texcoords ? jsonMesh.texcoords.UVMap : null;
      this.normals = jsonMesh.normals;

    } else if(jsonMesh.indices!=undefined && jsonMesh.verts != undefined){
      this.vertices = jsonMesh.verts;
      this.triVertices = jsonMesh.indices;
      //this.normals = jsonMesh.normals;
      this.normals = calculateNormals(this.vertices, this.triVertices);

      //console.log("== kurilo.su loader ==");
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
    if(mango.gl && mango.textureProgram) {
      let vertexBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, vertexBufferObject);
      mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.vertices), mango.gl.STATIC_DRAW);

      let normalBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, normalBufferObject);
      mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.normals), mango.gl.STATIC_DRAW);

      let indexBufferObject = mango.gl.createBuffer();
      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
      mango.gl.bufferData(mango.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triVertices), mango.gl.STATIC_DRAW);

      this.vbo = vertexBufferObject;
      this.ibo = indexBufferObject;
      this.nbo = normalBufferObject;

      if (this.textures !== []) {
        let colorBufferObject = mango.gl.createBuffer();
        mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, colorBufferObject);
        mango.gl.bufferData(mango.gl.ARRAY_BUFFER, new Float32Array(this.textures), mango.gl.STATIC_DRAW);
        this.cbo = colorBufferObject;
      }

      mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);
      mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
    }

    return this;
  }

  draw(){
    // if(mango.gl && mango.program) {
    ///////////////////////////////////////////////////////////////////////////////////////////// ""MATERIALS"" (NOPE)
    let uMaterialDiffuse = mango.gl.getUniformLocation(mango.textureProgram, 'uMaterialDiffuse');
    let uMaterialAmbient = mango.gl.getUniformLocation(mango.textureProgram, 'uMaterialAmbient');
    let uUseTextures = mango.gl.getUniformLocation(mango.textureProgram, 'uUseTextures');
    /// CHAPUZA CHANGE COLORS
    if (this.name === '2_sea_SS.json') {
      mango.gl.uniform4fv(uMaterialDiffuse, [0.313, 0.678, 0.949, 1.0]);
      mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
      mango.gl.uniform1i(uUseTextures, 0);
    } else {
      if (this.tex && this.tex.tex) {
        mango.gl.uniform4fv(uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
        mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        mango.gl.activeTexture(mango.gl.TEXTURE0);
        mango.gl.bindTexture(mango.gl.TEXTURE_2D, this.tex.tex);
        mango.gl.uniform1i(mango.textureProgram.sampler, 0);
        mango.gl.uniform1i(uUseTextures, 1);

        let texCoordAttribLocation = mango.gl.getAttribLocation(mango.textureProgram, 'aVertexTextureCoords');
        mango.gl.enableVertexAttribArray(texCoordAttribLocation);
        mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.cbo);
        mango.gl.vertexAttribPointer(texCoordAttribLocation, 2, mango.gl.FLOAT, mango.gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
        mango.gl.enableVertexAttribArray(texCoordAttribLocation);
      } else {
        mango.gl.uniform4fv(uMaterialDiffuse, [0.258, 0.960, 0.6, 1.0]);
        mango.gl.uniform4fv(uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]);
        mango.gl.uniform1i(uUseTextures, 0);
      }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////// BIND BUFFERS
    let positionAttribLocation = mango.gl.getAttribLocation(mango.textureProgram, 'aVertexPosition');
    let normalAttribLocation = mango.gl.getAttribLocation(mango.textureProgram, 'aVertexNormal');
    mango.gl.enableVertexAttribArray(positionAttribLocation);
    mango.gl.enableVertexAttribArray(normalAttribLocation);


    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.vbo);
    mango.gl.vertexAttribPointer(positionAttribLocation, 3, mango.gl.FLOAT, mango.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    mango.gl.enableVertexAttribArray(positionAttribLocation);


    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, this.nbo);
    mango.gl.vertexAttribPointer(normalAttribLocation, 3, mango.gl.FLOAT, mango.gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    mango.gl.enableVertexAttribArray(normalAttribLocation);


    ///////////////////////////////////////////////////////////////////////////////// POSITION & ROTATION STUFF
    var worldMatrix = TEntity.Model;
    var rotation = glMatrix.mat4.create();
    //glMatrix.mat4.rotate(rotation, worldMatrix, angle, [0, 1, 0]);


    let matWorldUniformLocation = mango.gl.getUniformLocation(mango.textureProgram, 'uMVMatrix');
    let normal = mango.gl.getUniformLocation(mango.textureProgram, 'uNMatrix');


    // MVMatrix = model * view
    let viewModel = [];
    glMatrix.mat4.multiply(viewModel, mango.viewMatrix, mango.modelMatrix);
    mango.gl.uniformMatrix4fv(matWorldUniformLocation, false, viewModel);

    // uPMatrix * uMVMatrix (on shader)

    // NMatrix
    let normalMatrix = glMatrix.mat4.create();
    glMatrix.mat4.invert(normalMatrix, viewModel);
    glMatrix.mat4.transpose(normalMatrix, normalMatrix);
    mango.gl.uniformMatrix4fv(normal, false, normalMatrix);

    ///////////////////////////////////////////////////////////////////////////////// DRAW
    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    mango.gl.drawElements(mango.gl.TRIANGLES, this.nTris, mango.gl.UNSIGNED_SHORT, 0);
    ///////////////////////////////////////////////////////////////////////////////// CLEAR ALL BUFFERS
    mango.gl.bindBuffer(mango.gl.ARRAY_BUFFER, null);
    mango.gl.bindBuffer(mango.gl.ELEMENT_ARRAY_BUFFER, null);
  }
  // }
}


async function loadJSON(filename){

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
    TResourceMeshArrayAnimation,
    TResourceMeshArrayDynamic
}
