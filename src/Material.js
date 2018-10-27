class Material {
  _uniform = {};
  get uniform() {
    return this._uniform;
  }

  get vertexShader() {
    return this._vertexShader;
  }

  get fragmentShader() {
    return this._fragmentShader;
  }

  get transparent() {
    return this._transparent;
  }

  constructor(parametars = {}) {
    this._uniform = parametars.uniform || {};
    this._vertexShader = parametars.vertexShader;
    this._fragmentShader = parametars.fragmentShader;
    this._transparent = parametars.transparent;
  }
}

export default Material;
