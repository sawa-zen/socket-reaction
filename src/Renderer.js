import Matrix4 from './Matrix4';
import {
  createProgram,
  createVbo,
} from './utils';
import deepForEach from './utils/deepForEach';

/**
 * レンダラー
 */
class Renderer {
  get domElement() {
    return this._domElement;
  }

  constructor() {
    this._domElement = document.createElement('canvas');

    // gl
    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');
  }

  _children = [];
  add(obj) {
    this._children.push(obj);

    // TODO children分回す
    (() => {
      const geometry = obj.geometry;
      const material = obj.material;
      // プログラムオブジェクトの生成とリンク
      const prg = createProgram(this._gl, material.vertexShader, material.fragmentShader);

      Object.keys(geometry.attributes).map((key) => {
        const attribute = geometry.attributes[key];
        const verticies = attribute.verticies;
        const stride = attribute.stride;
        const positionVbo = createVbo(this._gl, verticies);
        const positionAttrLoc = this._gl.getAttribLocation(prg, key);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionVbo);
        this._gl.enableVertexAttribArray(positionAttrLoc);
        this._gl.vertexAttribPointer(positionAttrLoc, stride, this._gl.FLOAT, false, 0, 0);
      });

      this._uniLocation = this._gl.getUniformLocation(prg, 'mvpMatrix');
    })();
  }

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
  }

  render() {
    // canvasをクリア
    this._clearCanvas();

    // ビュー座標変換行列
    const camera = {
      position: [0.0, 0.0, 5.0],
      center: [0, 0, 0],
      up: [0, 1, 0]
    };
    const vMatrix = new Matrix4().lookAt(
      camera.position,
      camera.center,
      camera.up
    );

    // プロジェクション座標変換行列
    const pMatrix = new Matrix4().perspective(90, this._domElement.width / this._domElement.height, 0.1, 100);
    // ビュープロジェクション座標変換行列
    const vpMatrix = pMatrix.multiply(vMatrix);

    // TODO children分回す
    (() => {
      const obj = this._children[0];
      // モデル座標変換行列
      const mMatrix = new Matrix4();
      mMatrix.translate([obj.position[0], obj.position[1], obj.position[2]]);
      // TODO 三軸分に増やす
      mMatrix.rotate(obj.rotate[0], [0, 1, 0]);
      // 各行列を掛け合わせ座標変換行列を完成させる
      const mvpMatrix1 = vpMatrix.clone().multiply(mMatrix);
      // uniformLocationへ座標変換行列を登録
      this._gl.uniformMatrix4fv(this._uniLocation, false, mvpMatrix1);
      // モデルの描画
      this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
    })();

    // コンテキストの再描画
    this._gl.flush();
  }

  _clearCanvas() {
    // canvasを黒でクリア(初期化)する
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // canvasを初期化する際の深度を設定する
    this._gl.clearDepth(1.0);
    // canvasを初期化
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }
}

export default Renderer;
