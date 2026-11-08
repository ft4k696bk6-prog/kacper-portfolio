import { renderPortfolioHeroImage } from "@/lib/portfolio-hero-image";
export const alt="Kacper Bernecki — od pomysłu do działającego biznesu. Portfolio z aktualnymi projektami i portretem.";
export const size={width:1200,height:630};
export const contentType="image/png";
export default async function OpenGraphImage(){
 return renderPortfolioHeroImage(size.width,size.height);
}
