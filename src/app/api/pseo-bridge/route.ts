/**
 * Minimal AI bridge for one trusted GitHub Actions workflow.
 * Uses the existing server-only OPENROUTER_API_KEY stored in Vercel.
 * No static secret is shared with GitHub; JWT is issued by GitHub OIDC per request.
 */
import {createPublicKey, verify as verifySignature} from "node:crypto";
import {NextResponse} from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;
export const dynamic = "force-dynamic";

const ISSUER = "https://token.actions.githubusercontent.com";
const AUDIENCE = "bernecki.dev:pseo:v1";
const REPO = "ft4k696bk6-prog/kacper-portfolio";
const WORKFLOW = REPO + "/.github/workflows/pseo-autopilot.yml@refs/heads/main";
const SUBJECT = "repo:" + REPO + ":ref:refs/heads/main";
const JWKS = "https://token.actions.githubusercontent.com/.well-known/jwks";

type JwtHeader = {alg?: string; kid?: string};
type Claims = {
  iss?: string; aud?: string|string[]; sub?: string; exp?: number; iat?: number; nbf?: number;
  repository?: string; repository_id?: string; ref?: string; workflow_ref?: string;
};
const unauthorized = () => NextResponse.json({message:"Unauthorized."},{status:401,headers:{"Cache-Control":"no-store"}});
const badRequest = () => NextResponse.json({message:"Invalid request."},{status:400,headers:{"Cache-Control":"no-store"}});

async function validGithubToken(token:string):Promise<boolean>{
  if (token.length < 200 || token.length > 9000) return false;
  const pieces = token.split(".");
  if (pieces.length !== 3) return false;
  try {
    const header = JSON.parse(Buffer.from(pieces[0],"base64url").toString("utf8")) as JwtHeader;
    const payload = JSON.parse(Buffer.from(pieces[1],"base64url").toString("utf8")) as Claims;
    const now = Math.floor(Date.now()/1000);
    if (header.alg !== "RS256" || typeof header.kid !== "string" || header.kid.length > 200) return false;
    if (payload.iss !== ISSUER || payload.aud !== AUDIENCE || payload.sub !== SUBJECT) return false;
    if (payload.repository !== REPO || payload.ref !== "refs/heads/main" || payload.workflow_ref !== WORKFLOW) return false;
    if (typeof payload.exp !== "number" || payload.exp <= now || payload.exp > now + 600) return false;
    if (typeof payload.iat !== "number" || payload.iat > now + 60 || payload.iat < now - 600) return false;
    if (typeof payload.nbf === "number" && payload.nbf > now + 60) return false;
    const jwksRes = await fetch(JWKS,{signal:AbortSignal.timeout(8000),next:{revalidate:180}});
    if (!jwksRes.ok) return false;
    const jwks = await jwksRes.json() as {keys?: Array<Record<string,unknown>>};
    const key = jwks.keys?.find(k=>k.kid === header.kid && k.kty === "RSA" && (k.use === "sig" || k.use === undefined));
    if (!key) return false;
    const publicKey = createPublicKey({key,format:"jwk"});
    return verifySignature("RSA-SHA256",Buffer.from(pieces[0]+"."+pieces[1]),publicKey,Buffer.from(pieces[2],"base64url"));
  }catch{return false;}
}
type Message = {role:"system"|"user";content:string};
type Input = {model?:string;temperature?:number;max_tokens?:number;response_format?:{type:string};messages?:Message[]};
function checkBody(input:unknown):input is Input{
  if(!input||typeof input!=="object")return false;
  const b=input as Input;
  if(b.model && !["openai/gpt-5-mini","openai/gpt-oss-20b"].includes(b.model))return false;
  if(!Array.isArray(b.messages)||b.messages.length!==2||b.messages[0]?.role!=="system"||b.messages[1]?.role!=="user")return false;
  if(b.messages.some(m=>typeof m.content!=="string"||m.content.length<1||m.content.length>28000))return false;
  if(b.max_tokens!==undefined&&(!Number.isInteger(b.max_tokens)||b.max_tokens<1||b.max_tokens>6800))return false;
  if(b.temperature!==undefined&&(typeof b.temperature!=="number"||b.temperature<0||b.temperature>1))return false;
  return !b.response_format || b.response_format.type==="json_object";
}
export async function POST(req:Request){
  const auth=req.headers.get("authorization");
  if(!auth?.startsWith("Bearer ")||!(await validGithubToken(auth.slice(7))))return unauthorized();
  const length=Number(req.headers.get("content-length")||0);
  if(length>50000)return badRequest();
  let raw="";
  try{raw=await req.text();}catch{return badRequest();}
  if(raw.length>50000)return badRequest();
  let input:unknown;
  try{input=JSON.parse(raw);}catch{return badRequest();}
  if(!checkBody(input))return badRequest();
  const key=process.env.OPENROUTER_API_KEY?.trim();
  if(!key)return NextResponse.json({message:"Vercel OPENROUTER_API_KEY is not configured."},{status:503});
  try{
    const upstream=await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",cache:"no-store",signal:AbortSignal.timeout(105000),
      headers:{
        Authorization:"Bearer "+key,"Content-Type":"application/json",
        "HTTP-Referer":"https://bernecki.dev","X-OpenRouter-Title":"bernecki.dev pSEO Autopilot"
      },
      body:JSON.stringify({
        model:input.model||"openai/gpt-5-mini",
        temperature:input.temperature??0.2,
        messages:input.messages,
        max_tokens:input.max_tokens||4000,
        response_format:{type:"json_object"},
        reasoning:{effort:"low",exclude:true},
        stream:false
      })
    });
    if(!upstream.ok)return NextResponse.json({message:"OpenRouter provider error.",providerStatus:upstream.status},{status:502});
    const response=await upstream.json() as {choices?:Array<{message?:{content?:unknown}}> ;usage?:{prompt_tokens?:number;completion_tokens?:number;cost?:number}};
    if(typeof response.choices?.[0]?.message?.content!=="string"||!response.choices[0].message.content)return NextResponse.json({message:"Provider returned empty content."},{status:502});
    return NextResponse.json({choices:[{message:{content:response.choices[0].message.content}}],usage:response.usage||{}},{headers:{"Cache-Control":"no-store"}});
  }catch{return NextResponse.json({message:"Provider unavailable or timed out."},{status:503});}
}
