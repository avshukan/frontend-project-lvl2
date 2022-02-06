import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (formatName) => {
  if (formatName === 'json') {
    return json;
  } if (formatName === 'plain') {
    return plain;
  }
  return stylish;
};
