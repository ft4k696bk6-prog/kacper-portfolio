import * as T from "three";

const threshold = /* glsl */ `
  vec2 pixel = mod(floor(gl_FragCoord.xy), 4.0);
  float order = mod(2.0 * pixel.x + 3.0 * pixel.y, 4.0) * 4.0 + mod(pixel.x + 2.0 * pixel.y, 4.0);
  float point = (order + 0.5) / 16.0;
`;

/** Replace the distant and close surfaces on complementary pixels, keeping depth writes intact. */
export function planetLod(roots: readonly T.Object3D[], distant = false) {
  const progress = { value: distant ? 0 : 1 };
  const materials = new Set<T.Material>();
  for (const root of roots) root.traverse(object => {
    if (object instanceof T.Mesh || object instanceof T.Line || object instanceof T.Points) {
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    }
  });
  for (const material of materials) {
    const compile = material.onBeforeCompile.bind(material);
    const key = material.customProgramCacheKey();
    material.customProgramCacheKey = () => `${key}:planet:${distant ? "orbit" : "surface"}`;
    material.onBeforeCompile = (shader, renderer) => {
      compile(shader, renderer);
      shader.uniforms.planetDetail = progress;
      const discard = distant ? "if (point < planetDetail) discard;" : "if (point >= planetDetail) discard;";
      shader.fragmentShader = `uniform float planetDetail;\n${shader.fragmentShader.replace(/void\s+main\s*\(\s*\)\s*\{/, `void main() {
        if (planetDetail ${distant ? "> 0.0" : "< 1.0"}) { ${threshold} ${discard} }`)} `;
    };
  }
  return (fraction: number) => { progress.value = fraction; };
}
