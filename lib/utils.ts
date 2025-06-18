import axios from "axios";

const api = axios.create({
  baseURL: "https://newsletter-backend-eight.vercel.app"
});

export const uploadWallpaper = async (imageUrl: string, author: string) => {
  try {
    const { data } = await api.post("/add-wallpaper", { imageUrl, author });
    console.log("Wallpaper uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading wallpaper:", err);
    throw err;
  }
};

/*
[
    {
      "id": "cmc0pjnw00000js0a79ttvq8x",
      "imageUrl": "https://tensorboy.s3.ap-south-1.amazonaws.com/1750175902327-e1a59f94-6be2-409a-a058-4a4cb7a8c155.gif"
    },
    {
      "id": "cmbzl7p3d0000jt04xb2ry5ro",
      "imageUrl": "https://tensorboy.s3.ap-south-1.amazonaws.com/1750108158441-9409423c-5c73-4590-8061-f113c54c9ae7.jpeg"
    }
  ]
 */

export const getWallpapers = async () => {
  try {
    const { data } = await api.get("/approved-wallpapers");
    console.log("Raw API response:", data);
    
    // Check if data exists and has the expected structure
    if (data && Array.isArray(data)) {
      console.log("API returned direct array:", data);
      return data;
    } else if (data && data.success === true && Array.isArray(data.wallpapers)) {
      console.log("API returned success object with wallpapers:", data.wallpapers);
      return data.wallpapers;
    }
    console.error("Invalid API response structure:", data);
    throw new Error("Invalid API response structure");
  } catch (err) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.debug("API wallpaper fetch failed, using fallback");
    }
    throw err;
  }
};