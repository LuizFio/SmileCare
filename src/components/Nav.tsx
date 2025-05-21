// src/components/Navbar.tsx
import React from 'react';
import './Nav.css';
import {  useLocation  } from "react-router-dom";
import logo from '../img/logoSmileCare.png';
import { Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { useEffect, useState } from 'react';
import { link } from 'fs';

const Navbar: React.FC<{ onLoginClick?: () => void }> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  //o bgl de login na nav
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  //bgl pra deixar os links da nav preto
   const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${isHome ? 'navbar-home' : 'navbar-default'}`}>
    <div className="logo">
      <figure>
        <img src={logo} alt="Logo SmileCare" style={{ display: 'block' }} />
      </figure>
    </div>
    <nav className="nav-links">
      <a href="/">Home</a>
      <a href="#" onClick={() => setIsLoginModalOpen(true)}>Login</a>
        <div className="dropdown">
          <a href="#">Procedimentos</a>
          <div className="dropdown-content">
            <Link to="/procedimentos/gengiva">Tratamentos Para Gengiva</Link>
            <Link to="/proteses-e-implantes">Próteses e Implantes</Link>
            <div className="sub-dropdown">
              <Link to="/areas/ortodontia" className='sub-dropdown'>Ortodontia &rsaquo;</Link>
              <div className="sub-dropdown-content">
                <Link to="/procedimentos/aparelhos">Aparelhos</Link>
                <a href="/procedimentos/invisalign">Invisalign</a>
              </div>
            </div>
            <div className="sub-dropdown">
              <Link to ="/areas/cirurgia" className='sub-dropdown'>Cirurgia &rsaquo;</Link>
              <div className="sub-dropdown-content">
                <Link to ="/procedimentos/extracao">Extração</Link>
                <Link to="/procedimentos/implante">Implante</Link>
              </div>
            </div>
          </div>
        </div>
        {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <div className="dropdown">
        <Link to="/agendamento">Agendamentos</Link>
      </div>
      </nav>
    </header>
  );
};

export default Navbar;