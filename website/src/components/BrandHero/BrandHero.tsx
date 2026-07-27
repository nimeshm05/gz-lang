import { SharedLogo, SharedWordmark } from "../SharedBrand/SharedBrand";
import "./BrandHero.css";

type BrandHeroProps = {
  onMascotLoad?: () => void;
};

export function BrandHero({ onMascotLoad }: BrandHeroProps) {
  return (
    <main className="brand-hero">
      <div className="brand-hero-content">
        <SharedLogo size="hero" traveling onLoad={onMascotLoad} />
        <SharedWordmark size="hero" traveling />
      </div>
    </main>
  );
}
