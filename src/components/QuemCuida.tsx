import React from 'react';
import './QuemCuida.css';
import dentista1 from '../img/dentista1.png';
import dentista2 from '../img/dentista2.png';
import dentista3 from '../img/dentista3.png';
import dentista4 from '../img/dentista4.png';
import dentista5 from '../img/dentista5.png';
import dentista6 from '../img/dentista6.png';

const QuemCuida: React.FC = () => {
  return (
    <section className="quem-cuida">
      <h2>Profissionais</h2>
      <div className="dentistas-container">
        <div className="dentista-card">
          <img src={dentista1} alt="Dr.João Silva" />
          <h3>Dr. João Silva</h3>
          <p>Especialista em Ortodontia</p>
        </div>
        <div className="dentista-card">
          <img src={dentista2} alt="Dra. Mario Santos" />
          <h3>Dra. Mario Santos</h3>
          <p>Especialista em Implantes</p>
        </div>
        <div className="dentista-card">
          <img src={dentista3} alt="Dra. Ana Oliveira" />
          <h3>Dra. Ana Oliveira</h3>
          <p>Especialista em Periodontia</p>
        </div>
        <div className="dentista-card">
          <img src={dentista4} alt="Dr. Carlos Mendes" />
          <h3>Dr. Carlos Mendes</h3>
          <p>Especialista em Cirurgia</p>
        </div>
        <div className="dentista-card">
          <img src={dentista5} alt="Dra. Paula Costa" />
          <h3>Dra. Paula Costa</h3>
          <p>Especialista em Endodontia</p>
        </div>
        <div className="dentista-card">
            <img src={dentista6} alt="Dra. Luana de Conto" />
            <h3>Dra. Luana de Conto</h3>
            <p>Especialista em Protese e Implantes</p>
        </div>
      </div>
    </section>
  );
};

export default QuemCuida; 