// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Nav.css';
import { useLocation, Link } from "react-router-dom";
import logo from '../img/logoSmileCare.png';
import LoginModal from './LoginModal';
import UserIcon from './UserIcon';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { estaLogado } = useAuth();

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
      <div className="nav-container">
        <nav className="nav-links">
          <Link to="/">Home</Link>
           <div className="dropdown">
            <a href="#">Procedimentos</a>
            <div className="dropdown-content">
              <div className="sub-dropdown">
                <Link to="/procedimentos/gengiva">Tratamentos Para Gengiva &rsaquo;</Link>
                <div className="sub-dropdown-content">
                  <Link to="/procedimentos/periodontia" className='sub-dropdown'>Periodontia</Link>
                </div>
              </div>
              <Link to="/procedimentos/proteses-e-implantes">Próteses e Implantes</Link>
              <div className="sub-dropdown">
                <Link to="/procedimentos/ortodontia" className='sub-dropdown'>Ortodontia &rsaquo;</Link>
                <div className="sub-dropdown-content">
                  <Link to="/procedimentos/aparelhos">Aparelhos</Link>
                  <Link to="/procedimentos/invisalign">Invisalign</Link>
                </div>
              </div>
              <div className="sub-dropdown">
                <Link to="/procedimentos/cirurgia" className='sub-dropdown'>Cirurgia &rsaquo;</Link>
                <div className="sub-dropdown-content">
                  <Link to="/procedimentos/extracao">Extração</Link>
                  <Link to="/procedimentos/implante">Implante</Link>
                </div>
              </div>
            </div>
          </div>
          <Link to="/profissionais">Profissionais</Link>
        </nav>
        <div className="user-section">
          {!estaLogado ? (
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsLoginModalOpen(true);
            }}>Login</a>
          ) : (
            <UserIcon />
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;