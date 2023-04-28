import * as path from "path";
import type { Locale } from "@services/i18n/i18n";

const rootDir = path.resolve(process.cwd());
const dataDir = path.resolve(rootDir, "data_in_repo");
const outcomeDir = (locale: Locale) => path.resolve(dataDir, "2022", locale, "outcomes");
const tableDir = (locale: Locale) => path.resolve(dataDir, "2022", locale, "tables");

export { rootDir, dataDir, outcomeDir, tableDir };
