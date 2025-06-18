"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import FileIcon from '@/components/FileIcon';
import { getWallpapers, Wallpaper } from '@/lib/wallpapers';

export default function Home() {
    const params = useParams();
    const folderId = (params?.folderId ?? '') as string;
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(true);
    const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);

    useEffect(() => {
        const loadWallpapers = async () => {
            setIsLoadingWallpapers(true);
            try {
                const wallpapersData = await getWallpapers();
                setWallpapers(wallpapersData);
                
                // Set current wallpaper from localStorage
                const savedWallpaperId = localStorage.getItem('wallpaperId');
                let wallpaper = null;
                if (savedWallpaperId) {
                    wallpaper = wallpapersData.find(w => w.id === savedWallpaperId);
                }
                setCurrentWallpaper(wallpaper || wallpapersData[0] || null);
            } catch (error) {
                console.error('Error loading wallpapers:', error);
            } finally {
                setIsLoadingWallpapers(false);
            }
        };
        loadWallpapers();
    }, []);

    return (
        <div className="relative w-screen min-h-screen overflow-hidden">
            {/* Background layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" 
                    style={{ backgroundImage: !isLoadingWallpapers && currentWallpaper ? `url(${currentWallpaper.imageUrl})` : 'none' }} />
                <div className="absolute inset-0 bg-black/30" />
                <video src="/bg-video.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-3" />
            </div>

            <div className="absolute top-12 left-8 z-30">
                <Link href="/"><h1 className="text-white text-2xl pixelated-font">{'<-'} Go Back</h1></Link>
            </div>

            <div className="absolute top-30 left-8 z-30">
                <h1 className="text-white text-5xl pixelated-font">HACKATHONS</h1>
            </div>

            <div className="absolute top-1/12 right-8 flex flex-col gap-10 z-30">
                <FileIcon
                    text="Hack With India"
                    url="https://unstop.com/hackathons/comsoc-hackx-2025-chandigarh-university-cu-ajitgarh-punjab-1412240?lb=uUzX7sqN&utm_medium=Share&utm_source=shortUrl"
                    icon="openai"
                    content=""
                    fileType="link"
                />
                <FileIcon
                    text="HackArena"
                    url="https://hackarenaa.devfolio.co/"
                    icon="google"
                    content=""
                    fileType="link"
                />
                <FileIcon
                    text="Adobe Express Hackathon"
                    url="https://adobeexpress.devpost.com/?ref_feature=challenge&ref_medium=discover"
                    icon="meta"
                    content=""
                    fileType="link"
                />
                <FileIcon
                    text="Edge AI Developer Hackathon"
                    url="https://www.qualcomm.com/developer/events/edge-ai-developer-hackathon/bengaluru-india?utm"
                    icon="deepmind"
                    content=""
                    fileType="link"
                />
                <FileIcon
                    text="Adobe India Hackathon"
                    url="https://unstop.com/hackathons/adobe-india-hackathon-adobe-1483364"
                    icon="microsoft"
                    content=""
                    fileType="link"
                />
            </div>

            <div className="absolute top-1/12 right-60 flex flex-col gap-10 z-30">
                <FileIcon
                    text="IPTLC Hackathon"
                    url="https://docs.google.com/forms/d/e/1FAIpQLSchabhFYNzw7Kw2ku4NjCqjYfYVUmEtm9IrAUOYfCiXTrEcjA/viewform"
                    icon="google"
                    content=""
                    fileType="link"
                />
                <FileIcon
                    text="IBM Hackathon"
                    url="https://www.ibm.com/community/techxchange-hackathons/"
                    icon="openai"
                    content=""
                    fileType="link"
                />

            </div>

        </div>
    );
}