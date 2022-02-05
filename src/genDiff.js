import path from 'path';
import parser from './parsers.js';
import makeDiff from './diff.js';
import formatters from './formatters/index.js';

const getPath = (fileName) => path.resolve(process.cwd(), fileName);

const genDiff = (filepath1, filepath2, formatName) => {
  const obj1 = parser(getPath(filepath1));
  const obj2 = parser(getPath(filepath2));
  const formatter = formatters(formatName);
  const diff = makeDiff(undefined, obj1, obj2);
  const result = formatter(diff);
  return result;
};

export default genDiff;
