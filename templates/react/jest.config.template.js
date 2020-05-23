const packageJson = require("./package");

module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/**/index.js"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  displayName: packageJson.name,
  moduleNameMapper: {
    "\\.(gif|jpeg|jpg|md|otf|png|svg|ttf|woff|woff2)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.s?css$": "<rootDir>/__mocks__/styleMock.js",
    "^react(.*)$": "<rootDir>/node_modules/react$1",
  },
};
