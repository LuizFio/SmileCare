import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">SMILECARE</div>
        <nav className="nav-links">
          <a href="#">Home</a>

          <div className="dropdown">
            <a href="#">Procedimentos</a>
            <div className="dropdown-content">
              <a href="#">Tratamentos Para Gengiva</a>
              <a href="#">Próteses e Implantes</a>
              <div className="sub-dropdown">
                <a href="#">Ortodontia &rsaquo;</a>
              </div>
              <div className="sub-dropdown">
                <a href="#">Cirurgia &rsaquo;</a>
              </div>
            </div>
          </div>

          <a href="#">Áreas de Atuação</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>SEJA BEM-VINDO</h1>
          <a
            className="whatsapp-button"
            href="https://wa.me/5599999999999" // substitua com seu número
            target="_blank"
            rel="noopener noreferrer"
          >
            Agende uma Consulta pelo WhatsApp
          </a>
          <p className="link-areas">Conheça nossas Áreas de Atuação</p>
        </div>
      </section>
    </div>
  );
};

export default Home;