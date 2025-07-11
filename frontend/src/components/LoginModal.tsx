import React, { useState, useEffect } from 'react';
import './LoginModal.css';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { fazerLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    cro: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '', cro: '' });
      setIsLoading(false);
      setErrors({});
      setSuccessMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 4) {
      newErrors.password = 'A senha deve ter pelo menos 4 caracteres';
    }

    if (isProfessional && !formData.cro) {
      newErrors.cro = 'CRO é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      let response;

      if (isProfessional) {
        response = await authAPI.loginProfissional(formData.email, formData.cro, formData.password);
      } else {
        response = await authAPI.loginPaciente(formData.email, formData.password);
      }

      const userData = isProfessional 
        ? {
            id: response.id || response.userId || response._id,
            nome: response.nome || response.name || formData.email.split('@')[0],
            email: response.email || formData.email,
            cro: response.cro || formData.cro,
            tipo: 'profissional' as const
          }
        : {
        id: response.id || response.userId || response._id,
        nome: response.nome || response.name || formData.email.split('@')[0],
        email: response.email || formData.email,
            tipo: 'paciente' as const
      };

      if (rememberMe) {
        localStorage.setItem('userToken', response.token || '');
        localStorage.setItem('userType', isProfessional ? 'profissional' : 'paciente');
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('userToken', response.token || '');
        sessionStorage.setItem('userType', isProfessional ? 'profissional' : 'paciente');
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }

      fazerLogin({
        token: response.token,
        user: userData
      });

      setSuccessMessage('Login realizado com sucesso!');

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('email ou senha incorreto')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (errorMsg.includes('email, cro e senha incorretos')) {
          errorMessage = 'Email, CRO ou senha incorretos.';
        } else if (errorMsg.includes('faltando')) {
          errorMessage = 'Todos os campos são obrigatórios.';
        } else if (errorMsg.includes('não cadastrado')) {
          errorMessage = isProfessional 
            ? 'Profissional não encontrado com este email e CRO.'
            : 'Paciente não encontrado com este email.';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return isOpen ? (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="modal-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fechar modal"
          disabled={isLoading}
        >
          &times;
        </button>
        <div className={`form-container ${isRegistering || isForgotPassword ? 'slide-left' : ''} ${isProfessional ? 'professional-mode' : ''}`}>
          {isRegistering ? (
            <RegisterForm onBack={() => setIsRegistering(false)} />
          ) : isForgotPassword ? (
            <ForgotPasswordForm
              onBack={() => setIsForgotPassword(false)}
              isProfessional={isProfessional}
            />
          ) : (
            <>
              <h2 id="login-title">
                <i className="fas fa-user-circle"></i>
                <br />
                {isProfessional ? 'Login Profissional' : 'Login Paciente'}
              </h2>

              {successMessage && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i> {successMessage}
                </div>
              )}

              <div className="login-type-toggle">
                <button
                  className={`toggle-button ${!isProfessional ? 'active' : ''}`}
                  onClick={() => {
                    setIsProfessional(false);
                    setErrors({});
                    setSuccessMessage('');
                  }}
                  aria-label="Login como paciente"
                  disabled={isLoading}
                >
                  <i className="fas fa-user"></i> Paciente
                </button>
                <button
                  className={`toggle-button-profitional ${isProfessional ? 'active' : ''}`}
                  onClick={() => {
                    setIsProfessional(true);
                    setErrors({});
                    setSuccessMessage('');
                  }}
                  aria-label="Login como profissional"
                  disabled={isLoading}
                >
                  <i className="fas fa-user-md"></i> Profissional
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={isProfessional ? "Email profissional" : "Email do paciente"}
                    required
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <span className="error-message" id="email-error">{errors.email}</span>}
                </div>

                {isProfessional && (
                  <div className="form-group">
                    <label htmlFor="cro">
                      <i className="fas fa-id-card"></i> CRO
                    </label>
                    <input
                      type="text"
                      id="cro"
                      name="cro"
                      value={formData.cro}
                      onChange={handleInputChange}
                      placeholder="Seu número de registro profissional"
                      required
                      disabled={isLoading}
                      aria-invalid={!!errors.cro}
                      aria-describedby={errors.cro ? "cro-error" : undefined}
                    />
                    {errors.cro && <span className="error-message" id="cro-error">{errors.cro}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i> Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    required
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {errors.password && <span className="error-message" id="password-error">{errors.password}</span>}
                </div>

                <div className="remember-me-container">
                  <label className="remember-me-label">
                    <input
                      type="checkbox"
                      className="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span className="remember-me-text">Lembrar de mim</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Entrando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i> Entrar
                    </>
                  )}
                </button>

                {errors.submit && (
                  <div className="error-message submit-error">
                    <i className="fas fa-exclamation-triangle"></i> {errors.submit}
                  </div>
                )}
              </form>

              <div className="additional-options-login">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) setIsForgotPassword(true);
                }}>
                  <i className="fas fa-question-circle"></i> Esqueceu sua senha?
                </a>
                {!isProfessional && (
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) setIsRegistering(true);
                  }}>
                    <i className="fas fa-user-plus"></i> Criar conta de paciente
                  </a>
                )}
              </div>

              <div className="privacy-policy">
                <p>
                  Ao fazer login, você concorda com nossa{' '}
                  <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">
                    Política de Privacidade
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default LoginModal;