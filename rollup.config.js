import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/the-json-library.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/the-json-library.esm.js",
      format: "esm",
    },
    {
      file: "dist/the-json-library.umd.js",
      format: "umd",
      name: "jsonSchemaValidator",
    },
  ],
  plugins: [resolve(), commonjs(), terser()],
};
