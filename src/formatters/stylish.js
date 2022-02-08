import _ from 'lodash';
import {
  diffStates,
} from '../diff.js';

const INDENT = ' ';

const signs = {
  [diffStates.ADDED]: '+',
  [diffStates.REMOVED]: '-',
  [diffStates.UNCHANGED]: INDENT,
  [diffStates.COMPLEX]: INDENT,
};

const getObjectArray = (data, deep) => _.sortBy(Object.keys(data)).map((key) => {
  if (_.isPlainObject(data[key])) {
    const firstString = `${INDENT.repeat(4 * deep)}${key}: {`;
    const content = getObjectArray(data[key], deep + 1);
    const lastString = `${INDENT.repeat(4 * deep)}}`;
    return [firstString, ...content, lastString].flat();
  }
  return [`${INDENT.repeat(4 * deep)}${key}: ${data[key]}`];
});

const getStrings = (diff, deep = 1) => {
  console.log('diff', diff);
  console.log('deep', deep);
  const result = diff.map(({ name, state, value }) => {
    if (state === diffStates.ADDED || state === diffStates.REMOVED || state === diffStates.UNCHANGED || state === diffStates.COMPLEX) {
      const sign = signs[state];
      const prefix = (deep > 0) ? `${INDENT.repeat(4 * deep - 2)}${sign}${INDENT}` : '';
      const postfix = `${INDENT.repeat(4 * deep)}`;
      if (state === diffStates.COMPLEX) {
        const firstString = (deep > 0) ? `${prefix}${name}: {` : '{';
        const content = (state === diffStates.COMPLEX)
          ? _.sortBy(value, 'name').map((child) => getStrings(child, deep + 1))
          : getObjectArray(value, deep + 1);
        const lastString = (deep > 0) ? `${postfix}}` : '}';
        return [firstString, ...content, lastString].flat();
      }
      return [`${prefix}${name}: ${value}`];
    }
    const [before, after] = value;
    const stringsBefore = (_.isPlainObject(before))
      ? [
        `${INDENT.repeat(4 * deep - 2)}${signs[diffStates.REMOVED]} ${name}: {`,
        ...getObjectArray(before, deep + 1),
        `${INDENT.repeat(4 * deep)}}`,
      ].flat()
      : [`${INDENT.repeat(4 * deep - 2)}${signs[diffStates.REMOVED]} ${name}: ${before}`];
    const stringsAfter = (_.isPlainObject(after))
      ? [
        `${INDENT.repeat(4 * deep - 2)}${signs[diffStates.ADDED]} ${name}: {`,
        ...getObjectArray(after, deep + 1),
        `${INDENT.repeat(4 * deep)}}`,
      ].flat()
      : [`${INDENT.repeat(4 * deep - 2)}${signs[diffStates.ADDED]} ${name}: ${after}`];
    return [
      ...stringsBefore,
      ...stringsAfter,
    ].flat();
  });
  return ['{', result, '}'].flat();
};

export default (diff) => getStrings(diff).join('\n');
