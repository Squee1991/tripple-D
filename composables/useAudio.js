const BUCKET = 'tripple-d-dev.firebasestorage.app';

export const getAudioUrl = (localPath) => {
    const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
    const encodedPath = encodeURIComponent(cleanPath);
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media`;
};