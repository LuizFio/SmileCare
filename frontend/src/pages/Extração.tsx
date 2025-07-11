import React from "react";
import "./ProcAtuacao.css";
import extração from "../img/extração.jpg";
export default function Extração() {
  return (
    <section className="procedimentos">
      <h2>Extração</h2>
      <div className="procedimentos2">
        <img src={extração} />

        <div className="textogeral">
          <h5>
            <b>O que é?</b>
          </h5>
          <p>
            Cirurgia o ato de se cuidar ou curar com as mãos, mais
            especificamente é o ato de intervenção física ou operação para
            reparo de tecidos ou órgãos através de intervenções manuais.
          </p>
          <p>
            As cirurgias orais mais conhecidas são as{" "}
            <strong>
              extrações dos dentes do siso e instalação de implantes dentários
            </strong>
          </p>
          <h5>
            <b>Como funcionam?</b>
          </h5>
          <p>
            De maneira geral as cirurgias envolvem intervenções com utilização
            de anestesias e medicações.
          </p>
          <h5>
            <b>Quando são indicadas?</b>
          </h5>
          <p>
            A indicação de procedimentos cirúrgicos é muito abrangente,
            envolvendo a estética, o tratamento de doenças e lesões e a
            reabilitação oral.
          </p>
        </div>
      </div>
    </section>
  );
}
