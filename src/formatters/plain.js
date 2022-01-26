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

const printArrayNode = (node, path = []) => {
  const print = [];
  const children = getChildren(node);
  const groups = children.reduce((acc, item) => {
    const key = getName(item);
    const group = acc[key] ? [...acc[key], item] : [item];
    return { ...acc, [key]: group };
  }, {});
  Object.keys(groups).forEach((key) => {
    const group = groups[key];
    const prop = [...path, key].filter((item) => item !== undefined).join('.');
    if (group.length === 1) {
      const state = getState(group[0]);
      const isObject = getIsObject(group[0]);
      const value = getValue(group[0]);
      const val = typeof value === 'string' ? `'${value}'` : value;
      const v = isObject ? '[complex value]' : val;
      if (state === nodeStates.removed) {
        print.push(`Property '${prop}' was removed`);
      }
      if (state === nodeStates.added) {
        print.push(`Property '${prop}' was added with value: ${v}`);
      }
      if (state === nodeStates.unchanged && isObject) {
        print.push(...printArrayNode(group[0], [...path, key]));
      }
    } else {
      const value1 = getValue(group[0]);
      const val1 = typeof value1 === 'string' ? `'${value1}'` : value1;
      const fromValue = getIsObject(group[0]) ? '[complex value]' : val1;
      const value2 = getValue(group[1]);
      const val2 = typeof value2 === 'string' ? `'${value2}'` : value2;
      const toValue = getIsObject(group[1]) ? '[complex value]' : val2;
      print.push(`Property '${prop}' was updated. From ${fromValue} to ${toValue}`);
    }
  });
  return print;
};

export default (node) => printArrayNode(node).join('\n');
