import { middleware } from '../trpc'
import { DecodedIdToken, getAuth } from 'firebase-admin/auth'
import { TRPCError } from '@trpc/server';


const verifyToken = async (token: string) => {
    try {
        const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(token)
        const { uid } = decodedToken

        return uid
    } catch (error) {
        if (error instanceof Error && 'code' in error) {
            // Handle Firebase errors based on error codes
            if (error.code === 'auth/invalid-token') {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid authentication token',
                })
            } else if (error.code === 'auth/id-token-expired') {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication token expired',
                })
            } else {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to authenticate user',
                })
            }
        } else {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to authenticate user',
            })
        }
    }
}

const authMiddleware = middleware(async ({ ctx, next }) => {
    const token = ctx.req.headers.authorization

    if (!token) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication token not provided',
        })
    }

    const uid = await verifyToken(token)
    ctx.uid = uid

    return next({ ctx })
})

export default authMiddleware