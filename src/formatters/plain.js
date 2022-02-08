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

const getStringsArray = (diff, path = []) => {
  const name = getName(diff);
  const state = getState(diff);
  const prop = [...path, name].filter((item) => item !== undefined).join('.');
  const valueBefore = formatValue(getValueBefore(diff));
  const valueAfter = formatValue(getValueAfter(diff));
  const children = getChildren(diff);
  if (state === diffStates.REMOVED) {
    return [`Property '${prop}' was removed`];
  }
  if (state === diffStates.ADDED) {
    return [`Property '${prop}' was added with value: ${valueAfter}`];
  }
  if (state === diffStates.CHANGED) {
    return [`Property '${prop}' was updated. From ${valueBefore} to ${valueAfter}`];
  }
  if (children !== undefined) {
    const result = children.map((child) => getStringsArray(child, [...path, name])).flat();
    return result;
  }
  return [];
};

export default (diff) => getStringsArray(diff).join('\n');
