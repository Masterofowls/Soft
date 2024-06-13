import * as fs from 'fs';

export default function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
};
