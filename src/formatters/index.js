import plain from './plain.js';
import stylish from './stylish.js';

export default (formatName) => (formatName === 'plain' ? plain : stylish);
