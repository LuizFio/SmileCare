import React, { useState, useRef } from 'react';
import './Home.css';
import mainbanner from "../img/mainbanner.jpg";
import Navbar from '../components/Nav'; // Certifique-se de que esse caminho está correto
import LoginModal from '../components/LoginModal';
import QuemCuida from '../components/QuemCuida';
import AreasDeAtuacao from '../components/AreasDeAtuacao';
import PacientesSatisfeitos from '../components/PacientesSatisfeitos';

const HomeContent: React.FC<{ scrollToAreas: () => void }> = ({ scrollToAreas }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="home-container">
      {/*tirei o Navbar (o bgl de login ta no nav.tsx*/}
      

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>SEJA BEM-VINDO<br />A SMILECARE</h1>
          <a
            className="whatsapp-button"
            href="https://wa.me/5599999999999"
            target="_blank"
            rel="noopener noreferrer"
          >
            Precisa de ajuda? Contate-nos via WhatsApp
            <i className="fab fa-whatsapp"></i>
          </a>
          <p className="link-areas" onClick={scrollToAreas}>Conheça nossas Áreas de Atuação</p>
        </div>
      </section>      
    </div>
  );
};

//o que tava feito no app.tsx
export default function Home() {
  const areasRef = useRef<HTMLDivElement>(null);

  const scrollToAreas = () => {
    areasRef.current?.scrollIntoView({ behavior: 'smooth' });
}
return (
  <>
    <HomeContent scrollToAreas={scrollToAreas}/>
    <QuemCuida />
    <div ref={areasRef}>
    <AreasDeAtuacao />
    </div>
    <PacientesSatisfeitos />
  </>
);
}