"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Home() {
  const params = useParams();
  const folderId = params.folderId as string;
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('wallpaperNumber') || 1);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" style={{ backgroundImage: `url(/wallpapers/${wallpaper}.gif)` }} />
        <div className="absolute inset-0 bg-black/30" />
        <video src="/bg-video.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-3" />
      </div>
      
      <div className="absolute top-8 left-8 z-30">
        <Link href="/"><h1 className="text-white text-2xl pixelated-font">{'<-'} Go Back</h1></Link>
      </div>
      
      <h1 className='absolute text-6xl pixelated-font top-72 text-center left-0 z-30 text-white'>Coming soon! Still under construction. Please check back later for updates.</h1>
      
    </div>
  );
}