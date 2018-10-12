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

  constructor(vertexShader, fragmentShader, uniform = {}) {
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniform = uniform;
  }
}

export default Material;
