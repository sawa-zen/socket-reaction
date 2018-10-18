import Object3D from './Object3D';
import Mesh from './Mesh';
import Geometry from './Geometry';
import Material from './Material';
const vertexShader = require('./shader/vertex.glsl');
const fragmentShader = require('./shader/fragment.glsl');

class Scene extends Object3D {
  _count = 0;

  constructor() {
    super();

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
    this.add(this._mesh);

    const geometry2 = new Geometry();
    geometry2.addAttribute('position', 3, [
       0.0,  1.5, 0.0,
       1.0, -0.5, 0.0,
      -1.0, -0.5, 0.0
    ]);
    geometry2.addAttribute('color', 4, [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ]);
    const material2 = new Material(vertexShader, fragmentShader);
    this._mesh2 = new Mesh(geometry2, material2);
    this._mesh2.position[0] = 0.0;
    this.add(this._mesh2);
  }

  update() {
    this._count += 2;

    // カウンタを元にラジアンを算出
    const rad = (this._count % 360) * Math.PI / 180;
    // モデル1は円の軌道を描き移動する
    const x = Math.cos(rad) * 3;
    const y = Math.sin(rad) * 3;
    // this._mesh.position[0] = x;
    this._mesh.position[1] = y;

    this.rotate[0] = rad;
  }
}

export default Scene;