"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { uploadWallpaper } from '@/lib/utils';
import { getWallpapers, Wallpaper } from '@/lib/wallpapers';

export default function WallpapersPage() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(true);
    const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSubmitted, setUploadSubmitted] = useState(false);

    useEffect(() => {
        const loadWallpapers = async () => {
            setIsLoadingWallpapers(true);
            try {
                const wallpapersData = await getWallpapers();
                setWallpapers(wallpapersData);
            } catch (error) {
                console.error('Error loading wallpapers:', error);
            } finally {
                setIsLoadingWallpapers(false);
            }
        };
        loadWallpapers();
    }, []);

    useEffect(() => {
        if (!isLoadingWallpapers && wallpapers.length > 0) {
            const updateCurrentWallpaper = () => {
                const savedWallpaperId = localStorage.getItem('wallpaperId');
                let wallpaper = null;
                if (savedWallpaperId) {
                    wallpaper = wallpapers.find(w => w.id === savedWallpaperId);
                }
                setCurrentWallpaper(wallpaper || wallpapers[0]);
            };
            updateCurrentWallpaper();
            const onStorage = (e: StorageEvent) => {
                if (e.key === 'wallpaperId') {
                    updateCurrentWallpaper();
                }
            };
            window.addEventListener('storage', onStorage);
            return () => window.removeEventListener('storage', onStorage);
        }
    }, [isLoadingWallpapers, wallpapers]);

    const handleUploadSubmit = async () => {
        if (!uploadedFile) return;

        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const res = await fetch('/api/upload-wallpaper', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setUploadError(data.error || 'Upload failed');
                setIsUploading(false);
                return;
            }

            const imageUrl = data.fileUrl || '';
            const uploadResult = await uploadWallpaper(imageUrl, localStorage.getItem('username') ?? '');
            
            if (uploadResult.error) {
                setUploadError(uploadResult.error);
                setIsUploading(false);
                return;
            }

            // Refresh wallpapers after successful upload
            const wallpapersData = await getWallpapers();
            setWallpapers(wallpapersData);

            setIsUploading(false);
            setUploadSubmitted(true);
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('Unexpected error occurred during upload');
            setIsUploading(false);
        }
    };

    const handleWallpaperSelect = (wallpaper: Wallpaper) => {
        localStorage.setItem('wallpaperId', wallpaper.id);
        // Optionally refresh the page to show the new wallpaper
        window.location.reload();
    };

    return (
        <div className="relative w-screen min-h-screen overflow-hidden overflow-y-scroll">
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
                <h1 className="text-white text-5xl pixelated-font">WALLPAPERS</h1>
            </div>

            {/* Pinterest-like Masonry Grid Layout */}
            <div className="relative z-10 pt-50 px-8 pb-20">
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {/* Upload Button */}
                    <div 
                        onClick={() => setShowUploadModal(true)}
                        className="break-inside-avoid bg-black/50 border border-white/30 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
                        style={{ height: '300px' }}
                    >
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                        </div>
                        <span className="text-white pixelated-font text-lg">Upload New Wallpaper</span>
                        <span className="text-white/60 pixelated-font text-sm mt-2">Share your favorite wallpapers</span>
                    </div>

                    {/* Wallpaper Grid Items */}
                    {wallpapers.map((wallpaper) => (
                        <div 
                            key={wallpaper.id}
                            className="break-inside-avoid group relative bg-black/50 border border-white/30 rounded-lg overflow-hidden cursor-pointer hover:bg-black/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
                            style={{ height: '300px' }}
                            onClick={() => handleWallpaperSelect(wallpaper)}
                        >
                            <img 
                                src={wallpaper.imageUrl} 
                                alt={`Wallpaper ${wallpaper.id}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="text-white">
                                    {/* <span className="pixelated-font text-lg">Wallpaper {wallpaper.id}</span> */}
                                    <p className="text-white/80 text-sm mt-1 pixelated-font">click to set as current wallpaper</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300]" onClick={() => setShowUploadModal(false)}>
                    <div className="bg-[#222] border border-white/30 p-6 w-[400px] rounded-sm" onClick={(e) => e.stopPropagation()}>
                        {!uploadSubmitted ? (
                            <>
                                <h2 className="text-white text-2xl pixelated-font mb-4">Upload Wallpaper</h2>

                                <div className="mb-6">
                                    <div className="relative border border-white/30 rounded-sm bg-[#333] p-4 cursor-pointer hover:bg-[#444] transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setUploadedFile(file);
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isUploading}
                                        />
                                        <div className="flex items-center justify-center gap-3 text-white pixelated-font">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                            <span>{uploadedFile ? uploadedFile.name : 'Choose wallpaper file...'}</span>
                                        </div>
                                    </div>

                                    {uploadedFile && (
                                        <div className="mt-4 p-3 border border-white/30 rounded-sm bg-[#333]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                    <span className="text-white pixelated-font truncate max-w-[300px]">{uploadedFile.name}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setUploadedFile(null);
                                                    }}
                                                    className="text-white hover:text-red-400 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {uploadError && (
                                        <div className="mt-2 text-red-500 pixelated-font">{uploadError}</div>
                                    )}
                                </div>

                                <button
                                    onClick={handleUploadSubmit}
                                    disabled={isUploading || !uploadedFile}
                                    className={`w-full px-4 py-2 ${isUploading ? 'bg-gray-500' : 'bg-[#b8460e] hover:bg-[#a53d0c]'} border border-white/30 text-white pixelated-font transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isUploading ? 'Submitting...' : 'Submit'}
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-white text-2xl pixelated-font mb-4">Thanks for your submission!</h2>
                                <p className="text-white mb-4">Our team will review your wallpaper and add it to the collection if approved.</p>
                                <button 
                                    onClick={() => { 
                                        setShowUploadModal(false); 
                                        setUploadSubmitted(false);
                                        setUploadedFile(null);
                                    }} 
                                    className="w-full px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 