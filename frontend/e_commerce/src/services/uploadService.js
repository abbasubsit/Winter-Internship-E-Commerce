// ============================================================
// Upload Service — Image Upload via Multer
// ============================================================
import API from "./api";

// Upload an image file (Private - Seller)
export const uploadImage = async (formData, token) => {
    const { data } = await API.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
