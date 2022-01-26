import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (formatName) => {
  let formatter;
  if (formatName === 'json') {
    formatter = json;
  } else if (formatName === 'plain') {
    formatter = plain;
  } else {
    formatter = stylish;
  }
  return formatter;
};
