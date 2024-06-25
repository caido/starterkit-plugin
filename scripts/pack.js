import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");

/**
 * @param {string} dirPath
 * @param {JSZip} zipFolder
 */
function addDirToZip(dirPath, zipFolder) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      const newZipFolder = zipFolder.folder(file);
      addDirToZip(filePath, newZipFolder);
    } else {
      const fileContents = fs.readFileSync(filePath);
      zipFolder.file(file, fileContents);
    }
  });
}

console.log("[*] Copying manifest file");
const srcManifestPath = path.resolve(__dirname, "../manifest.json");
const destManifestPath = path.join(DIST, "manifest.json");
fs.copyFileSync(srcManifestPath, destManifestPath);

console.log("[*] Creating zip");
const zip = new JSZip();

addDirToZip(DIST, zip);

const zipPath = path.join(DIST, "plugin.zip");
zip
  .generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  })
  .then((content) => {
    fs.writeFileSync(zipPath, content);
  })
  .catch((err) => console.error("[-] Error creating zip:", err));
