import { createFilter } from "@rollup/pluginutils";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import copy from "rollup-plugin-copy";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

import packageJson from "./package.json";

const distDirectory = path.join(__dirname, "dist");

const cleanDistDirectory = () => {
  if (fs.existsSync(distDirectory)) {
    rimraf.sync(`${distDirectory}/**/*`);
  } else {
    fs.mkdirSync(distDirectory);
  }
};

const copyTemplates = () => {};

const createReadme = () => {
  fs.copyFileSync(
    path.join(__dirname, "README.md"),
    path.join(distDirectory, "README.md")
  );
};

const createPackageJson = () => {
  fs.writeFileSync(
    path.join(distDirectory, "package.json"),
    JSON.stringify(
      {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        keywords: packageJson.keywords,
        homepage: packageJson.homepage,
        repository: packageJson.repository,
        license: packageJson.license,
        author: packageJson.author,
        main: packageJson.main,
        bin: packageJson.bin,
        dependencies: packageJson.dependencies,
        peerDependencies: packageJson.peerDependencies,
      },
      null,
      2
    )
  );
};

const external = createFilter(
  [
    ...Object.keys(packageJson.peerDependencies || {}),
    ...Object.keys(packageJson.dependencies || {}),
  ],
  null,
  {
    resolve: false,
  }
);

const plugins = [terser(), filesize(), visualizer()];

const configuratorConfig = {
  external,
  input: "index.js",
  output: [
    {
      exports: "named",
      file: "dist/index.js",
      format: "cjs",
    },
  ],
  plugins: [
    ...plugins,
    copy({
      targets: [{ src: "templates/**/*", dest: "dist/templates" }],
    }),
  ],
};

const cliConfig = {
  external,
  input: "cli.js",
  output: [
    {
      exports: "named",
      file: "dist/cli.js",
      format: "cjs",
    },
  ],
  plugins,
};

cleanDistDirectory();
copyTemplates();
createReadme();
createPackageJson();

export default [configuratorConfig, cliConfig];
