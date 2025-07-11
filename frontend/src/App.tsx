import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QuemCuida from "./components/QuemCuida";
import "./App.css";
import ScrollToTop from "./components/scrollToTop";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import TratGengiva from "./pages/tratamentosParaGengiva";
import ProtesesImplantes from "./pages/protesesImplantes";
import Invisalign from "./pages/Invisalign";
import Extracao from "./pages/Extração";
import Aparelhos from "./pages/Apararelhos";
import Implante from "./pages/Implante";
import Periodontia from "./pages/AreaPeriodontia";
import AreaCirugia from "./pages/AreaCirugia";
import AreaOrtodontia from "./pages/AreaOrtodontia";
import AreaPeriodontia from "./pages/AreaPeriodontia";
import AreaProtesImplantes from "./pages/AreaProtesImplantes";
import DrJoaoSilva from "./pages/DrJoaoSilva";
import DrMarioSantos from "./pages/DrMarioSantos";
import DraAnaOliveira from "./pages/DrAnaOliveira";
import DrCarlosMendes from "./pages/DrCarlosMendes";
import DraPaulaCosta from "./pages/DraPaulaCosta";
import DraLuanaDeConto from "./pages/DraLuanaDeConto";
import AreasDeAtuacao from "./components/AreasDeAtuacao";

import Perfil from "./pages/Perfil";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import MinhaAgenda from "./pages/MinhaAgenda";
import { AuthProvider } from "./contexts/AuthContext";
import axios from 'axios';
import { useEffect } from 'react';


export default function App() {
  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then(response => {
        console.log('API respondeu:', response.data);
      })
      .catch(error => {
        console.error('Erro ao conectar com a API:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/procedimentos/gengiva" element={<TratGengiva />} />
          <Route path="/proteses-e-implantes" element={<ProtesesImplantes />} />
          <Route path="/procedimentos/aparelhos" element={<Aparelhos />} />
          <Route path="/procedimentos/invisalign" element={<Invisalign />} />
          <Route path="/procedimentos/extracao" element={<Extracao />} />
          <Route path="/procedimentos/implante" element={<Implante />} />
          <Route path="/procedimentos/periodontia" element={<AreaPeriodontia />} />
          <Route path="/procedimentos/ortodontia" element={<AreaOrtodontia />} />
          <Route
            path="/procedimentos/proteses-e-implantes"
            element={<AreaProtesImplantes />}
          />
          <Route path="/procedimentos/cirurgia" element={<AreaCirugia />} />
          <Route path="/profissionais/dr-joao-silva" element={<DrJoaoSilva />} />
          <Route path="/profissionais/dr-mario-santos" element={<DrMarioSantos />} />
          <Route path="/profissionais/dra-ana-oliveira" element={<DraAnaOliveira />} />
          <Route path="/profissionais/dr-carlos-mendes" element={<DrCarlosMendes />} />
          <Route path="/profissionais/dra-paula-costa" element={<DraPaulaCosta />} />
          <Route path="/profissionais/dra-luana-conto" element={<DraLuanaDeConto />} />
          <Route path="/profissionais" element={<QuemCuida />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
          <Route path="/agenda" element={<MinhaAgenda />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
