class Geometry {
  _attributes = {};
  get attributes() {
    return this._attributes;
  }

  addAttribute(name, stride, verticies) {
    this._attributes[name] = { stride, verticies };
  }
}

export default Geometry;
