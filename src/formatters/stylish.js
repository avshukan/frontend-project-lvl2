import _ from 'lodash';
import diffStates from '../diffStates.js';

const STEP = 4;

const INDENT = ' ';

const signs = {
  [diffStates.ADDED]: '+',
  [diffStates.REMOVED]: '-',
  [diffStates.UNCHANGED]: INDENT,
  [diffStates.COMPLEX]: INDENT,
};

const getPrefix = (deep, sign, name) => `${INDENT.repeat(STEP * deep - 2)}${sign}${INDENT}${name}`;

const printValue = (value, prefix, deep) => {
  if (_.isPlainObject(value)) {
    const keys = _.sortBy(Object.keys(value));
    return [
      `${prefix}: {`,
      ...keys.map((key) => printValue(value[key], `${INDENT.repeat(STEP * deep + 4)}${key}`, deep + 1)),
      `${INDENT.repeat(STEP * deep)}}`,
    ].flat();
  }
  return [`${prefix}: ${value}`];
};

const getStrings = (diff, deep = 1) => {
  const result = diff.map(({ name, state, value }) => {
    if (state === diffStates.COMPLEX) {
      const firstString = `${INDENT.repeat(STEP * deep)}${name}: {`;
      const content = getStrings(value, deep + 1).flat();
      const lastString = `${INDENT.repeat(STEP * deep)}}`;
      return [firstString, ...content, lastString].flat();
    }
    if (state === diffStates.CHANGED) {
      const [before, after] = value;
      return [
        ...printValue(before, getPrefix(deep, signs[diffStates.REMOVED], name), deep),
        ...printValue(after, getPrefix(deep, signs[diffStates.ADDED], name), deep),
      ].flat();
    }
    if (state === diffStates.ADDED) {
      return printValue(value, getPrefix(deep, signs[state], name), deep);
    }
    if (state === diffStates.REMOVED) {
      return printValue(value, getPrefix(deep, signs[state], name), deep);
    }
    if (state === diffStates.UNCHANGED) {
      return printValue(value, getPrefix(deep, signs[state], name), deep);
    }
    return [];
  });
  return result;
};

export default (diff) => ['{', getStrings(diff).flat(), '}'].flat().join('\n');
