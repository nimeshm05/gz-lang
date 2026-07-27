import { SharedLogo, SharedWordmark } from "../SharedBrand/SharedBrand";
import { ContribDeets } from "../ContribDeets/ContribDeets";
import "./Navbar.css";

type NavbarProps = {
  showBrand: boolean;
  traveling: boolean;
  onTravelComplete?: () => void;
};

export function Navbar({
  showBrand,
  traveling,
  onTravelComplete,
}: NavbarProps) {
  return (
    <header className={`navbar ${showBrand ? "navbar-visible" : "navbar-hidden"}`}>
      <div className="navbar-side navbar-side-start">
        {showBrand ? (
          <SharedWordmark size="nav" traveling={traveling} />
        ) : null}
      </div>

      <div className="navbar-center">
        {showBrand ? (
          <SharedLogo
            size="nav"
            traveling={traveling}
            onTravelComplete={onTravelComplete}
          />
        ) : null}
      </div>

      <div className="navbar-side navbar-side-end">
        {showBrand ? <ContribDeets reveal /> : null}
      </div>
    </header>
  );
}
