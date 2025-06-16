import axios from "axios";

const api = axios.create({
  baseURL: "https://newsletter-backend-eight.vercel.app"
});

export const uploadWallpaper = async (imageUrl : string, author : string) => {
  try {
    const { data } = await api.post("/add-wallpaper", { imageUrl, author });
    console.log("Wallpaper uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading wallpaper:", err);
    throw err;
  }
};
