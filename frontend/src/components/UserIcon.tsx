import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserIcon.css';
import { pacientesAPI, profissionaisAPI } from '../services/api';

const UserIcon: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { usuario, fazerLogout } = useAuth();
    const [dadosUsuario, setDadosUsuario] = useState<any>(usuario);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchDados = async () => {
            if (isOpen && usuario) {
                try {
                    let dados;
                    if (usuario.tipo === 'paciente') {
                        dados = await pacientesAPI.getByEmail(usuario.email);
                        setDadosUsuario({ ...dados, tipo: 'paciente' });
                    } else {
                        dados = await profissionaisAPI.getByEmail(usuario.email);
                        setDadosUsuario({ ...dados, tipo: 'profissional' });
                    }
                } catch (e) {
                    setDadosUsuario(usuario); // fallback
                }
            }
        };
        fetchDados();
    }, [isOpen, usuario]);

    const handleLogout = () => {
        fazerLogout();
        setIsOpen(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    const isProfissional = (user: any): user is { cro: string } => {
        return user.tipo === 'profissional';
    };

    return (
        <div className="user-icon-container" ref={dropdownRef}>
            <button
                className="user-icon-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div
                    className="user-avatar"
                    style={{
                        backgroundColor: dadosUsuario?.tipo === 'profissional' ? '#5e2129' : '#00b4f0',
                        color: 'white'
                    }}
                >
                    {dadosUsuario?.nome ? getInitials(dadosUsuario.nome) : '??'}
                </div>
            </button>

            {isOpen && dadosUsuario && (
                <div className="user-dropdown">
                    <div className="user-info">
                        <div className="user-type-icon" style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            {dadosUsuario.tipo === 'profissional' ? (
                                <i className="fas fa-user-md" style={{ marginRight: 8, color: '#5e2129', fontSize: 20 }}></i>
                            ) : (
                                <i className="fas fa-user" style={{ marginRight: 8, color: '#00b4f0', fontSize: 20 }}></i>
                            )}
                            <span style={{ fontWeight: 'bold', fontSize: 16 }}>{dadosUsuario.tipo === 'profissional' ? 'Profissional' : 'Paciente'}</span>
                        </div>
                        <div className="user-name">{dadosUsuario.nome}</div>
                        <div className="user-email">{dadosUsuario.email}</div>
                        {isProfissional(dadosUsuario) && (
                            <div className="user-cro">CRO: {dadosUsuario.cro}</div>
                        )}
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                        className="dropdown-item" 
                        onClick={() => handleNavigation('/perfil')}
                    >
                        <i className="fas fa-user"></i> Meu Perfil
                    </button>
                    {dadosUsuario.tipo === 'paciente' && (
                        <button 
                            className="dropdown-item" 
                            onClick={() => handleNavigation('/meus-agendamentos')}
                        >
                            <i className="fas fa-calendar-alt"></i> Meus Agendamentos
                        </button>
                    )}
                    {dadosUsuario.tipo === 'profissional' && (
                        <button 
                            className="dropdown-item" 
                            onClick={() => handleNavigation('/agenda')}
                        >
                            <i className="fas fa-calendar-check"></i> Minha Agenda
                        </button>
                    )}
                    <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserIcon; 