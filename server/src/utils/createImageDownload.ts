import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { clientStorage } from "../firebase-client.js";
import { randomUUID } from "crypto";

export async function createDownloadUrl(uploadPath: string, thumbnail: string) {
    const imagePath = `${uploadPath}/${randomUUID()}}`;
    const uploadRef = ref(clientStorage, imagePath);

    const uploadTask = await uploadString(uploadRef, thumbnail, 'data_url');
    return await getDownloadURL(uploadTask.ref);
}