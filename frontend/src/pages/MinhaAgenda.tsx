import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { agendamentosAPI, procedimentosAPI, profissionaisAPI } from '../services/api';
import './MinhaAgenda.css';

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
}

interface Paciente {
  id: string;
  nome: string;
}

const MinhaAgenda: React.FC = () => {
  const { usuario } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoAgendamento, setEditandoAgendamento] = useState<string | null>(null);
  const [statusSelecionado, setStatusSelecionado] = useState<'pendente' | 'confirmada' | 'concluída' | 'cancelada'>('pendente');
  const [deletandoAgendamento, setDeletandoAgendamento] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!usuario || usuario.tipo !== 'profissional') {
        throw new Error('Usuário não autenticado ou não é um profissional');
      }

      // Buscar dados completos do profissional
      const profissionalData = await profissionaisAPI.getByEmail(usuario.email);
      console.log('Dados do profissional:', profissionalData);

      if (!profissionalData || !profissionalData.id) {
        throw new Error('Dados do profissional não encontrados');
      }

      // Carregar agendamentos do profissional
      const agendamentosData = await agendamentosAPI.getAll();
      console.log('Todos os agendamentos:', agendamentosData);
      
      // Converter objeto de agendamentos em array e filtrar pelo ID do profissional
      const agendamentosArray = Object.values(agendamentosData)
        .filter((ag: any) => ag.idProfissional === profissionalData.id) as Agendamento[];
      
      console.log('Agendamentos do profissional:', agendamentosArray);
      setAgendamentos(agendamentosArray);

      // Carregar procedimentos disponíveis
      const procedimentosData = await procedimentosAPI.getAll();
      console.log('Procedimentos carregados:', procedimentosData);
      
      // Converter objeto de procedimentos em array
      const procedimentosArray = Object.values(procedimentosData) as Procedimento[];
      setProcedimentos(procedimentosArray);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar os dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditarStatus = (id: string) => {
    setEditandoAgendamento(id);
    const agendamento = agendamentos.find(ag => ag.id === id);
    if (agendamento) {
      setStatusSelecionado(agendamento.status);
    }
  };

  const handleSalvarStatus = async (id: string) => {
    try {
      console.log('Atualizando status do agendamento:', id);
      
      // Encontrar o agendamento atual
      const agendamentoAtual = agendamentos.find(ag => ag.id === id);
      if (!agendamentoAtual) {
        throw new Error('Agendamento não encontrado');
      }

      // Manter os dados existentes e atualizar apenas o status
      const dadosAtualizados = {
        data: agendamentoAtual.data,
        horario: agendamentoAtual.horario,
        idPaciente: agendamentoAtual.idPaciente,
        idProcedimento: agendamentoAtual.idProcedimento,
        idProfissional: agendamentoAtual.idProfissional,
        status: statusSelecionado
      };

      console.log('Atualizando agendamento com dados:', dadosAtualizados);
      await agendamentosAPI.update(id, dadosAtualizados);
      
      setEditandoAgendamento(null);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar status do agendamento:', err);
      setError('Não foi possível atualizar o status do agendamento. Por favor, tente novamente.');
    }
  };
  
  const handleDeletarAgendamento = async (id: string) => {
    try {
      console.log('Iniciando processo de deletar agendamento:', id);
      setDeletandoAgendamento(id);
      
      if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
        console.log('Confirmação recebida, chamando API para deletar agendamento:', id);
        const response = await agendamentosAPI.delete(id);
        console.log('Resposta da API ao deletar:', response);
        
        console.log('Recarregando dados após deletar');
        await carregarDados();
        console.log('Dados recarregados com sucesso');
      } else {
        console.log('Usuário cancelou a exclusão');
      }
    } catch (err) {
      console.error('Erro detalhado ao deletar agendamento:', err);
      setError('Não foi possível deletar o agendamento. Por favor, tente novamente.');
    } finally {
      setDeletandoAgendamento(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Carregando agenda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agenda-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agenda-container tema-profissional">
      <div className="agenda-header">
        <h1>Minha Agenda</h1>
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
                <div className="agendamento-paciente">
                  <i className="fas fa-user"></i>
                  <span>{agendamento.paciente?.nome || 'Paciente não especificado'}</span>
                </div>
                {editandoAgendamento === agendamento.id ? (
                  <div className="status-edit">
                    <select 
                      value={statusSelecionado}
                      onChange={(e) => setStatusSelecionado(e.target.value as 'pendente' | 'confirmada' | 'concluída' | 'cancelada')}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="concluída">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    <button 
                      className="salvar-button"
                      onClick={() => handleSalvarStatus(agendamento.id)}
                    >
                      <i className="fas fa-save"></i>
                      Salvar
                    </button>
                  </div>
                ) : (
                  <span className={`status-badge ${agendamento.status}`}>
                    {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                  </span>
                )}
              </div>
              {!editandoAgendamento && (
                <div className="buttons-container">
                  <button
                    className="editar-button"
                    onClick={() => handleEditarStatus(agendamento.id)}
                  >
                    <i className="fas fa-edit"></i>
                    Editar Status
                  </button>
                  <button
                    className="deletar-button"
                    onClick={() => handleDeletarAgendamento(agendamento.id)}
                    disabled={deletandoAgendamento === agendamento.id}
                  >
                    {deletandoAgendamento === agendamento.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                    {deletandoAgendamento === agendamento.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhaAgenda; 