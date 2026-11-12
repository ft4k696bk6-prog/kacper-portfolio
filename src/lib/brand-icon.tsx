import { ImageResponse } from "next/og";

/** Identical dark/silver circular KB mark as /favicon.svg. Never gold. */
export function renderBrandIcon(size: number) {
  const scale = size / 64;
  return new ImageResponse(
    <div style={{
      display: "flex", width:"100%",height:"100%",background:"#06080b",
      borderRadius:"50%",padding:4*scale,alignItems:"center",justifyContent:"center"
    }}>
      <div style={{
        display:"flex",flex:1,height:"100%",borderRadius:"50%",
        border:`${2.8*scale}px solid #d9dee5`,background:"#11151b",
        alignItems:"center",justifyContent:"center"
      }}>
        <span style={{
          color:"#f9fafb",fontFamily:"Arial, sans-serif",fontSize:23.5*scale,
          letterSpacing:-.7*scale,fontWeight:800,display:"flex"
        }}>KB</span>
      </div>
    </div>,
    {width:size,height:size}
  );
}
