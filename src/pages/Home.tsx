import React, { useState } from 'react';
import './Home.css';
import logo from '../img/logo2.png';
import mainbanner from "../img/mainbanner.jpg"
import LoginModal from '../components/LoginModal';

const Home: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <figure>
            <img src={logo} alt="Logo SmileCare" style={{ display: 'block' }} />
          </figure>
        </div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#" onClick={() => setIsLoginModalOpen(true)}>Login</a>
          <div className="dropdown">
            <a href="#">Procedimentos</a>
            <div className="dropdown-content">
              <a href="#">Tratamentos Para Gengiva</a>
              <a href="#">Próteses e Implantes</a>
              <div className="sub-dropdown">
                <a href="#">Ortodontia &rsaquo;</a>
                <div className="sub-dropdown-content">
                  <a href="#">Aparelhos</a>
                  <a href="#">Invisalign</a>
                </div>
              </div>
              <div className="sub-dropdown">
                <a href="#">Cirurgia &rsaquo;</a>
                <div className="sub-dropdown-content">
                  <a href="#">Extração</a>
                  <a href="#">Implante</a>
                </div>
              </div>
            </div>
          </div>
          <div className='atuation-area'>
            <a href="#">Áreas de Atuação</a>
            <div className="dropdown-content">
              <a href="#">Ortodontia</a>
              <a href="#">Cirurgia</a>
              <a href="#">Próteses e Implantes</a>
              <a href="#">Periodontia</a>
            </div>
          </div>
        </nav>
      </header>

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
          <p className="link-areas">Conheça nossas Áreas de Atuação</p>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Home;