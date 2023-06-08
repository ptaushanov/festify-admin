import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, firestore } from '../../firebase.v9';
import { collection, getDoc, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';

import Loading from '../../components/Loading/Loading';

interface AuthContextProps {
    currentUser: User | null;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<boolean>;
    isError: boolean;
    error: string | null;
    token: string | null;
    refreshUserToken: () => Promise<void>;
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
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser({ ...user });
                setUserToken();
            } else {
                setCurrentUser(null);
                setToken(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const setUserToken = async () => {
        const token = await auth.currentUser?.getIdToken() ?? null;
        setToken(token);
    }

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsError(false);

            const credentials = await signInWithEmailAndPassword(auth, email, password);
            const { user } = credentials;

            const adminCollection = collection(firestore, 'admins')
            const adminDoc = doc(adminCollection, user.uid)
            const userDoc = await getDoc(adminDoc);

            if (!userDoc.exists()) {
                await signOut();
                setError('User is not an admin');
                setIsError(true);
                return false
            }

            setCurrentUser(user);
            return true
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
                setIsError(true);
            }
            return false
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            setIsError(false);
            await auth.signOut();
            return true
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
                setIsError(true);
            }
            return false
        }
    };

    const value: AuthContextProps = {
        currentUser,
        signIn,
        signOut,
        isError,
        error,
        token,
        refreshUserToken: setUserToken
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
