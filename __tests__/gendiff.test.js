import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

const expectedStylish = readFile('expected-stylish.txt');
const expectedPlain = readFile('expected-plain.txt');
const expectedJson = readFile('expected-json.json');
const extensions = ['json', 'yml'];

const handler = (extension) => {
  const path1 = getFixturesPath(`file1.${extension}`);
  const path2 = getFixturesPath(`file2.${extension}`);
  expect(genDiff(path1, path2, '')).toEqual(expectedStylish);
  expect(genDiff(path1, path2, 'stylish')).toEqual(expectedStylish);
  expect(genDiff(path1, path2, 'plain')).toEqual(expectedPlain);
  expect(JSON.parse(genDiff(path1, path2, 'json'))).toMatchObject(JSON.parse(expectedJson));
};

describe('all tests', () => {
  test.each(extensions)('apply genDiff with %s', handler);
});
