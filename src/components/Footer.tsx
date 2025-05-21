import React from 'react';
import './Footer.css';
import logoForcaTatica from '../img/ForçaTatica.png';
import logoSmileCare from '../img/logoSmileCare.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="clinic-info">
          <p>Clínica SmileCare Odontologia – CRO 27.669</p>
          <p>Resp. Téc. Dr. João Silva – CRO-SP 109.559</p>
        </div>

        <div className="footer-logo">
          <img src={logoSmileCare} alt="SmileCare" className="logo-smilecare" />
        </div>
        
        <div className="credits">
          <p>Desenvolvido por</p>
          <img src={logoForcaTatica} alt="Força Tática" className="logo-forca-tatica" />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 