import _ from 'lodash';
import {
  diffStates, getName, getState, getValueBefore, getValueAfter, getChildren,
} from '../diff';

const indent = ' ';

const signs = {
  ADDED: '+',
  REMOVED: '-',
};

const getObjectArray = (data, deep) => Object.keys(data).sort().map((key) => {
  if (_.isPlainObject(data[key])) {
    const firstString = `${indent.repeat(4 * deep)}${key}: {`;
    const content = getObjectArray(data[key], deep + 1);
    const lastString = `${indent.repeat(4 * deep)}}`;
    return [firstString, ...content, lastString].flat();
  }
  return [`${indent.repeat(4 * deep)}${key}: ${data[key]}`];
});

const getStringsArray = (diff, deep = 0) => {
  const name = getName(diff);
  const state = getState(diff);
  if (state === diffStates.ADDED) {
    const value = getValueAfter(diff);
    if (_.isPlainObject(value)) {
      const firstString = (deep > 0) ? `${indent.repeat(4 * deep - 2)}${signs.ADDED} ${name}: {` : '{';
      const content = getObjectArray(value, deep + 1);
      const lastString = (deep > 0) ? `${indent.repeat(4 * deep)}}` : '}';
      return [firstString, ...content, lastString].flat();
    }
    return [`${indent.repeat(4 * deep - 2)}${signs.ADDED} ${name}: ${value}`];
  }
  if (state === diffStates.REMOVED) {
    const value = getValueBefore(diff);
    if (_.isPlainObject(value)) {
      const firstString = (deep > 0) ? `${indent.repeat(4 * deep - 2)}${signs.REMOVED} ${name}: {` : '{';
      const content = getObjectArray(value, deep + 1);
      const lastString = (deep > 0) ? `${indent.repeat(4 * deep)}}` : '}';
      return [firstString, ...content, lastString].flat();
    }
    return [`${indent.repeat(4 * deep - 2)}${signs.REMOVED} ${name}: ${value}`];
  }
  if (state === diffStates.UNCHANGED) {
    const children = getChildren(diff);
    if (children === undefined) {
      return [`${indent.repeat(4 * deep)}${name}: ${getValueAfter(diff)}`];
    }
    const firstString = (deep > 0) ? `${indent.repeat(4 * deep)}${name}: {` : '{';
    const content = children.sort().map((child) => getStringsArray(child, deep + 1));
    const lastString = (deep > 0) ? `${indent.repeat(4 * deep)}}` : '}';
    return [firstString, ...content, lastString].flat();
  }
  const valueBefore = getValueBefore(diff);
  const valueAfter = getValueAfter(diff);
  const stringsBefore = (_.isPlainObject(valueBefore))
    ? [
      `${indent.repeat(4 * deep - 2)}${signs.REMOVED} ${name}: {`,
      ...getObjectArray(valueBefore, deep + 1),
      `${indent.repeat(4 * deep)}}`,
    ].flat()
    : [`${indent.repeat(4 * deep - 2)}${signs.REMOVED} ${name}: ${valueBefore}`];
  const stringsAfter = (_.isPlainObject(valueAfter))
    ? [
      `${indent.repeat(4 * deep - 2)}${signs.ADDED} ${name}: {`,
      ...getObjectArray(valueAfter, deep + 1),
      `${indent.repeat(4 * deep)}}`,
    ].flat()
    : [`${indent.repeat(4 * deep - 2)}${signs.ADDED} ${name}: ${valueAfter}`];
  return [
    ...stringsBefore,
    ...stringsAfter,
  ].flat();
};

export default (diff) => getStringsArray(diff).join('\n');

// export default (diff) => {
//   console.log('diff', diff);
//   const x = getStringsArray(diff);
//   console.log('x', x);
//   return x.join('\n');
// };
