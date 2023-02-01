const zlib = require("zlib");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { generateURL, generateBinPath } = require("./node-platform");

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          (res.statusCode === 301 || res.statusCode === 302) &&
          res.headers.location
        ) {
          return fetch(res.headers.location).then(resolve, reject);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Server responded with ${res.statusCode}`));
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
};

function extractFileFromTarGzip(buffer, tarGzPath) {
  try {
    buffer = zlib.unzipSync(buffer);
  } catch (err) {
    throw new Error(
      `Invalid gzip data in archive: ${(err && err.message) || err}`
    );
  }
  let str = (i, n) =>
    String.fromCharCode(...buffer.subarray(i, i + n)).replace(/\0.*$/, "");
  let offset = 0;
  while (offset < buffer.length) {
    let name = str(offset, 100);
    let size = parseInt(str(offset + 124, 12), 8);
    offset += 512;
    if (!isNaN(size)) {
      if (name === tarGzPath) return buffer.subarray(offset, offset + size);
      offset += (size + 511) & ~511;
    }
  }
  throw new Error(`Could not find ${JSON.stringify(tarGzPath)} in archive`);
}

const install = async () => {
  const { subPath, binPath, tarGzPath } = generateBinPath();
  const url = generateURL();

  if (fs.existsSync(binPath)) {
    return Promise.resolve();
  }

  if (fs.existsSync(subPath)) {
    fs.rmSync(subPath, { recursive: true, force: true });
  }

  fs.mkdirSync(subPath, { recursive: true });

  try {
    fs.writeFileSync(
      binPath,
      extractFileFromTarGzip(await fetch(url), tarGzPath)
    );
    fs.chmodSync(binPath, 0o755);
  } catch (e) {
    console.error(
      `[create-dsa-folder] Failed to download ${JSON.stringify(url)}: ${
        (e && e.message) || e
      }`
    );
    throw e;
  }
};

try {
  install();
} catch (e) {
  if (e && e.status) process.exit(e.status);
  throw e;
}
