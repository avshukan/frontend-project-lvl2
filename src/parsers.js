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
  switch (format) {
    case '.yaml':
    case '.yml':
      return yamlParser(file);
    case '.json':
      return jsonParser(file);
    default:
  }
  return undefined;
};

export default parser;
