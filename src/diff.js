import _ from 'lodash';

/*
1. UNDEFINED -> SIMPLE|COMPLEX
- ADDED WITH AFTER
2. SIMPLE|COMPLEX -> UNDEFINED
- REMOVED WITH BEFORE
3. SIMPLE -> SIMPLE
- CHANGED WITH BEFORE & AFTER
- UNCHANGED WITH AFTER
4. SIMPLE -> COMPLEX
- CHANGED WITH BEFORE & AFTER
5. COMPLEX -> SIMPLE
- CHANGED WITH BEFORE & AFTER
6. COMPLEX -> COMPLEX
- UNCHANGED WITH CHILDREN
*/

const diffStates = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  CHANGED: 'CHANGED',
};

const getName = (diff) => diff.name;

const getState = (diff) => diff.state;

const getValueBefore = (diff) => diff.valueBefore;

const getValueAfter = (diff) => diff.valueAfter;

const getChildren = (diff) => diff.children;

const makeDiff = (name, valueBefore, valueAfter) => {
  if (valueBefore === undefined) {
    return {
      name,
      state: diffStates.ADDED,
      valueAfter: _.cloneDeep(valueAfter),
    };
  }
  if (valueAfter === undefined) {
    return {
      name,
      state: diffStates.REMOVED,
      valueBefore: _.cloneDeep(valueBefore),
    };
  }
  if (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter)) {
    const keys = _.union(_.keys(valueBefore), _.keys(valueAfter)).sort();
    const children = keys.map((key) => makeDiff(key, valueBefore[key], valueAfter[key]));
    return {
      name,
      state: diffStates.UNCHANGED,
      children,
    };
  }
  if (valueBefore === valueAfter) {
    return {
      name,
      state: diffStates.UNCHANGED,
      valueAfter,
    };
  }
  return {
    name,
    state: diffStates.CHANGED,
    valueBefore,
    valueAfter,
  };
};

export {
  diffStates, getName, getState, getValueBefore, getValueAfter, getChildren,
};

export default makeDiff;
