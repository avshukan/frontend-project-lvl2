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
    const diff = genDiff(filepath1, filepath2);
    console.log(`${program.opts().format}: ${diff}`);
  });

program.parse();
