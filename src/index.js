import "@babel/polyfill";
import Stats from './Stats';
import Renderer from './Renderer';

class SocketReaction {
  get domElement() {
    return this._renderer.domElement;
  }

  constructor() {
    if (SocketReaction.instance) {
      return SocketReaction.instance;
    }

    // stats
    this._stats = new Stats();

    this._renderer = new Renderer();

    // 更新
    this._update();

    SocketReaction.instance = this;
    return this;
  }

  resize(w, h) {
    this._renderer.setSize(w, h);
  }

  dispose() {
    cancelAnimationFrame(this._animationFrameId);
    SocketReaction.instance = null;
  }

  _update = () => {
    this._stats.begin();

    this._renderer.render();

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._update);
  };
}

export default SocketReaction;
