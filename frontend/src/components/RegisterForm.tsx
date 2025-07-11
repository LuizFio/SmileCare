import React, { useState } from 'react';
import { pacientesAPI } from '../services/api';

interface RegisterFormProps {
  onBack: () => void;
}

interface PacienteData {
  nome: string;
  email: string;
  senha: string;
  fone: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    fone: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Limpar mensagem quando usuário começar a digitar
    if (message) {
      setMessage('');
    }
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setMessage('Nome é obrigatório');
      setMessageType('error');
      return false;
    }

    if (!formData.email.trim()) {
      setMessage('Email é obrigatório');
      setMessageType('error');
      return false;
    }

    if (!formData.fone.trim()) {
      setMessage('Telefone é obrigatório');
      setMessageType('error');
      return false;
    }

    if (!formData.senha) {
      setMessage('Senha é obrigatória');
      setMessageType('error');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setMessage('Senhas não conferem');
      setMessageType('error');
      return false;
    }

    if (formData.senha.length < 4) {
      setMessage('Senha deve ter pelo menos 4 caracteres');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Preparar dados para envio (sem confirmarSenha)
      const { confirmarSenha, ...dadosParaEnvio } = formData;

      const response = await pacientesAPI.create({
        ...dadosParaEnvio
      });

      setMessage('Cadastro realizado com sucesso!');
      setMessageType('success');

      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        fone: ''
      });

      // Opcional: voltar para login após 2 segundos
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (error) {
      let errorMessage = 'Erro no cadastro. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('já cadastrado')) {
          errorMessage = 'Este email já está cadastrado.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>
        <i className="fas fa-user-plus"></i>
        <br />
        Criar Conta de Paciente
      </h2>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`message ${messageType}`} style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '5px',
          textAlign: 'center',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">
            <i className="fas fa-user"></i> Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Seu email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fone">
            <i className="fas fa-phone"></i> Telefone
          </label>
          <input
            type="tel"
            id="fone"
            name="fone"
            value={formData.fone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">
            <i className="fas fa-lock"></i> Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Sua senha"
            required
            disabled={loading}
            minLength={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">
            <i className="fas fa-lock"></i> Confirmar Senha
          </label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            placeholder="Confirme sua senha"
            required
            disabled={loading}
            minLength={4}
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Cadastrando...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i> Cadastrar
            </>
          )}
        </button>
      </form>

      <div className="additional-options-register">
        <div className="additional-options-login" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <a href="#" onClick={e => { e.preventDefault(); if (!loading) onBack(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: 15 }}>
            <i className="fas fa-user-circle"></i> Voltar para Login
          </a>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;