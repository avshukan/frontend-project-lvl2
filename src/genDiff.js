import _ from 'lodash';
import makeNode, {
  nodeStates, getName, getValue, getIsObject, getChildren, addChildren, deepCopy,
} from './node.js';
import formatters from './formatters/index.js';

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

const genDiff = (obj1, obj2, formatName) => {
  const node1 = makeNode(obj1);
  const node2 = makeNode(obj2);
  const formatter = formatters(formatName);
  const diff = makeNode({});
  const children1 = getChildren(node1);
  const children2 = getChildren(node2);
  const children = makeDiffChildren(children1, children2);
  children.forEach((child) => addChildren(diff, child));
  return formatter(diff);
};

export default genDiff;
