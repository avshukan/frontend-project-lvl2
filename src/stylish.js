import {
  getName, getValue, getState, getIsObject, getChildren,
} from './genDiff.js';

const indent = ' ';

const printArrayNode = (node, deep = 0) => {
  const print = [];
  const name = getName(node);
  const state = getState(node);
  const value = getValue(node);
  const children = getChildren(node);
  const isObject = getIsObject(node);
  if (isObject) {
    const firstString = (deep > 0) ? `${indent.repeat(4 * deep - 2)}${state} ${name}: {` : '{';
    print.push(firstString);
    children.forEach((child) => {
      print.push(...printArrayNode(child, deep + 1));
    });
    const lastString = (deep > 0) ? `${indent.repeat(4 * deep)}}` : '}';
    print.push(lastString);
  } else {
    print.push(`${indent.repeat(4 * deep - 2)}${state} ${name}: ${value}`);
  }
  return print;
};

const stylish = (node) => printArrayNode(node).join('\n');

export default stylish;
