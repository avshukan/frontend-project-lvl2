import _ from 'lodash';

const diffStates = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  CHANGED: 'CHANGED',
  COMPLEX: 'COMPLEX',
};

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
        value: _.cloneDeep(obj1[name]),
      };
    }
    if (_.isPlainObject(obj1[name]) && _.isPlainObject(obj2[name])) {
      return {
        name,
        state: diffStates.COMPLEX,
        value: makeDiff(obj1[name], obj2[name]),
      };
    }
    if (obj1[name] === obj2[name]) {
      return {
        name,
        state: diffStates.UNCHANGED,
        value: obj1[name],
      };
    }
    return {
      name,
      state: diffStates.CHANGED,
      value: [obj1[name], obj2[name]],
    };
  });
  return result;
};

export {
  diffStates,
};

export default makeDiff;
