import { Renderer } from './libs';
import MainScene from './MainScene';

class SocketReaction {
  get domElement() {
    return this._renderer.domElement;
  }

  constructor() {
    if (SocketReaction.instance) {
      return SocketReaction.instance;
    }

    // レンダラー
    this._renderer = new Renderer();

    // メインシーン
    this._scene = new MainScene();

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
    this._scene.update()

    this._renderer.render(this._scene);

    this._animationFrameId = requestAnimationFrame(this._update);
  };
}

export default SocketReaction;
