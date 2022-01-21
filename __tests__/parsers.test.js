import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { parsers } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);

describe('parsers', () => {
  test('json', () => {
    const filename = 'file.json';
    const expectedResult = {
      host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22', follow: false,
    };
    const realResult = parsers(getFixturesPath(filename));
    expect(realResult).toMatchObject(expectedResult);
  });

  test('yaml', () => {
    const filename = 'file.yaml';
    const expectedResult = { first: 'first', second: 'other', third: 'another' };
    const realResult = parsers(getFixturesPath(filename));
    expect(realResult).toMatchObject(expectedResult);
  });

  test('yml', () => {
    const filename = 'file.yml';
    const expectedResult = { first: 'first', second: 'other', third: 'another' };
    const realResult = parsers(getFixturesPath(filename));
    expect(realResult).toMatchObject(expectedResult);
  });

  test('default', () => {
    const filename = 'file';
    const realResult = parsers(getFixturesPath(filename));
    expect(realResult).toBeUndefined();
  });
});
