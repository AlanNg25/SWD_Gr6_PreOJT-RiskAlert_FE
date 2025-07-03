import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../config/firebase"; // Adjust path if needed

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder in Firebase Storage (default: 'images').
 * @param {function} onProgress - Callback function to report upload progress (optional).
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */

export async function uploadImageWithProgress(file, folder = "images", onProgress) {
    if (!file) throw new Error("No file provided");

    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
}

/**
 * Retrieves the download URL for the first image file in the avatars folder from Firebase Storage.
 * @param {string} folder - The folder in Firebase Storage (default: 'avatars').
 * @returns {Promise<string>} - The download URL of the first avatar image.
 */

export async function getFirstAvatarUrl(folder = "avatars") {
    const folderRef = ref(storage, folder);
    const listResult = await listAll(folderRef);

    if (!listResult.items.length) {
        throw new Error("No files found in the avatars folder");
    }

    const firstFileRef = listResult.items[0];
    return await getDownloadURL(firstFileRef);
}