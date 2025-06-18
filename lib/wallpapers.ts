import { getWallpapers as fetchWallpapers } from './utils';

export interface Wallpaper {
  id: string;
  imageUrl: string;
}

// Fallback wallpapers when API is not available
const fallbackWallpapers: Wallpaper[] = [
  {
    id: "1",
    imageUrl: "/wallpapers/1.gif"
  },
  {
    id: "2",
    imageUrl: "/wallpapers/2.gif"
  },
  {
    id: "3",
    imageUrl: "/wallpapers/3.gif"
  },
  {
    id: "4",
    imageUrl: "/wallpapers/4.gif"
  },
  {
    id: "5",
    imageUrl: "/wallpapers/5.gif"
  },
  {
    id: "6",
    imageUrl: "/wallpapers/6.gif"
  },
  {
    id: "7",
    imageUrl: "/wallpapers/7.gif"
  },
  {
    id: "8",
    imageUrl: "/wallpapers/8.gif"
  },
  {
    id: "9",
    imageUrl: "/wallpapers/9.gif"
  },
  {
    id: "10",
    imageUrl: "/wallpapers/10.gif"
  },
  {
    id: "11",
    imageUrl: "/wallpapers/11.gif"
  },
  {
    id: "12",
    imageUrl: "/wallpapers/12.gif"
  }
];

// Helper function to validate wallpaper object
const isValidWallpaper = (wallpaper: any): wallpaper is Wallpaper => {
  console.log("Validating wallpaper:", wallpaper);
  
  if (!wallpaper) {
    console.log("Wallpaper is null or undefined");
    return false;
  }
  
  if (typeof wallpaper !== 'object') {
    console.log("Wallpaper is not an object:", typeof wallpaper);
    return false;
  }
  
  if (typeof wallpaper.id !== 'string') {
    console.log("Wallpaper id is not a string:", wallpaper.id);
    return false;
  }
  
  if (typeof wallpaper.imageUrl !== 'string') {
    console.log("Wallpaper imageUrl is not a string:", wallpaper.imageUrl);
    return false;
  }
  
  if (wallpaper.imageUrl.length === 0) {
    console.log("Wallpaper imageUrl is empty");
    return false;
  }
  
  return true;
};

export const getWallpapers = async (): Promise<Wallpaper[]> => {
  try {
    console.log("Fetching wallpapers from API...");
    const wallpapers = await fetchWallpapers();
    console.log("Received wallpapers from API:", wallpapers);
    
    // Validate and filter wallpapers
    const validWallpapers = wallpapers.filter(isValidWallpaper);
    console.log("Valid wallpapers:", validWallpapers);
    
    if (validWallpapers.length === 0) {
      console.error("No valid wallpapers found in API response");
      throw new Error("No valid wallpapers found in API response");
    }
    
    return validWallpapers;
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.debug("Using fallback wallpapers due to error:", error);
    }
    return fallbackWallpapers;
  }
}; 