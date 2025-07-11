import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pacientesAPI, profissionaisAPI, agendamentosAPI } from '../services/api';
import './Perfil.css';
import { useNavigate } from 'react-router-dom';

interface PerfilPaciente {
  id: string;
  nome: string;
  email: string;
  fone: string;
  tipo: 'paciente';
}

interface PerfilProfissional {
  id: string;
  nome: string;
  email: string;
  fone: string;
  cro: string;
  especialidade: string;
  descricao: string;
  tipo: 'profissional';
  senha?: string;
}

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

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  dadosPerfil: PerfilPaciente | PerfilProfissional;
  onSave: (dados: any) => Promise<void>;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  isOpen,
  onClose,
  dadosPerfil,
  onSave
}) => {
  const [formData, setFormData] = useState({
    nome: dadosPerfil.nome,
    email: dadosPerfil.email,
    fone: dadosPerfil.fone,
    ...(dadosPerfil.tipo === 'profissional' && {
      cro: (dadosPerfil as PerfilProfissional).cro,
      especialidade: (dadosPerfil as PerfilProfissional).especialidade,
      descricao: (dadosPerfil as PerfilProfissional).descricao
    })
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'fone') {
      // Máscara para telefone brasileiro (99) 99999-9999
      let v = value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 0) v = '(' + v;
      if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
      if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
      setFormData(prev => ({ ...prev, [name]: v }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fone">Telefone</label>
            <input
              type="tel"
              id="fone"
              name="fone"
              value={formData.fone}
              onChange={handleChange}
              required
            />
          </div>

          {dadosPerfil.tipo === 'profissional' && (
            <>
              <div className="form-group">
                <label htmlFor="cro">CRO</label>
                <input
                  type="text"
                  id="cro"
                  name="cro"
                  value={formData.cro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="especialidade">Especialidade</label>
                <input
                  type="text"
                  id="especialidade"
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Descreva sua especialidade e experiência"
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Perfil: React.FC = () => {
  const { usuario, updateUsuario } = useAuth();
  const [dadosPerfil, setDadosPerfil] = useState<PerfilPaciente | PerfilProfissional | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const carregarDadosPerfil = async () => {
    if (!usuario) {
      setError('Usuário não está logado');
      setLoading(false);
      return;
    }

    try {
      let dados;
      if (usuario.tipo === 'paciente') {
        const response = await pacientesAPI.getByEmail(usuario.email);
        dados = {
          ...response,
          tipo: 'paciente' as const
        };

        // Carregar agendamentos do paciente
        const agendamentosData = await agendamentosAPI.getAll();
        console.log('Agendamentos carregados:', agendamentosData);
        
        // Converter para array e filtrar agendamentos do paciente
        const agendamentosArray = Object.values(agendamentosData)
          .filter((ag: any) => ag.idPaciente === response.id) as Agendamento[];
        
        console.log('Agendamentos filtrados do paciente:', agendamentosArray);
        
        // Ordenar agendamentos por data e hora
        agendamentosArray.sort((a, b) => {
          const dataA = new Date(`${a.data.split('/').reverse().join('-')}T${a.horario}`);
          const dataB = new Date(`${b.data.split('/').reverse().join('-')}T${b.horario}`);
          return dataB.getTime() - dataA.getTime();
        });

        console.log('Agendamentos ordenados:', agendamentosArray);
        setAgendamentos(agendamentosArray);
      } else {
        const response = await profissionaisAPI.getByEmail(usuario.email);
        dados = {
          ...response,
          tipo: 'profissional' as const
        };
      }
      setDadosPerfil(dados);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao carregar dados do perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosPerfil();
  }, [usuario]);

  const handleSave = async (dadosAtualizados: any) => {
    if (!dadosPerfil) return;

    try {
      if (dadosPerfil.tipo === 'paciente') {
        await pacientesAPI.update(dadosPerfil.id, dadosAtualizados);
        // Buscar dados atualizados
        const atualizado = await pacientesAPI.getByEmail(dadosPerfil.email);
        const userAtualizado = { ...atualizado, tipo: 'paciente' };
        updateUsuario(userAtualizado);
      } else {
        // Para profissionais, não enviamos a senha na atualização
        const { senha, ...dadosSemSenha } = dadosAtualizados;
        await profissionaisAPI.update(dadosPerfil.id, dadosSemSenha);
        // Buscar dados atualizados
        const atualizado = await profissionaisAPI.getByEmail(dadosPerfil.email);
        const userAtualizado = { ...atualizado, tipo: 'profissional' };
        updateUsuario(userAtualizado);
      }
      // Recarrega os dados do perfil após a atualização
      await carregarDadosPerfil();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    }
  };

  const getProximoAgendamento = () => {
    if (!agendamentos.length) return null;
    
    const agora = new Date();
    console.log('Buscando próxima consulta. Data atual:', agora);
    
    // Filtrar apenas agendamentos futuros com status pendente ou confirmado
    const agendamentosFuturos = agendamentos.filter(ag => {
      // Converter a data e hora do agendamento para um objeto Date
      const [dia, mes, ano] = ag.data.split('/');
      const [hora, minuto] = ag.horario.split(':');
      const dataHora = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(hora), parseInt(minuto));
      
      return dataHora > agora && (ag.status === 'pendente' || ag.status === 'confirmada');
    });

    // Ordenar por data mais próxima
    agendamentosFuturos.sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split('/');
      const [horaA, minutoA] = a.horario.split(':');
      const dataHoraA = new Date(parseInt(anoA), parseInt(mesA) - 1, parseInt(diaA), parseInt(horaA), parseInt(minutoA));

      const [diaB, mesB, anoB] = b.data.split('/');
      const [horaB, minutoB] = b.horario.split(':');
      const dataHoraB = new Date(parseInt(anoB), parseInt(mesB) - 1, parseInt(diaB), parseInt(horaB), parseInt(minutoB));

      return dataHoraA.getTime() - dataHoraB.getTime();
    });

    console.log('Próximo agendamento encontrado:', agendamentosFuturos[0]);
    return agendamentosFuturos[0];
  };

  const getUltimoAgendamento = () => {
    if (!agendamentos.length) return null;
    
    const agora = new Date();
    console.log('Buscando última consulta. Data atual:', agora);
    console.log('Todos os agendamentos:', agendamentos);
    
    // Filtrar apenas agendamentos com status concluído ou cancelado
    const agendamentosPassados = agendamentos.filter(ag => {
      const statusValido = ag.status === 'concluída' || ag.status === 'cancelada';
      
      console.log('Verificando agendamento:', {
        id: ag.id,
        data: ag.data,
        horario: ag.horario,
        status: ag.status,
        statusValido
      });
      
      return statusValido;
    });

    console.log('Agendamentos passados filtrados:', agendamentosPassados);

    if (agendamentosPassados.length === 0) {
      console.log('Nenhum agendamento passado encontrado');
      return null;
    }

    // Ordenar por data mais recente
    agendamentosPassados.sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split('/');
      const [horaA, minutoA] = a.horario.split(':');
      const dataHoraA = new Date(parseInt(anoA), parseInt(mesA) - 1, parseInt(diaA), parseInt(horaA), parseInt(minutoA));

      const [diaB, mesB, anoB] = b.data.split('/');
      const [horaB, minutoB] = b.horario.split(':');
      const dataHoraB = new Date(parseInt(anoB), parseInt(mesB) - 1, parseInt(diaB), parseInt(horaB), parseInt(minutoB));

      return dataHoraB.getTime() - dataHoraA.getTime();
    });

    console.log('Agendamentos passados ordenados:', agendamentosPassados);
    console.log('Último agendamento encontrado:', agendamentosPassados[0]);
    return agendamentosPassados[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return '#f39c12'; // Laranja
      case 'confirmada':
        return '#2ecc71'; // Verde
      case 'concluída':
        return '#3498db'; // Azul
      case 'cancelada':
        return '#e74c3c'; // Vermelho
      default:
        return '#95a5a6'; // Cinza
    }
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!dadosPerfil) {
    return (
      <div className="perfil-container">
        <div className="error-message">
          <i className="fas fa-user-slash"></i>
          <p>Nenhum dado encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`perfil-container${dadosPerfil.tipo === 'profissional' ? ' profissional' : ''}`}>
      <div className="perfil-header">
        <div
          className="perfil-avatar"
          style={{
            backgroundColor: dadosPerfil.tipo === 'profissional' ? '#5e2129' : '#00b4f0',
            color: 'white',
            boxShadow: dadosPerfil.tipo === 'profissional'
              ? '0 2px 8px rgba(94, 33, 41, 0.3)'
              : '0 2px 8px rgba(0, 180, 240, 0.3)'
          }}
        >
          {dadosPerfil.nome
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <h1>{dadosPerfil.nome}</h1>
        <span
          className="tipo-usuario"
          style={{
            background: dadosPerfil.tipo === 'profissional' ? 'rgba(94,33,41,0.08)' : 'rgba(0,180,240,0.08)',
            color: dadosPerfil.tipo === 'profissional' ? '#5e2129' : '#00b4f0',
            border: `1px solid ${dadosPerfil.tipo === 'profissional' ? '#5e2129' : '#00b4f0'}`
          }}
        >
          {dadosPerfil.tipo === 'paciente' ? 'Paciente' : 'Profissional'}
        </span>
      </div>

      <div className="perfil-info">
        <div className="info-section">
          <h2>Informações Pessoais</h2>
          <div className="info-group">
            <label>
              <i className="fas fa-envelope"></i> Email
            </label>
            <p>{dadosPerfil.email}</p>
          </div>

          <div className="info-group">
            <label>
              <i className="fas fa-phone"></i> Telefone
            </label>
            <p>{dadosPerfil.fone}</p>
          </div>
        </div>

        {dadosPerfil.tipo === 'profissional' && (
          <div className="info-section">
            <h2>Informações Profissionais</h2>
            <div className="info-group">
              <label>
                <i className="fas fa-id-card"></i> CRO
              </label>
              <p>{dadosPerfil.cro}</p>
            </div>
            <div className="info-group">
              <label>
                <i className="fas fa-stethoscope"></i> Especialidade
              </label>
              <p>{dadosPerfil.especialidade}</p>
            </div>
          </div>
        )}

        {dadosPerfil.tipo === 'paciente' && (
          <div className="info-section">
            <h2>Histórico de Atendimentos</h2>
            <div className="info-group">
              <label>
                <i className="fas fa-calendar-check"></i> Próxima Consulta
              </label>
              {getProximoAgendamento() ? (
                <div className="agendamento-info">
                  <p>
                    <strong>Data:</strong> {getProximoAgendamento()?.data}
                    <br />
                    <strong>Horário:</strong> {getProximoAgendamento()?.horario}
                    <br />
                    <strong>Procedimento:</strong> {getProximoAgendamento()?.procedimento?.nome}
                    <br />
                    <strong>Profissional:</strong> {getProximoAgendamento()?.profissional?.nome}
                    <br />
                    <strong>Status:</strong>{' '}
                    <span style={{ color: getStatusColor(getProximoAgendamento()?.status || '') }}>
                      {getProximoAgendamento()?.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p>Nenhuma consulta agendada</p>
              )}
            </div>
            <div className="info-group">
              <label>
                <i className="fas fa-history"></i> Última Consulta
              </label>
              {getUltimoAgendamento() ? (
                <div className="agendamento-info">
                  <p>
                    <strong>Data:</strong> {getUltimoAgendamento()?.data}
                    <br />
                    <strong>Horário:</strong> {getUltimoAgendamento()?.horario}
                    <br />
                    <strong>Procedimento:</strong> {getUltimoAgendamento()?.procedimento?.nome}
                    <br />
                    <strong>Profissional:</strong> {getUltimoAgendamento()?.profissional?.nome}
                    <br />
                    <strong>Status:</strong>{' '}
                    <span style={{ color: getStatusColor(getUltimoAgendamento()?.status || '') }}>
                      {getUltimoAgendamento()?.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p>Nenhuma consulta realizada</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="perfil-actions">
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          <i className="fas fa-edit"></i> Editar Perfil
        </button>
        {dadosPerfil.tipo === 'paciente' ? (
          <button className="appointments-button agenda-paciente" onClick={() => handleNavigation('/meus-agendamentos')}>
            <i className="fas fa-calendar-alt"></i> Meus Agendamentos
          </button>
        ) : (
          <button className="schedule-button agenda-profissional" onClick={() => handleNavigation('/agenda')}>
            <i className="fas fa-calendar-check"></i> Minha Agenda
          </button>
        )}
      </div>

      <EditarPerfilModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        dadosPerfil={dadosPerfil}
        onSave={handleSave}
      />
    </div>
  );
};

export default Perfil; 