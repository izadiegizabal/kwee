
import {TNode} from './TNode.js';
import {TTransform, TCamera, TLight, TAnimation, TMesh, TArc, TFocus, TRotationAnimation, TArcAndMeshAnimation, TMaterial} from './TEntity.js';
import {TResourceManager, TResourceMesh, TResourceMaterial, TResourceTexture, TResourceShader, TResourceMeshArray, TResourceMeshArrayDynamic} from './resourceManager.js';
import {convertLatLonToVec3offsetY, convertLatLonToVec3RandomOffset} from './tools/utils';
import { global, ease } from './commons.js';

class TMotorTAG{

// TAG.39
    constructor(resourceManager) {
        this.scene = this.createRootNode();
        
        this.allLights = [];
        this.activeLights = [];
        this.positionLights = [];

        this.allCameras = [];
        this.activeCamera = -1;
        this.positionCameras = [];

        this.aux = [];

        this.MVMatrix = null;

        this.allFocuses = []

        this.resourceManager = resourceManager;

        this.allCountAnimations = [];

        this.allCamAnimations = [];
    }

    createRootNode(){
        if(this.scene==null){
            TMotorTAG.scene = new TNode(null,null,null);
        }
        return TMotorTAG.scene;
    }

// TAG.42
    // SCENE -> trasla - rota - escala - hoja
    createBranch(father, entity){

      // node translation
      let TransTrans = new TTransform();
      let nodeTranslation= this.createNode(father, TransTrans );

      // + node rotation
      let TransRotation = new TTransform();
      let nodeRotation = this.createNode(nodeTranslation, TransRotation );

      // + + node scale
      let TransScale = new TTransform();
      let nodeScale = this.createNode(nodeRotation, TransScale );

      let node = this.createNode(nodeScale, entity );

      return node;
    }

    setChildren(node, children) {
      node.addChild(children.father.father.father);
    }

    createNode(father, entity){
        var node = new TNode(father, entity);
        father.addChild(node);
        return node;
    }


// TAG.40
    createCamera( father, isPerspective, near, far, right, left, top, bottom ){

        // isPerspective, near, far, right, left, top, bottom
        let cam = new TCamera(isPerspective, near, far, right, left, top, bottom);
        let NCam = this.createBranch(father, cam);

        this.allCameras.push(NCam);

        return NCam;
    }

    deleteCamera( TNodeCam ) {
        let array = TMotorTAG.allCameras;
        TNodeCam.father.father.father.remChild(TNodeCam.father.father);
        array.splice(array.indexOf(TNodeCam),1);
    }
    /**
     * 
     * @param {*} Node to rotate
     * @param {*} angle Angle to rotate
     * @param {*} axis Axis to rotate. If different for values 'x', 'y' or 'z', will use that axis
     */
    rotate( node, angle, axis ) {
        switch (axis) {
            case 'x':
                node.father.father.entity.rotateX(angle);
                break;
            case 'y':
                node.father.father.entity.rotateY(angle);
                break;
            case 'z':
                node.father.father.entity.rotateZ(angle);
                break;
            default:
                node.father.father.entity.rotate(angle, axis);
                break;
        }
    }

    // angle in degrees!
    setRotation( node, angle, axis ) {
      node.father.father.entity.identity();
      switch (axis) {
        case 'x':
          node.father.father.entity.rotateX(angle);
          break;
        case 'y':
          node.father.father.entity.rotateY(angle);
          break;
        case 'z':
          node.father.father.entity.rotateZ(angle);
          break;
        default:
          node.father.father.entity.rotate(angle, axis);
          break;
      }
    }

    translate( node, units ) {
      // Transl - Rota - Scale - MESH
        // go to translate node
        node.father.father.father.entity.translate(units);
    }

    scale( node, units ) {
        node.father.entity.scale(units);
    }

    targetTo( node, position, target = [0,0,0], up = [0,0,0]){
      let matrix = glMatrix.mat4.create();
      glMatrix.mat4.targetTo( matrix, position, target, up);
      
      // TraslationNode - RotationNode - ScaleNode - NODE
      node.father.father.entity.setRotation([matrix[0], matrix[1], matrix[2], matrix[4], matrix[5], matrix[6], matrix[8], matrix[9], matrix[10]])
      node.father.father.father.entity.setTranslation([matrix[12], matrix[13], matrix[14]])  
    }

