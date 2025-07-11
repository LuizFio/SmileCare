import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { agendamentosAPI, procedimentosAPI, profissionaisAPI, pacientesAPI } from '../services/api';
import './MeusAgendamentos.css';

interface Agendamento {
  id: string;
  data: string;
  horario: string;
  status: 'pendente' | 'confirmada' | 'concluída' | 'cancelada';
  idPaciente: string;
  idProcedimento: string;
  idProfissional: string;
  paciente?: {
    nome: string;
  };
  profissional?: {
    nome: string;
  };
  procedimento?: {
    nome: string;
  };
}

interface Procedimento {
  id: string;
  nome: string;
  idProfissionais: string[];
}

interface Profissional {
  id: string;
  nome: string;
  cro: string;
  especialidade: string;
}

const MeusAgendamentos: React.FC = () => {
  const { usuario } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    horario: '',
    idProcedimento: '',
    idProfissional: ''
  });
  const [mensagemErroData, setMensagemErroData] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
      try {
      setLoading(true);
      setError(null);

      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados completos do paciente
      const pacienteData = await pacientesAPI.getByEmail(usuario.email);
      console.log('Dados do paciente:', pacienteData);

      if (!pacienteData || !pacienteData.id) {
        throw new Error('Dados do paciente não encontrados');
      }

      // Carregar todos os agendamentos do sistema
      let todosAgendamentosData = await agendamentosAPI.getAll();
      let todosAgendamentosArray = Object.values(todosAgendamentosData) as Agendamento[];
      // Padronizar datas para o formato ISO (YYYY-MM-DD)
      todosAgendamentosArray = todosAgendamentosArray.map(ag => ({
        ...ag,
        data: toISODate(ag.data)
      }));
      setTodosAgendamentos(todosAgendamentosArray);

      // Carregar agendamentos do paciente
      let agendamentosArray = todosAgendamentosArray.filter((ag: any) => ag.idPaciente === pacienteData.id);
      setAgendamentos(agendamentosArray);

      // Carregar procedimentos disponíveis
      const procedimentosData = await procedimentosAPI.getAll();
      const procedimentosArray = Object.values(procedimentosData) as Procedimento[];
      setProcedimentos(procedimentosArray);

      // Carregar profissionais disponíveis
      const profissionaisData = await profissionaisAPI.getAll();
      const profissionaisArray = Object.values(profissionaisData) as Profissional[];
      setProfissionais(profissionaisArray);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
      setLoading(false);
    }
  };

  // Atualiza a lista de profissionais disponíveis quando um procedimento é selecionado
  useEffect(() => {
    if (novoAgendamento.idProcedimento) {
      const procedimentoSelecionado = procedimentos.find(p => p.id === novoAgendamento.idProcedimento);
      console.log('Procedimento selecionado:', procedimentoSelecionado);
      
      if (procedimentoSelecionado) {
        const profissionaisDoProcedimento = profissionais.filter(
          prof => procedimentoSelecionado.idProfissionais.includes(prof.id)
        );
        console.log('Profissionais disponíveis para o procedimento:', profissionaisDoProcedimento);
        setProfissionaisDisponiveis(profissionaisDoProcedimento);
      }
    } else {
      setProfissionaisDisponiveis([]);
    }
  }, [novoAgendamento.idProcedimento, procedimentos, profissionais]);

  const formatarData = (data: string) => {
    if (!data) return '';
    
    // Se a data já estiver no formato dd/MM/yyyy, retorna ela mesma
    if (data.includes('/')) {
      return data;
    }
    
    // Se estiver no formato ISO (YYYY-MM-DD), converte para dd/MM/yyyy
    try {
      const [ano, mes, dia] = data.split('-');
      if (ano && mes && dia) {
        return `${dia}/${mes}/${ano}`;
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
    }
    
    return data;
  };

  // Função para gerar os horários disponíveis
  const gerarHorariosDisponiveis = () => {
    const horariosManha: string[] = [];
    const horariosTarde: string[] = [];
    
    // Horários da manhã (8h às 12h)
    for (let hora = 8; hora <= 12; hora++) {
      horariosManha.push(`${hora.toString().padStart(2, '0')}:00`);
      // Adiciona o horário de 30 minutos se não for 12h
      if (hora !== 12) {
        horariosManha.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Horários da tarde (13h às 19h)
    for (let hora = 13; hora <= 19; hora++) {
      horariosTarde.push(`${hora.toString().padStart(2, '0')}:00`);
      // Adiciona o horário de 30 minutos se não for 19h
      if (hora !== 19) {
        horariosTarde.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
    
    return { horariosManha, horariosTarde };
  };

  // Função para converter data para o formato ISO (YYYY-MM-DD)
  const toISODate = (data: string) => {
    if (!data) return '';
    if (data.includes('-')) return data; // já está no formato ISO
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      return `${ano}-${mes}-${dia}`;
    }
    return data;
  };

  // Função para obter horários ocupados para o procedimento e data selecionados (independente do profissional)
  const horariosOcupados = todosAgendamentos
    .filter(ag =>
      toISODate(ag.data) === toISODate(novoAgendamento.data) &&
      ag.idProfissional === novoAgendamento.idProfissional &&
      ag.status !== 'cancelada'
    )
    .map(ag => ag.horario);

  const toBRDate = (data: string) => {
    if (!data) return '';
    if (data.includes('/')) return data; // já está no formato brasileiro
    if (data.includes('-')) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return data;
  };

  // Função para verificar se a data é sábado ou domingo (corrigida para fuso local)
  const isWeekend = (dateString: string) => {
    if (!dateString) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = domingo, 6 = sábado
  };

  // Função para verificar se a data é anterior à data atual
  const isPastDate = (dateString: string) => {
    if (!dateString) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const selected = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera o horário para comparar só a data
    return selected < today;
  };

  const handleNovoAgendamento = async () => {
    try {
      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados completos do paciente
      const pacienteData = await pacientesAPI.getByEmail(usuario.email);
      console.log('Dados do paciente:', pacienteData);

      if (!pacienteData || !pacienteData.id) {
        throw new Error('Dados do paciente não encontrados');
      }

      // Formatar a data para o formato brasileiro antes de enviar
      const dataFormatada = formatarData(novoAgendamento.data);

      const agendamentoData = {
        data: dataFormatada,
        horario: novoAgendamento.horario,
        idProcedimento: novoAgendamento.idProcedimento,
        idProfissional: novoAgendamento.idProfissional,
        idPaciente: pacienteData.id,
        status: 'pendente' as const
      };

      console.log('Criando novo agendamento:', agendamentoData);
      await agendamentosAPI.create(agendamentoData);
      
      setShowModal(false);
      setNovoAgendamento({
        data: '',
        horario: '',
        idProcedimento: '',
        idProfissional: ''
      });
      
      await carregarDados();
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      setError('Não foi possível criar o agendamento. Por favor, tente novamente.');
    }
  };

  const handleCancelarAgendamento = async (id: string) => {
    try {
      console.log('Cancelando agendamento:', id);
      
      // Encontrar o agendamento atual em todosAgendamentos
      const agendamentoAtual = todosAgendamentos.find(ag => ag.id === id);
      if (!agendamentoAtual) {
        throw new Error('Agendamento não encontrado');
      }

      // Manter os dados existentes e atualizar apenas o status
      const dadosAtualizados = {
        data: toBRDate(agendamentoAtual.data),
        horario: agendamentoAtual.horario,
        idPaciente: agendamentoAtual.idPaciente,
        idProcedimento: agendamentoAtual.idProcedimento,
        idProfissional: agendamentoAtual.idProfissional,
        status: 'cancelada' as const
      };

      console.log('Atualizando agendamento com dados:', dadosAtualizados);
      await agendamentosAPI.update(id, dadosAtualizados);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao cancelar agendamento:', err);
      setError('Não foi possível cancelar o agendamento. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Carregando agendamentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agendamentos-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agendamentos-container tema-paciente">
      <div className="agendamentos-header">
      <h1>Meus Agendamentos</h1>
        <button 
          className="novo-agendamento-button"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i>
          Novo Agendamento
        </button>
      </div>

      {agendamentos.length === 0 ? (
        <div className="sem-agendamentos">
          <i className="fas fa-calendar-times"></i>
          <p>Você ainda não possui agendamentos.</p>
        </div>
      ) : (
        <div className="agendamentos-list">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="agendamento-card">
              <div className="agendamento-info">
                <div className="agendamento-data">
                  <i className="fas fa-calendar"></i>
                  <span>{formatarData(agendamento.data)}</span>
                </div>
                <div className="agendamento-hora">
                  <i className="fas fa-clock"></i>
                  <span>{agendamento.horario}</span>
                </div>
                <div className="agendamento-procedimento">
                  <i className="fas fa-tooth"></i>
                  <span>{agendamento.procedimento?.nome || 'Procedimento não especificado'}</span>
                </div>
                <div className="agendamento-profissional">
                  <i className="fas fa-user-md"></i>
                  <span>{agendamento.profissional?.nome || 'Profissional não especificado'}</span>
                </div>
                <span className={`status-badge ${agendamento.status}`}>
                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                </span>
              </div>
              {agendamento.status === 'pendente' && (
                <button
                  className="cancelar-button"
                  onClick={() => handleCancelarAgendamento(agendamento.id)}
                >
                  <i className="fas fa-times"></i>
                  Cancelar Agendamento
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Novo Agendamento</h2>
            <div className="form-group">
              <label htmlFor="data">Data</label>
              <input
                type="date"
                id="data"
                value={novoAgendamento.data}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isWeekend(value)) {
                    setMensagemErroData('Não é possível agendar para sábados ou domingos.');
                    setNovoAgendamento({ ...novoAgendamento, data: '' });
                    setTimeout(() => setMensagemErroData(''), 3000);
                  } else if (isPastDate(value)) {
                    setMensagemErroData('Não é possível agendar para datas anteriores à data atual.');
                    setNovoAgendamento({ ...novoAgendamento, data: '' });
                    setTimeout(() => setMensagemErroData(''), 3000);
                  } else {
                    setNovoAgendamento({ ...novoAgendamento, data: value });
                    setMensagemErroData('');
                  }
                }}
                required
              />
              {mensagemErroData && (
                <div className="mensagem-erro-data">{mensagemErroData}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="horario">Horário</label>
              <select
                id="horario"
                value={novoAgendamento.horario}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, horario: e.target.value })}
                required
                disabled={!novoAgendamento.data || !novoAgendamento.idProcedimento || !novoAgendamento.idProfissional}
              >
                <option value="">Selecione um horário</option>
                <optgroup label="Horários da Manhã (8h às 12h)">
                  {gerarHorariosDisponiveis().horariosManha.map((horario) => (
                    <option key={horario} value={horario} disabled={horariosOcupados.includes(horario)}>
                      {horario} {horariosOcupados.includes(horario) ? ' - Indisponível' : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Horários da Tarde (13h às 19h)">
                  {gerarHorariosDisponiveis().horariosTarde.map((horario) => (
                    <option key={horario} value={horario} disabled={horariosOcupados.includes(horario)}>
                      {horario} {horariosOcupados.includes(horario) ? ' - Indisponível' : ''}
                    </option>
                  ))}
                </optgroup>
              </select>
              {(!novoAgendamento.data || !novoAgendamento.idProcedimento || !novoAgendamento.idProfissional) && (
                <small className="form-text">Selecione data, procedimento e profissional</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="procedimento">Procedimento</label>
              <select
                id="procedimento"
                value={novoAgendamento.idProcedimento}
                onChange={(e) => {
                  setNovoAgendamento({ 
                    ...novoAgendamento, 
                    idProcedimento: e.target.value,
                    idProfissional: '' // Limpa o profissional selecionado
                  });
                }}
                required
              >
                <option value="">Selecione um procedimento</option>
                {procedimentos.map((proc) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="profissional">Profissional</label>
              <select
                id="profissional"
                value={novoAgendamento.idProfissional}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, idProfissional: e.target.value })}
                required
                disabled={!novoAgendamento.idProcedimento}
              >
                <option value="">Selecione um profissional</option>
                {profissionaisDisponiveis.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    Dr(a). {prof.nome} - {prof.especialidade}
                  </option>
                ))}
              </select>
              {!novoAgendamento.idProcedimento && (
                <small className="form-text">Selecione primeiro um procedimento</small>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button 
                className="confirm-button" 
                onClick={handleNovoAgendamento}
                disabled={!novoAgendamento.data || !novoAgendamento.horario || !novoAgendamento.idProcedimento || !novoAgendamento.idProfissional}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeusAgendamentos; 