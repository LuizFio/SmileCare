import React from "react"
import './ProcAtuacao.css';
import cirugia from '../img/implnateEprotese.png';
export default function ProtesesImplantes(){

    return (
    <section className="procedimentos">
      <h2>Próteses e Implantes </h2>
      <div className="procedimentos2">
      <img src={cirugia}  />
        
      <div className="textogeral">
    <h5><b>O que são?</b></h5>
<p>Implantes são dispositivos de titânio instalados em regiões em que ocorreram perdas de dentes.</p>
<p>Próteses são as “peças” de reposição de tecidos bucais e dentes perdidos visando restaurar e manter a forma, função, aparência e saúde da boca.</p>
<p>Podemos dizer que o <strong>implante</strong> é uma solução para a ausência da raiz, assim como a <strong>prótese</strong> é uma solução para a ausência do dente.</p>
<h5><b>Como funcionam?</b></h5>
<p>Implantes funcionam como parafusos com a capacidade de se integrar aos ossos maxilares. Posteriormente recebem próteses para exercer a função do dente que foi perdido. Podem ser unitários ou múltiplos. Exemplo: uma coroa de cerâmica é uma prótese que se encaixa em um implante.</p>
<h5><b>Quando são indicados?</b></h5>
<p>Tem indicação de substituição de dentes perdidos ou não formados (agenesias).</p>
  </div>
        
        
      </div>
    </section>
  );
};