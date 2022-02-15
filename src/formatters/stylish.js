import _ from 'lodash';
import diffStates from '../diffStates.js';

const INDENT = ' ';

const signs = {
  [diffStates.ADDED]: '+',
  [diffStates.REMOVED]: '-',
  [diffStates.UNCHANGED]: INDENT,
  [diffStates.COMPLEX]: INDENT,
};

const printValue = (value, prefix, deep) => {
  if (_.isPlainObject(value)) {
    return [
      `${prefix}: {`,
      ..._.sortBy(Object.keys(value)).map((key) => printValue(value[key], `${INDENT.repeat(4 * deep + 4)}${key}`, deep + 1)),
      `${INDENT.repeat(4 * deep)}}`,
    ].flat();
  }
  return [`${prefix}: ${value}`];
};

const getPrefix = (deep, sign, name) => `${INDENT.repeat(4 * deep - 2)}${sign}${INDENT}${name}`;

const getStrings = (diff, deep = 1) => {
  const result = diff.map(({ name, state, value }) => {
    if (state === diffStates.COMPLEX) {
      const firstString = `${INDENT.repeat(4 * deep)}${name}: {`;
      const content = getStrings(value, deep + 1).flat();
      const lastString = `${INDENT.repeat(4 * deep)}}`;
      return [firstString, ...content, lastString].flat();
    }
    if (state === diffStates.CHANGED) {
      const [before, after] = value;
      return [
        ...printValue(before, getPrefix(deep, signs[diffStates.REMOVED], name), deep),
        ...printValue(after, getPrefix(deep, signs[diffStates.ADDED], name), deep),
      ].flat();
    }
    return printValue(value, getPrefix(deep, signs[state], name), deep);
  });
  return result;
};

export default (diff) => ['{', getStrings(diff).flat(), '}'].flat().join('\n');
