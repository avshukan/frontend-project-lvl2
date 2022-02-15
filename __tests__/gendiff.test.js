import fs from 'fs';
import path, { dirname } from 'path';
import {
  test, expect, describe, beforeAll,
} from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff from '../src/genDiff.js';

const expected = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

const handler = (filenameBefore, filenameAfter) => {
  const path1 = getFixturesPath(filenameBefore);
  const path2 = getFixturesPath(filenameAfter);
  expect(genDiff(path1, path2, '')).toEqual(expected.stylish);
  expect(genDiff(path1, path2, 'stylish')).toEqual(expected.stylish);
  expect(genDiff(path1, path2, 'plain')).toEqual(expected.plain);
  expect(JSON.parse(genDiff(path1, path2, 'json'))).toMatchObject(JSON.parse(expected.json));
};

beforeAll(() => {
  expected.stylish = readFile('expected-stylish.txt');
  expected.plain = readFile('expected-plain.txt');
  expected.json = readFile('expected-json.json');
});

describe('all tests', () => {
  test.each([
    ['file1.json', 'file2.json'],
    ['file1.json', 'file2.yml'],
    ['file1.yml', 'file2.json'],
    ['file1.yml', 'file2.yml'],
  ])('apply genDiff with %s & %s', handler);
});
