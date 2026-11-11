export type ImageOriginVerdict = "ai-clues" | "credentials" | "inconclusive" | "unsupported";
export type ImageOriginResult = {
  format: string;
  verdict: ImageOriginVerdict;
  signals: string[];
  hasCredentialsMarker: boolean;
  hasMetadata: boolean;
};

const signatures: Array<[RegExp, string]> = [
  [/stable[\s_-]*diffusion/i, "Stable Diffusion"],
  [/comfyui/i, "ComfyUI"],
  [/automatic1111|a1111/i, "AUTOMATIC1111"],
  [/midjourney/i, "Midjourney"],
  [/dall[\s.·_-]*e/i, "DALL·E"],
  [/adobe[\s_-]*firefly/i, "Adobe Firefly"],
  [/invokeai/i, "InvokeAI"],
  [/fooocus/i, "Fooocus"],
  [/civitai/i, "Civitai"],
  [/generative[\s_-]*fill/i, "Generative Fill"],
  [/flux[\s._-]*1(?:[\s._-]|$)/i, "FLUX.1"],
  [/chatgpt(?:[\s_-]*image)?/i, "ChatGPT"],
  [/openai[\s_-]*(?:image|generator|dall)/i, "OpenAI image generation"],
];
const maxExtract = 512_000;
function ascii(bytes: Uint8Array, offset: number, length: number): string {
  return new TextDecoder("latin1").decode(bytes.subarray(offset, offset + Math.min(length, maxExtract)));
}
function markers(data: Uint8Array): { format: string; chunks: string[]; credentials: boolean } {
  const chunks: string[] = [];
  let credentials = false;
  const push = (start: number, len: number, c2pa = false) => {
    if (c2pa) credentials = true;
    if (len > 0 && len <= maxExtract && start >= 0 && start + len <= data.length) chunks.push(ascii(data, start, len));
  };
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const be = (at: number) => view.getUint32(at, false);
  const le = (at: number) => view.getUint32(at, true);

  // JPEG: read only APP metadata and COM segments before compressed image data.
  if (data.length > 2 && data[0] === 0xff && data[1] === 0xd8) {
    let p = 2;
    while (p + 4 < data.length) {
      if (data[p] !== 0xff) break;
      while (p < data.length && data[p] === 0xff) p++;
      const marker = data[p++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd7) continue;
      if (p + 2 > data.length) break;
      const size = view.getUint16(p, false);
      if (size < 2 || p + size > data.length) break;
      if (marker >= 0xe1 && marker <= 0xef || marker === 0xfe) push(p + 2, size - 2);
      p += size;
    }
    return { format: "JPEG", chunks, credentials: credentials || chunks.some(s => /c2pa|jumbf/i.test(s)) };
  }

  // PNG: metadata is stored in text, EXIF and optional C2PA chunks.
  if (data.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => data[i] === v)) {
    let p = 8;
    while (p + 12 <= data.length) {
      const size = be(p);
      const type = ascii(data, p + 4, 4);
      if (size > data.length - p - 12) break;
      if (["tEXt", "iTXt", "eXIf", "zTXt", "caBX"].includes(type)) push(p + 8, size, type === "caBX");
      p += 12 + size;
      if (type === "IEND") break;
    }
    return { format: "PNG", chunks, credentials: credentials || chunks.some(s => /c2pa|jumbf/i.test(s)) };
  }

  // WebP: inspect EXIF and XMP chunks, not compressed picture data.
  if (data.length >= 12 && ascii(data, 0, 4) === "RIFF" && ascii(data, 8, 4) === "WEBP") {
    let p = 12;
    while (p + 8 <= data.length) {
      const type = ascii(data, p, 4);
      const size = le(p + 4);
      if (size > data.length - p - 8) break;
      if (["EXIF", "XMP ", "C2PA"].includes(type)) push(p + 8, size, type === "C2PA");
      p += 8 + size + size % 2;
    }
    return { format: "WebP", chunks, credentials: credentials || chunks.some(s => /c2pa|jumbf/i.test(s)) };
  }

  if (data.length >= 12 && ascii(data, 4, 4) === "ftyp") return { format: "HEIC / AVIF", chunks, credentials: false };
  return { format: "Nieznany / Unknown", chunks, credentials: false };
}

export function inspectImageOrigin(buffer: ArrayBuffer): ImageOriginResult {
  const parsed = markers(new Uint8Array(buffer));
  const signals = new Set<string>();
  for (const chunk of parsed.chunks) {
    for (const [regex, label] of signatures) if (regex.test(chunk)) signals.add(label);
  }
  const supported = ["JPEG", "PNG", "WebP"].includes(parsed.format);
  return {
    format: parsed.format,
    verdict: !supported ? "unsupported" : signals.size ? "ai-clues" : parsed.credentials ? "credentials" : "inconclusive",
    signals: [...signals],
    hasCredentialsMarker: parsed.credentials,
    hasMetadata: parsed.chunks.length > 0,
  };
}
