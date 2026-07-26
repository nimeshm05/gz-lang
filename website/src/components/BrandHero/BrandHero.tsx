import mascotUrl from "../../../assets/gzlang-mascot.svg";
import "./BrandHero.css";

export function BrandHero() {
  return (
    <main className="brand-hero">
      <div className="brand-hero-content">
        <div className="brand-hero-mascot">
          <img
            src={mascotUrl}
            alt="gzlang mascot"
            width={512}
            height={512}
          />
        </div>
        <h1 className="brand-hero-title">gzlang</h1>
      </div>
    </main>
  );
}
