import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/** Build-time PNG dimensions keep owner-replaceable image slots in proportion. */
export async function figureDimensions(figure: {
  src: string;
  width: number;
  height: number;
}) {
  if (!figure.src.endsWith(".png"))
    return { width: figure.width, height: figure.height };
  const data = await readFile(resolve("public", `.${figure.src}`));
  if (
    !data
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
    data.toString("ascii", 12, 16) !== "IHDR"
  ) {
    throw new Error(`Invalid PNG: ${figure.src}`);
  }
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  if (!width || !height) throw new Error(`Empty PNG: ${figure.src}`);
  return { width, height };
}
