import fs from 'fs';
import path from 'path';
import parser from './parsers.js';
import makeDiff from './diff.js';
import formatters from './formatters/index.js';

const getPath = (fileName) => path.resolve(process.cwd(), fileName);

export const getData = (filepath) => fs.readFileSync(filepath, 'utf-8');

export const getFormat = (filepath) => path.extname(filepath);

const genDiff = (filepath1, filepath2, formatName) => {
  const path1 = getPath(filepath1);
  const path2 = getPath(filepath2);
  const obj1 = parser(getData(path1), getFormat(path1));
  const obj2 = parser(getData(path2), getFormat(path2));
  const formatter = formatters(formatName);
  const diff = makeDiff(obj1, obj2);
  return formatter(diff);
};

export default genDiff;
