import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onBack: () => void;
  isProfessional: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, isProfessional }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email é obrigatório' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email inválido' });
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
    } catch (error) {
      setErrors({ submit: 'Erro ao enviar email. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: 'Erro ao redefinir senha. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>
        <i className="fas fa-key"></i>
        Recuperar Senha
      </h2>
      <p className="form-subtitle">
        {step === 1 
          ? 'Digite seu email para receber o código de recuperação'
          : 'Digite sua nova senha'
        }
      </p>

      <div className="step-indicator">
        <div className={`step ${step === 1 ? 'active' : ''}`}></div>
        <div className={`step ${step === 2 ? 'active' : ''}`}></div>
      </div>

      {isSuccess ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <span className="error-message" id="email-error">{errors.email}</span>}
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Enviar Código
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">
              <i className="fas fa-lock"></i> Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              aria-invalid={!!errors.newPassword}
              aria-describedby={errors.newPassword ? "new-password-error" : undefined}
            />
            {errors.newPassword && <span className="error-message" id="new-password-error">{errors.newPassword}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i> Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {errors.confirmPassword && <span className="error-message" id="confirm-password-error">{errors.confirmPassword}</span>}
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Redefinindo...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Redefinir Senha
              </>
            )}
          </button>
        </form>
      )}

      <button 
        className="back-button"
        onClick={onBack}
        disabled={isLoading}
      >
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
  );
};

export default ForgotPasswordForm; 