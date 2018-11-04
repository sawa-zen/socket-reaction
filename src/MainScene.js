import {
  Object3D,
  Geometry,
  Material,
  Mesh,
  Scene,
} from './libs';
const vertexShader = require('./shader/vertex.glsl');
const fragmentShader = require('./shader/fragment.glsl');

class MainScene extends Scene {
  _count = 0;

  constructor() {
    super();

    const geometry = new Geometry();
    geometry.addAttribute('position', 3, [
       0.0,  1.5,  0.0,
       1.0,  0.0,  1.0,
       1.0,  0.0, -1.0,
      -1.0,  0.0, -1.0,
      -1.0,  0.0,  1.0,
       0.0, -1.5,  0.0,
    ]);
    geometry.addAttribute('color', 4, [
      1.0, 0.0, 0.0, 1.0, // 赤
      0.0, 1.0, 0.0, 1.0, // 緑
      0.0, 0.0, 1.0, 1.0, // 青
      1.0, 0.0, 1.0, 1.0, // 藍
      0.0, 1.0, 1.0, 1.0, // 水
      1.0, 1.0, 0.0, 1.0  // 黄
    ]);
    geometry.setIndex([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 1,
      5, 2, 1,
      5, 3, 2,
      5, 4, 3,
      5, 1, 4,
    ]);
    const material = new Material({
      vertexShader,
      fragmentShader,
    });
    this._mesh = new Mesh(geometry, material);
    this.add(this._mesh);

    const group = new Object3D();
    const geometry2 = new Geometry();
    geometry2.addAttribute('position', 3, [
       2.0, -2.0,  0.0,
      -2.0, -2.0,  0.0,
      -2.0,  2.0,  0.0,
       2.0,  2.0,  0.0
    ]);
    geometry2.addAttribute('color', 4, [
      1.0, 1.0, 1.0, 0.5,
      1.0, 1.0, 1.0, 0.5,
      1.0, 1.0, 1.0, 0.5,
      1.0, 1.0, 1.0, 0.5
    ]);
    geometry2.setIndex([
      0, 1, 2,
      0, 2, 3,
    ]);
    const material2 = new Material({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: 'SIDE_DOUBLE'
    });
    this._mesh2 = new Mesh(geometry2, material2);
    this._mesh2.position[2] = -2.0;
    this.add(this._mesh2);
  }

  update() {
    this._count += 2;

    // カウンタを元にラジアンを算出
    const rad = (this._count % 360) * Math.PI / 180;
    // モデル1は円の軌道を描き移動する
    const x = Math.cos(rad) * 3;
    const y = Math.sin(rad) * 3;

    this._mesh.rotation[0] = -rad * 2;

    this.position[1] = y;
    this.rotation[0] = rad;
  }
}

export default MainScene;
