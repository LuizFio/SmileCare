import React from "react";
import dentista4 from "../img/dentista4.png";
import "./Profissionais.css";

export default function DrCarlosMendes() {
  return (
    <section className="allbio">
      <img className="bio-image-carlos" src={dentista4} alt="Dr. Carlos Mendes" />

      <div className="bio-text-carlos">
        <h1>Dr. Carlos Mendes</h1>
        <p><span className="check-icon">✔</span> USP</p>
        <p><span className="check-icon">✔</span>Especialista em Periodontia USP</p>
        <p><span className="check-icon">✔</span>Especialista em Implantodontia ECOACADEMY</p>
        <p><span className="check-icon">✔</span>Mestre em Periodontia USP</p>
        <p><span className="check-icon">✔</span>Doutor em Periodontia USP</p>
        <p><span className="check-icon">✔</span>Atualização em Cirurgia Periodontal e Peri-implantar USP</p>
        <p><span className="check-icon">✔</span>Capacitação em micro cirurgia periodontal USP</p>
        <p><span className="check-icon">✔</span>Atualização em cirurgia oral menor USP</p>
        <p><span className="check-icon">✔</span>Atualização cirurgia de implante USP</p>
        <p><span>CRO:</span> 107.896</p>
      </div>
    </section>
  );
}
