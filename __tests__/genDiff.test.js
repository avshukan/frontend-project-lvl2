import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import parser from '../src/parsers.js';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');

const handler = (filenameBefore, filenameAfter, filenameExpected, formatName = 'stylish') => {
  const realResult = genDiff(
    getFixturesPath(filenameBefore),
    getFixturesPath(filenameAfter),
    formatName,
  );
  const expectedResult = readFile(filenameExpected);
  expect(realResult).toEqual(expectedResult);
};

describe('tests stylish formatter', () => {
  test.each([
    ['file0.json', 'file0.json', 'diff00.stylish', 'stylish'],
    ['file0.json', 'file1.yaml', 'diff01.stylish', 'stylish'],
    ['file0.json', 'file2.json', 'diff02.stylish', 'stylish'],
    ['file1.yaml', 'file2.json', 'diff12.stylish', 'stylish'],
    ['file5.json', 'file5.json', 'diff55.stylish', 'stylish'],
    ['file5.json', 'file6.json', 'diff56.stylish', 'stylish'],
    ['file5.json', 'file7.yaml', 'diff57.stylish', 'stylish'],
    ['file5.json', 'file8.yaml', 'diff58.stylish', 'stylish'],
    ['file7.yaml', 'file7.yaml', 'diff77.stylish', 'stylish'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('tests plain formatter', () => {
  test.each([
    ['file0.json', 'file0.json', 'diff00.plain', 'plain'],
    ['file0.json', 'file7.yaml', 'diff07.plain', 'plain'],
    ['file1.yaml', 'file5.json', 'diff15.plain', 'plain'],
    ['file7.yaml', 'file6.json', 'diff76.plain', 'plain'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('tests json formatter', () => {
  test.each([
    ['file3.yaml', 'file4.json', 'diff34.json', 'json'],
    ['file7.yaml', 'file6.json', 'diff76.json', 'json'],
  ])('apply genDiff with %s & %s and expected %s', (filenameBefore, filenameAfter, filenameExpected, formatName = 'stylish') => {
    const diff = genDiff(
      getFixturesPath(filenameBefore),
      getFixturesPath(filenameAfter),
      formatName,
    );
    const realResult = JSON.parse(diff);
    const expectedResult = parser(getFixturesPath(filenameExpected));
    expect(realResult).toMatchObject(expectedResult);
  });
});
