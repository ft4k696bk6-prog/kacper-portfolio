import {
  CubeUVReflectionMapping, DataTexture, DataUtils, HalfFloatType, LinearFilter,
  LinearSRGBColorSpace, RGBAFormat,
} from "three";

export async function loadLighting(signal: AbortSignal) {
  const response = await fetch("/images/world/environment.webp", { signal });
  if (!response.ok) throw new Error("The baked light map could not be loaded");
  const image = await createImageBitmap(await response.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const width = image.width;
  const height = image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    image.close();
    throw new Error("The baked light map could not be decoded");
  }
  context.drawImage(image, 0, 0);
  image.close();
  const encoded = context.getImageData(0, 0, width, height).data;
  const pixels = new Uint16Array(encoded.length);
  // RGB stores the mantissas and alpha stores the shared exponent. The baked CubeUV
  // atlas already contains all roughness levels, so the GPU can sample it directly.
  for (let offset = 0; offset < encoded.length; offset += 4) {
    const exponent = encoded[offset + 3];
    if (!exponent) continue;
    const scale = 2 ** (exponent - 128) / 255;
    pixels[offset] = DataUtils.toHalfFloat(encoded[offset] * scale);
    pixels[offset + 1] = DataUtils.toHalfFloat(encoded[offset + 1] * scale);
    pixels[offset + 2] = DataUtils.toHalfFloat(encoded[offset + 2] * scale);
    pixels[offset + 3] = 0x3c00;
  }
  const light = new DataTexture(pixels, width, height, RGBAFormat, HalfFloatType);
  // Three.js accepts CubeUV on textures produced by its PMREM generator.
  Object.assign(light, { mapping: CubeUVReflectionMapping });
  light.colorSpace = LinearSRGBColorSpace;
  light.minFilter = LinearFilter;
  light.magFilter = LinearFilter;
  light.needsUpdate = true;
  return light;
}
