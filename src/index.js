import "@babel/polyfill";
import Stats from './Stats';
import { createProgram, createVbo } from './utils';
const vertexSource = require('./shader/vertex.glsl');
const fragmentSource = require('./shader/fragment.glsl');

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
    // プログラムオブジェクトの生成とリンク
    this._prg = createProgram(this._gl, vertexSource, fragmentSource);

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
    // canvasを初期化する際の深度を設定する
    this._gl.clearDepth(1.0);
    // canvasを初期化
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    // // attributeLocationの取得
    // const attLocation = this._gl.getAttribLocation(prg, 'position');
    // // attributeの要素数(この場合は xyz の3要素)
    // const attStride = 3;
    // // モデル(頂点)データ
    // const vertexPosition = [
    //   0.0, 1.0, 0.0,
    //   1.0, 0.0, 0.0,
    //   -1.0, 0.0, 0.0
    // ];
    // // VBOの生成
    // const vbo = createVbo(this._gl, vertexPosition);
    // // VBOをバインド
    // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
    // // attribute属性を有効にする
    // this._gl.enableVertexAttribArray(attLocation);
    // // attribute属性を登録
    // this._gl.vertexAttribPointer(attLocation, attStride, this._gl.FLOAT, false, 0, 0);
    //
    // const uniLocation = this._gl.getUniformLocation(prg, 'mvpMatrix');
    //
    // uniformLocationへ座標変換行列を登録
    // this._gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
    //
    // // モデルの描画
    // this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
    // コンテキストの再描画
    this._gl.flush();

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._render);
  };
}

export default SocketReaction;
