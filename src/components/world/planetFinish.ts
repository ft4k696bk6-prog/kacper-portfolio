import * as T from "three";

type Paint = (direction: T.Vector3, color: T.Color) => number;
const tau = Math.PI * 2;
const key = new T.Vector3(43, 55, 44).normalize();
const pixelChannel = (value: number) => Math.round(T.MathUtils.clamp(value, 0, 1) * 255);

/** Bake fine shore and ground detail once, then shade the planet in one pass. */
export function surfaceFinish(low: boolean, paint: Paint, waterColor: T.Color) {
  const width = low ? 448 : 768;
  const height = width / 2;
  const texels = new Uint8Array(width * height * 4);
  const direction = new T.Vector3();
  const color = new T.Color();
  const longitude = Array.from({ length: width }, (_, x) => (x + .5) * tau / width);
  const cosines = longitude.map(angle => Math.cos(angle));
  const sines = longitude.map(angle => Math.sin(angle));
  for (let y = 0; y < height; y++) {
    const latitude = (1 - (y + .5) / height) * Math.PI;
    const spread = Math.sin(latitude);
    const up = Math.cos(latitude);
    for (let x = 0; x < width; x++) {
      direction.set(-cosines[x] * spread, up, sines[x] * spread);
      const water = paint(direction, color);
      color.convertLinearToSRGB();
      const index = (y * width + x) * 4;
      texels[index] = pixelChannel(color.r);
      texels[index + 1] = pixelChannel(color.g);
      texels[index + 2] = pixelChannel(color.b);
      texels[index + 3] = pixelChannel(water);
    }
  }
  const atlas = new T.DataTexture(texels, width, height, T.RGBAFormat);
  atlas.colorSpace = T.SRGBColorSpace;
  atlas.wrapS = T.RepeatWrapping;
  atlas.magFilter = T.LinearFilter;
  atlas.minFilter = T.LinearMipmapLinearFilter;
  atlas.generateMipmaps = true;
  atlas.needsUpdate = true;

  const material = new T.ShaderMaterial({
    toneMapped: false,
    uniforms: { atlas: { value: atlas }, lightDirection: { value: key }, waterColor: { value: waterColor } },
    vertexShader: /* glsl */ `
      varying vec2 surfaceUv;
      varying vec3 radialNormal, toEye;
      void main() {
        surfaceUv = uv;
        radialNormal = normalize(position);
        toEye = cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D atlas;
      uniform vec3 lightDirection, waterColor;
      varying vec2 surfaceUv;
      varying vec3 radialNormal, toEye;
      void main() {
        vec4 surface = texture2D(atlas, surfaceUv);
        vec3 normal = normalize(radialNormal);
        vec3 eye = normalize(toEye);
        float sunlight = dot(normal, lightDirection);
        float day = smoothstep(-.28, .69, sunlight);
        vec3 diffuse = mix(vec3(.15, .21, .31), vec3(1.13, 1.01, .88), day);
        float rim = 1.0 - max(0.0, dot(normal, eye));
        float sheen = pow(max(0.0, dot(normal, normalize(lightDirection + eye))), 26.0);
        float water = surface.a;
        vec3 reflection = water * (sheen * .17 * vec3(.94, .85, .69) + rim * rim * waterColor * (.007 + day * .074));
        vec3 light = surface.rgb * diffuse + reflection + rim * rim * rim * waterColor * day * .043;
        gl_FragColor = vec4(light, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  material.addEventListener("dispose", () => atlas.dispose());
  return material;
}

export function planetAtmosphere(radius: number, hue: T.Color, low: boolean, strength = .65) {
  return new T.Mesh(new T.SphereGeometry(radius * 1.026, low ? 40 : 64, low ? 24 : 36), new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: T.BackSide,
    blending: T.AdditiveBlending,
    toneMapped: false,
    uniforms: { hue: { value: hue }, lightDirection: { value: key }, strength: { value: strength } },
    vertexShader: /* glsl */ `
      varying vec3 normalOnShell, toEye;
      void main() {
        normalOnShell = normalize(position);
        toEye = cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 hue, lightDirection;
      uniform float strength;
      varying vec3 normalOnShell, toEye;
      void main() {
        vec3 normal = normalize(normalOnShell);
        float angle = abs(dot(normal, normalize(toEye)));
        float sun = smoothstep(-.65, .82, dot(normal, lightDirection));
        float glow = smoothstep(.018, .12, angle) * exp(-8.8 * angle) * (.14 + sun * 1.05);
        gl_FragColor = vec4(mix(hue, vec3(.78, .60, .46), sun * .3), glow * strength);
        #include <colorspace_fragment>
      }`,
  }));
}
