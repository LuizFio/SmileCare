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
                <p><span>Sou cirurgiã-dentista, atendo clínico geral</span></p>
                <p><span>Realizo a parte de restaurações, profilaxias, clareamento, extrações e diagnóstico.</span></p>
                <p><span>E-mail:</span> SmileCareodontologia@gmail.com</p>
            </div>
        </section>
    )
}