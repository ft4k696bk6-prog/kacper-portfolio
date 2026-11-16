import type {Metadata,Viewport} from "next";
import "../globals.css";
import "../design-system.css";
export const metadata:Metadata={metadataBase:new URL("https://bernecki.dev"),robots:{index:true,follow:true},openGraph:{siteName:"bernecki.dev",locale:"uk_UA",type:"website"}};
export const viewport:Viewport={width:"device-width",initialScale:1};
export default function UkrainianLayout({children}:{children:React.ReactNode}){
 return <html lang="uk"><body>{children}</body></html>;
}
