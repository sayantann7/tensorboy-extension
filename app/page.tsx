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
  
  // Add new state variables for mission customization
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [missionText, setMissionText] = useState('days till the next drop');
  const [missionEndDate, setMissionEndDate] = useState(() => {
    // Default to 38 days from now
    const date = new Date();
    date.setDate(date.getDate() + 38);
    return date;
  });
  const [daysRemaining, setDaysRemaining] = useState(38);

  // Load saved settings from localStorage only once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWallpaper = localStorage.getItem('customWallpaper');
      if (savedWallpaper) {
        setCustomWallpaper(savedWallpaper);
      }
      
      const savedMissionText = localStorage.getItem('missionText');
      if (savedMissionText) {
        setMissionText(savedMissionText);
      }
      
      const savedMissionEndDate = localStorage.getItem('missionEndDate');
      if (savedMissionEndDate) {
        const parsedDate = new Date(savedMissionEndDate);
        // Only update if it's a valid date
        if (!isNaN(parsedDate.getTime())) {
          setMissionEndDate(parsedDate);
        }
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for time updates and calculations
  useEffect(() => {
    // Function to update time
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12) || 12;
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

    // Initial time update
    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for countdown
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setDecimalValue(prevValue => {
        if (prevValue <= 0) return 999999;
        return prevValue - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate effect just for days calculation
  useEffect(() => {
    // Function to calculate days remaining
    function calculateDaysRemaining() {
      const now = new Date();
      const timeDiff = missionEndDate.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      setDaysRemaining(daysLeft);
    }

    // Initial calculation
    calculateDaysRemaining();

    // Update calculation every minute
    const daysInterval = setInterval(calculateDaysRemaining, 60000);

    return () => {
      clearInterval(daysInterval);
    };
  }, [missionEndDate]); // Only recalculate when mission end date changes

  const formattedDecimal = decimalValue.toString().padStart(6, '0');

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    // For GIFs, use a different approach to preserve animation
    if (file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const dataUrl = event.target?.result as string;
          // Make sure data URL includes the correct MIME type
          if (!dataUrl.startsWith('data:image/gif')) {
            console.warn('GIF MIME type not correctly preserved');
          }
          setCustomWallpaper(dataUrl);
          localStorage.setItem('customWallpaper', dataUrl);
        } catch (error) {
          alert('GIF is too large for storage. Please choose a smaller file.');
          console.error('Storage error:', error);
        }
      };
      reader.readAsDataURL(file);
      return;
    }
      
    // For non-GIF images, use canvas compression
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
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
  
  // Handle mission timer click
  const handleMissionTimerClick = () => {
    setShowMissionModal(true);
  };
  
  // Handle saving mission settings
  const handleSaveMissionSettings = () => {
    // Save to localStorage
    localStorage.setItem('missionText', missionText);
    localStorage.setItem('missionEndDate', missionEndDate.toISOString());
    setShowMissionModal(false);
    
    // Force a re-render by creating a new string reference
    setMissionText(current => current === '' ? current : current + '');
  };

  // Function to handle direct text changes from modal
  const handleMissionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setMissionText(newText);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* ——— Background image/video layer ——— */}
      {customWallpaper && customWallpaper.startsWith('data:image/gif') ? (
        // Use img element for GIFs to preserve animation
        <img
          src={customWallpaper}
          alt="Animated Background"
          className="absolute inset-0 w-full h-full object-cover z-0 filter grayscale-[50%] brightness-65 contrast-100"
        />
      ) : (
        // Use background-image for non-GIF images
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
      )}

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
      <div 
        className="absolute top-[250px] left-[580px] flex flex-col gap-0 z-30 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleMissionTimerClick}
      >
        <h1 className="text-white text-[140px] pixelated-font p-0 leading-tight">{daysRemaining}<span className="text-[40px]">.{formattedDecimal}</span></h1>
        <h1 className="text-white text-[30px] pixelated-font -mt-4">{missionText}</h1>
      </div>

      <div className="absolute bottom-2 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">{greeting}</h1>
      </div>

      <div className="absolute bottom-2 right-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">{currentTime}</h1>
      </div>
      
      {/* Mission Settings Modal */}
      {showMissionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="bg-[#222] border border-white/30 p-6 w-[500px] rounded-sm">
            <h2 className="text-white text-2xl pixelated-font mb-6">Mission Settings</h2>
            
            <div className="mb-4">
              <label className="block text-white pixelated-font mb-2">Mission End Date</label>
              <input 
                type="datetime-local" 
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={missionEndDate.toISOString().slice(0, 16)} 
                onChange={(e) => setMissionEndDate(new Date(e.target.value))}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-white pixelated-font mb-2">Mission Text</label>
              <input 
                type="text" 
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={missionText}
                onChange={handleMissionTextChange}
                placeholder="days till the next drop"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowMissionModal(false)}
                className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-white/30 text-white pixelated-font transition-colors"
              >
                cancel
              </button>
              <button 
                onClick={handleSaveMissionSettings}
                className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
              >
                save changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Taskbar */}
      {/* <Taskbar /> */}
    </div>
  );
}