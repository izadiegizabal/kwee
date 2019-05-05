
import {TNode} from './TNode.js';
import {TTransform, TCamera, TLight, TAnimation, TMesh, TArc, TFocus} from './TEntity.js';
import {TResourceManager, TResourceMesh, TResourceMaterial, TResourceTexture, TResourceShader} from './resourceManager.js';
import { global } from './commons.js';

class TMotorTAG{

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
    }

    createRootNode(){
        if(this.scene==null){
            TMotorTAG.scene = new TNode(null,null,null);
        }
        return TMotorTAG.scene;
    }

    // scale -> rotation -> translation -> node
    createFullBranch(father, entity){

      // node scale
      let TransScale = new TTransform();
      let nodeScale = this.createNode(father, TransScale );

      return this.createBranch(nodeScale, entity);
    }
    // rotation -> translation -> node
    createBranch(father, entity){
      // node rotation
      let TransRotation = new TTransform();
      let nodeRotation = this.createNode(father, TransRotation );

      // node translation
      let TransTrans = new TTransform();
      let nodeTranslation= this.createNode(nodeRotation, TransTrans );

      let node = this.createNode(nodeTranslation, entity );

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
        node.father.entity.translate(units);
    }

    scale( node, units ) {
        node.father.father.father.entity.scale(units);
    }

    cameraLookAt( node, cameraPosition, target = [0,0,0], up = [0,1,0]) {
      glMatrix.mat4.lookAt(
        node.father.entity.matrix,
        cameraPosition,
        target,
        up
      )
    }

    async lookAt(TNodeCam, eye, center, up) {
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

    createLight(father, typ, intensity, specular, diffuse, direction, coef){

        // typ, intensity, specular, direction, s
        // typ, intensity /* = ambient */, specular, diffuse, direction, coef
        let light = new TLight(typ, intensity, specular, diffuse, direction, coef);
        let NLight = this.createBranch(father, light);

        this.allLights.push(NLight);

        return NLight;
    }

    createFocus(father, size, position){
      
      let focus = new TFocus(size, position);
      
      let NFocus = this.createBranch(father, focus);

      this.allFocuses.push(NFocus);

      return NFocus;
    }

    // updateParticles(time){
    //   for(let i=0;i<this.allFocuses.length;i++){
    //     this.allFocuses[i].entity.updateParticle(time);
    //   }
    // }

    createArc(father, startLat, startLon, endLat, endLon, quality){
        let arc = new TArc(startLat, startLon, endLat, endLon, quality);
        let NArc = this.createBranch(father, arc);
        return NArc;
    }

    // returns TNodeMesh
    async loadMesh(father, file){

        //Crear la malla a partir del recurso malla y devolverla
        let meshResource = await this.resourceManager.getResource(file); 

        let mesh = new TMesh(meshResource);

        let NMesh = this.createFullBranch(father, mesh);
        
        return NMesh;
    }


    draw(){
      // Clear
      global.gl.useProgram(global.program);
      global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
      global.gl.enable(global.gl.DEPTH_TEST);
      global.gl.enable(global.gl.CULL_FACE);
      global.gl.frontFace(global.gl.CCW);
      global.gl.cullFace(global.gl.BACK);
      // global.gl.enable(global.gl.BLEND);
      // global.gl.blendFunc(global.gl.SRC_ALPHA, global.gl.ONE_MINUS_SRC_ALPHA);

      
      // We can set the PMatrix once here (it will be the same for every Entity)
      // -- MVMatrix and NMatrix will change over the rest of Entities

      // Projection Matrix
      global.gl.uniformMatrix4fv(global.programUniforms.uPMatrix, false, global.projectionMatrix);

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
        

        this.allLights.forEach((e) => {
            this.goToRoot(e);
            
            for (let i = this.aux.length - 1; i >= 0; i--) {
                glMatrix.mat4.mul(lights, lights, this.aux[i])
            }
            this.allLights.push(lights);

            this.aux = [];
        });

    }
    
    // same as calculateLights but for the Cameras
    async calculateViews() {
        
        let cameras = await glMatrix.mat4.create();
       
        this.allCameras.forEach((e) => {
          this.goToRoot(e);
          if(this.aux.length!=0)
          {
            for (let i = this.aux.length - 1; i >= 0; i--) {
                glMatrix.mat4.mul(cameras, cameras, this.aux[i])
                //glMatrix.mat4.invert(cameras, cameras);
            }
          }

          this.positionCameras.push(cameras.slice(0));
          
          // Set viewMatrix to active camera
          // (this will be the first matrix to be multiplied to the objects position)
          //global.auxMatrix = cameras;

          this.aux = [];
        });
        
        // Inverse of cameras matrix = MVMatrix
        // ----- not needed (?) -----------
        // glMatrix.mat4.invert(cameras, cameras);

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









