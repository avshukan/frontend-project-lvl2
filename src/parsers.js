import YAML from 'js-yaml';

const jsonParser = JSON.parse;

const yamlParser = YAML.load;

const parser = (format) => {
  switch (format) {
    case 'yaml':
    case 'yml':
      return yamlParser;
    case 'json':
      return jsonParser;
    default:
      throw new Error('Invalid extension');
  }
};

export default parser;
