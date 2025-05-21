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
import Agendamento from "./pages/Agendamento";

export default function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/procedimentos/gengiva" element={<TratGengiva />} />
        <Route path="/proteses-e-implantes" element={<ProtesesImplantes />} />
        <Route path="/procedimentos/aparelhos" element={<Aparelhos />} />
        <Route path="/procedimentos/invisalign" element={<Invisalign />} />
        <Route path="/procedimentos/extracao" element={<Extracao />} />
        <Route path="/procedimentos/implante" element={<Implante />} />
        <Route path="/areas/periodontia" element={<AreaPeriodontia />} />
        <Route path="/areas/ortodontia" element={<AreaOrtodontia />} />
        <Route
          path="/areas/proteses-e-implantes"
          element={<AreaProtesImplantes />}
        />
        <Route path="/areas/cirurgia" element={<AreaCirugia />} />
        <Route path="/perfilProfissional/dr-joao-silva" element={<DrJoaoSilva />} />
        <Route path="/perfilProfissional/dr-mario-santos" element={<DrMarioSantos />} />
        <Route path="/perfilProfissional/dra-ana-oliveira" element={<DraAnaOliveira />} />
        <Route path="/perfilProfissional/dr-carlos-mendes" element={<DrCarlosMendes />} />
        <Route path="/perfilProfissional/dr-paula-costa" element={<DraPaulaCosta />} />
        <Route path="/perfilProfissional/dr-luana-conto" element={<DraLuanaDeConto />} />
        <Route path="/agendamento" element={<Agendamento />} />
      </Routes>
      <Footer />
    </Router>
  );
}
