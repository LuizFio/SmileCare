import React from "react";
import "./AreasDeAtuacao.css";
import ortodontia from "../img/ortodontia.png";
import implanteEprotese from "../img/implnateEprotese.png";
import cirurgia from "../img/cirurgia.png";
import periodontia from "../img/periodontia.png";

const AreasDeAtuacao: React.FC = () => {
    return (
        <section className="areasDeAtuacao">
            <h2>Áreas de Atuação</h2>
            <div className="areas-container">
                <div className="areas-card">
                    <img src={ortodontia} alt="ortodontia" />
                    <p>Ortodontia</p>
                </div>
                <div className="areas-card">
                    <img src={cirurgia} alt="cirurgia" />
                    <p>Cirurgias</p>
                </div>
                <div className="areas-card">
                    <img src={implanteEprotese} alt="implante e protese" />
                    <p>Implantes e Proteses</p>
                </div>
                <div className="areas-card">
                    <img src={periodontia} alt="periodontia" />
                    <p>Periodontia</p>
                </div>
            </div>

        </section>
    )
}

export default AreasDeAtuacao;