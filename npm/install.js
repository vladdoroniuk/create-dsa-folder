const axios = require("axios");
const tar = require("tar");
const rimraf = require("rimraf");
const { generateURL, generateBinPath } = require("./node-platform");

const install = () => {
  const { binPath, installDirectory } = generateBinPath();
  const url = generateURL();

  if (existsSync(binPath)) {
    return Promise.resolve();
  }

  if (existsSync(installDirectory)) {
    rimraf.sync(installDirectory);
  }

  mkdirSync(installDirectory, { recursive: true });

  return axios({ url, responseType: "stream" })
    .then((res) => {
      return new Promise((resolve, reject) => {
        const sink = res.data.pipe(tar.x({ strip: 1, C: installDirectory }));
        sink.on("finish", () => resolve());
        sink.on("error", (err) => reject(err));
      });
    })
    .catch((e) => {
      error(`Error fetching release: ${e.message}`);
    });
};
