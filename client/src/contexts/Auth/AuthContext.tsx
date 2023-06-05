import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../firebase.v9';

import Loading from '../../components/Loading/Loading';

interface User {
    uid: string;
    email?: string | null;
}

interface AuthContextProps {
    currentUser: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isError: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { uid, email } = user;
                setCurrentUser({ uid, email });
            } else {
                setCurrentUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsError(false);

            const credentials = await signInWithEmailAndPassword(auth, email, password);
            const { user } = credentials;

            setCurrentUser(user);
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
                setIsError(true);
            }
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            setIsError(false);
            await auth.signOut();
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
                setIsError(true);
            }
        }
    };

    const value: AuthContextProps = {
        currentUser,
        signIn,
        signOut,
        isError,
        error,
    };

    if (isLoading) return <Loading />

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export { AuthContext, AuthProvider, useAuth };
