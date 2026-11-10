import { defineConfig } from "vitest/config";
export default defineConfig({
 esbuild:{jsx:"automatic",jsxImportSource:"react",tsconfigRaw:{compilerOptions:{jsx:"react-jsx"}}},
 test:{environment:"node"}
});
