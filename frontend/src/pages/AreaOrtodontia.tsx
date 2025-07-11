import React from "react"
import './ProcAtuacao.css';
import ortodontia from '../img/ortodontia.png';
export default function AreaOrtodontia(){

    return (
    <section className="procedimentos">
      <h2>Ortodontia </h2>
      <div className="procedimentos2">
      <img src={ortodontia}  />
        
      <div className="textogeral">
    <h5><b>O que é?</b></h5>
    <p>É a especialidade que melhora o posicionamento dos dentes para mordida e estética do paciente.</p>
    <h5>Como funciona?</h5>
    <p>Com o uso de <strong>aparelhos</strong> que podem ser: fixos (colados aos dentes, metálicos ou de porcelana) ou removíveis<strong> (invisalign, alinhadores invisíveis)</strong>.</p>
    <h5>Quando é indicado?</h5>
    <p>Quando há queixas estéticas (dentes tortos) e/ou por questões funcionais (mordida torta, dores faciais e/ou dentais, tratamento pré reabilitação oral e estética)</p>
  </div>
        
        
      </div>
    </section>
  );
};