import yaml from 'js-yaml';

const jsonParser = JSON.parse;

const yamlParser = (data) => {
  const result = yaml.load(data);
  return result ?? {};
};

const parser = (data, format) => {
  switch (format) {
    case 'yaml':
    case 'yml':
      return yamlParser(data);
    case 'json':
      return jsonParser(data);
    default:
      throw new Error('Invalid extension');
  }
};

export default parser;
