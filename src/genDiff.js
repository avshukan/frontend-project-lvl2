import path from 'path';
import parser from './parsers.js';
import makeDiff from './diff.js';
import formatters from './formatters/index.js';

const getPath = (fileName) => path.resolve(process.cwd(), fileName);

const genDiff = (filepath1, filepath2, formatName) => {
  const obj1 = parser(getPath(filepath1));
  const obj2 = parser(getPath(filepath2));
  const formatter = formatters(formatName);
  const diff = makeDiff(obj1, obj2);
  console.log('obj1, obj2, diff', obj1, obj2, diff);
  return formatter(diff);
};

export default genDiff;
