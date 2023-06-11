import { TRPCError } from "@trpc/server";
import { deleteObject, ref } from "firebase/storage";
import { clientStorage } from '../firebase-client.js';

export async function deleteImages(images: string[]) {
    await Promise.all(images.map((image) => deleteImage(image)));
}

export async function deleteImage(image: string) {
    try {
        const thumbnailRef = ref(clientStorage, image);
        await deleteObject(thumbnailRef);
    } catch (error) {
        if (error instanceof Error && "code" in error) {
            if (error.code !== 'storage/object-not-found') {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to delete image from storage',
                });
            }
        }
    }
}