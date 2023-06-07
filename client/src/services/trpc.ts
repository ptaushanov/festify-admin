import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../../../server/src/routers/appRouter";

const trpc = createTRPCReact<AppRouter>({
    abortOnUnmount: true
})
export default trpc;