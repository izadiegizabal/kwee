
import {TNode} from './TNode.js';
import {TTransform, TCamera, TLight, TAnimation, TMesh} from './TEntity.js';
import {TResourceManager, TResourceMesh, TResourceMaterial, TResourceTexture, TResourceShader} from './resourceManager.js';

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

        this.resourceManager = resourceManager;
    }

    createRootNode(){
        if(this.scene==null){
            TMotorTAG.scene = new TNode(null,null,null);
        }
        return TMotorTAG.scene;
    }

    createNode(father, entity){
        var node = new TNode(father, entity);
        father.addChild(node);
        return node;
    }

    createCamera( father, isPerspective, near, far, right, left, top, bottom ){

        // node rotation
        let TransfRotaCam = new TTransform();
        let nodeRotation = this.createNode(father, TransfRotaCam );

        // node traslation
        let TransfTransCam = new TTransform();
        let nodeTranslation = this.createNode(nodeRotation, TransfTransCam );

        // isPerspective, near, far, right, left, top, bottom
        let cam = new TCamera(isPerspective, near, far, right, left, top, bottom);
        let NCam = this.createNode(nodeTranslation, cam);

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

    lookAt(TNodeCam, eye, center, up) {
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
        if (Math.abs(eyex - centerx) < glMatrix.glMatrix.EPSILON &&
            Math.abs(eyey - centery) < glMatrix.glMatrix.EPSILON &&
            Math.abs(eyez - centerz) < glMatrix.glMatrix.EPSILON) {
          return identity(out);
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
  

        var out = glMatrix.mat4.create();
        out = glMatrix.mat4.set(out, x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez), 1);   
  
        out = glMatrix.mat4.invert(out, out);
  
        TNodeCam.father.entity.setTranslation([out[12], out[13], out[14]]);
        TNodeCam.father.father.entity.setRotation([out[0], out[1], out[2], out[4], out[5], out[6], out[8], out[9], out[10]]);
  
  
  
        /*var matrix = glMatrix.mat4.create();
        matrix = glMatrix.mat4.multiply(matrix, TNodeCam.father.entity.matrix, TNodeCam.father.father.entity.matrix)
        var matrix2 = glMatrix.mat4.create();
        matrix2 = glMatrix.mat4.lookAt(matrix2, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
        console.log(matrix);
        console.log(matrix2);
        console.log(glMatrix.mat4.equals(matrix, matrix2));*/
      }

    createLight(father, typ, intensity, specular, direction, s){

        // node rotation
        let TransfRotaLight = new TTransform();
        let nodeRotation = this.createNode(father, TransfRotaLight );

        // node traslation
        let TransfTransLight = new TTransform();
        let nodeTranslation = this.createNode(nodeRotation, TransfTransLight );
          
        // typ, intensity, specular, direction, s
        let light = new TLight(typ, intensity, specular, direction, s);
        let NLight = this.createNode(nodeTranslation, light);

        this.allLights.push(NLight);

        return NLight;
    }

    // returns TNodeMesh
    async loadMesh(father, file){

        //Crear la malla a partir del recurso malla y devolverla
        let meshResource = await this.resourceManager.getResource(file); 

        let mesh = new TMesh(meshResource);
        return this.createNode(father, mesh);
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


    // calculate all the light matices from the Lighs static array and drop them into the AuxLights array
    calculateLights() {
        let aux = glMatrix.mat4.create();
        
        this.allLights.forEach((e) => {
            this.goToRoot(e);
            
            for (let i = this.aux.length - 1; i >= 0; i--) {
                glMatrix.mat4.mul(aux, aux, this.aux[i])
            }
            this.allLights.push(aux);

            this.aux = [];
        });
    }
    
    // same as calculateLights but for the Cameras
    calculateViews() {
        let aux = glMatrix.mat4.create();
        
        this.allCameras.forEach((e) => {
        this.goToRoot(e);
        for (let i = this.aux.length - 1; i >= 0; i--) {
            glMatrix.mat4.mul(aux,  aux, this.aux[i])
            glMatrix.mat4.invert(aux, aux);
        }
        this.positionCameras.push(aux);

        this.aux = [];
        });
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









