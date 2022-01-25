import _ from 'lodash';

const getName = (node) => node.name;

const setName = (node, name) => {
  node.name = name;
}

const getState = (node) => node.state;

const setState = (node, state) => {
  node.state = state;
}

const getValue = (node) => node.value;

const setValue = (node, value) => {
  node.value = value;
}

const getIsObject = (node) => node.isObject;

const setIsObject = (node, isObject) => {
  node['isObject'] = isObject;
}

const getChildren = (node) => node.children;

const addChildren = (node, child) => {
  node.children.push(child);
}

const makeNode = (obj, name, state = '=') => {
  const node = {
    children: []
  };
  setName(node, name);
  setState(node, state);
  if (typeof obj === 'object' && obj !== null) {
    setIsObject(node, true);
    _.keys(obj).forEach((key) => {
      const child = makeNode(obj[key], key);
      addChildren(node, child);
    });
  } else {
    setIsObject(node, false);
    setValue(node, obj);
  }
  return node;
}

const deepCopy = (node) => {
  const name = getName(node);
  if (!getIsObject(node)) {
    return makeNode(getValue(node), name);
  }
  const copy = makeNode({}, name);
  setState(copy, getState(node));
  setIsObject(copy, getIsObject(node));
  getChildren(node).forEach(child => {
    const copyChild = deepCopy(child);
    addChildren(copy, copyChild);
  });
  return copy;
}

const printArrayNode = (node, deep = 0) => {
  const indent = ' ';
  const print = [];
  const name = getName(node);
  const state = getState(node);
  const value = getValue(node);
  const children = getChildren(node);
  const isObject = getIsObject(node);
  if (isObject) {
    const firstString = (deep > 0) ? `${indent.repeat(4 * deep - 2)}${state} ${name}: {` : '{';
    print.push(firstString);
    children.forEach((child) => {
      const printChild = printArrayNode(child, deep + 1);
      print.push(...printChild);
    })
    const lastString = (deep > 0) ? `${indent.repeat(4 * deep)}}` : '}';
    print.push(lastString);
  } else {
    print.push(`${indent.repeat(4 * deep - 2)}${state} ${name}: ${value}`)
  }
  return print;
}

const printNode = (node) => printArrayNode(node).join('\n');

// const makeDiff = (obj1, obj2) => {
//   const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();
//   const diff = keys.map((key) => {
//     if (!_.has(obj1, key)) { return [`+ ${key}: ${obj2[key]}`]; }
//     if (!_.has(obj2, key)) { return [`- ${key}: ${obj1[key]}`]; }
//     return (obj1[key] === obj2[key])
//       ? [`  ${key}: ${obj2[key]}`]
//       : [`- ${key}: ${obj1[key]}`, `+ ${key}: ${obj2[key]}`];
//   });
//   return diff;
// };

// const printDiff = (diff) => ['{', ...diff.flat().map((s) => (`  ${s}`)), '}'].join('\n');

// export default (obj1, obj2) => {
//   const diff = makeDiff(obj1, obj2);
//   const print = printDiff(diff);
//   return print;
// };

const makeDiff = (children1, children2) => {
  const children = [];
  const keys = _.union(children1.map((child) => getName(child)), children2.map((child) => getName(child)));
  keys.forEach(key => {
  })
  console.log(keys);
  return children;
};

const genDiff = (obj1, obj2) => {
  const node1 = makeNode(obj1);
  const node2 = makeNode(obj2);
  const node = makeNode({});
  const children1 = getChildren(node1);
  const children2 = getChildren(node2);
  const children = makeDiff(children1, children2);
  children.forEach(child => addChildren(node, child));
  return printNode(node);
}

export default genDiff;

const x = {
  "common": {
      "setting1": "Value 1",
      "setting2": 200,
      "setting3": true,
      "setting6": {
          "key": "value",
          "doge": {
              "wow": ""
          }
      }
  },
  "group1": {
      "baz": "bas",
      "foo": "bar",
      "nest": {
          "key": "value"
      }
  },
  "group2": {
      "abc": 12345,
      "deep": {
          "id": 45
      }
  }
};


const y = {
  "common": {
      "follow": false,
      "setting1": "Value 1",
      "setting3": null,
      "setting4": "blah blah",
      "setting5": {
          "key5": "value5"
      },
      "setting6": {
          "key": "value",
          "ops": "vops",
          "doge": {
              "wow": "so much"
          }
      }
  },
  "group1": {
      "foo": "bar",
      "baz": "bars",
      "nest": "str"
  },
  "group3": {
      "deep": {
          "id": {
              "number": 45
          }
      },
      "fee": 100500
  }
};

const xNode = makeNode(x)
const xCopy = deepCopy(xNode);
console.log(xCopy);
console.log(printNode(xCopy));

const z = {};

console.log(makeNode(z));
console.log(printNode(makeNode(z)));

const diff = genDiff(x, z);

console.log(diff);
