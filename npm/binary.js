const { Binary } = require("binary-install");
const os = require("os");

const error = (msg) => {
  console.error(msg);
  process.exit(1);
};

const { version, name, repository } = require("../package.json");

const supportedPlatforms = [
  {
    TYPE: "Windows_NT",
    ARCHITECTURE: "x64",
    RUST_TARGET: "win64",
    BINARY_NAME: "dsa",
  },
];

const getPlatformMetadata = () => {
  const type = os.type();
  const architecture = os.arch();

  for (let supportedPlatform of supportedPlatforms) {
    if (
      type === supportedPlatform.TYPE &&
      architecture === supportedPlatform.ARCHITECTURE
    ) {
      return supportedPlatform;
    }
  }

  error(
    `Platform with type "${type}" and architecture "${architecture}" is not supported by ${name}.`
  );
};

const getBinary = () => {
  const platformMetadata = getPlatformMetadata();
  // the url for this binary is constructed from values in `package.json`
  const url = `https://github.com/vladdoroniuk/create-dsa-folder/releases/download/v${version}/${name}-${platformMetadata.RUST_TARGET}.tar.gz`;
  return new Binary(platformMetadata.BINARY_NAME, url);
};

const run = () => {
  const binary = getBinary();
  binary.run();
};

const install = () => {
  const binary = getBinary();
  binary.install();
};

module.exports = {
  install,
  run,
};
