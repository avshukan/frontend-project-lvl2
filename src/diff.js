import _ from 'lodash';

const diffStates = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  CHANGED: 'CHANGED',
  COMPLEX: 'COMPLEX',
};

const makeDiffNode = (name, state, value) => ({ name, state, value });

const makeDiff = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));
  const result = keys.map((name) => {
    if (!_.has(obj1, name)) {
      return makeDiffNode(name, diffStates.ADDED, _.cloneDeep(obj2[name]));
    }
    if (!_.has(obj2, name)) {
      return makeDiffNode(name, diffStates.REMOVED, _.cloneDeep(obj1[name]));
    }
    if (_.isPlainObject(obj1[name]) && _.isPlainObject(obj2[name])) {
      return makeDiffNode(name, diffStates.COMPLEX, makeDiff(obj1[name], obj2[name]));
    }
    if (obj1[name] === obj2[name]) {
      return makeDiffNode(name, diffStates.UNCHANGED, obj1[name]);
    }
    return makeDiffNode(name, diffStates.CHANGED, [obj1[name], obj2[name]]);
  });
  return result;
};

export {
  diffStates,
};

export default makeDiff;
