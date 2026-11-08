import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Social preview uses the *same, real* project screenshots and untouched portrait as the home hero. */
export async function renderPortfolioHeroImage(width=1200,height=630){
 const file=async(name:string,type:string)=>"data:image/"+type+";base64,"+
  (await readFile(join(process.cwd(),"public",name))).toString("base64");
 const [portrait,star,isto,crm,font]=await Promise.all([
  file("images/profile-3-cutout.png","png"),
  file("images/projects/starcars-live-current.jpg","jpeg"),
  file("images/projects/isto-live-nov08.jpg","jpeg"),
  file("images/projects/bcrm-admin-dashboard.jpg","jpeg"),
  readFile(join(process.cwd(),"public/fonts/OpenSans-Regular.ttf"))
 ]);
 const stretch=height/630;
 const labelStyle={display:"flex",alignItems:"center",justifyContent:"space-between",
  background:"#111",color:"#efefef",padding:"9px 13px",fontSize:17} as const;
 const tile=(img:string,label:string,left:number,top:number,w:number,angle=0)=>(
  <div style={{position:"absolute",left,top:top*stretch,width:w,display:"flex",flexDirection:"column",
   overflow:"hidden",borderRadius:13,border:"1px solid #444",background:"#111",
   transform:`rotate(${angle}deg)`,boxShadow:"0 22px 48px #000b"}}>
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src={img} alt="" style={{display:"flex",width:"100%",height:w/1.6,objectFit:"cover",objectPosition:"top left"}}/>
   <div style={labelStyle}><span>{label}</span><span style={{fontSize:22}}>↗</span></div>
  </div>
 );
 return new ImageResponse(
  <div style={{width,height,display:"flex",position:"relative",overflow:"hidden",background:"#080808",color:"#f5f5f5",fontFamily:"Open Sans"}}>
   <div style={{position:"absolute",left:56,top:22*stretch,right:56,display:"flex",alignItems:"center",gap:18}}>
    <div style={{width:47,height:47,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #a8a8a8",borderRadius:10,fontSize:21}}>KB</div>
    <div style={{fontSize:19,letterSpacing:5,color:"#e7e7e7"}}>KACPER BERNECKI</div>
   </div>
   <div style={{position:"absolute",left:56,right:56,top:88*stretch,height:1,background:"#ffffff30",display:"flex"}}/>
   <div style={{position:"absolute",left:58,top:185*stretch,width:555,display:"flex",flexDirection:"column"}}>
    <div style={{fontSize:17,letterSpacing:2,color:"#aaa",marginBottom:24*stretch}}>BIZNES I TECHNOLOGIA</div>
    <div style={{fontSize:53,lineHeight:1.14,letterSpacing:-2,display:"flex",flexDirection:"column",fontWeight:650}}>
     <span>Od pomysłu do</span><span>działającego biznesu.</span>
    </div>
    <div style={{fontSize:21,color:"#c4c4c4",lineHeight:1.55,marginTop:23*stretch,width:490}}>
     Strony internetowe, CRM, AI i marketing. Od strategii do wdrożenia.
    </div>
    <div style={{display:"flex",gap:11,marginTop:26*stretch}}>
     <div style={{display:"flex",background:"#dfdfdf",color:"#080808",padding:"13px 21px",borderRadius:7,fontSize:17}}>Umów rozmowę ↗</div>
     <div style={{display:"flex",border:"1px solid #999",color:"#fff",padding:"13px 21px",borderRadius:7,fontSize:17}}>Realizacje ↗</div>
    </div>
   </div>
   {tile(star,"StarCars",639,138,244,-3)}
   {tile(isto,"Isto Kebab",1002,196,190,3)}
   <div style={{position:"absolute",left:738,top:68*stretch,width:420,height:562*stretch,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={portrait} alt="" style={{width:420,height:550*stretch,objectFit:"contain",objectPosition:"center bottom"}}/>
   </div>
   {tile(crm,"B-CRM",614,425,306,-2)}
  </div>,
  {width,height,fonts:[{name:"Open Sans",data:font,style:"normal",weight:400}]}
 );
}
