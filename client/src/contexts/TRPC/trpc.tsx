import { ReactNode, useState } from 'react'
import { AppRouter } from '../../../../server/src/routers/appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCClientError, httpBatchLink } from '@trpc/client';
import { useAuth } from '../Auth/AuthContext';
import trpc from '../../services/trpc';
import toast from 'react-hot-toast';

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

    const handleTRPCClientError = async (error: TRPCClientError<AppRouter>) => {
        toast.error(error.message);

        const isUnauthorized = error.data?.code === 'UNAUTHORIZED';
        if (!isUnauthorized) return;

        toast.loading('Refreshing user credentials');
        await refreshUserToken();
        toast.success('Credentials refreshed!');
    }

    const handleErrorResponse = (error: unknown) => {
        const isTRPCClientError = error instanceof TRPCClientError<AppRouter>
        if (isTRPCClientError) return handleTRPCClientError(error)

        const isGenericError = error instanceof Error;
        if (isGenericError) toast.error(error.message);
    }

    queryClient.setDefaultOptions({
        queries: {
            onError: handleErrorResponse,
            refetchOnMount: "always",
            retry: 3,
            retryDelay: 1000
        },
        mutations: {
            onError: handleErrorResponse,
            retry: 3,
            retryDelay: 2000
        }
    });

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient} >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}