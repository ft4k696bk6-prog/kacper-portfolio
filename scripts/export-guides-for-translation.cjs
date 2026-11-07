#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Export actual published guide data for offline PL→EN translation.
 * Uses the project's installed TypeScript compiler; no extra dependencies.
 * This never writes private env vars or API tokens to the export.
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ts = require("typescript");

require.extensions[".ts"] = function transpile(mod, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true, resolveJsonModule: true },
    fileName: filename
  });
  mod._compile(result.outputText, filename);
};
const directory = require(path.resolve("src/lib/guide-directory.ts"));
const raw = directory.allGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  description: guide.description,
  intro: guide.intro,
  serviceLabel: guide.serviceLabel,
  sections: guide.sections.map((section) => ({
    title: section.title,
    paragraphs: section.paragraphs.map((paragraph) => String(paragraph))
  }))
}));
const contentKey = (g) => [g.title,g.description,g.intro,g.serviceLabel,...g.sections.flatMap(s => [s.title,...s.paragraphs])].join("\u0000");
const data = raw.map(g => ({
  ...g,
  sourceHash: crypto.createHash("sha256").update(contentKey(g), "utf8").digest("hex")
}));
const slugs = new Set(data.map(g=>g.slug));
if (slugs.size !== data.length) throw Error("Duplicate published guide slug detected");
const filename = process.argv[2] || "/tmp/bernecki-guide-source-pl.json";
fs.writeFileSync(filename, JSON.stringify(data,null,2)+"\n","utf8");
process.stdout.write("Exported "+data.length+" published Polish guides to "+filename+"\n");
