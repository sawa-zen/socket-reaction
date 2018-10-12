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

    // モデル(頂点)データ
    const vertexPosition = [
       0.0, 1.0, 0.0,
       1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];
    const positionVbo = createVbo(this._gl, vertexPosition);
    const positionAttrLoc = this._gl.getAttribLocation(prg, 'position');
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionVbo);
    this._gl.enableVertexAttribArray(positionAttrLoc);
    this._gl.vertexAttribPointer(positionAttrLoc, 3, this._gl.FLOAT, false, 0, 0);

    // 頂点の色情報を格納する配列
    const vertexColor = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];
    const colorVbo = createVbo(this._gl, vertexColor);
    const colorAttrLoc = this._gl.getAttribLocation(prg, 'color');
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorVbo);
    this._gl.enableVertexAttribArray(colorAttrLoc);
    this._gl.vertexAttribPointer(colorAttrLoc, 4, this._gl.FLOAT, false, 0, 0);

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
  }

  dispose() {
    cancelAnimationFrame(this._animationFrameId);
    SocketReaction.instance = null;
  }

  _render = () => {
    this._stats.begin();

    // モデル座標変換行列
    const mMatrix = new Matrix4();

    this._count += 2;
    // カウンタを元にラジアンを算出
    const rad = (this._count % 360) * Math.PI / 180;

    // モデル1は円の軌道を描き移動する
    const x = Math.cos(rad) * 3;
    const y = Math.sin(rad) * 3;
    mMatrix.translate([x, y + 1.0, 0.0]);
    mMatrix.rotate(rad, [0, 1, 0]);

    // canvasを黒でクリア(初期化)する
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // canvasを初期化する際の深度を設定する
    this._gl.clearDepth(1.0);
    // canvasを初期化
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // ビュー座標変換行列
    const vMatrix = new Matrix4().lookAt([0.0, 0.0, 5.0], [0, 0, 0], [0, 1, 0]);
    // プロジェクション座標変換行列
    const pMatrix = new Matrix4().perspective(90, this._domElement.width / this._domElement.height, 0.1, 100);
    // ビュープロジェクション座標変換行列
    const vpMatrix = pMatrix.multiply(vMatrix);
    // 各行列を掛け合わせ座標変換行列を完成させる
    const mvpMatrix = vpMatrix.multiply(mMatrix);

    // uniformLocationへ座標変換行列を登録
    this._gl.uniformMatrix4fv(this._uniLocation, false, mvpMatrix);
    // モデルの描画
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);
    // コンテキストの再描画
    this._gl.flush();

    this._stats.end();

    this._animationFrameId = requestAnimationFrame(this._render);
  };
}

export default SocketReaction;
