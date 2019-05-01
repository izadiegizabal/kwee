
import {TCamera, TLight, TTransform} from './TEntity';
import {TEntity, getEntity, setEntity} from './commons.js';

class TNode {
    // WARNING: TE FATHER IS REQUIRED
    constructor(father, entity, children) {
        this.entity = this.setEntity(entity);
        this.father = father;
        this.children = [];
        if (children) {
            children.forEach((e) => {
                this.children.push(e);
            });
        }
    }

    addChild(child) {
        this.children.push(child);
    }

    remChild(child) {
        let entity = getEntity();
        this.children.splice(this.children.indexOf(child), 1);
        // WARNING: remove from the Lights and Cameras arrays
        if (this.entity instanceof TLight) {
            entity.Lights.splice(entity.Lights.indexOf(child), 1);
        }
        if (this.entity instanceof TCamera) {
            entity.Views.splice(entity.Views.indexOf(child), 1);
        }
        setEntity(entity);
    }

    setEntity(_entity) {
        let entity = getEntity();
        this.entity = _entity;
        
        // WARNING: add to the Lights and Cameras arrays
        if (this.entity instanceof TLight) {
            entity.Lights.push(this);
        }
        if (this.entity instanceof TCamera) {
            entity.Views.push(this);
        }
        setEntity(entity);
        return this.entity;
    }

    getEntity() {
        return this.entity;
    }

    getfather() {
        return this.father;
    }

    draw() {
      if (this.entity && this.entity != null) {
          this.entity.beginDraw();
      }
      if (this.children && this.children.length > 0) {
          this.children.forEach((e) => {
              e.draw();
          });
      }
      if (this.entity && this.entity != null) {
          this.entity.endDraw();
      }
    }

}

// WARNING: MONTER function we will not probably use // DO NOT REMOVE
function deepClone(obj) {

    if (obj === null || typeof obj !== "object")
        return obj
    var props = Object.getOwnPropertyDescriptors(obj);
    for (var prop in props) {
        props[prop].value = deepClone(props[prop].value)
    }

    return Object.create(
        Object.getPrototypeOf(obj),
        props
    )
}

// WARNING: MEH function we will not probably use // DO NOT REMOVE
function copyClone(obj) {
    return Object.assign(Object.create(obj.prototype), obj);
}

// WARNING: we will need it if we need to copy simple objects // DO NOT REMOVE
function copy(obj) {
    return Object.assign({}, obj);
}

// WARNING: Go over the tree and get all the lights and cameras // DO NOT REMOVE
function getLigthsViews(obj) {
  if (obj.entity instanceof TLight) {
    TEntity.Lights.push(obj);
  }
  if (obj.entity instanceof TCamera) {
    TEntity.Views.push(obj);
  }
  obj.children.forEach((e) => {
    getLigthsViews(e);
  });
}

// calculate all the light matices from the Lighs static array and drop them into the AuxLights array
function calculateLights() {
  let aux = glMatrix.mat4.create();
  console.log("TNode allLights:");
  console.log( TEntity.Lights);
  TEntity.Lights.forEach((e) => {
    goToRoot(e);
    for (let i = TEntity.Aux.length - 1; i >= 0; i--) {
      glMatrix.mat4.mul(aux, aux, TEntity.Aux[i])
    }
    TEntity.AuxLights.push(aux);
    TEntity.Aux = [];
  });
}

// same as calculateLights but for the Cameras
function calculateViews() {
  let aux = glMatrix.mat4.create();
  console.log("TNode allCameras:");
  console.log(TEntity.Views);
  TEntity.Views.forEach((e) => {
    goToRoot(e);
    for (let i = TEntity.Aux.length - 1; i >= 0; i--) {
      glMatrix.mat4.mul(aux,  aux, TEntity.Aux[i])
      glMatrix.mat4.invert(aux, aux);
    }
    TEntity.AuxViews.push(aux);
    TEntity.Aux = [];
  });
}

// go from the leaf to the root
function goToRoot(obj) {
  if (obj.entity instanceof TTransform) {
      console.log("pusheo mat TNode");
    TEntity.Aux.push(obj.entity.matrix);
  }
  if (obj.father) {
    goToRoot(obj.father);
  }
}

export {
    TNode,
    calculateViews,
    calculateLights,
    goToRoot,
    getLigthsViews
}
