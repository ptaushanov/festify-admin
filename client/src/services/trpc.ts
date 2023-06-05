import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../../../server/src/routers/appRouter";

const trpc = createTRPCReact<AppRouter>()
export default trpc;