// news-image-20261125 entry (Node 22+, standard library only).
//
// The poster sits next to this file as entry.png: a 1024x1024 front page
// summing up Wednesday 25 November 2026. This program checks the PNG is
// complete and inside the bounty limits, then copies it to the output
// directory and confirms the copy matches byte for byte.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const SIZE_LIMIT = 1048576; // 1 MiB
const EDGE_LIMIT = 1024;

// CRC-32 (IEEE) lookup table, generated from the polynomial 0xedb88320.
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Read the PNG chunk by chunk, checking every CRC and the layout the
// bounty requires: an IHDR first, at least one IDAT, and an IEND last.
function checkPng(bytes: Buffer): { width: number; height: number } {
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("entry.png is missing the PNG signature");
  }
  let pos = 8;
  let width = 0;
  let height = 0;
  let idatSeen = false;
  let lastChunk = "";
  let firstChunk = true;
  while (pos + 8 <= bytes.length) {
    const dataLen = bytes.readUInt32BE(pos);
    const type = bytes.toString("latin1", pos + 4, pos + 8);
    if (firstChunk && type !== "IHDR") {
      throw new Error(`the first chunk is ${type}, not IHDR`);
    }
    firstChunk = false;
    const dataStart = pos + 8;
    const dataEnd = dataStart + dataLen;
    if (dataEnd + 4 > bytes.length) {
      throw new Error(`chunk ${type} runs past the end of the file`);
    }
    const stored = bytes.readUInt32BE(dataEnd);
    const check = crc32(
      Buffer.concat([
        bytes.subarray(pos + 4, pos + 8),
        bytes.subarray(dataStart, dataEnd),
      ]),
    );
    if (stored !== check) {
      throw new Error(`chunk ${type} failed its CRC-32 check`);
    }
    if (type === "IHDR") {
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
    } else if (type === "IDAT") {
      idatSeen = true;
    }
    lastChunk = type;
    pos = dataEnd + 4;
  }
  if (pos !== bytes.length) throw new Error("trailing bytes after the final chunk");
  if (lastChunk !== "IEND") throw new Error("the file does not end with an IEND chunk");
  if (width === 0 || height === 0) throw new Error("no IHDR chunk found");
  if (!idatSeen) throw new Error("no IDAT chunk found");
  return { width, height };
}

const poster = readFileSync(new URL("./entry.png", import.meta.url));
if (poster.length > SIZE_LIMIT) {
  throw new Error(`entry.png is ${poster.length} bytes, over the 1 MiB limit`);
}
const { width, height } = checkPng(poster);
if (width > EDGE_LIMIT || height > EDGE_LIMIT) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.png");
copyFileSync(new URL("./entry.png", import.meta.url), outPath);
const copied = readFileSync(outPath);
if (!copied.equals(poster)) {
  throw new Error("the written entry.png differs from the checked poster");
}
console.log(`poster OK: ${width}x${height}, ${poster.length} bytes`);
console.log(`wrote ${outPath}, verified byte-for-byte`);
