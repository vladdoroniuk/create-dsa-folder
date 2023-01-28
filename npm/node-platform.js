const { Binary } = require("./binary-install");
const os = require("os");
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
  const { BINARY_NAME } = getPlatformMetadata();
  const installDirectory = join(__dirname, "bin");

  if (!existsSync(installDirectory)) {
    mkdirSync(installDirectory, { recursive: true });
  }

  const binPath = join(installDirectory, BINARY_NAME);

  return { binPath, installDirectory };
};

module.exports = {
  generateBinPath,
  generateURL,
};
