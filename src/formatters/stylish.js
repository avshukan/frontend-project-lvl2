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
      const stringsBefore = printValue(before, `${INDENT.repeat(4 * deep - 2)}${signs[diffStates.REMOVED]} ${name}`, deep);
      const stringsAfter = printValue(after, `${INDENT.repeat(4 * deep - 2)}${signs[diffStates.ADDED]} ${name}`, deep);
      return [
        ...stringsBefore,
        ...stringsAfter,
      ].flat();
    }
    const sign = signs[state];
    const prefix = `${INDENT.repeat(4 * deep - 2)}${sign}${INDENT}${name}`;
    return printValue(value, prefix, deep);
  });
  return result;
};

export default (diff) => ['{', getStrings(diff).flat(), '}'].flat().join('\n');
