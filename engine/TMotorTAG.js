
class TMotorTAG{

    constructor(resourceManager) {
        this.scene = new TNode();
        
        this.allLights = [];
        this.activeLights = [];

        this.allCameras = [];
        this.activeCamera = -1;

        this.resourceManager = resourceManager;
    }

    createRootNode(){
        TMotorTAG.rootNode = new TNode(null,'root');
        return TMotorTAG.rootNode;
    }

    createNode(father, entity){
        var node = new TNode(father, entity);
        father.addChild(node);
        return node;
    }

    createTransform(){

    }

    createCamera( father, isPerspective, near, far, right, left, top, bottom ){

        // node rotation
        let TransfRotaCam = new TTransform();
        let nodeRotation = createNode(father, TransfRotaCam );

        // node traslation
        let TransfTransCam = new TTransform();
        let nodeTranslation = createNode(nodeRotation, TransfTransCam );
          
        // isPerspective, near, far, right, left, top, bottom
        let cam = new TCamera(isPerspective, near, far, right, left, top, bottom);
        createNode(nodeTranslation, cam);

        this.allCameras.push(cam);

        return cam;
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

    lookAt( TNodeCam ) {
        // to do
    }

    createLight(father, typ, intensity, specular, direction, s){

        // node rotation
        let TransfRotaLight = new TTransform();
        let nodeRotation = createNode(father, TransfRotaLight );

        // node traslation
        let TransfTransLight = new TTransform();
        let nodeTranslation = createNode(nodeRotation, TransfTransLight );
          
        // typ, intensity, specular, direction, s
        let light = new TLight(typ, intensity, specular, direction, s);
        createNode(nodeTranslation, light);

        this.allLights.push(light);

        return light;
    }

    async loadMesh(father, file){

        //Crear la malla a partir del recurso malla y devolverla
        let meshResource = await this.resourceManager.getResource(file); // WARNING: CORREGIR GETRESOURCE(FILE)
        let mesh = new TMesh(meshResource);
        return createNode(father, mesh);
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

}

// Static attributes of TMotorTag
TMotorTAG.rootNode = null;









