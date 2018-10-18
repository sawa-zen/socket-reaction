import { getUniqueStr } from './utils';
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

  _rotate = [0, 0, 0];
  get rotate() {
    return this._rotate;
  }

  _children = [];
  get children() {
    return this._children;
  }

  add(obj) {
    this._children.push(obj);
  }

  getModelMatrix() {
    const mMatrix = new Matrix4();

    // TODO 三軸分に増やす
    mMatrix.rotate(this.rotate[0], [0, 1, 0]);
    mMatrix.rotate(this.rotate[1], [1, 0, 0]);
    mMatrix.rotate(this.rotate[2], [0, 0, 1]);
    // モデル座標変換行列
    mMatrix.translate([this.position[0], this.position[1], this.position[2]]);

    return mMatrix;
  }
}

export default Object3D;
