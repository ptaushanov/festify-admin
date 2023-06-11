import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { clientStorage } from "../firebase-client.js";
import { randomUUID } from "crypto";

const storageBucket = process.env.STORAGE_BUCKET ?? "";

export async function createDownloadUrl(uploadPath: string, thumbnail: string) {
    // If the thumbnail is already a download URL, return it
    if (thumbnail.includes(storageBucket)) return thumbnail;

    const imagePath = `${uploadPath}/${randomUUID()}}`;
    const uploadRef = ref(clientStorage, imagePath);

    const uploadTask = await uploadString(uploadRef, thumbnail, 'data_url');
    return await getDownloadURL(uploadTask.ref);
}