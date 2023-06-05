import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ReactNode, useState } from 'react'
import trpc from '../../services/trpc';

const serverURL = import.meta.env.VITE_SERVER_URL;

interface TRPCProviderProps {
    children?: ReactNode
}

export default function TRPCProvider({ children }: TRPCProviderProps) {
    const headers = async () => ({
        Authorization: "Bearer " + localStorage.getItem("token"),
    })

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({ url: serverURL, headers }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient} >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}