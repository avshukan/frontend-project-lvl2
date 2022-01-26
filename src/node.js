import _ from 'lodash';

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

export {
  nodeStates, getName, getValue, getState, getIsObject, getChildren, addChildren, deepCopy,
};

export default makeNode;
