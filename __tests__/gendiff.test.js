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

const handler = (filenameBefore, filenameAfter) => {
  const path1 = getFixturesPath(filenameBefore);
  const path2 = getFixturesPath(filenameAfter);
  expect(genDiff(path1, path2, '')).toEqual(expectedStylish);
  expect(genDiff(path1, path2, 'stylish')).toEqual(expectedStylish);
  expect(genDiff(path1, path2, 'plain')).toEqual(expectedPlain);
  expect(JSON.parse(genDiff(path1, path2, 'json'))).toMatchObject(JSON.parse(expectedJson));
};

describe('all tests', () => {
  test.each([
    ['file1.json', 'file2.json'],
    ['file1.json', 'file2.yml'],
    ['file1.yml', 'file2.json'],
    ['file1.yml', 'file2.yml'],
  ])('apply genDiff with %s & %s', handler);
});
