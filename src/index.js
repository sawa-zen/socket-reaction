import "@babel/polyfill";
import Stats from './Stats';
import Matrix4 from './Matrix4';
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
    // gl
    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');

    // プログラムオブジェクトの生成とリンク
    const prg = createProgram(this._gl, vertexSource, fragmentSource);

    // attributeLocationの取得
    const attLocation = [];
    attLocation.push(this._gl.getAttribLocation(prg, 'position'));
    attLocation.push(this._gl.getAttribLocation(prg, 'color'));

    // attributeの要素数(この場合は xyz の3要素)
    const attStride = [];
    attStride.push(3);
    attStride.push(4);

    // モデル(頂点)データ
    const vertexPosition = [
       0.0, 1.0, 0.0,
       1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];
    const positionVbo = createVbo(this._gl, vertexPosition);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionVbo);
    this._gl.enableVertexAttribArray(attLocation[0]);
    this._gl.vertexAttribPointer(attLocation[0], attStride[0], this._gl.FLOAT, false, 0, 0);

    // 頂点の色情報を格納する配列
    var vertexColor = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];
    const colorVbo = createVbo(this._gl, vertexColor);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorVbo);
    this._gl.enableVertexAttribArray(attLocation[1]);
    this._gl.vertexAttribPointer(attLocation[1], attStride[1], this._gl.FLOAT, false, 0, 0);

    this._updateMvpMat();
    this._uniLocation = this._gl.getUniformLocation(prg, 'mvpMatrix');

    // 描画開始
    this._render();

    SocketReaction.instance = this;
    return this;
  }

  resize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._updateMvpMat();
  }

  dispose() {
    cancelAnimationFrame(this._animationFrameId);
    SocketReaction.instance = null;
  }

  _updateMvpMat() {
    // モデル座標変換行列
    const mMatrix = new Matrix4();
    // ビュー座標変換行列
    const vMatrix = new Matrix4().lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0]);
    // プロジェクション座標変換行列
    const pMatrix = new Matrix4().perspective(90, this._domElement.width / this._domElement.height, 0.1, 100);
    // 各行列を掛け合わせ座標変換行列を完成させる
    this._mvpMatrix = pMatrix.multiply(vMatrix).multiply(mMatrix);
  }

  _render = () => {
    this._stats.begin();

    // canvasを黒でクリア(初期化)する
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // canvasを初期化する際の深度を設定する
    this._gl.clearDepth(1.0);
    // canvasを初期化
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    // uniformLocationへ座標変換行列を登録
    this._gl.uniformMatrix4fv(this._uniLocation, false, this._mvpMatrix);
    // モデルの描画
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
    // コンテキストの再描画
    this._gl.flush();

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._render);
  };
}

export default SocketReaction;
