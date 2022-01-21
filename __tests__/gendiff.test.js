import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff, { parsers } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

describe('json tests', () => {
  test.each([
    ['file0.json', 'file0.json', 'jsonDiff00.txt'],
    ['file0.json', 'file1.json', 'jsonDiff01.txt'],
    ['file0.json', 'file2.json', 'jsonDiff02.txt'],
    ['file1.json', 'file0.json', 'jsonDiff10.txt'],
    ['file1.json', 'file1.json', 'jsonDiff11.txt'],
    ['file1.json', 'file2.json', 'jsonDiff12.txt'],
    ['file2.json', 'file0.json', 'jsonDiff20.txt'],
    ['file2.json', 'file1.json', 'jsonDiff21.txt'],
    ['file2.json', 'file2.json', 'jsonDiff22.txt'],
  ])(
    'apply genDiff with %s & %s and expected %s',
    (filenameBefore, filenameAfter, filenameExpected) => {
      const fileBefore = parsers(getFixturesPath(filenameBefore));
      const fileAfter = parsers(getFixturesPath(filenameAfter));
      const expectedResult = readFile(filenameExpected);
      const realResult = genDiff(fileBefore, fileAfter);
      expect(realResult).toEqual(expectedResult);
    },
  );
});

describe('yaml tests', () => {
  test.each([
    ['file0.yaml', 'file0.yaml', 'yamlDiff00.txt'],
    ['file0.yaml', 'file1.yaml', 'yamlDiff01.txt'],
    ['file0.yaml', 'file2.yaml', 'yamlDiff02.txt'],
    ['file1.yaml', 'file0.yaml', 'yamlDiff10.txt'],
    ['file1.yaml', 'file1.yaml', 'yamlDiff11.txt'],
    ['file1.yaml', 'file2.yaml', 'yamlDiff12.txt'],
    ['file2.yaml', 'file0.yaml', 'yamlDiff20.txt'],
    ['file2.yaml', 'file1.yaml', 'yamlDiff21.txt'],
    ['file2.yaml', 'file2.yaml', 'yamlDiff22.txt'],
  ])(
    'apply genDiff with %s & %s and expected %s',
    (filenameBefore, filenameAfter, filenameExpected) => {
      const fileBefore = parsers(getFixturesPath(filenameBefore));
      const fileAfter = parsers(getFixturesPath(filenameAfter));
      const expectedResult = readFile(filenameExpected);
      const realResult = genDiff(fileBefore, fileAfter);
      expect(realResult).toEqual(expectedResult);
    },
  );
});
