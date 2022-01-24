import _ from 'lodash';

const makeNode = (key, oldObj, newObj) => {
  const node = {
    key,
    state,
    value,
    children
   };
  if (!_.has(oldObj, key)) {
    node[state] = 'added';
    if (newObj[key] === null) {
      node[key] = value;
    } else if (typeof newObj[key] !== 'object') {
      node[key] = newObj[key];
    } {
      _.keys(newObj[key]);
    };
    return [`+ ${key}: ${obj2[key]}`];
  }
  if (!_.has(obj2, key)) { return [`- ${key}: ${obj1[key]}`]; }
  return (obj1[key] === obj2[key])
    ? [`  ${key}: ${obj2[key]}`]
    : [`- ${key}: ${obj1[key]}`, `+ ${key}: ${obj2[key]}`];

  node[key]

    state: 'unchanged',
    oldValue: obj1[key],
    newValue: obj2[key],
  };
  return node;
};

const makeDiff = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();
  const diff = keys.map((key) => {
    if (!_.has(obj1, key)) { return [`+ ${key}: ${obj2[key]}`]; }
    if (!_.has(obj2, key)) { return [`- ${key}: ${obj1[key]}`]; }
    return (obj1[key] === obj2[key])
      ? [`  ${key}: ${obj2[key]}`]
      : [`- ${key}: ${obj1[key]}`, `+ ${key}: ${obj2[key]}`];
  });
  return diff;
};

const printDiff = (diff) => ['{', ...diff.flat().map((s) => (`  ${s}`)), '}'].join('\n');

export default (obj1, obj2) => {
  const diff = makeDiff(obj1, obj2);
  const print = printDiff(diff);
  return print;
};
