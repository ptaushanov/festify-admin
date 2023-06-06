import { t } from '../trpc'
import authMiddleware from '../middleware/auth'
import adminMiddleware from '../middleware/admin'

const protectedProcedure = t.procedure
    .use(authMiddleware)
    .use(adminMiddleware)

export default protectedProcedure