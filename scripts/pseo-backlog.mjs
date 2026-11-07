import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backlog = JSON.parse(readFileSync(resolve(root, "docs/pseo-backlog.json"), "utf8"));
const categoryArg = process.argv.find((arg) => arg.startsWith("--category="));
const category = categoryArg?.split("=")[1];
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const parsedLimit = Number(limitArg?.split("=")[1] ?? "30");
const limit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 1000) : 30;

const records = backlog.entries.filter((entry) => !category || entry.category === category);
if (category && records.length === 0) {
  console.error(`Brak tematów w kategorii "${category}". Dostępne: ${[...new Set(backlog.entries.map((entry) => entry.category))].join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`pSEO: ${records.length} propozycji w kolejce, pokazuję ${Math.min(limit, records.length)}. Cel: ${backlog.target}.\n`);
  for (const [index, entry] of records.slice(0, limit).entries()) {
    console.log(`${index + 1}. [${entry.category}] ${entry.query}`);
  }
  console.log("\nTo kolejka, nie opublikowane URL. Przed publikacją: sprawdź intencję, duplikaty, rozwiązanie i źródła.");
}
