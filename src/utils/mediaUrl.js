// Images may be full Cloudinary URLs (https://...) or older
// server paths (/uploads/...). Return a URL the browser can load.
export const mediaUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${import.meta.env.VITE_API_URL}${path}`;
};
