import React, { useState, useEffect } from 'react';
import './Agendamento.css';

interface Consulta {
  data: string;
  horario: string;
  paciente: string;
  dentista: string;
}

interface DentistaHorarios {
  nome: string;
  horariosDomingo: string[];
  horariosSegunda: string[];
  horariosTerca: string[];
  horariosQuarta: string[];
  horariosQuinta: string[];
  horariosSexta: string[];
  horariosSabado: string[];
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

const Agendamento: React.FC = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDentista, setSelectedDentista] = useState<string>('');
  const [selectedHorario, setSelectedHorario] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [historicoConsultas, setHistoricoConsultas] = useState<Consulta[]>([]);
  const [currentMonth, setCurrentMonth] = useState(5); // Começa em junho (0-based)
  const [currentYear, setCurrentYear] = useState(2024);
  const [formData, setFormData] = useState({
    paciente: '',
    telefone: '',
    email: '',
  });

  const dentistasHorarios: DentistaHorarios[] = [
    {
      nome: "Dr. João Silva - Ortodontista",
      horariosDomingo: ["08:00", "10:00", "14:00", "16:00"],
      horariosSegunda: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosTerca: ["09:00", "11:00", "15:00", "17:00", "19:00"],
      horariosQuarta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosQuinta: ["09:00", "11:00", "15:00", "17:00", "19:00"],
      horariosSexta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosSabado: ["08:00", "09:00", "10:00", "11:00"]
    },
    {
      nome: "Dr. Mario Santos - Periodontista",
      horariosDomingo: ["09:00", "11:00", "15:00", "17:00"],
      horariosSegunda: ["09:00", "11:00", "15:00", "17:00", "19:00"],
      horariosTerca: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosQuarta: ["09:00", "11:00", "15:00", "17:00", "19:00"],
      horariosQuinta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosSexta: ["09:00", "11:00", "15:00", "17:00", "19:00"],
      horariosSabado: ["08:30", "09:30", "10:30", "11:30"]
    },
    {
      nome: "Dra. Ana Oliveira - Clínico Geral",
      horariosDomingo: ["07:00", "09:00", "13:00", "15:00"],
      horariosSegunda: ["07:00", "09:00", "13:00", "15:00", "17:00", "19:00"],
      horariosTerca: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosQuarta: ["07:00", "09:00", "13:00", "15:00", "17:00", "19:00"],
      horariosQuinta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosSexta: ["07:00", "09:00", "13:00", "15:00", "17:00", "19:00"],
      horariosSabado: ["07:30", "08:30", "09:30", "10:30"]
    },
    {
      nome: "Dr. Carlos Mendes - Cirurgião",
      horariosDomingo: ["08:00", "10:00", "14:00", "16:00"],
      horariosSegunda: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosTerca: ["07:00", "09:00", "13:00", "15:00", "17:00", "19:00"],
      horariosQuarta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosQuinta: ["07:00", "09:00", "13:00", "15:00", "17:00", "19:00"],
      horariosSexta: ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"],
      horariosSabado: ["08:00", "09:00", "10:00", "11:00"]
    },
    {
      nome: "Dra. Paula Costa - Odontopediatra",
      horariosDomingo: ["07:30", "09:30", "13:30", "15:30"],
      horariosSegunda: ["07:30", "09:30", "13:30", "15:30", "17:30", "19:30"],
      horariosTerca: ["08:30", "10:30", "14:30", "16:30", "18:30"],
      horariosQuarta: ["07:30", "09:30", "13:30", "15:30", "17:30", "19:30"],
      horariosQuinta: ["08:30", "10:30", "14:30", "16:30", "18:30"],
      horariosSexta: ["07:30", "09:30", "13:30", "15:30", "17:30", "19:30"],
      horariosSabado: ["08:00", "09:00", "10:00", "11:00"]
    },
    {
      nome: "Dra. Luana de Conto - Clínico Geral",
      horariosDomingo: ["08:30", "10:30", "14:30", "16:30"],
      horariosSegunda: ["08:30", "10:30", "14:30", "16:30", "18:30"],
      horariosTerca: ["07:30", "09:30", "13:30", "15:30", "17:30", "19:30"],
      horariosQuarta: ["08:30", "10:30", "14:30", "16:30", "18:30"],
      horariosQuinta: ["07:30", "09:30", "13:30", "15:30", "17:30", "19:30"],
      horariosSexta: ["08:30", "10:30", "14:30", "16:30", "18:30"],
      horariosSabado: ["07:30", "08:30", "09:30", "10:30"]
    }
  ];

  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedDentista || !selectedHorario) return;
    if (!usuarioLogado) {
      alert('Por favor, faça login para agendar uma consulta');
      return;
    }

    const novaConsulta: Consulta = {
      data: selectedDate,
      horario: selectedHorario,
      paciente: usuarioLogado.nome,
      dentista: selectedDentista
    };

    setConsultas([...consultas, novaConsulta]);
    setHistoricoConsultas([...historicoConsultas, novaConsulta]);
    setFormData({ paciente: '', telefone: '', email: '' });
    setSelectedHorario('');
    setSelectedDentista('');
    setSelectedDate('');
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const getHorariosByDate = (dentista: DentistaHorarios, date: string) => {
    const diaSemana = new Date(date).getDay();
    switch (diaSemana) {
      case 0: // Domingo
        return dentista.horariosDomingo;
      case 1: // Segunda
        return dentista.horariosSegunda;
      case 2: // Terça
        return dentista.horariosTerca;
      case 3: // Quarta
        return dentista.horariosQuarta;
      case 4: // Quinta
        return dentista.horariosQuinta;
      case 5: // Sexta
        return dentista.horariosSexta;
      case 6: // Sábado
        return dentista.horariosSabado;
      default:
        return [];
    }
  };

  const isHorarioDisponivel = (dentista: string, horario: string) => {
    return !consultas.some(
      consulta => 
        consulta.data === selectedDate && 
        consulta.dentista === dentista && 
        consulta.horario === horario
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth > 5) { // Se for maior que junho
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 7) { // Se for menor que agosto
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateSelectable = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Permite apenas junho (5), julho (6) e agosto (7) de 2024
    return year === 2024 && month >= 5 && month <= 7;
  };

  const getCurrentMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    if (firstDay !== 0) {
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return {
      year: currentYear,
      month: currentMonth,
      days
    };
  };

  const { year, month, days } = getCurrentMonth();
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const HistoricoConsultas: React.FC<{ consultas: Consulta[] }> = ({ consultas }) => {
    return (
      <div className="historico-container">
        <h3>Histórico de Consultas</h3>
        {consultas.length === 0 ? (
          <p>Nenhuma consulta agendada</p>
        ) : (
          <div className="historico-grid">
            {consultas.map((consulta, index) => (
              <div key={index} className="consulta-card">
                <h4>{consulta.dentista}</h4>
                <p><strong>Data:</strong> {formatDate(consulta.data)}</p>
                <p><strong>Horário:</strong> {consulta.horario}</p>
                <p><strong>Paciente:</strong> {consulta.paciente}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="agendamento-container">
      <h2>Agendamento de Consulta</h2>
      
      {showSuccess && (
        <div className="mensagem-sucesso">
          Consulta agendada com sucesso!
        </div>
      )}
      
      <div className="agendamento-content">
        <div className="calendario">
          <div className="calendario-header">
            <button 
              className={`nav-button ${month <= 5 ? 'disabled' : ''}`}
              onClick={handlePrevMonth}
              disabled={month <= 5}
            >
              &lt;
            </button>
            <h3>{monthNames[month]} {year}</h3>
            <button 
              className={`nav-button ${month >= 7 ? 'disabled' : ''}`}
              onClick={handleNextMonth}
              disabled={month >= 7}
            >
              &gt;
            </button>
          </div>
          
          <div className="dias-semana">
            <div>DOM</div>
            <div>SEG</div>
            <div>TER</div>
            <div>QUA</div>
            <div>QUI</div>
            <div>SEX</div>
            <div>SAB</div>
          </div>
          
          <div className="dias-grid">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="dia empty"></div>;
              }
              
              const date = new Date(year, month, day);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDate;
              const selectable = isDateSelectable(date);
              
              return (
                <div
                  key={dateStr}
                  className={`dia ${isSelected ? 'selected' : ''} ${!selectable ? 'disabled' : ''}`}
                  onClick={() => {
                    if (selectable) {
                      setSelectedDate(dateStr);
                      setSelectedDentista('');
                      setSelectedHorario('');
                    }
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="sessoes-container">
            <h3>Horários Disponíveis</h3>
            <div className="sessoes-grid">
              {dentistasHorarios.map((dentista) => {
                const isSelectedDentista = selectedDentista === dentista.nome;
                const horariosDisponiveis = getHorariosByDate(dentista, selectedDate);
                const temHorariosDisponiveis = horariosDisponiveis.some(
                  horario => isHorarioDisponivel(dentista.nome, horario)
                );

                if (!temHorariosDisponiveis) return null;

                return (
                  <div key={dentista.nome} className="dentista-sessoes">
                    <h4>{dentista.nome}</h4>
                    <div className="horarios-grid">
                      {horariosDisponiveis.map((horario) => {
                        const disponivel = isHorarioDisponivel(dentista.nome, horario);
                        const isSelected = isSelectedDentista && selectedHorario === horario;
                        
                        if (!disponivel) return null;

                        return (
                          <button
                            key={`${dentista.nome}-${horario}`}
                            className={`horario-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (isSelectedDentista && selectedHorario === horario) {
                                setSelectedDentista('');
                                setSelectedHorario('');
                              } else {
                                setSelectedDentista(dentista.nome);
                                setSelectedHorario(horario);
                              }
                            }}
                          >
                            {horario}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={`dados-paciente-container ${!selectedDentista || !selectedHorario ? 'hidden' : ''}`}>
          <h3>Dados do Paciente</h3>
          <form onSubmit={handleSubmit}>
            {!usuarioLogado ? (
              <>
                <div className="form-group">
                  <label>Nome Completo:</label>
                  <input
                    type="text"
                    value={formData.paciente}
                    onChange={(e) => setFormData({...formData, paciente: e.target.value})}
                    required
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    required
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
                <div className="form-group">
                  <label>E-mail:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </>
            ) : (
              <div className="usuario-info">
                <p><strong>Nome:</strong> {usuarioLogado.nome}</p>
                <p><strong>E-mail:</strong> {usuarioLogado.email}</p>
                <p><strong>Telefone:</strong> {usuarioLogado.telefone}</p>
              </div>
            )}

            <div className="consulta-info">
              <p><strong>Data:</strong> {selectedDate ? formatDate(selectedDate) : ''}</p>
              <p><strong>Horário:</strong> {selectedHorario || ''}</p>
              <p><strong>Profissional:</strong> {selectedDentista || ''}</p>
            </div>

            <button type="submit" className="agendar-button">
              Confirmar Agendamento
            </button>
          </form>
        </div>
      </div>
      
      {usuarioLogado && <HistoricoConsultas consultas={historicoConsultas} />}
    </div>
  );
};

export default Agendamento; 