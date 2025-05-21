import React from "react";
import dentista6 from "../img/dentista6.png";
import "./Profissionais.css";

export default function DraLuanaDeConto(){
    return(
        <section  className="allbio">
            <img className="bio-image-luana" src={dentista6} alt="Dra. Luana De Conto"/>

            <div className="bio-text-luana">
                <h1>Dra. Luana De Conto</h1>
                <p><span className="check-icon">✔</span>Graduação Universidade de São Caetano do Sul</p>
                <p><span>Sou cirurgiã-dentista, atendo clínico geral.</span></p>
                <p><span>Realizo a parte de restaurações, profilaxias, clareamento, extrações e diagnóstico</span></p>
                <p><span>CRO:</span> 171.021</p>
            </div>
        </section>
    )
}