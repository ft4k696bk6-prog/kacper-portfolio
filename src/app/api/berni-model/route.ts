/** Original animated Quaternius Robot, licensed CC0.
 * Source: https://github.com/raysan5/raylib/blob/master/examples/models/resources/models/gltf/robot.glb
 * License: https://github.com/raysan5/raylib/blob/master/examples/models/resources/models/gltf/LICENSE
 * Streamed through our domain, not hotlinked by visitors.
 */
const SOURCE="https://raw.githubusercontent.com/raysan5/raylib/master/examples/models/resources/models/gltf/robot.glb";
export const revalidate=86400;
export async function GET(){
 try{
  const upstream=await fetch(SOURCE,{next:{revalidate:86400},signal:AbortSignal.timeout(10000)});
  if(!upstream.ok||!upstream.body)return new Response("Model unavailable",{status:502});
  return new Response(upstream.body,{headers:{"Content-Type":"model/gltf-binary","Cache-Control":"public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response("Model unavailable",{status:502})}
}
