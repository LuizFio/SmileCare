import React from "react"
import './ProcAtuacao.css';
import periodontia from '../img/periodontia.png';
export default function AreaPeriodontia(){

    return (
    <section className="procedimentos">
      <h2>Periodontia </h2>
      <div className="procedimentos2">
      <img src={periodontia}  />
        
      <div className="textogeral">
    <h5><b>O que é?</b></h5>
<p>É a especialidade responsável pelos cuidados com os tecidos que envolvem o dente como por exemplo a gengiva, o osso e mucosas.</p>
<h5><b>Principais atuações</b></h5>
<p>A doença mais prevalente dentro desta especialidade é a <strong>gengivite</strong>, seguida pela <strong>periodontite</strong>.</p>
<p>Abrange também procedimentos estéticos e corretivos como plásticas gengivais para remoção de excessos de gengiva ou seu oposto como correção da falta do tecido gengival ou ósseo (enxertos).</p>
  </div>
        
        
      </div>
    </section>
  );
};