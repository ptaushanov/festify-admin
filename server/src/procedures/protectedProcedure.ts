import { publicProcedure } from '../trpc.js'
import authMiddleware from '../middleware/auth.js'
import adminMiddleware from '../middleware/admin.js'

const protectedProcedure = publicProcedure
    .use(authMiddleware)
    .use(adminMiddleware)

export default protectedProcedure