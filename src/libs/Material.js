import Matrix4 from './Matrix4';

class Material {
  _uniforms = {
    mMatrix: {
      type: 'v4',
      value: new Matrix4(),
    },
    vMatrix: {
      type: 'v4',
      value: new Matrix4(),
    },
    pMatrix: {
      type: 'v4',
      value: new Matrix4(),
    },
  };
  get uniforms() {
    return this._uniforms;
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

  get side() {
    return this._side;
  }

  get blending() {
    return this._blending;
  }

  constructor(parametars = {}) {
    this._uniforms = {
      ...this._uniforms,
      ...parametars.uniforms,
    };
    this._vertexShader = parametars.vertexShader;
    this._fragmentShader = parametars.fragmentShader;
    this._transparent = !!parametars.transparent;
    this._side = parametars.side || 'SIDE_FRONT';
    this._blending = parametars.blending || 'BLENDING_NO';
  }
}

export default Material;
