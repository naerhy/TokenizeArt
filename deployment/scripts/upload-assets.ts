import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PinataSDK, UploadResponse } from "pinata";
import * as z from "zod";

interface Metadata {
  name: string;
  description: string;
  image: string;
}

type UploadContent = {
  type: "file";
  content: Blob;
} | {
  type: "json";
  content: Object;
};

const Env = z.object({
  PINATA_JWT: z.string(),
  PINATA_GATEWAY: z.string()
});
const env = Env.parse(process.env);

const assetsDir = "assets";
const metadataPath = `${assetsDir}/metadata.json`;
const imagePath = `${assetsDir}/nft.jpeg`;
const targetFilename = "nft";
const allowedExtensions = ["jpeg", "jpg", "png"];

const pinata = new PinataSDK({ pinataJwt: env.PINATA_JWT, pinataGateway: env.PINATA_GATEWAY });

async function upload(uploadContent: UploadContent, filename: string, type?: string) {
  let upload: UploadResponse | null = null;
  if (uploadContent.type === "json") {
    upload = await pinata.upload.public.json(uploadContent.content).name(filename);
  } else {
    const file = new File([uploadContent.content], filename, { type });
    upload = await pinata.upload.public.file(file);
  }
  console.log(`${filename} has been succesfully uploaded to Pinata:`, upload);
  return upload;
}

// we remove the . in front of the extension (.jpeg)
const extension = path.extname(imagePath).substring(1);
if (!allowedExtensions.includes(extension)) {
  throw new Error(`Allowed extensions = jpeg | jpg | png, current = ${extension}`);
}
const { cid } = await upload(
  { type: "file", content: new Blob([fs.readFileSync(imagePath)]) },
  `${targetFilename}.${extension}`,
  `image/${extension}`
);

const metadataJSON = JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as Metadata;
metadataJSON.image = `ipfs://${cid}`;
console.log(`tokenURI: ipfs://${(await upload({ type: "json", content: metadataJSON }, "metadata.json")).cid}`);
