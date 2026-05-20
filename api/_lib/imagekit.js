const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadBuffer(buffer, fileName, folder = "/marshall-admin") {
  const file = await toFile(buffer, fileName);
  const result = await imagekit.files.upload({
    file,
    fileName: fileName || "upload",
    folder: folder,
    useUniqueFileName: true,
  });
  return { url: result.url };
}

module.exports = { uploadBuffer };
