import React from "react";
import denstista3 from "../img/dentista3.png";
import "./Profissionais.css";

export default function DraAnaOliveira(){
    return(
        <section className="allbio">
            <img className="bio-image-ana" src={denstista3} alt="Dra. Ana Oliveira"/>

            <div className="bio-text-ana">
                <h1>Dra. Ana Oliveira</h1>
                <p><span className="check-icon">✔</span>Graduação FO-UNINOVE</p>
                <p><span className="check-icon">✔</span>Sou cirurgiã-dentista, atendo clínico geral</p>
                <p><span className="check-icon">✔</span>Realizo a parte de restaurações, profilaxias, clareamento, extrações e diagnóstico</p>
                <p><span>E-mail:</span> ana.clinico@clinica.com</p>
                <p><span>CRO:</span> 10004-SP</p>
            </div>
        </section>
    )
}