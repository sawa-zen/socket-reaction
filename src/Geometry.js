class Geometry {
  _attributes = {};
  get attributes() {
    return this._attributes;
  }

  _index = [];
  get index() {
    return this._index;
  }

  addAttribute(name, stride, verticies) {
    this._attributes[name] = { stride, verticies };
  }

  setIndex(index) {
    this._index = index;
  }
}

export default Geometry;
