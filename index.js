const fs = require("fs");
const path = require("path");
const reactPackageJsonTemplate = require("./templates/react/package.template.json");
const reactTypescriptPackageJsonTemplate = require("./templates/react-typescript/package.template.json");

const ApplicationTypes = Object.freeze({
  REACT: "react",
  REACT_TYPESCRIPT: "react-ts",
});

const copyTemplatesToDestination = (
  filesToCopy,
  sourceDirectory,
  destinationDirectory
) => {
  if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory);
  }
  filesToCopy.forEach((file) => {
    const destinationFilename = file.replace(".template", "");
    fs.copyFileSync(
      path.join(sourceDirectory, file),
      path.join(destinationDirectory, destinationFilename)
    );
  });
};

const configureApplicationTooling = (applicationType) => {
  switch (applicationType) {
    case ApplicationTypes.REACT_TYPESCRIPT:
      copyTemplatesToDestination(
        [
          ".eslintrc.template.json",
          "jest.config.template.js",
          "tsconfig.template.json",
          "webpack.config.template.js",
        ],
        path.resolve(__dirname, "./templates/react-typescript"),
        "./"
      );
      break;
    default:
      copyTemplatesToDestination(
        [
          ".eslintrc.template.json",
          "jest.config.template.js",
          "webpack.config.template.js",
        ],
        path.resolve(__dirname, "./templates/react"),
        "./"
      );
      break;
  }
};

const configureCommonTooling = () => {
  copyTemplatesToDestination(
    [
      ".eslintignore.template",
      ".gitignore.template",
      ".npmrc.template",
      ".prettierignore.template",
      "commitlint.config.template.js",
      "lint-staged.config.template.js",
      "stylelint.config.template.js",
    ],
    path.resolve(__dirname, "./templates/common"),
    "./"
  );
};

const configureGitHooks = () => {
  copyTemplatesToDestination(
    ["prepare-commit-msg.template.sh"],
    path.resolve(__dirname, "./templates/common"),
    "git-hooks"
  );
};

const configureJestMocks = () => {
  copyTemplatesToDestination(
    ["fileMock.template.js", "styleMock.template.js"],
    path.resolve(__dirname, "./templates/common"),
    "__mocks__"
  );
};

const configurePackageJson = (applicationType) => {
  const applicationPackageJsonFile = fs.readFileSync("package.json");
  const applicationPackageJson = JSON.parse(applicationPackageJsonFile);

  let packageJsonTemplate;
  switch (applicationType) {
    case ApplicationTypes.REACT_TYPESCRIPT:
      packageJsonTemplate = reactTypescriptPackageJsonTemplate;
      break;
    default:
      packageJsonTemplate = reactPackageJsonTemplate;
      break;
  }

  fs.writeFileSync(
    "package.json",
    JSON.stringify(
      {
        ...applicationPackageJson,
        husky: {
          hooks: {
            "pre-commit": "lint-staged && npm run test:changed",
            "prepare-commit-msg":
              "git-hooks/prepare-commit-msg.sh ${HUSKY_GIT_PARAMS}", // eslint-disable-line no-template-curly-in-string
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
            "pre-push": "npm run lint && npm run test",
          },
        },
        ...packageJsonTemplate,
      },
      null,
      4
    )
  );
};

const configure = (applicationType) => {
  configureApplicationTooling(applicationType);
  configureCommonTooling();
  configureGitHooks();
  configureJestMocks();
  configurePackageJson(applicationType);
};

module.exports = {
  ApplicationTypes,
  configure,
};
