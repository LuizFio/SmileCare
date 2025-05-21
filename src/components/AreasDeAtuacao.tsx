import React from "react";
import "./AreasDeAtuacao.css";
import { Link } from "react-router-dom";
import ortodontia from "../img/ortodontia.png";
import implanteEprotese from "../img/implnateEprotese.png";
import cirurgia from "../img/cirurgia.png";
import periodontia from "../img/periodontia.png";

const AreasDeAtuacao: React.FC = () => {
    return (
        <section className="areasDeAtuacao">
            <h2 className="titulo-areas">
                Áreas de <span>Atuação</span>
            </h2>
            <div className="areas-container">
                <Link to="/areas/ortodontia" className="areas-card">
                    <img src={ortodontia} alt="Ortodontia" />
                    <p>Ortodontia</p>
                </Link>
                <Link to="/areas/cirurgia" className="areas-card">
                    <img src={cirurgia} alt="Cirurgia" />
                    <p>Cirurgias</p>
                </Link>
                <Link to="/proteses-e-implantes" className="areas-card">
                    <img src={implanteEprotese} alt="Implante e Prótese" />
                    <p>Próteses e Implantes</p>
                </Link>
                <Link to="/areas/periodontia" className="areas-card">
                    <img src={periodontia} alt="Periodontia" />
                    <p>Periodontia</p>
                </Link>
            </div>
        </section>
    );
};

export default AreasDeAtuacao;