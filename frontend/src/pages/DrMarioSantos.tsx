import React from "react";
import dentista2 from "../img/dentista2.png";
import "./Profissionais.css";

export default function DrMarioSantos(){
    return(
        <section className="allbio">
            <img className="bio-image" src={dentista2} alt="Dr. Mario Santos"/>

        <div className="bio-text">
            <h1>Dr. Mario Santos</h1>
            <p><span className="check-icon">✔</span>Graduação USP</p>
            <p><span className="check-icon">✔</span>Especialista em Periodontia USP</p>
            <p><span className="check-icon">✔</span>Especialista em Implantodontia UNISA</p>
            <p><span className="check-icon">✔</span>Mestre em Periodontia USP</p>
            <p><span className="check-icon">✔</span>Atualização em Cirurgia Periodontal e Peri-implantar USP</p>
            <p><span className="check-icon">✔</span>Membro da Sociedade Brasileira de Periodontia (Sobrape)</p>
            <p><span>E-mail:</span> mario.periodontista@clinica.com</p>
            <p><span>CRO:</span> 10002-SP </p>       
        </div>
        </section>
    )
}