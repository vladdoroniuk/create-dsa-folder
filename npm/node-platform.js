const os = require("os");
const path = require("path");
const fs = require("fs");
const { version, name, repository } = require("../package.json");

const supportedPlatforms = [
  {
    TYPE: "Windows_NT",
    ARCHITECTURE: "x64",
    RUST_TARGET: "win64",
    BINARY_NAME: `${name}.exe`,
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
};

const generateURL = () => {
  const { RUST_TARGET } = getPlatformMetadata();
  const url = `https://github.com/vladdoroniuk/${name}/releases/download/v${version}/${name}-${RUST_TARGET}.tar.gz`;

  return url;
};

const generateBinPath = () => {
  const { BINARY_NAME, RUST_TARGET } = getPlatformMetadata();
  const subPath = path.join(__dirname, "../bin");

  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true });
  }

  const binPath = path.join(subPath, BINARY_NAME);
  const tarGzPath = `${name}-${RUST_TARGET}/${BINARY_NAME}`;

  return { subPath, binPath, tarGzPath };
};

module.exports = {
  generateBinPath,
  generateURL,
};
