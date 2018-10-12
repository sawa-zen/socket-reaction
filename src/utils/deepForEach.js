import isPlainObject from 'lodash.isplainobject';

const forEachObject = (obj, fn, path) => {
  for (const key in obj) {
    const deepPath = path ? `${path}.${key}` : key;

    // Note that we always use obj[key] because it might be mutated by forEach
    fn.call(obj, obj[key], key, obj, deepPath);

    forEach(obj[key], fn, deepPath);
  }
}

const forEachArray = (array, fn, path) => {
  array.forEach((value, index, arr) => {
    const deepPath = `${path}[${index}]`;

    fn.call(arr, value, index, arr, deepPath);

    // Note that we use arr[index] because it might be mutated by forEach
    forEach(arr[index], fn, deepPath);
  });
}

const deepForEach = (value, fn, path) => {
  path = path || '';

  if (Array.isArray(value)) {
    forEachArray(value, fn, path);
  } else if (isPlainObject(value)) {
    forEachObject(value, fn, path);
  }
}

export default deepForEach;
