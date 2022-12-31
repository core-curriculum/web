import * as fs from "fs";
import * as path from "path";

const hasBOM = (data: Buffer) => data[0] == 0xef && data[1] == 0xbb && data[2] == 0xbf;
const stripBOM = (data: Buffer) => (hasBOM(data) ? data.slice(3) : data);

const readTextFileSync = (filename: string) => {
  const data = fs.readFileSync(filename);
  return stripBOM(data).toString();
};

const rootDir = path.resolve(process.cwd());
const dataDir = path.resolve(rootDir, "data_in_repo");

export { hasBOM, stripBOM, readTextFileSync, rootDir, dataDir };
