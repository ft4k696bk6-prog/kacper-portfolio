import { ImageResponse } from "next/og";
import {
 faFacebookF, faLinkedinIn, faInstagram, faYoutube,
 faTiktok, faXTwitter, faGithub, faWhatsapp
} from "@fortawesome/free-brands-svg-icons";
type IconDefinition = typeof faFacebookF;

export const runtime = "nodejs";

const brands:Record<string,{icon:IconDefinition;color:string}>={
 facebook:{icon:faFacebookF,color:"#0866FF"},
 linkedin:{icon:faLinkedinIn,color:"#0A66C2"},
 instagram:{icon:faInstagram,color:"#E1306C"},
 youtube:{icon:faYoutube,color:"#FF0033"},
 tiktok:{icon:faTiktok,color:"#111111"},
 x:{icon:faXTwitter,color:"#111111"},
 github:{icon:faGithub,color:"#24292F"},
 whatsapp:{icon:faWhatsapp,color:"#25D366"}
};
const platforms=[...Object.keys(brands),"calendar"];

export function generateStaticParams(){
 return platforms.map(platform=>({platform}));
}

export async function GET(_request:Request,{params}:{params:Promise<{platform:string}>}){
 const {platform}=await params;
 if(!platforms.includes(platform))return new Response("Not found",{status:404});
 const brand=brands[platform];
 const shape=brand?.icon.icon;
 const iconPath=shape?(Array.isArray(shape[4])?shape[4][0]:shape[4]):"";
 const art=platform==="calendar"?
  <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#25252b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
   <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/>
   <path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/>
   <path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>
  </svg>:
  <svg width={platform==="instagram"?"58":"72"} height={platform==="instagram"?"58":"72"} viewBox={"0 0 "+shape[0]+" "+shape[1]} fill={platform==="instagram"?"#ffffff":brand.color}>
   <path d={iconPath}/>
  </svg>;

 return new ImageResponse(
  <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#ffffff"}}>
   {platform==="instagram"?
    <div style={{width:76,height:76,borderRadius:18,background:"linear-gradient(135deg,#833ab4 5%,#c13584 40%,#e1306c 65%,#fcb045 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>{art}</div>:
    art
   }
  </div>,
  {width:96,height:96,headers:{"Cache-Control":"public, max-age=31536000, immutable"}}
 );
}
