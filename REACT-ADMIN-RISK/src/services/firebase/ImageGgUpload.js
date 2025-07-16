import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../config/firebase"; // Adjust path if needed

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder in Firebase Storage (default: 'attachmentNoti').
 * @param {string} id - The ID of the notification to include in the file name.
 * @param {function} onProgress - Callback function to report upload progress (optional).
 * @returns {Promise<{downloadURL: string, fileRef: StorageReference}>} - The download URL and file reference.
 */
export async function uploadFileWithProgress(file, folder = "attachmentNoti", id, onProgress) {
    if (!file) throw new Error("No file provided");
    if (!id) throw new Error("No notification ID provided");

    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `${dateTimeString}_${id}_${file.name}`; // Thêm ID vào tên file
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
                resolve({ downloadURL, fileRef });
            }
        );
    });
}

/**
 * Deletes a file from Firebase Storage.
 * @param {StorageReference} fileRef - The reference to the file in Firebase Storage.
 * @returns {Promise<void>}
 */
export async function deleteFile(fileRef) {
    try {
        // console.log("Attempting to delete file at:", fileRef.fullPath);
        await deleteObject(fileRef);
        console.log("File deleted successfully");
    } catch (error) {
        console.error("Failed to delete file:", error.code, error.message);
        throw error;
    }
}

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder in Firebase Storage (default: 'images').
 * @param {function} onProgress - Callback function to report upload progress (optional).
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export async function uploadImageWithProgress(file, folder = "images", onProgress) {
    if (!file) throw new Error("No file provided");

    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `${dateTimeString}_${file.name}`;
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

    listResult.items.sort((a, b) => {
        const getTimestamp = item => item.name.split('_')[0];
        return getTimestamp(b).localeCompare(getTimestamp(a));
    });

    const firstFileRef = listResult.items[0];
    return await getDownloadURL(firstFileRef);
}