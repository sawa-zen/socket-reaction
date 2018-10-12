import "@babel/polyfill";
import Stats from './Stats';
import Renderer from './Renderer';
import Geometry from './Geometry';
import Material from './Material';
import Mesh from './Mesh';
const vertexShader = require('./shader/vertex.glsl');
const fragmentShader = require('./shader/fragment.glsl');

class SocketReaction {
  _count = 0;

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

    const geometry = new Geometry();
    geometry.addAttribute('position', 3, [
       0.0, 0.5, 0.0,
       1.0, -0.5, 0.0,
      -1.0, -0.5, 0.0
    ]);
    geometry.addAttribute('color', 4, [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ]);

    const material = new Material(vertexShader, fragmentShader);

    this._mesh = new Mesh(geometry, material);

    this._renderer.add(this._mesh);

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

    this._count += 2;

    // カウンタを元にラジアンを算出
    const rad = (this._count % 360) * Math.PI / 180;
    // モデル1は円の軌道を描き移動する
    const x = Math.cos(rad) * 3;
    const y = Math.sin(rad) * 3;
    this._mesh.position[0] = x;
    this._mesh.position[1] = y;
    this._mesh.rotate[0] = rad;

    this._renderer.render();

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._update);
  };
}

export default SocketReaction;
