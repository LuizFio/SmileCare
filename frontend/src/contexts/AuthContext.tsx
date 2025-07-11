import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos específicos para cada tipo de usuário
interface Paciente {
    id: string;
    nome: string;
    email: string;
    tipo: 'paciente';
}

interface Profissional {
    id: string;
    nome: string;
    email: string;
    cro: string;
    tipo: 'profissional';
}

type Usuario = Paciente | Profissional;

// Interface do contexto
interface AuthContextData {
    usuario: Usuario | null;
    estaLogado: boolean;
    fazerLogin: (dados: { token: string; user: Usuario }) => void;
    fazerLogout: () => void;
    updateUsuario: (user: Usuario) => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook personalizado para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

// Provider do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    // Carregar dados do usuário do storage ao iniciar
    useEffect(() => {
        const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
        const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType');

        if (token && userData && userType) {
            try {
                const parsedUser = JSON.parse(userData);
                const user: Usuario = {
                    ...parsedUser,
                    tipo: userType as 'paciente' | 'profissional',
                    ...(userType === 'profissional' && { cro: parsedUser.cro })
                };
                setUsuario(user);
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }
    }, []);

    const fazerLogin = (dados: { token: string; user: Usuario }) => {
        setUsuario(dados.user);
    };

    const updateUsuario = (user: Usuario) => {
        setUsuario(user);
        const storage = localStorage.getItem('userToken') ? localStorage : sessionStorage;
        storage.setItem('userData', JSON.stringify(user));
        storage.setItem('userType', user.tipo);
    };

    const fazerLogout = () => {
        setUsuario(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userType');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                estaLogado: !!usuario,
                fazerLogin,
                fazerLogout,
                updateUsuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
} 