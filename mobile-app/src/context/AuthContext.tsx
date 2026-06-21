import { createContext, useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { api } from '@/services/api';

type User = {
    id: number;
    name: string;
    email: string;
    birthDate: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string, birthDate: string) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function showError(message: string) {
    if (Platform.OS === 'web') {
        window.alert(message);
    } else {
        Alert.alert('Erro', message);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const signIn = async (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
            showError('Preencha o e-mail e a senha.');
            return;
        }

        setLoading(true);
        try {
            const data = await api<{ user: User; token: string }>('/auth/login', {
                method: 'POST',
                body: { email, password },
            });
            setUser(data.user);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Não foi possível fazer login.');
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (name: string, email: string, password: string, birthDate: string) => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            showError('Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const data = await api<{ user: User; token: string }>('/auth/register', {
                method: 'POST',
                body: { name, email, password, birthDate },
            });
            setUser(data.user);
        } catch (e) {
            showError(e instanceof Error ? 'a' : 'Não foi possível criar a conta.');
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);