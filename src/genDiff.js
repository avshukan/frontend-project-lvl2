import _ from 'lodash';

const indent = ' ';

const nodeStates = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const getName = (node) => node.name;

const getState = (node) => node.state;

const getValue = (node) => node.value;

const getIsObject = (node) => node.isObject;

const getChildren = (node) => node.children;

const addChildren = (node, child) => {
  node.children.push(child);
};

const makeNode = (data, name, state = nodeStates.unchanged) => {
  if (typeof data === 'object' && data !== null) {
    const node = {
      name,
      isObject: true,
      state,
      children: [],
    };
    _.keys(data).forEach((key) => {
      const child = makeNode(data[key], key);
      addChildren(node, child);
    });
    return node;
  }
  return {
    name,
    value: data,
    isObject: false,
    state,
    children: [],
  };
};

const deepCopy = (node, state) => {
  const name = getName(node);
  if (!getIsObject(node)) {
    return makeNode(getValue(node), name, state);
  }
  const copy = makeNode({}, name, state);
  getChildren(node).forEach((child) => {
    const copyChild = deepCopy(child);
    addChildren(copy, copyChild);
  });
  return copy;
};

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

const printNode = (node) => printArrayNode(node).join('\n');

const makeDiffChildren = (children1, children2) => {
  const children = [];
  const keys = _.union(children1.map((el) => getName(el)), children2.map((el) => getName(el)));
  keys.sort().forEach((key) => {
    const child1 = _.find(children1, (child) => getName(child) === key);
    const child2 = _.find(children2, (child) => getName(child) === key);
    if (!child1) {
      children.push(deepCopy(child2, nodeStates.added));
    } else if (!child2) {
      children.push(deepCopy(child1, nodeStates.removed));
    } else if (getIsObject(child1) !== getIsObject(child2)) {
      children.push(deepCopy(child1, nodeStates.removed));
      children.push(deepCopy(child2, nodeStates.added));
    } else if (!getIsObject(child1) && !getIsObject(child2)) {
      if (getValue(child1) === getValue(child2)) {
        children.push(deepCopy(child1, nodeStates.unchanged));
      } else {
        children.push(deepCopy(child1, nodeStates.removed));
        children.push(deepCopy(child2, nodeStates.added));
      }
    } else {
      const child = makeNode({}, key);
      const subChildren = makeDiffChildren(getChildren(child1), getChildren(child2));
      subChildren.forEach((subChild) => addChildren(child, subChild));
      children.push(child);
    }
  });
  return children;
};

const genDiff = (obj1, obj2) => {
  const node1 = makeNode(obj1);
  const node2 = makeNode(obj2);
  const node = makeNode({});
  const children1 = getChildren(node1);
  const children2 = getChildren(node2);
  const children = makeDiffChildren(children1, children2);
  children.forEach((child) => addChildren(node, child));
  return printNode(node);
};

export default genDiff;
