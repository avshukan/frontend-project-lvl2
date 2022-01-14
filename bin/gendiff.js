#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const getPath = (filename) => path.resolve(__dirname, filename);

const readFile = (filename) => fs.readFileSync(getPath(filename), 'utf-8');

// Само чтение файлов нужно выполнять либо внутри тестов,
// либо внутри хуков, например `beforeAll` или `beforeEach`.
// Не стоит этого делать на уровне модуля, вне функций.
// const html = await readFile('withLinks.html');
// const json = await readFile('somethingElse.json');

const program = new Command();

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .helpOption(true, 'output usage information')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    try {
      const data1 = readFile(filepath1);
      const data2 = readFile(filepath2);
      const diff = genDiff(data1, data2);
      console.log(diff);
    } catch (e) {
      console.error('something was wrong...');
      console.log(e);
    }
  });

program.parse();
