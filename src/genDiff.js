import _ from 'lodash';

export default (data1, data2) => {
  const json1 = JSON.parse(data1);
  const json2 = JSON.parse(data2);
  const keys = _.union(_.keys(json1), _.keys(json2)).sort();
  console.log('keys', keys);
  const diff = keys.map((key) => {
    if (!_.has(json1, key)) { return [`+ ${key}: ${json2[key]}`]; }
    if (!_.has(json2, key)) { return [`- ${key}: ${json1[key]}`]; }
    return (json1[key] === json2[key])
      ? [`  ${key}: ${json2[key]}`]
      : [`- ${key}: ${json1[key]}`, `+ ${key}: ${json2[key]}`];
  });
  return ['{', ...diff.flat().map((s) => (`  ${s}`)), '}'].join('\n');
};
