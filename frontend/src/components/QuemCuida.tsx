import React from "react";
import "./QuemCuida.css";
import { Link } from "react-router-dom";
import dentista1 from "../img/dentista1.png";
import dentista2 from "../img/dentista2.png";
import dentista3 from "../img/dentista3.png";
import dentista4 from "../img/dentista4.png";
import dentista5 from "../img/dentista5.png";
import dentista6 from "../img/dentista6.png";

const QuemCuida: React.FC = () => {
  return (
    <div className="profissionais-container">
      <h2 className="titulo-profissionais">
        Nossos <span>Profissionais</span>
      </h2>
      <p className="subtitulo-profissionais">Uma equipe especializada para cuidar do seu sorriso</p>
      <div className="profissionais-grid">
        <Link to="/profissionais/dr-joao-silva" className="card-profissional">
          <img src={dentista1} alt="Dr. João Silva" />
          <div className="card-info">
            <h3>Dr. João Silva</h3>
            <p>Responsável Técnico</p>
          </div>
        </Link>

        <Link to="/profissionais/dr-mario-santos" className="card-profissional">
          <img src={dentista2} alt="Dr. Mario Santos" />
          <div className="card-info">
            <h3>Dr. Mario Santos</h3>
            <p>Especialista em Periodontia e Implantes</p>
          </div>
        </Link>

        <Link to="/profissionais/dr-carlos-mendes" className="card-profissional">
          <img src={dentista4} alt="Dr. Carlos Mendes" />
          <div className="card-info">
            <h3>Dr. Carlos Mendes</h3>
            <p>Especialista em Cirurgia</p>
          </div>
        </Link>

        <Link to="/profissionais/dra-ana-oliveira" className="card-profissional">
          <img src={dentista3} alt="Dra. Ana Oliveira" />
          <div className="card-info">
            <h3>Dra. Ana Oliveira</h3>
            <p>Clínico Geral</p>
          </div>
        </Link>

        <Link to="/profissionais/dra-paula-costa" className="card-profissional">
          <img src={dentista5} alt="Dra. Paula Costa" />
          <div className="card-info">
            <h3>Dra. Paula Costa</h3>
            <p>Especialista em Odontopediatria</p>
          </div>
        </Link>

        <Link to="/profissionais/dra-luana-conto" className="card-profissional">
          <img src={dentista6} alt="Dra. Luana de Conto" />
          <div className="card-info">
            <h3>Dra. Luana de Conto</h3>
            <p>Clínico Geral</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuemCuida;
