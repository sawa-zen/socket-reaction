class Object3D {
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
}

export default Object3D;
