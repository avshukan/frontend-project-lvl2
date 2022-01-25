import _ from 'lodash';

const getName = (node) => node.name;

const setName = (node, name) => {
  node.name = name;
};

const getState = (node) => node.state;

const setState = (node, state) => {
  node.state = state;
};

const getValue = (node) => node.value;

const setValue = (node, value) => {
  node.value = value;
};

const getIsObject = (node) => node.isObject;

const setIsObject = (node, isObject) => {
  node.isObject = isObject;
};

const getChildren = (node) => node.children;

const addChildren = (node, child) => {
  node.children.push(child);
};

const makeNode = (obj, name, state = ' ') => {
  const node = {
    children: [],
  };
  setName(node, name);
  setState(node, state);
  if (typeof obj === 'object' && obj !== null) {
    setIsObject(node, true);
    _.keys(obj).forEach((key) => {
      const child = makeNode(obj[key], key);
      addChildren(node, child);
    });
  } else {
    setIsObject(node, false);
    setValue(node, obj);
  }
  return node;
};

const deepCopy = (node) => {
  const name = getName(node);
  if (!getIsObject(node)) {
    return makeNode(getValue(node), name);
  }
  const copy = makeNode({}, name);
  setState(copy, getState(node));
  setIsObject(copy, getIsObject(node));
  getChildren(node).forEach((child) => {
    const copyChild = deepCopy(child);
    addChildren(copy, copyChild);
  });
  return copy;
};

const printArrayNode = (node, deep = 0) => {
  const indent = ' ';
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
      const printChild = printArrayNode(child, deep + 1);
      print.push(...printChild);
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
      const addedNode = deepCopy(child2);
      setState(addedNode, '+');
      children.push(addedNode);
    } else if (!child2) {
      const removedNode = deepCopy(child1);
      setState(removedNode, '-');
      children.push(removedNode);
    } else if (getIsObject(child1) !== getIsObject(child2)) {
      const removedNode = deepCopy(child1);
      setState(removedNode, '-');
      children.push(removedNode);
      const addedNode = deepCopy(child2);
      setState(addedNode, '+');
      children.push(addedNode);
    } else if (!getIsObject(child1) && !getIsObject(child2)) {
      if (getValue(child1) === getValue(child2)) {
        const unchangedNode = deepCopy(child1);
        children.push(unchangedNode);
      } else {
        const removedNode = deepCopy(child1);
        setState(removedNode, '-');
        children.push(removedNode);
        const addedNode = deepCopy(child2);
        setState(addedNode, '+');
        children.push(addedNode);
      }
    } else {
      const child = makeNode({}, key);
      const subChildren1 = getChildren(child1);
      const subChildren2 = getChildren(child2);
      const subChildren = makeDiffChildren(subChildren1, subChildren2);
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
