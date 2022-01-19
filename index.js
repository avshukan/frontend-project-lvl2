import genDiff from './src/genDiff.js';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

(() => {
    const file = fs.readFileSync(path.join( '__fixtures__', 'file1.yaml'));
    const doc = yaml.load(file);
    console.log('doc', doc);
})();


export default genDiff;
