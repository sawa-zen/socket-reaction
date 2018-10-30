import Matrix4 from './Matrix4';
import {
  createProgram,
  createVbo,
  createIbo,
  registerAttribute,
  registerMvpUniform,
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

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
  }

  _children = [];
  add(obj) {
    this._createProgram(obj, this._children);
  }

  _createProgram(obj, container) {
    const data = { obj };
    if (obj.type === 'Mesh') {
      const geometry = obj.geometry;
      const material = obj.material;

      // プログラムオブジェクトの生成とリンク
      data.program = createProgram(
        this._gl,
        material.vertexShader,
        material.fragmentShader,
      );

      // アトリビュートを登録
      data.attributes = [];
      Object.keys(geometry.attributes).map(key => {
        const attribute = geometry.attributes[key];
        const attributeInfo = {};
        // VBOを作成
        attributeInfo.vbo = createVbo(this._gl, attribute.verticies);
        attributeInfo.attrLoc = this._gl.getAttribLocation(data.program, key);
        attributeInfo.stride = attribute.stride;
        data.attributes.push(attributeInfo);
      });
    }

    data.children = [];
    obj.children.map((child) => {
      this._createProgram(child, data.children);
    });

    container.push(data);
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

        child.attributes.forEach(attribute => {
          // アトリビュートを許可
          this._gl.bindBuffer(this._gl.ARRAY_BUFFER, attribute.vbo);
          this._gl.enableVertexAttribArray(attribute.attrLoc);
          this._gl.vertexAttribPointer(
            attribute.attrLoc,
            attribute.stride,
            this._gl.FLOAT,
            false, 0, 0
          );
          // バッファを開放
          this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
        });

        // uniformLocationへ座標変換行列を登録
        registerMvpUniform(this._gl, prg, mMatrix, vMatrix, pMatrix);

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
        this._renderChild(child.children, mMatrix, vMatrix, pMatrix);
      }
    });
  }
}

export default Renderer;