    cameraLookAt( node, cameraPosition, target = [0,0,0], up = [0,1,0]) {
      global.viewPos = cameraPosition;
      let matOutput = glMatrix.mat4.create();
      glMatrix.mat4.lookAt(
        matOutput,
        cameraPosition,
        target,
        up
      );
      // TraslationNode - RotationNode - ScaleNode - NODE
      node.father.father.entity.setRotation([matOutput[0], matOutput[1], matOutput[2], matOutput[4], matOutput[5], matOutput[6], matOutput[8], matOutput[9], matOutput[10]])
      node.father.father.father.entity.setTranslation([matOutput[12], matOutput[13], matOutput[14]])
    }

    async lookAt(TNodeCam, eye, center, up) {
        global.viewPos = eye;
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let eyex = eye[0];
        let eyey = eye[1];
        let eyez = eye[2];
        let upx = up[0];
        let upy = up[1];
        let upz = up[2];
        let centerx = center[0];
        let centery = center[1];
        let centerz = center[2];
        var out = await glMatrix.mat4.create();
        
        if (Math.abs(eyex - centerx) < glMatrix.glMatrix.EPSILON &&
            Math.abs(eyey - centery) < glMatrix.glMatrix.EPSILON &&
            Math.abs(eyez - centerz) < glMatrix.glMatrix.EPSILON) {
          return glMatrix.mat4.identity(out);
        }
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
        } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
        } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
        }
  
        var coso = [x0, y0, z0, 0 , x1, y1, z1, 0 , x2, y2, z2, 0,  -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez), 1];
  

        out = await glMatrix.mat4.set(out, x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez), 1);   
  
        out = await glMatrix.mat4.invert(out, out);
  
        TNodeCam.father.entity.setTranslation([out[12], out[13], out[14]]);
        TNodeCam.father.father.entity.setRotation([out[0], out[1], out[2], out[4], out[5], out[6], out[8], out[9], out[10]]);

      }


