const getStringsArray = (diff) => {
  if (Array.isArray(diff)) {
    return `[${diff.map((child) => getStringsArray(child)).join(', ')}]`;
  }
  if (diff === null) {
    return null;
  }
  if (typeof diff === 'object') {
    return `{${Object.keys(diff).filter((key) => diff[key] !== undefined).map((key) => `"${key}": ${getStringsArray(diff[key])}`).join(', ')}}`;
  }
  if (typeof diff === 'string') {
    return `"${diff}"`;
  }
  return diff;
};

export default getStringsArray;
