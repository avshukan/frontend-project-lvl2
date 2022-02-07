import _ from 'lodash';

const diffStates = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  CHANGED: 'CHANGED',
  COMPLEX: 'COMPLEX',
};

const getName = (diff) => diff.name;

const getState = (diff) => diff.state;

const getValue = (diff) => diff.value;

const makeDiff = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));
  const result = keys.map((name) => {
    if (!_.has(obj1, name)) {
      return {
        name,
        state: diffStates.ADDED,
        value: _.cloneDeep(obj2[name]),
      };
    }
    if (!_.has(obj2, name)) {
      return {
        name,
        state: diffStates.REMOVED,
        valueBefore: _.cloneDeep(obj1[name]),
      };
    }
    if (_.isPlainObject(obj1[name]) && _.isPlainObject(obj2[name])) {
      return {
        name,
        state: diffStates.COMPLEX,
        value: makeDiff(obj1[name], obj2[name]),
      };
    }
    if (obj1 === obj2) {
      return {
        name,
        state: diffStates.UNCHANGED,
        value: obj1[name],
      };
    }
    return {
      name,
      state: diffStates.CHANGED,
      value: { before: obj1[name], after: obj2[name] },
    };
  });
  return result;
};

export {
  diffStates, getName, getState, getValue,
};

export default makeDiff;
