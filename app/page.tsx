"use client";
import FolderIcon from "@/components/FolderIcon";
import Taskbar from "@/components/Taskbar";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [decimalValue, setDecimalValue] = useState(552677);
  const [currentTime, setCurrentTime] = useState('00:00 AM');
  const [greeting, setGreeting] = useState('good morning hacker');
  const [customWallpaper, setCustomWallpaper] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load custom wallpaper from localStorage if available
    if (typeof window !== 'undefined') {
      const savedWallpaper = localStorage.getItem('customWallpaper');
      if (savedWallpaper) {
        setCustomWallpaper(savedWallpaper);
      }
    }

    // Function to update time
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12) || 12; // Convert 0 to 12 for 12 AM
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setCurrentTime(timeString);

      if (hours >= 5 && hours < 12) {
        setGreeting('good morning hacker');
      } else if (hours >= 12 && hours < 18) {
        setGreeting('good afternoon hacker');
      } else {
        setGreeting('good evening hacker');
      }
    }

    // Update decimal countdown
    const countdownInterval = setInterval(() => {
      setDecimalValue(prevValue => {
        if (prevValue <= 0) return 999999;
        return prevValue - 1;
      });
    }, 1000);

    // Initial time update
    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const formattedDecimal = decimalValue.toString().padStart(6, '0');

  // Handle file upload
  // Handle file upload
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Resize image before storing
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        // Max dimensions to keep file size reasonable
        const maxWidth = 1280;
        const maxHeight = 720;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get compressed image as data URL with reduced quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        try {
          // Set the compressed image
          setCustomWallpaper(compressedDataUrl);
          localStorage.setItem('customWallpaper', compressedDataUrl);
        } catch (error) {
          alert('Image is still too large. Please choose a smaller image.');
          console.error('Storage error:', error);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

  // Open file input dialog
  const handleChangeWallpaper = () => {
    fileInputRef.current?.click();
  };

  // Reset to default wallpaper
  const handleResetWallpaper = () => {
    setCustomWallpaper('');
    localStorage.removeItem('customWallpaper');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* ——— Background image layer ——— */}
      <div
        className={`
    absolute inset-0
    ${!customWallpaper ? 'bg-slate-900' : ''}
    bg-cover bg-center bg-no-repeat
    filter grayscale-[50%] brightness-65 contrast-100
    z-0
  `}
        style={customWallpaper ? { backgroundImage: `url(${customWallpaper})` } : { backgroundImage: `url(/background.png)` }}
      />

      {/* ——— Optional tint on top of the image ——— */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* ——— Video layer (untouched by the image filter) ——— */}
      <video
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        className="
          absolute inset-0
          w-full h-full object-cover
          z-20
          opacity-5
        "
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Wallpaper control buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
        <button
          onClick={handleChangeWallpaper}
          className="px-3 py-1 bg-black/50 hover:bg-black/70 border border-white/30 text-white text-sm pixelated-font transition-colors"
        >
          change wallpaper
        </button>
        {customWallpaper && (
          <button
            onClick={handleResetWallpaper}
            className="px-3 py-1 bg-black/50 hover:bg-black/70 border border-white/30 text-white text-sm pixelated-font transition-colors"
          >
            reset wallpaper
          </button>
        )}
      </div>

      {/* ——— Folders ——— */}
      <div className="absolute top-1/20 right-8 flex flex-col gap-10 z-30">
        <FolderIcon text="ai news" url="http://localhost:3000/folders/ai-news" />
        <FolderIcon text="internships" url="http://localhost:3000/folders/internships" />
        <FolderIcon text="hackathons" url="http://localhost:3000/folders/hackathons" />
      </div>

      {/* ——— Intro Text ——— */}
      <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">welcome to tensor protocol</h1>
        <h1 className="text-white text-xl pixelated-font">checkout the latest drop <a href="#" target="_blank" className="text-white/50 underline">link</a></h1>
        <h1 className="text-white text-xl pixelated-font">not subscribed yet? <a href="#" target="_blank" className="text-white/50 underline">sub here</a></h1>
      </div>

      {/* ——— Timer ——— */}
      <div className="absolute top-[250px] left-[580px] flex flex-col gap-0 z-30">
        <h1 className="text-white text-[140px] pixelated-font p-0 leading-tight">38<span className="text-[40px]">.{formattedDecimal}</span></h1>
        <h1 className="text-white text-[30px] pixelated-font -mt-4">days till the next drop</h1>
      </div>

      <div className="absolute bottom-2 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">{greeting}</h1>
      </div>

      <div className="absolute bottom-2 right-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">{currentTime}</h1>
      </div>
    </div>
  );
}