import Matrix4 from './Matrix4';
import {
  createProgram,
  createVbo,
  registerMvpUniform,
  enabledDepthTest,
  switchBlending,
  switchCulling,
  drawFace,
  clearColor,
} from '../utils';
/**
 * レンダラー
 */
class Renderer {
  get domElement() {
    return this._domElement;
  }

  _renderList = [];
  _vMatrix = new Matrix4();
  _pMatrix = new Matrix4();

  constructor() {
    this._domElement = document.createElement('canvas');

    // gl
    this._gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');
  }

  setSize(w, h) {
    this._domElement.width = w;
    this._domElement.height = h;
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._pMatrix.perspective(90, w / h, 0.1, 100);
  }

  render(scene) {
    // canvasをクリア
    clearColor(this._gl);

    // ビュー座標変換行列
    const camera = {
      position: [0.0, 0.0, 10.0],
      center: [0, 0, 0],
      up: [0, 1, 0]
    };
    this._vMatrix.lookAt(
      camera.position,
      camera.center,
      camera.up
    );

    scene.updateMatrixWorld();

    if (scene.needsUpdate) {
      this._projectObject(scene);
      scene.needsUpdate = false;
    }

    // オブジェクトを描画する
    this._renderList.forEach(renderItem => {
      this._renderObj(renderItem);
    });

    // コンテキストの再描画
    this._gl.flush();
  }

  _projectObject(obj) {
    this._renderList = [];
    if (obj.type === 'Mesh') {
      // プログラムオブジェクトの生成とリンク
      const program = createProgram(
        this._gl,
        obj.material.vertexShader,
        obj.material.fragmentShader,
      );

      // アトリビュートを登録
      const attributes = Object.keys(obj.geometry.attributes).map(key => {
        const attribute = obj.geometry.attributes[key];
        const attributeInfo = {};
        // VBOを作成
        attributeInfo.vbo = createVbo(this._gl, attribute.verticies);
        attributeInfo.attrLoc = this._gl.getAttribLocation(program, key);
        attributeInfo.stride = attribute.stride;
        return attributeInfo;
      });

      // ユニフォームを登録
      const uniforms = {};
      Object.keys(obj.material.uniforms).forEach(key => {
        uniforms[key] = this._gl.getUniformLocation(program, key);
      });

      const renderItem = {
        obj,
        program,
        attributes,
        uniforms,
      };
      this._renderList.push(renderItem);
    }

    obj.children.forEach(child => {
      this._projectObject(child);
    });
  }

  _renderObj(renderItem) {
    const obj = renderItem.obj;
    const prg = renderItem.program;
    const attributes = renderItem.attributes;
    const uniforms = renderItem.uniforms;
    const geometry = obj.geometry;
    const material = obj.material;

    attributes.forEach(attribute => {
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

    // 使用するプログラムを指定
    this._gl.useProgram(prg);

    // uniformの値を反映
    material.uniforms.mMatrix.value = obj.matrix.multiply(obj.matrixWorld);
    material.uniforms.vMatrix.value = this._vMatrix;
    material.uniforms.pMatrix.value = this._pMatrix;
    Object.keys(uniforms).forEach(key => {
      const uniformLoc = uniforms[key];
      const uniform = material.uniforms[key];
      switch (uniform.type) {
        case 'v4':
          this._gl.uniformMatrix4fv(uniformLoc, false, uniform.value);
          break;
      }
    });

    // 深度テストを有効
    enabledDepthTest(this._gl);

    // ブレンディングを切り替え
    switchBlending(this._gl, material.transparent);

    // カリングを切り替える
    switchCulling(this._gl, material.side);

    // 面を描画
    drawFace(this._gl, geometry.index);
  }
}

export default Renderer;
