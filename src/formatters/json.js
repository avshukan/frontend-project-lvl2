import {
  diffStates,
} from '../diff.js';

const keys = {
  name: 'key',
  state: 'type',
  value: 'children',
};

const states = {
  [diffStates.ADDED]: 'added',
  [diffStates.REMOVED]: 'deleted',
  [diffStates.COMPLEX]: 'nested',
  [diffStates.CHANGED]: 'changed',
  [diffStates.UNCHANGED]: 'unchanged',
};

const getStringsArray = (diff) => {
  if (Array.isArray(diff)) {
    return `[${diff.map((child) => getStringsArray(child)).join(',')}]`;
  }
  if (diff === null) {
    return 'null';
  }
  if (typeof diff === 'object') {
    return `{${Object.keys(diff)
      .filter((key) => diff[key] !== undefined)
      .map((key) => (key === 'state'
        ? `"${keys[key]}":"${states[diff[key]]}"`
        : `"${keys[key]}":${getStringsArray(diff[key])}`))
      .join(',')
    }}`;
  }
  if (typeof diff === 'string') {
    return `"${diff}"`;
  }
  return diff;
};

export default (diff) => `{"type": "root", "children": ${getStringsArray(diff)}}`;
