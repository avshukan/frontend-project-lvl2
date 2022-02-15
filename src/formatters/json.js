import diffStates from '../diffStates.js';

const states = {
  [diffStates.ADDED]: 'added',
  [diffStates.REMOVED]: 'deleted',
  [diffStates.COMPLEX]: 'nested',
  [diffStates.CHANGED]: 'changed',
  [diffStates.UNCHANGED]: 'unchanged',
};

const printValue = (value) => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    const result = Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .map((key) => `"${key}":${printValue(value[key])}`);
    return `{${result.join(',')}}`;
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return value;
};

const getStrings = (diff) => {
  const result = diff
    .map(({ name, state, value }) => {
      if (state === diffStates.COMPLEX) {
        return `{"key":"${name}","type": "${states[state]}","children": [${getStrings(value)}]}`;
      }
      if (state === diffStates.CHANGED) {
        const [before, after] = value;
        return `{"key":"${name}","type": "${states[state]}","value1":${printValue(before)},"value2":${printValue(after)}}`;
      }
      return `{"key":"${name}","type": "${states[state]}","value":${printValue(value)}}`;
    })
    .join(',');
  return result;
};

export default (diff) => `{"type": "root", "children": [${getStrings(diff)}]}`;
