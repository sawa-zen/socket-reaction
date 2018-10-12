import Matrix4 from './Matrix4';
import { createProgram, createVbo } from './utils';
const vertexSource = require('./shader/vertex.glsl');
const fragmentSource = require('./shader/fragment.glsl');

/**
 * レンダラー
 */
class Renderer {
  _count = 0;

  get domElement() {
    return this._domElement;
  }

  constructor() {
    this._domElement = document.createElement('canvas');

    // gl
    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');

    // プログラムオブジェクトの生成とリンク
    const prg = createProgram(this._gl, vertexSource, fragmentSource);

    // モデル(頂点)データ
    const vertexPosition = [
       0.0, 0.5, 0.0,
       1.0, -0.5, 0.0,
      -1.0, -0.5, 0.0
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

  }

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
  }

  render() {
    // canvasをクリア
    this._clearCanvas();

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

    // 各行列を掛け合わせ座標変換行列を完成させる
    const mvpMatrix1 = vpMatrix.clone().multiply(mMatrix);
    // uniformLocationへ座標変換行列を登録
    this._gl.uniformMatrix4fv(this._uniLocation, false, mvpMatrix1);
    // モデルの描画
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);

    // 各行列を掛け合わせ座標変換行列を完成させる
    mMatrix.inverse();
    const mvpMatrix2 = vpMatrix.clone().multiply(mMatrix);
    // uniformLocationへ座標変換行列を登録
    this._gl.uniformMatrix4fv(this._uniLocation, false, mvpMatrix2);
    // モデルの描画
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 3);

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
