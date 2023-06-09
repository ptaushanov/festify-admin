import { middleware } from '../trpc.js'
import { adminDB } from '../firebase-admin.js';
import { TRPCError } from '@trpc/server';

const verifyUserIsAdmin = async (uid: string) => {
    const adminCollection = adminDB.collection('admins')
    try {
        const adminDoc = await adminCollection.doc(uid).get()
        return adminDoc.exists
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to check if user is admin',
        })
    }
}

const adminMiddleware = middleware(async ({ ctx, next }) => {
    const { uid } = ctx

    if (!uid) throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication token not provided',
    })

    const isAdmin = await verifyUserIsAdmin(uid)

    if (!isAdmin) throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not an admin',
    })

    return next({ ctx })
})

export default adminMiddleware