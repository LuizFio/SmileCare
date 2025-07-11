import React from "react";
import denstista5 from "../img/dentista5.png";
import "./Profissionais.css";

export default function DraPaulaCosta() {
  return (
    <section className="allbio">
      <img className="bio-image-paula" src={denstista5} alt="Dra. Paula Costa" />

      <div className="bio-text">
        <h1>Dra. Paula Costa</h1>
        <p><span className="check-icon">✔</span>Graduação USP</p>
        <p><span className="check-icon">✔</span>Especialista em Odontopediatria USP</p>
        <p><span className="check-icon">✔</span>Mestrado em Odontopediatria USP</p>
        <p><span>E-mail:</span> - Indisponível </p>
        <p><span>CRO:</span> - Indisponível </p>

      </div>
    </section>
  );
}
