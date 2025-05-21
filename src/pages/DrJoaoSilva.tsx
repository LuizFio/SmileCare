import React from "react";
import "./Profissionais.css";
import dentista1 from "../img/dentista1.png";

export default function DrJoaoSilva() {
  return (
    <section className="allbio">
      <img className="bio-image-joao" src={dentista1} alt="Dr. João Silva" />

      <div className="bio-text-joao">
        <h1>Dr. João Silva</h1>
        <p><span className="check-icon">✔</span>Graduação USP</p>
        <p><span className="check-icon">✔</span>Atualização em Ortodontia técnica MBT e INVISALIGN USP</p>
        <p><span className="check-icon">✔</span>Atualização em Ortodontia Preventiva USP</p>
        <p><span className="check-icon">✔</span>Atualização em Ortodontia Avançada USP</p>
        <p><span className="check-icon">✔</span>Aperfeiçoamento em Prótese Dentária USP</p>
        <p><span className="check-icon">✔</span>Especialista em Prótese Dentária USP</p>
        <p><span className="check-icon">✔</span>Especialista em Ortodontia USP</p>
        <p><span className="check-icon">✔</span>INVISALIGN TOP DOCTOR</p>
        <p><span className="check-icon">✔</span>ARCH PLUS Alinhadores invisíveis</p>
        <p><span>E-mail:</span> dr.joaosilva@SmileCareodontologia.com.br</p>
        <p><span>CRO:</span> 109.559</p>
      </div>
    </section>
  );
}
