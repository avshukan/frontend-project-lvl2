import YAML from 'js-yaml';

const jsonParser = JSON.parse;

const yamlParser = YAML.load;

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
