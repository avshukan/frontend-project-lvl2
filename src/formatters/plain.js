import _ from 'lodash';
import {
  diffStates,
} from '../diff.js';

const formatValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getStrings = (diff, path = []) => {
  const result = diff.map(({ name, state, value }) => {
    const prop = [...path, name].filter((item) => item !== undefined).join('.');
    if (state === diffStates.COMPLEX) {
      return getStrings(value, [...path, name]).flat();
    }
    if (state === diffStates.REMOVED) {
      return [`Property '${prop}' was removed`];
    }
    if (state === diffStates.ADDED) {
      return [`Property '${prop}' was added with value: ${formatValue(value)}`];
    }
    if (state === diffStates.CHANGED) {
      const [before, after] = value;
      return [`Property '${prop}' was updated. From ${formatValue(before)} to ${formatValue(after)}`];
    }
    return [];
  });
  return result.flat();
};

export default (diff) => getStrings(diff).join('\n');
