#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../index.js';

const program = new Command();

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .helpOption(true, 'output usage information')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    try {
      const formatter = program.opts().format;
      const diff = genDiff(filepath1, filepath2, formatter);
      console.log(diff);
    } catch (e) {
      console.error('something was wrong...');
      console.error(e);
    }
  });

program.parse();
