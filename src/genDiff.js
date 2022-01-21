import _ from 'lodash';

export default (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();
  const diff = keys.map((key) => {
    if (!_.has(obj1, key)) { return [`+ ${key}: ${obj2[key]}`]; }
    if (!_.has(obj2, key)) { return [`- ${key}: ${obj1[key]}`]; }
    return (obj1[key] === obj2[key])
      ? [`  ${key}: ${obj2[key]}`]
      : [`- ${key}: ${obj1[key]}`, `+ ${key}: ${obj2[key]}`];
  });
  return ['{', ...diff.flat().map((s) => (`  ${s}`)), '}'].join('\n');
};
