import axios from "axios";

const api = axios.create({
  baseURL: "https://newsletter-backend-eight.vercel.app"
});

export const uploadWallpaper = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("/upload", formData);
    console.log("Wallpaper uploaded successfully:", data);
    return data.fileUrl;
  } catch (err) {
    console.error("Error uploading wallpaper:", err);
    throw err;
  }
};
