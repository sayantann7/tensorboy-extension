"use client";
import FolderIcon from "@/components/FolderIcon";
import Taskbar from "@/components/Taskbar";
import { useEffect, useState } from "react";


export default function Home() {
  const [decimalValue, setDecimalValue] = useState(552677);
  const [currentTime, setCurrentTime] = useState('00:00 AM');
  const [greeting, setGreeting] = useState('good morning hacker');

  useEffect(() => {
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

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* ——— Background image layer ——— */}
      <div
        className="
          absolute inset-0
          bg-[url('/background.png')]
          bg-cover bg-center bg-no-repeat

          /* only this layer is B/W + darker + more contrast */
          filter grayscale-[50%] brightness-65 contrast-100

          z-0
        "
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

      {/* ——— Folders ——— */}
      <div className="absolute top-1/20 right-8 flex flex-col gap-10 z-30">
        <FolderIcon text="ai news"     url="http://localhost:3000/folders/ai-news" />
        <FolderIcon text="internships" url="http://localhost:3000/folders/internships" />
        <FolderIcon text="hackathons"  url="http://localhost:3000/folders/hackathons" />
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
