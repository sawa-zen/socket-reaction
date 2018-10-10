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
export const createProgram = (gl, vertexShader, fragmentShader) => {
  // プログラムを生成する。
  const program = gl.createProgram();

  // シェーダーをアタッチする。
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // プログラムをリンクする。
  gl.linkProgram(program);

  // リンクが成功したか確認する。
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
  // リンク中に問題があった場合、エラーを取得する。
    throw new Error('program filed to link:' + gl.getProgramInfoLog (program));
  }

  return program;
}

/**
 * 二つのscript要素を使ってWebGLProgramを生成する。
 */
export const createProgramFromScripts = (gl, vertexSource, fragmentSource) => {
  const vertexShader = createShaderFromScript(gl, vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFromScript(gl, fragmentSource, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}
