import { getUniqueStr } from '../utils';
import Matrix4 from './Matrix4';

class Object3D {
  _id = getUniqueStr();
  get id() {
    return this._id;
  }

  _type = 'Object3D';
  get type() {
    return this._type;
  }

  _position = [0.0, 0.0, 0.0];
  get position() {
    return this._position;
  }

  _up = [0, 1, 0]
  get up() {
    return this._up;
  }

  _rotation = [0, 0, 0];
  get rotation() {
    return this._rotation;
  }

  _parent = null;
  get parent() {
    return this._parent;
  }
  set parent(obj) {
    this._parent = obj;
  }

  _children = [];
  get children() {
    return this._children;
  }

  _matrix = new Matrix4();
  get matrix() {
    return this._matrix;
  }

  _matrixWorld = new Matrix4();
  get matrixWorld() {
    return this._matrixWorld;
  }

  add(obj) {
    this._children.push(obj);
    obj.parent = this;
  }

  updateMatrix() {
    // 初期化
    this._matrix.identity();
    // 三軸分
    this._matrix.rotate(this.rotation[0], [0, 1, 0]);
    this._matrix.rotate(this.rotation[1], [1, 0, 0]);
    this._matrix.rotate(this.rotation[2], [0, 0, 1]);
    // モデル座標変換行列
    this._matrix.translate([this.position[0], this.position[1], this.position[2]]);
  }

  updateMatrixWorld() {
    this.updateMatrix();

    if (this._parent === null) {
      this._matrixWorld.copy(this.matrix);
    } else {
      this._matrixWorld.multiplyMatrices(this._parent.matrixWorld, this._matrix);
    }

    // update children
    const children = this._children;
    for (var i = 0, l = children.length; i < l; i ++) {
      children[i].updateMatrixWorld();
    }
  }
}

export default Object3D;
