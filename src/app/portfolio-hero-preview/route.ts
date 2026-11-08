import { renderPortfolioHeroImage } from "@/lib/portfolio-hero-image";
export const runtime="nodejs";
export async function GET(){
 const image=await renderPortfolioHeroImage(1200,750);
 image.headers.set("Cache-Control","public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
 return image;
}
