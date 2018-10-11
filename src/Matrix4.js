/**
 * 行列クラス
 */
export default class Matrix4 extends Float32Array {
  constructor() {
    super(16);
    this.identity();
  }

  /**
   * 初期化する
   */
  identity() {
    this[0]  = 1; this[1]  = 0; this[2]  = 0; this[3]  = 0;
    this[4]  = 0; this[5]  = 1; this[6]  = 0; this[7]  = 0;
    this[8]  = 0; this[9]  = 0; this[10] = 1; this[11] = 0;
    this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1;
    return this;
  }

  /**
   * 渡されたMatrixを掛け合わせる
   */
  multiply(mat) {
    const a = this[0],  b = this[1],  c = this[2],  d = this[3],
          e = this[4],  f = this[5],  g = this[6],  h = this[7],
          i = this[8],  j = this[9],  k = this[10], l = this[11],
          m = this[12], n = this[13], o = this[14], p = this[15];
    const A = mat[0],   B = mat[1],   C = mat[2],   D = mat[3],
          E = mat[4],   F = mat[5],   G = mat[6],   H = mat[7],
          I = mat[8],   J = mat[9],   K = mat[10],  L = mat[11],
          M = mat[12],  N = mat[13],  O = mat[14],  P = mat[15];
    this[0]  = A * a + B * e + C * i + D * m;
    this[1]  = A * b + B * f + C * j + D * n;
    this[2]  = A * c + B * g + C * k + D * o;
    this[3]  = A * d + B * h + C * l + D * p;
    this[4]  = E * a + F * e + G * i + H * m;
    this[5]  = E * b + F * f + G * j + H * n;
    this[6]  = E * c + F * g + G * k + H * o;
    this[7]  = E * d + F * h + G * l + H * p;
    this[8]  = I * a + J * e + K * i + L * m;
    this[9]  = I * b + J * f + K * j + L * n;
    this[10] = I * c + J * g + K * k + L * o;
    this[11] = I * d + J * h + K * l + L * p;
    this[12] = M * a + N * e + O * i + P * m;
    this[13] = M * b + N * f + O * j + P * n;
    this[14] = M * c + N * g + O * k + P * o;
    this[15] = M * d + N * h + O * l + P * p;

    return this;
  }

  /**
   * 渡されたベクトル分拡大縮小する
   */
  scale(vec) {
    this[0]  = this[0]  * vec[0];
    this[1]  = this[1]  * vec[0];
    this[2]  = this[2]  * vec[0];
    this[3]  = this[3]  * vec[0];
    this[4]  = this[4]  * vec[1];
    this[5]  = this[5]  * vec[1];
    this[6]  = this[6]  * vec[1];
    this[7]  = this[7]  * vec[1];
    this[8]  = this[8]  * vec[2];
    this[9]  = this[9]  * vec[2];
    this[10] = this[10] * vec[2];
    this[11] = this[11] * vec[2];

    return this;
  }

  /**
   * 渡されたベクトル分移動させる
   */
  translate(vec) {
    this[12] = this[0] * vec[0] + this[4] * vec[1] + this[8]  * vec[2] + this[12];
    this[13] = this[1] * vec[0] + this[5] * vec[1] + this[9]  * vec[2] + this[13];
    this[14] = this[2] * vec[0] + this[6] * vec[1] + this[10] * vec[2] + this[14];
    this[15] = this[3] * vec[0] + this[7] * vec[1] + this[11] * vec[2] + this[15];

    return this;
  }

  /**
   * 回転させる
   */
  rotate(angle, axis) {
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);

    if (!sq) {
      return;
    }

    let a = axis[0],
        b = axis[1],
        c = axis[2];

    if (sq != 1) {
      sq = 1 / sq;
      a *= sq;
      b *= sq;
      c *= sq;
    }

    const d = Math.sin(angle),
          e = Math.cos(angle),
          f = 1 - e,
          g = this[0], h = this[1], i = this[2],  j = this[3],
          k = this[4], l = this[5], m = this[6],  n = this[7],
          o = this[8], p = this[9], q = this[10], r = this[11],
          s = a * a * f + e,
          t = b * a * f + c * d,
          u = c * a * f - b * d,
          v = a * b * f - c * d,
          w = b * b * f + e,
          x = c * b * f + a * d,
          y = a * c * f + b * d,
          z = b * c * f - a * d,
          A = c * c * f + e;

    this[0]  = g * s + k * t + o * u;
    this[1]  = h * s + l * t + p * u;
    this[2]  = i * s + m * t + q * u;
    this[3]  = j * s + n * t + r * u;
    this[4]  = g * v + k * w + o * x;
    this[5]  = h * v + l * w + p * x;
    this[6]  = i * v + m * w + q * x;
    this[7]  = j * v + n * w + r * x;
    this[8]  = g * y + k * z + o * A;
    this[9]  = h * y + l * z + p * A;
    this[10] = i * y + m * z + q * A;
    this[11] = j * y + n * z + r * A;

