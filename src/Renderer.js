import Matrix4 from './Matrix4';
import {
  createProgram,
  createVbo,
  createIbo,
  registerAttribute,
  enabledDepthTest,
  switchBlending,
  switchCulling,
  drawFace,
  clearColor,
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
  }

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
  }

  render() {
    // canvasをクリア
    clearColor(this._gl);

    // モデル座標変換行列のベース
    const mMatrix = new Matrix4();

    // ビュー座標変換行列
    const camera = {
      position: [0.0, 0.0, 10.0],
      center: [0, 0, 0],
      up: [0, 1, 0]
    };
    const vMatrix = new Matrix4().lookAt(
      camera.position,
      camera.center,
      camera.up
    );

    // プロジェクション座標変換行列
    const pMatrix = new Matrix4().perspective(
      90,
      this._domElement.width / this._domElement.height,
      0.1,
      100,
    );

    // children分回す
    this._renderChild(
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
      const material = obj.material;
      // プログラムオブジェクトの生成とリンク
      const prg = createProgram(
        this._gl,
        material.vertexShader,
        material.fragmentShader,
      );
      data.program = prg;
    }

    data.children = [];
    obj.children.map((child) => {
      this._createProgram(child, data.children);
    });

    container.push(data);
  }

  _renderChild(children, parentModelMatrix, vMatrix, pMatrix) {
    children.map((child) => {
      const obj = child.obj;

      const mMatrix = parentModelMatrix.clone().multiply(obj.getModelMatrix());

      // Meshでなければ無視する
      if (obj.type === 'Mesh') {
        const geometry = obj.geometry;
        const material = obj.material;
        const prg = child.program;

        // 使用するプログラムを指定
        this._gl.useProgram(prg);

        Object.keys(geometry.attributes).map(key => {
          // アトリビュートを登録
          const attribute = geometry.attributes[key];
          registerAttribute(
            this._gl,
            prg,
            key,
            attribute.verticies,
            attribute.stride,
          );
        });

        // uniformLocationへ座標変換行列を登録
        const uniLocation = {
          mMatrix: this._gl.getUniformLocation(prg, 'mMatrix'),
          vMatrix: this._gl.getUniformLocation(prg, 'vMatrix'),
          pMatrix: this._gl.getUniformLocation(prg, 'pMatrix')
        };
        this._gl.uniformMatrix4fv(uniLocation.mMatrix, false, mMatrix);
        this._gl.uniformMatrix4fv(uniLocation.vMatrix, false, vMatrix);
        this._gl.uniformMatrix4fv(uniLocation.pMatrix, false, pMatrix);

        // 深度テストを有効
        enabledDepthTest(this._gl);

        // ブレンディングを切り替え
        switchBlending(this._gl, material.transparent);

        // カリングを切り替える
        switchCulling(this._gl, material.side);

        // 面を描画
        drawFace(this._gl, geometry.index);
      }

      if (child.children) {
        this._renderChild(child.children, mMatrix.clone(), vMatrix, pMatrix);
      }
    });
  }
}

export default Renderer;
