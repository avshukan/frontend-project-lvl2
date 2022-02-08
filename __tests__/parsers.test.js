import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getData, getFormat } from '../src/genDiff.js';
import parser from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

describe('parsers', () => {
  test('json', () => {
    const filename = 'file.json';
    const filepath = getFixturesPath(filename);
    const data = getData(filepath);
    const format = getFormat(filepath);
    const realResult = parser(data, format);
    const expectedResult = {
      host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22', follow: false,
    };

    expect(realResult).toMatchObject(expectedResult);
  });

  test('yaml', () => {
    const filename = 'file.yaml';
    const filepath = getFixturesPath(filename);
    const data = getData(filepath);
    const format = getFormat(filepath);
    const realResult = parser(data, format);
    const expectedResult = { first: 'first', second: 'other', third: 'another' };
    expect(realResult).toMatchObject(expectedResult);
  });

  test('yml', () => {
    const filename = 'file.yml';
    const filepath = getFixturesPath(filename);
    const data = getData(filepath);
    const format = getFormat(filepath);
    const realResult = parser(data, format);
    const expectedResult = { first: 'first', second: 'other', third: 'another' };
    expect(realResult).toMatchObject(expectedResult);
  });

  test('default', () => {
    const filename = 'file';
    const realResult = parser(getFixturesPath(filename));
    expect(realResult).toBeUndefined();
  });
});
