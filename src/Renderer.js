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
    this._createProgram(obj, this._children);
    console.info(this._children);
  }

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
  }

  render() {
    // canvasをクリア
    this._clearCanvas();

    // モデル座標変換行列のベース
    const mMatrix = new Matrix4();

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

    // children分回す
    this._updateUniform(
      this._children,
      mMatrix,
      vMatrix,
      pMatrix,
    );

    // コンテキストの再描画
    this._gl.flush();
  }

  _createProgram(obj, container) {
    const data = { obj };
    if (obj.type === 'Mesh') {
      const geometry = obj.geometry;
      const material = obj.material;
      // プログラムオブジェクトの生成とリンク
      const prg = createProgram(this._gl, material.vertexShader, material.fragmentShader);

      Object.keys(geometry.attributes).map(key => {
        const attribute = geometry.attributes[key];
        const verticies = attribute.verticies;
        const stride = attribute.stride;
        const positionVbo = createVbo(this._gl, verticies);
        const positionAttrLoc = this._gl.getAttribLocation(prg, key);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionVbo);
        this._gl.enableVertexAttribArray(positionAttrLoc);
        this._gl.vertexAttribPointer(positionAttrLoc, stride, this._gl.FLOAT, false, 0, 0);
      });

      data.program = prg;
      data.uniLocation = {
        mMatrix: this._gl.getUniformLocation(prg, 'mMatrix'),
        vMatrix: this._gl.getUniformLocation(prg, 'vMatrix'),
        pMatrix: this._gl.getUniformLocation(prg, 'pMatrix')
      };
    }

    data.children = [];
    obj.children.map((child) => {
      this._createProgram(child, data.children);
    });

    container.push(data);
  }

  _clearCanvas() {
    // canvasを黒でクリア(初期化)-5る
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // canvasを初期化する際の深度を設定する
    this._gl.clearDepth(1.0);
    // canvasを初期化
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  _updateUniform(children, parentModelMatrix, vMatrix, pMatrix) {
    children.map((child) => {
      const obj = child.obj;

      const mMatrix = parentModelMatrix.clone().multiply(obj.getModelMatrix());

      // Meshでなければ無視する
      if (obj.type === 'Mesh') {
        this._gl.useProgram(child.program);
        // uniformLocationへ座標変換行列を登録
        this._gl.uniformMatrix4fv(child.uniLocation.mMatrix, false, mMatrix);
        this._gl.uniformMatrix4fv(child.uniLocation.vMatrix, false, vMatrix);
        this._gl.uniformMatrix4fv(child.uniLocation.pMatrix, false, pMatrix);
        // モデルの描画
        this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
      }

      if (child.children) {
        this._updateUniform(child.children, mMatrix.clone(), vMatrix, pMatrix);
      }
    });
  }
}

export default Renderer;
