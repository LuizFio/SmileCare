import React, { useState } from 'react';

interface RegisterFormProps {
  onBack: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de registro
    console.log('Register attempt:', formData);
  };

  return (
    <>
      <h2>
        <i className="fas fa-user-plus"></i>
        <br />
        Criar Conta
      </h2>
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
          />
        </div>
        <button type="submit" className="login-button">
          <i className="fas fa-user-plus"></i> Cadastrar
        </button>
      </form>
      <div className="additional-options">
        <button onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar para Login
        </button>
      </div>
    </>
  );
};

export default RegisterForm; 