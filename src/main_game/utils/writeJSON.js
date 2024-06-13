import * as fs from 'fs';

export default function writeJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
