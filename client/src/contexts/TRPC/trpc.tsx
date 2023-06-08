import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ReactNode, useState } from 'react'
import trpc from '../../services/trpc';
import { useAuth } from '../Auth/AuthContext';

const serverURL = import.meta.env.VITE_SERVER_URL;

interface TRPCProviderProps {
    children?: ReactNode
}

export default function TRPCProvider({ children }: TRPCProviderProps) {
    const { token, refreshUserToken } = useAuth();
    const headers = { authorization: token || '' }

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({ url: serverURL, headers }),
            ],
        }),
    );

    queryClient.setDefaultOptions({
        queries: {
            onError: refreshUserToken
        },
    });

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient} >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}