import Stats from './Stats';
import "@babel/polyfill";

class SocketReaction {
  _count = 0;

  _domElement = document.createElement('canvas');
  get domElement() {
    return this._domElement;
  }

  constructor() {
    if (SocketReaction.instance) {
      return SocketReaction.instance;
    }

    // stats
    this._stats = new Stats();

    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');

    // 描画開始
    this._render();

    SocketReaction.instance = this;
    return this;
  }

  resize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
  }

  dispose() {
    cancelAnimationFrame(this._animationFrameId);
    SocketReaction.instance = null;
  }

  _render = () => {
    this._stats.begin();

    // canvasを黒でクリア(初期化)する
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._render);
  };
}

export default SocketReaction;