    return this;
  }

  /**
   * ビュー変換行列を生成する
   */
  lookAt(eye, center, up) {
    let eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
        upX     = up[0],     upY     = up[1],     upZ     = up[2],
        centerX = center[0], centerY = center[1], centerZ = center[2];

    if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
      this.identity();
      return;
    }

    let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
    z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
    l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= l; z1 *= l; z2 *= l;
    x0 = upY * z2 - upZ * z1;
    x1 = upZ * z0 - upX * z2;
    x2 = upX * z1 - upY * z0;
    l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

    if (!l) {
      x0 = 0; x1 = 0; x2 = 0;
    } else {
      l = 1 / l;
      x0 *= l; x1 *= l; x2 *= l;
    }

    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
    l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

    if (!l) {
      y0 = 0; y1 = 0; y2 = 0;
    } else {
      l = 1 / l;
      y0 *= l; y1 *= l; y2 *= l;
    }

    this[0] = x0; this[1] = y0; this[2]  = z0; this[3]  = 0;
    this[4] = x1; this[5] = y1; this[6]  = z1; this[7]  = 0;
    this[8] = x2; this[9] = y2; this[10] = z2; this[11] = 0;
    this[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
    this[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
    this[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
    this[15] = 1;

    return this;
  }

  /**
   * プロジェクション変換行列を生成する
   */
  perspective(fovy, aspect, near, far) {
    const t = near * Math.tan(fovy * Math.PI / 360);
    const r = t * aspect;
    const a = r * 2, b = t * 2, c = far - near;

    this[0] = near * 2 / a;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = near * 2 / b;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = -(far + near) / c;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = -(far * near * 2) / c;
    this[15] = 0;

    return this;
  }

  /**
   * 行列を転置する
   */
  transpose() {
    const a = this[0],  b = this[1],  c = this[2],  d = this[3],
          e = this[4],  f = this[5],  g = this[6],  h = this[7],
          i = this[8],  j = this[9],  k = this[10], l = this[11],
          m = this[12], n = this[13], o = this[14], p = this[15];
    this[0]  = a; this[1]  = e; this[2]  = i; this[3]  = m;
    this[4]  = b; this[5]  = f; this[6]  = j; this[7]  = n;
    this[8]  = c; this[9]  = g; this[10] = k; this[11] = o;
    this[12] = d; this[13] = h; this[14] = l; this[15] = p;

    return this;
  }

  /**
   * 逆行列を生成する
   */
  inverse() {
    const a = this[0],  b = this[1],  c = this[2],  d = this[3],
          e = this[4],  f = this[5],  g = this[6],  h = this[7],
          i = this[8],  j = this[9],  k = this[10], l = this[11],
          m = this[12], n = this[13], o = this[14], p = this[15];

    const q = a * f - b * e, r = a * g - c * e,
          s = a * h - d * e, t = b * g - c * f,
          u = b * h - d * f, v = c * h - d * g,
          w = i * n - j * m, x = i * o - k * m,
          y = i * p - l * m, z = j * o - k * n,
          A = j * p - l * n, B = k * p - l * o,
          ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);

    this[0]  = ( f * B - g * A + h * z) * ivd;
    this[1]  = (-b * B + c * A - d * z) * ivd;
    this[2]  = ( n * v - o * u + p * t) * ivd;
    this[3]  = (-j * v + k * u - l * t) * ivd;
    this[4]  = (-e * B + g * y - h * x) * ivd;
    this[5]  = ( a * B - c * y + d * x) * ivd;
    this[6]  = (-m * v + o * s - p * r) * ivd;
    this[7]  = ( i * v - k * s + l * r) * ivd;
    this[8]  = ( e * A - f * y + h * w) * ivd;
    this[9]  = (-a * A + b * y - d * w) * ivd;
    this[10] = ( m * u - n * s + p * q) * ivd;
    this[11] = (-i * u + j * s - l * q) * ivd;
    this[12] = (-e * z + f * x - g * w) * ivd;
    this[13] = ( a * z - b * x + c * w) * ivd;
    this[14] = (-m * t + n * r - o * q) * ivd;
    this[15] = ( i * t - j * r + k * q) * ivd;

    return this;
  }

  /**
   * 複製する
   */
  clone() {
    const newMat = new Matrix4();
    const a = this[0],  b = this[1],  c = this[2],  d = this[3],
          e = this[4],  f = this[5],  g = this[6],  h = this[7],
          i = this[8],  j = this[9],  k = this[10], l = this[11],
          m = this[12], n = this[13], o = this[14], p = this[15];

    newMat[0]  = a;
    newMat[1]  = b;
    newMat[2]  = c;
    newMat[3]  = d;
    newMat[4]  = e;
    newMat[5]  = f;
    newMat[6]  = g;
    newMat[7]  = h;
    newMat[8]  = i;
    newMat[9]  = j;
    newMat[10] = k;
    newMat[11] = l;
    newMat[12] = m;
    newMat[13] = n;
    newMat[14] = o;
    newMat[15] = p;

    return newMat;
  }
}
