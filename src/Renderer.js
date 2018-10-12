/**
 * レンダラー
 */
class Renderer {
  _size = {
    width: 0,
    height: 0
  }

  _domElement = document.createElement('canvas');
  get domElement() {
    return this._domElement;
  }

  constructor() {
    // gl
    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');
  }

  render() {
  }
}

export default Renderer;
