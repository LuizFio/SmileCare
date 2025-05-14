import React, { useState } from 'react';
import './LoginModal.css';
import RegisterForm from './RegisterForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    console.log('Login attempt:', { email, password });
  };

  const LoginForm = () => (
    <>
      <h2>
        <i className="fas fa-user-circle"></i>
        <br />
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i> Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <i className="fas fa-lock"></i> Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>
        <button type="submit" className="login-button">
          <i className="fas fa-sign-in-alt"></i> Entrar
        </button>
      </form>
      <div className="additional-options">
        <a href="#">
          <i className="fas fa-key"></i> Esqueceu sua senha?
        </a>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          setIsRegistering(true);
        }}>
          <i className="fas fa-user-plus"></i> Criar conta
        </a>
      </div>
    </>
  );

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className={`form-container ${isRegistering ? 'slide-left' : ''}`}>
          {isRegistering ? (
            <RegisterForm onBack={() => setIsRegistering(false)} />
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;