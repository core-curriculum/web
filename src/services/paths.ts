import * as path from "path";

const rootDir = path.resolve(process.cwd());
const dataDir = path.resolve(rootDir, "data_in_repo");
const outcomeDir = path.resolve(dataDir, "2022", "ja", "outcomes")
const tableDir = path.resolve(dataDir, "2022", "ja", "tables")

export { rootDir, dataDir, outcomeDir, tableDir };
