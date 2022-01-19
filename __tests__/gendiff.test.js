import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

test.each([
  ['file0.json', 'file0.json', 'diff00.txt'],
  ['file0.json', 'file1.json', 'diff01.txt'],
  ['file0.json', 'file2.json', 'diff02.txt'],
  ['file1.json', 'file0.json', 'diff10.txt'],
  ['file1.json', 'file1.json', 'diff11.txt'],
  ['file1.json', 'file2.json', 'diff12.txt'],
  ['file2.json', 'file0.json', 'diff20.txt'],
  ['file2.json', 'file1.json', 'diff21.txt'],
  ['file2.json', 'file2.json', 'diff22.txt'],
])(
  'apply genDiff with %s & %s and expected %s',
  (filenameBefore, filenameAfter, filenameExpected) => {
    const fileBefore = readFile(filenameBefore);
    const fileAfter = readFile(filenameAfter);
    const expectedResult = readFile(filenameExpected);
    const realResult = genDiff(fileBefore, fileAfter);
    expect(realResult).toEqual(expectedResult);
  },
);
