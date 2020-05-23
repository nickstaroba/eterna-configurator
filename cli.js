const readline = require("readline");
const meow = require("meow");
const { ApplicationTypes, configure } = require("./index");

const applicationTypesAsString = Object.values(ApplicationTypes).join(", ");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cli = meow(
  `
  Usage
    configurator [options]

  Options
    --app, -a       Application type (${applicationTypesAsString}).

  Other Options
    --force, -f     Overwrite without prompting.
    --help, -h      Show usage information.
`,
  {
    flags: {
      app: {
        type: "string",
        alias: "a",
      },
      force: {
        type: "boolean",
        alias: "f",
      },
      help: {
        type: "boolean",
        alias: "h",
      },
    },
  }
);

const handleError = (error) => {
  console.info(error);
  process.exit(1);
};

const configurator = () => {
  const { app, force, help } = cli.flags;

  if (help) {
    meow.showHelp();
  }

  let applicationType;
  if (app === ApplicationTypes.REACT) {
    applicationType = ApplicationTypes.REACT;
  } else if (app === ApplicationTypes.REACT_TYPESCRIPT) {
    applicationType = ApplicationTypes.REACT_TYPESCRIPT;
  }

  if (!applicationType) {
    handleError(
      `No application type set. Please try again using the "--app" flag with an appropriate value (${applicationTypesAsString}).`
    );
  }

  const configureApplication = () => {
    configure(applicationType);
    console.info("Configuration complete.");
    process.exit(0);
  };

  let overwrite;
  if (!force) {
    rl.question("Overwrite current tooling configuration (y/n)? ", (input) => {
      overwrite = input === "y";
      rl.close();
    });
  } else {
    configureApplication();
  }

  rl.on("close", () => {
    if (overwrite) {
      configureApplication();
    } else {
      handleError("Cannot configure application without overwrite permission.");
    }
  });
};

configurator();
