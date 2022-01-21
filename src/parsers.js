import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parser = (filepath) => {
  const file = fs.readFileSync(filepath, 'utf-8');
  const format = path.extname(filepath);
  let handler;
  switch (format) {
    case '.yaml':
    case '.yml':
      handler = yaml.load;
      break;
    case '.json':
      handler = JSON.parse;
      break;
    default:
      handler = () => {};
  }
  const obj = handler(file);
  return obj;
};

export default parser;
