import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const jsonParser = (text) => JSON.parse(text);

const yamlParser = (filename) => {
  const result = yaml.load(filename);
  return result ?? {};
};

const parser = (filepath) => {
  const file = fs.readFileSync(filepath, 'utf-8');
  const format = path.extname(filepath);
  let handler;
  switch (format) {
    case '.yaml':
    case '.yml':
      handler = yamlParser;
      break;
    case '.json':
      handler = jsonParser;
      break;
    default:
      handler = () => { };
  }
  const obj = handler(file);
  return obj;
};

export default parser;
