/* node/thumbnailRequests.mjs
   ------------------------------------------------------------
   Writing a thumbnail picture for an item that shows in a category list.

   Request handled here:
     writeThumbnail   payload { kind, domain, category, name, pngBase64 }
       kind      "patterns", "gallery", "figures" or "drawRegistry"
       domain    only for "gallery": "Ideabook", "Patterns" or "Scripts"
       category  the category folder (for "drawRegistry": the object's key)
       name      the item's file name without extension
       pngBase64 the PNG, base64 text (the browser draws it)
     Writes <folder>/images/thumb_<name>.png, replacing any older picture.
     The category folder must already exist; this never creates one. (The
     one exception is a Draw object's folder, which is made when the file
     drawRegistry/<key>.js exists.)
     Returns { status: "ok", path }.

   The folders and names are the ones ui/thumbnailSettings.js reads.
   Bad requests throw a RequestError (HTTP 400).
   ------------------------------------------------------------ */

import fs   from "fs";
import path from "path";
import { RequestError, assertSimpleName } from "./safePaths.mjs";
import { assertFileName } from "./figureFiles.mjs";
import { writeFileAtomicSync } from "./serviceFileHelpers.mjs";

const GALLERY_DOMAINS = ["Ideabook", "Patterns", "Scripts"];
const MAX_PNG_BYTES   = 1024 * 1024;
const PNG_SIGNATURE   = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);


export async function writeThumbnail(payload = {}) {

  const { kind, domain, category, name, pngBase64 } = payload;

  assertSimpleName(category, "writeThumbnail: category");
  assertFileName(name, "writeThumbnail: name");

  let categoryDir;
  if (kind === "patterns" || kind === "figures" || kind === "drawRegistry") {
    categoryDir = path.resolve("./" + kind, category);
  } else if (kind === "gallery") {
    if (!GALLERY_DOMAINS.includes(domain)) {
      throw new RequestError("writeThumbnail: domain must be one of " + GALLERY_DOMAINS.join(", "));
    }
    categoryDir = path.resolve("./gallery", domain, category);
  } else {
    throw new RequestError("writeThumbnail: kind must be patterns, gallery, figures or drawRegistry");
  }

  // A Draw object keeps its pictures in drawRegistry/<key>/images, but most
  // have no such folder yet; it is made when the object's file exists.
  if (kind === "drawRegistry" && !fs.existsSync(categoryDir) && fs.existsSync(path.resolve("./drawRegistry", category + ".js"))) {
    fs.mkdirSync(categoryDir);
  }
  if (!fs.existsSync(categoryDir) || !fs.statSync(categoryDir).isDirectory()) {
    throw new RequestError("writeThumbnail: no such category folder: " + kind + "/" + category);
  }

  if (typeof pngBase64 !== "string" || pngBase64.trim() === "") {
    throw new RequestError("writeThumbnail: pngBase64 missing");
  }
  const bytes = Buffer.from(pngBase64, "base64");
  if (bytes.length > MAX_PNG_BYTES) throw new RequestError("writeThumbnail: picture is larger than 1 MB");
  if (bytes.length < PNG_SIGNATURE.length || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new RequestError("writeThumbnail: the data is not a PNG");
  }

  const imagesDir = path.join(categoryDir, "images");
  fs.mkdirSync(imagesDir, { recursive: true });
  const outPath = path.join(imagesDir, "thumb_" + name + ".png");
  writeFileAtomicSync(outPath, bytes);

  return { request: "writeThumbnail", status: "ok", path: path.relative(path.resolve("."), outPath).split(path.sep).join("/") };

} // end writeThumbnail

// end thumbnailRequests.mjs
