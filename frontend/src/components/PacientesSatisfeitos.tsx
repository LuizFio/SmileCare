import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './PacientesSatisfeitos.css';

const depoimentos = [
  {
    texto: '"Depois de anos lidando com crises emocionais e desafios intensos, encontrei finalmente um caminho que transformou minha vida e me trouxe equilíbrio. Foi um recomeço que eu nem sabia que precisava."',
    nome: 'Gabriela Aloise',
  },
  {
    texto: '"As mãos firmes do Dr. Carlos, aliado ao seu enorme bom senso estético, fazem dele um dos maiores profissionais que conheço."',
    nome: 'Bento Bongiorno',
  },
  {
    texto: '"Sinto hoje o prazer verdadeiro de sorrir, pois você pode me mostrar que é possível graças à sua competência e dedicação."',
    nome: 'Regiane Guimarães',
  },
  {
    texto: '"Desde a primeira consulta, percebi o quanto a equipe é profissional e atenciosa. Hoje, sorrio com mais segurança e autoestima. Foi uma das melhores escolhas que fiz na vida."',
    nome: 'Camila Ferreira',
  },
  {
    texto: '"Nunca imaginei que um atendimento odontológico pudesse ser tão acolhedor. O cuidado, a paciência e a excelência fizeram toda diferença no meu tratamento. Recomendo de olhos fechados!"',
    nome: 'Rafael Lima',
  },
  {
    texto: '"Eu tinha muito medo de ir ao dentista, mas aqui me senti seguro e confiante. O resultado superou todas as minhas expectativas. Meu sorriso ficou simplesmente perfeito!"',
    nome: 'Fernanda Souza',
  },
  {
    texto: '"Profissionalismo, empatia e dedicação definem essa clínica. Meu tratamento foi realizado com tanto cuidado que hoje me sinto uma nova pessoa, muito mais confiante e feliz."',
    nome: 'Lucas Almeida',
  },
];

const PacientesSatisfeitos = () => {
  return (
    <div className="depoimentos-container">
      <h2 className="titulo">
        Pacientes <span>Satisfeitos</span>
      </h2>
      <p className="subtitulo">Sorrisos transformados</p>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Pagination, Navigation]}
        className="meuSwiper"
      >
        {depoimentos.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <p className="texto">"{item.texto}"</p>
              <h3 className="nome">{item.nome}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PacientesSatisfeitos; 