import { Link } from "@remix-run/react";
import {
  containerClasses,
  backgroundClasses,
  overlayClasses,
  contentClasses,
  titleClasses,
  subtitleClasses,
  buttonClasses,
} from "~/styles/startStyles";

export default function Start() {

  return (
    <div className={containerClasses}>
      <div
        className={backgroundClasses}
        style={{ backgroundImage: "url('/assets/img/homepage-amadeus.jpg')" }}
      ></div>
      <div className={overlayClasses}></div>
      <div className={contentClasses}>
        <h1 className={titleClasses}>Tu próxima gran aventura comienza aquí</h1>
        <p className={subtitleClasses}>
          Explora destinos inolvidables y crea recuerdos para toda la vida.
        </p>

        <Link to="/login" className={buttonClasses}>
          ¡Empieza tu aventura!
        </Link>
      </div>
    </div>
  );
}
