import genDiff from '../index.js';
import file1 from '../__fixtures__/file1.json';
import file2 from '../__fixtures__/file2.json';

test('reverse', () => {
  const diff12 = genDiff(file1, file2);
  expect(1).toEqual(1);
  console.log(diff12);
});
