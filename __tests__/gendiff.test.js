import fs from 'fs';
import path, { dirname } from 'path';
import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff, { parser } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');
const handler = (filenameBefore, filenameAfter, filenameExpected, formatName = 'stylish') => {
  const fileBefore = parser(getFixturesPath(filenameBefore));
  const fileAfter = parser(getFixturesPath(filenameAfter));
  const realResult = genDiff(fileBefore, fileAfter, formatName);
  const expectedResult = readFile(filenameExpected);
  expect(realResult).toEqual(expectedResult);
};

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
  ])('apply genDiff with %s & %s and expected %s', handler);
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
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('deep json tests', () => {
  test.each([
    ['deepFile1.json', 'deepFile2.json', 'deepJsonDiff12.txt'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('deep yaml tests', () => {
  test.each([
    ['deepFile1.yaml', 'deepFile2.yaml', 'deepYamlDiff12.txt'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('deep json vs yaml tests', () => {
  test.each([
    ['deepFile1.json', 'deepFile1.yaml', 'deepJsonYamlDiff11.txt'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('tests for deep json files and plain formatter', () => {
  test.each([
    ['deepFile0.json', 'deepFile1.json', 'deepJsonPlainDiff01.txt', 'plain'],
    ['deepFile1.json', 'deepFile2.json', 'deepJsonPlainDiff12.txt', 'plain'],
  ])('apply genDiff with %s & %s and expected %s', handler);
});

describe('tests for deep yaml files and json formatter', () => {
  test.each([
    ['file1.yaml', 'file2.yaml', 'deepYamlDiff12.json', 'json'],
  ])('apply genDiff with %s & %s and expected %s', (filenameBefore, filenameAfter, filenameExpected, formatName = 'stylish') => {
    const fileBefore = parser(getFixturesPath(filenameBefore));
    const fileAfter = parser(getFixturesPath(filenameAfter));
    const realResult = genDiff(fileBefore, fileAfter, formatName);
    const expectedResult = JSON.stringify(parser(getFixturesPath(filenameExpected)));
    expect(realResult).toEqual(expectedResult);
  });
});