// TAG.41
    createLight(father, typ, intensity, specular, diffuse, direction, coef){

        // typ, intensity, specular, direction, s
        // typ, intensity /* = ambient */, specular, diffuse, direction, coef
        let light = new TLight(typ, intensity, specular, diffuse, direction, coef);
        let NLight = this.createBranch(father, light);

        this.allLights.push(NLight);

        return NLight;
    }

    createFocus(father, size, type, position, target = undefined, life = 3, color){
      let velocity = null;
      let extra = null;

      // Rotation for last matrix operations
      let rotation = null;

      // Vectors to calc rotation angles (if dispersed)
      let vecA = null;
      let vecB = null;

      // target calcs
      switch(target){
        case 'y':
        case 'undefined':{
          target = [position[0], position[1]+0.01, position[2]];
          break;
        }
        case 'normal':{
          // Set the normal for the calculated vector (a point on the same vector-director (line))
          target = [position[0]*2, position[1]*2, position[2]*2];
          break;
        }
        default: {
          // Particles looking to
          target = target;
          break;
        }
      }
      // type calcs
      switch(type){
        case 'dispersion':{
          // Opcion 1:
          // velocity = [ 0.75, 0.75, 0.75 ];
          // extra    = [  1,1,1  ];

          // // Opcion 2:
          // velocity = [ 0.25, 0.25, 0.25 ];
          // extra    = [ 0,0,0 ];

          // vec Y:
          // vecA = glMatrix.vec3.fromValues( 1,1,1 );
          // // vecA = glMatrix.vec3.fromValues( position[0], 5, position[2] );
          // //vecA = glMatrix.vec3.fromValues( 0,5,0 );
          // vecB = glMatrix.vec3.fromValues( target[0] - position[0], target[1] - position[1], target[2] - position[2]);

          // console.log(vecB);
          // rotation = axisAnglesBetweenVecs(vecA, vecB);
          velocity = [ 0.6, 0.6, 0.6 ];
          extra    = [ -0.2, -0.2, -0.2];
          life = 1;

          break;
        }
        case 'straight':{
          // velocity = [ -0.2, -0.2, -0.2 ];
          velocity = [ -.20, -.20, -.20 ];
          extra = [0,0,0];
          life = 1;

          let out = [];
          glMatrix.mat4.targetTo(out, position, target, [0,0,0]);

          position = [out[12], out[13], out[14]];
          rotation = [
            out[0], out[1], out[2],
            out[4], out[5], out[6],
            out[8], out[9], out[10] ];

          break;
        }
        case 'fireworks':{
          velocity = [ 0.9, 0.9, 0.9 ];
          extra    = [ -0.3, -0.3, -0.3];
          life = 1.8;
        }
        case 'little':{
          velocity = [ 0.3, 0.3, 0.3 ];
          extra    = [ -0.1, -0.1, -0.1];
          life = 0.8;
        }
      }


      let focus = new TFocus(size, type, position, target, velocity, extra, life, color);

      let NFocus = this.createBranch(father, focus);

      this.allFocuses.push(NFocus);

      if(type == 'straight' && target != undefined){
        // Rotate Focus entity once created to match targetTo target
        NFocus.father.father.entity.setRotation(rotation);

      }
      else if( type == 'dispersion' && target != undefined){
        // Opcion 1:
        // this.rotate(NFocus, -45, 'x');
        // rotation[2] ? this.rotate(NFocus, rotation[2], 'z') : 0;

        // testing
        // this.rotate(NFocus, -45, 'x');
        // // Rotate Focus entity to disperse and match vector direction
        // //rotation[0] ? this.rotate(NFocus, rotation[0], 'x') : 0;
        // rotation[1] ? this.rotate(NFocus, rotation[1], 'y') : 0;
        // rotation[2] ? this.rotate(NFocus, rotation[2], 'z') : 0;

      }
      NFocus.father.father.father.entity.setTranslation(position);

      return NFocus;
    }

    deleteFocus( focusNode){
      let array = this.allFocuses;
      focusNode.father.father.father.remChild(focusNode.father.father);
      array.splice(array.indexOf(focusNode),1);
    }


    deleteFullBranch() {

    }

    deleteArc(node){
      let index = -1;
      this.allCountAnimations.forEach( (e, i) => {
        if(e.object === node.entity){
          index = i;
        }
      });
      if (index > -1) {
        this.allCountAnimations.splice(index, 1);
      }
      node.father.father.father.father.remChild(node.father.father.father);
    }

    isArcAnimation(anim){
      return (anim.object.entity instanceof TArc);
    }

    createArc(father, startLat, startLon, endLat, endLon, quality){
        let arc = new TArc(startLat, startLon, endLat, endLon, quality);
        let NArc = this.createBranch(father, arc);
        return NArc;
    }

    createAndAnimateArc(father, startLat, startLon, endLat, endLon, quality, timeAnim, endAnim){
      let arc = new TArc(startLat, startLon, endLat, endLon, quality);
      let NArc = this.createBranch(father, arc);
      let anim = new TArcAndMeshAnimation(NArc, quality, timeAnim, endAnim);
      this.allCountAnimations.push(anim);
      return NArc;
    }

    animate(node, quality, timeAnim, endAnim){
      let anim = new TArcAndMeshAnimation(node, quality, timeAnim, endAnim);
      this.allCountAnimations.push(anim);
      return anim;
    }

    animateArc(node, quality, timeAnim, endAnim){
      return this.animate(node, quality, timeAnim, endAnim);
    }

    animateMesh(node, quality, timeAnim, endAnim){
      return this.animate(node, quality, timeAnim, endAnim);
    }

    animateCam(node, timeAnim, startLat, startLon, endLat, endLon, initPos, endPos){
      let anim = new TRotationAnimation(node, timeAnim, startLat, startLon, endLat, endLon, initPos, endPos);
      this.allCamAnimations.push(anim);
      return anim;
    }

    rotateCamTo(endLat, endLon, timeAnim = 1){
      this.animateCam(this.activeCamera, timeAnim, null, null, endLat, endLon, global.viewPos, null);
    }

    rotateCamToWithYOffset(endLat, endLon, timeAnim = 1, offsetY = - 20){
      let endPos = convertLatLonToVec3offsetY(endLat, endLon, offsetY);
      this.animateCam(this.activeCamera, timeAnim, null, null, null, null, global.viewPos, endPos);
    }

    rotateCamToRandomXYOffset(endLat, endLon, timeAnim = 1, widthScene){
      let endPos = convertLatLonToVec3RandomOffset(endLat, endLon, widthScene);
      this.animateCam(this.activeCamera, timeAnim, null, null, null, null, global.viewPos, endPos.coord);
      global.targetPoint = endPos.coordWithoutRotation;
      // console.log(endPos);
      return endPos.random;
    }

    async loadMeshOnly(file){
      let meshResource = await this.resourceManager.getResource(file);

      return new TMesh(meshResource);
    }


  // for 2 meshes (lazy load content) = LANDING ----------
  async dynamicMeshArrayLazyLoading(father, files, color){
    let count = 0;
    let meshArray = [];
    let manager = this.resourceManager;

    let meshes = new TResourceMeshArrayDynamic(meshArray, color);


    for(let i = 0; i<files.length; i++){
      if(i == 0){
        // First load low poly model
        await manager.getResource(files[i])
          .then(completed => {
            meshes.addMesh(completed);
            meshes.setCount(i);
            console.log(files[i] + " lowpo loaded ");
          })
      }
      else{
        //setTimeout(() => {
        // Then load high poly model
        manager.getResource(files[i])
          .then( completed => {
            meshes.addMesh(completed);
            meshes.setCount(i);
            console.log(files[i] + " highpo loaded");
            global.status = 1;
          })

        // }, 4000);

        // todo -> everything loaded: scroll -> change models LOD

      }
    }

    let branch = await this.createBranch(father, meshes);

    return branch
  }

  // for 3 meshes (NO UTILIZAMOS)
  async dynamicMeshArray(father, files, material, tiers){
    let count = 0;
    let meshArray = [];
    let manager = this.resourceManager;

    if(files.length-1 != tiers.length){
      console.log("Tiers don't match mesh array length");
      return null;
    }

    // tiers: lowpo < medpo < highpo
    let meshes = new TResourceMeshArray(meshArray, material, tiers);

    //meshes.setMaterial(color)

    for(let i = 0; i<files.length; i++){
      if(i == 0){
        // First load low poly model
        await manager.getResource(files[i])
          .then(completed => {
            meshes.addMesh(completed);
            meshes.setCount(0);
          })
      }
      else{
        //setTimeout(() => {
        // Then load high poly model
        manager.getResource(files[i])
          .then( completed => {

            meshes.addMesh(completed);
            if(i == (files.length-1)){
              //global.status = 1;
              meshes.setCount(1);
            }
          })

        // }, 4000);

        // todo -> everything loaded: scroll -> change models LOD

      }
    }

    let branch = await this.createBranch(father, meshes);

    return branch
  }

  createMaterial(diffuse, specular, shiny){
    let material = new TMaterial(diffuse, specular, shiny);
    return material;
  }


  async loadMeshArrayAnimation(father, files){

      let meshesArray = [];

      await this.asyncForEach(files, async (e) => {
        meshesArray.push(await this.resourceManager.getResource(e));
      });

      let meshes = new TResourceMeshArray(meshesArray);

      return this.createBranch(father, meshes);
    }


