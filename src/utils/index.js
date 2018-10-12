/**
 * シェーダーを生成、コンパイルする。
 */
export const createShader = (gl, shaderSource, shaderType) => {
  // scriptタグのtype属性をチェック
  const shader = gl.createShader(shaderType);

  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, shaderSource);

  // シェーダをコンパイルする
  gl.compileShader(shader);

  // シェーダが正しくコンパイルされたかチェック
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!success){
    // コンパイル中に問題があった場合、エラーを取得する。
    throw new Error('could not compile shader:' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

/**
 * 2つのシェーダーからプログラムを生成する。
 */
export const createProgram = (gl, vertexSource, fragmentSource) => {
  const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

  // プログラムを生成する。
  const program = gl.createProgram();

  // シェーダーをアタッチする。
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // プログラムをリンクする。
  gl.linkProgram(program);

  // リンクが成功したか確認する。
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);
  } else {
    // リンク中に問題があった場合、エラーを取得する。
    throw new Error('program filed to link:' + gl.getProgramInfoLog(program));
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

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
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

  // バッファのバインドを無効化
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return ibo;
}
