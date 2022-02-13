import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

const handler = (filenameBefore, filenameAfter) => {
  const path1 = getFixturesPath(filenameBefore);
  const path2 = getFixturesPath(filenameAfter);
  const realStylish = genDiff(path1, path2, 'stylish');
  const expectedStylish = readFile('expected.stylish');
  expect(realStylish).toEqual(expectedStylish);
  const realPlain = genDiff(path1, path2, 'plain');
  const expectedPlain = readFile('expected.plain');
  expect(realPlain).toEqual(expectedPlain);
  const realJson = genDiff(path1, path2, 'json');
  const expectedJson = readFile('expected.json');
  expect(JSON.parse(realJson)).toMatchObject(JSON.parse(expectedJson));
};

describe('all tests', () => {
  test.each([
    ['file1.json', 'file2.json'],
    ['file1.json', 'file2.yml'],
    ['file1.yml', 'file2.json'],
    ['file1.yml', 'file2.yml'],
  ])('apply genDiff with %s & %s', handler);
});