// TAG.69.1
    // load all meshes -a saco todas de golpe- = LOD DEMO ---------------
  async loadMeshArray(father, files, material, tiers){

    let meshesArray = [];

    let meshes = new TResourceMeshArray(meshesArray, material, tiers);

    await this.asyncForEach(files, async (e) => {
      meshes.addMesh( await this.resourceManager.getResource(e));
    });


    meshes.setMaterial(material);

    meshes.setCount(2);

    let branch = this.createBranch(father, meshes);

    global.status = 1;

    return branch;
  }


  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


// TAG.43 (animaciones? (flaviu)
  // load ONLY 1 MESH
  async loadMesh(father, file){

      //Crear la malla a partir del recurso malla y devolverla
      let meshResource = await this.resourceManager.getResource(file); 

      let mesh = new TMesh(meshResource);

      let NMesh = this.createBranch(father, mesh);
      
      return NMesh;
  }

  enableBoundingBox( meshResource ) {
    meshResource.entity.mesh.enableBB(true);
  }

  easeCamera(){
    ease({
      startValue: 7,
      endValue: 1.7,
      durationMs: 5000,
      onStep: x => global.zoom = x,
      onComplete: () => {
        global.status = 1;
      }
    })
  }

  init(){
    // Clear
    global.gl.useProgram(global.program);
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
    global.gl.enable(global.gl.DEPTH_TEST);
    global.gl.enable(global.gl.CULL_FACE);
    //global.gl.frontFace(global.gl.CCW);
// TAG.54
    global.gl.cullFace(global.gl.BACK);

    this.initProgram();

    this.initParticles();

    // Avoid error unit 0
    const whiteTexture = global.gl.createTexture();
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);
    global.gl.texImage2D(
    global.gl.TEXTURE_2D, 0, global.gl.RGBA, 1, 1, 0,
    global.gl.RGBA, global.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    global.gl.useProgram(global.program);
    global.gl.bindTexture(global.gl.TEXTURE_2D, whiteTexture);


  }

  initProgram(){
    global.gl.useProgram(global.program);

    // Projection Matrix
    global.gl.uniformMatrix4fv(global.programUniforms.uPMatrix, false, global.projectionMatrix);

    

  }

  initParticles(){
    global.gl.useProgram(global.particlesProgram);

    // Projection Matrix
    global.gl.uniformMatrix4fv(global.particlesUniforms.uPMatrix, false, global.projectionMatrix);    //Maps the Perspective matrix to the uniform prg.uPMatrix

    // uPointSize = size of each particle
    global.gl.uniform1f(global.particlesUniforms.uPointSize, 23.0);

    global.gl.useProgram(global.program);
  }

    draw(){
      // Clear
      global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
      
      // We can set the PMatrix once here (it will be the same for every Entity)
      // -- MVMatrix and NMatrix will change over the rest of Entities

      this.scene.draw();
    }

    /*Métodos para el registro y manejo de las cámaras Métodos para el registro 
    y manejo de las luces Métodos para el registro y manejo de los viewports*/


    // calculate all the light matices from the Lighs static array and drop them into the AuxLights array
    calculateLights() {

        let lights = glMatrix.mat4.create();


        // todo & to fix:
        global.gl.uniform4f(global.programUniforms.uLightAmbient,     ...this.allLights[0].entity.getIntensity());
        global.gl.uniform3f(global.programUniforms.uLightDirection,   ...this.allLights[0].entity.getDirection());
        global.gl.uniform4f(global.programUniforms.uLightDiffuse,     ...this.allLights[0].entity.getDiffuse());	
        global.gl.uniform4f(global.programUniforms.uLightSpecular,    ...this.allLights[0].entity.getSpecular());	
        

        // this.allLights.forEach((e) => {
        //     this.goToRoot(e);
            
        //     for (let i = this.aux.length - 1; i >= 0; i--) {
        //         glMatrix.mat4.mul(lights, lights, this.aux[i])
        //     }
        //     this.allLights.push(lights);

        //     this.aux = [];
        // });

    }

    enableCam( cam ){
      this.activeCamera = cam;
    }

    // same as calculateLights but for the Cameras
    async calculateViews() {
        
        let cameras = await glMatrix.mat4.create();
       
        this.goToRoot(this.activeCamera);

        glMatrix.mat4.mul(cameras, cameras, this.aux[2])
        glMatrix.mat4.mul(cameras, cameras, this.aux[1])
        glMatrix.mat4.mul(cameras, cameras, this.aux[0]);

        this.aux = [];

        global.viewMatrix = cameras;

    }
    
    // go from the leaf to the root
    goToRoot(obj) {
        if (obj.entity instanceof TTransform) {
            this.aux.push(obj.entity.matrix);
        }
        if (obj.father) {
            this.goToRoot(obj.father);
        }
    }
}

// Static attributes of TMotorTag
TMotorTAG.scene = null;

export {
    TMotorTAG
}









