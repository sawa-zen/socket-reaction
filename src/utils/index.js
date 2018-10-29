/**
 * シェーダーを生成、コンパイルする。
 */
export const createShader = (
  gl,
  shaderSource,
  shaderType,
) => {
  // scriptタグのtype属性をチェック
  const shader = gl.createShader(shaderType);

  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, shaderSource);

  // シェーダをコンパイルする
  gl.compileShader(shader);

  // シェーダが正しくコンパイルされたかチェック
  const success = gl.getShaderParameter(
    shader,
    gl.COMPILE_STATUS,
  );
  if(!success){
    // コンパイル中に問題があった場合、エラーを取得する。
    throw new Error(
      `could not compile shader:${gl.getShaderInfoLog(shader)}`
    );
  }

  return shader;
}

/**
 * 2つのシェーダーからプログラムを生成する。
 */
export const createProgram = (
  gl,
  vertexSource,
  fragmentSource
) => {
  const vertexShader = createShader(
    gl,
    vertexSource,
    gl.VERTEX_SHADER,
  );
  const fragmentShader = createShader(
    gl,
    fragmentSource,
    gl.FRAGMENT_SHADER,
  );

  // プログラムを生成する。
  const program = gl.createProgram();

  // シェーダーをアタッチする。
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // プログラムをリンクする。
  gl.linkProgram(program);

  // リンクが成功したか確認する。
  const success = gl.getProgramParameter(
    program,
    gl.LINK_STATUS,
  );
  if (success) {
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);
  } else {
    // リンク中に問題があった場合、エラーを取得する。
    throw new Error(
      `program filed to link:${gl.getProgramInfoLog(program)}`
    );
  }

  return program;
}

/**
 * VBOを生成する
 */
export const createVbo = (gl, data) => {
  // バッファオブジェクトの生成
  const vbo = gl.createBuffer();

  // バッファをバインドする
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // バッファにデータをセット
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(data),
    gl.STATIC_DRAW,
  );

  // バッファのバインドを無効化
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vbo;
}

/**
 * IBOを生成する
 */
export const createIbo = (gl, data) => {
  // バッファオブジェクトの生成
  const ibo = gl.createBuffer();

  // バッファをバインドする
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  // バッファにデータをセット
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Int16Array(data),
    gl.STATIC_DRAW
  );

  // バッファのバインドを無効化
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return ibo;
}

/**
 * アトリビュートを登録
 */
export const registerAttribute = (
  gl,
  prg,
  key,
  verticies,
  stride,
) => {
  const vbo = createVbo(gl, verticies);
  const attrLoc = gl.getAttribLocation(prg, key);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.enableVertexAttribArray(attrLoc);
  gl.vertexAttribPointer(attrLoc, stride, gl.FLOAT, false, 0, 0);
}

/**
 * 座標変換行列をuniformに登録
 */
export const registerMvpUniform = (
  gl,
  prg,
  mMatrix,
  vMatrix,
  pMatrix,
) => {
  const uniLocation = {
    mMatrix: gl.getUniformLocation(prg, 'mMatrix'),
    vMatrix: gl.getUniformLocation(prg, 'vMatrix'),
    pMatrix: gl.getUniformLocation(prg, 'pMatrix')
  };
  gl.uniformMatrix4fv(
    uniLocation.mMatrix,
    false,
    mMatrix,
  );
  gl.uniformMatrix4fv(
    uniLocation.vMatrix,
    false,
    vMatrix,
  );
  gl.uniformMatrix4fv(
    uniLocation.pMatrix,
    false,
    pMatrix,
  );
}

/**
 * 深度テストを有効にする
 */
export const enabledDepthTest = (gl) => {
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
}

/**
 * カリングの切り替え
 */
export const switchCulling = (gl, side) => {
  switch (side) {
    case 'SIDE_DOUBLE':
      gl.disable(gl.CULL_FACE);
      break;
    case 'SIDE_BACK':
      gl.enable(gl.CULL_FACE);
      gl.frontFace(gl.CW);
      break;
    case 'SIDE_FRONT':
    default:
      gl.enable(gl.CULL_FACE);
      gl.frontFace(gl.CCW);
      break;
  }
}

/**
 * ブレンディングの切り替え
 */
export const switchBlending = (gl, transparent) => {
  if (transparent) {
    // ブレンディングを有効
    gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
    );
  } else {
    gl.disable(gl.BLEND);
  }
}

/**
 * 面を描画
 */
export const drawFace = (gl, index) => {
  if (index.length) {
    const ibo = createIbo(gl, index);
    // IBOをバインドして登録する
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    // モデルの描画
    gl.drawElements(
      gl.TRIANGLES,
      index.length,
      gl.UNSIGNED_SHORT,
      0
    );
  } else {
    // モデルの描画
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

/**
 * 描画をクリア
 */
export const clearColor = (
  gl,
  color = [0.0, 0.0, 0.0, 1.0],
  depth = 1.0,
) => {
  // canvasを単色でクリア(初期化)
  gl.clearColor(
    color[0],
    color[1],
    color[2],
    color[3],
  );
  // canvasを初期化する際の深度を設定する
  gl.clearDepth(depth);
  // canvasを初期化
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * ユニークな文字列を作成
 */
export const getUniqueStr = (strong = 1000) => {
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
};
