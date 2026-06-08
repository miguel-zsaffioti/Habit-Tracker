import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
    user: any | null;
    signIn: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {

    const [user, setUser] = useState<any | null>(null);

    const signIn = () => {
        setUser({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
    }

    const signOut = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);