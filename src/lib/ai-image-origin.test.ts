import { describe, expect, it } from "vitest";
import { inspectImageOrigin } from "./ai-image-origin";

const encoder = new TextEncoder();
const bytes = (s: string) => [...encoder.encode(s)];
const result = (value: number[]) => inspectImageOrigin(Uint8Array.from(value).buffer);
const pngChunk = (type: string, content: string) => {
  const payload = bytes(content);
  const n = payload.length;
  return [n >>> 24, n >>> 16 & 255, n >>> 8 & 255, n & 255, ...bytes(type), ...payload, 0, 0, 0, 0];
};

describe("image metadata provenance checker", () => {
  it("recognizes strong AI generation metadata in JPEG APP segments", () => {
    const body = bytes("Exif\0\0 parameters: Stable Diffusion");
    const length = body.length + 2;
    const image = [255, 216, 255, 225, length >>> 8, length & 255, ...body, 255, 217];
    expect(result(image)).toMatchObject({ format: "JPEG", verdict: "ai-clues", signals: ["Stable Diffusion"] });
  });
  it("does not label images without metadata as human-made", () => {
    expect(result([255, 216, 255, 217])).toMatchObject({ format: "JPEG", verdict: "inconclusive" });
  });
  it("finds PNG generator metadata, ignoring picture bytes", () => {
    const image = [137, 80, 78, 71, 13, 10, 26, 10,
      ...pngChunk("tEXt", "parameters\0ComfyUI workflow"), ...pngChunk("IEND", "")];
    expect(result(image)).toMatchObject({ format: "PNG", verdict: "ai-clues", signals: ["ComfyUI"] });
  });
  it("reports C2PA metadata without pretending signatures were verified", () => {
    const image = [137, 80, 78, 71, 13, 10, 26, 10,
      ...pngChunk("caBX", "credential payload"), ...pngChunk("IEND", "")];
    expect(result(image)).toMatchObject({ verdict: "credentials", hasCredentialsMarker: true });
  });
  it("recognizes metadata in WebP XMP chunks", () => {
    const payload = bytes("Generated with Midjourney");
    const len = payload.length;
    const chunk = [...bytes("XMP "), len & 255, len >>> 8 & 255, len >>> 16 & 255, len >>> 24 & 255, ...payload, ...(len % 2 ? [0] : [])];
    const riffLen = chunk.length + 4;
    const image = [...bytes("RIFF"), riffLen & 255, riffLen >>> 8 & 255, riffLen >>> 16 & 255, riffLen >>> 24 & 255, ...bytes("WEBP"), ...chunk];
    expect(result(image)).toMatchObject({ format: "WebP", verdict: "ai-clues", signals: ["Midjourney"] });
  });
  it("does not claim to support arbitrary or invalid image formats", () => {
    expect(result(bytes("not an image"))).toMatchObject({ verdict: "unsupported" });
    expect(result(bytes("\0\0\0\0ftypheic"))).toMatchObject({ format: "HEIC / AVIF", verdict: "unsupported" });
  });
});
