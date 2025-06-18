import React from 'react';
import Image from 'next/image';

interface WallpaperIconProps {
    onClick: () => void;
}

const WallpaperIcon: React.FC<WallpaperIconProps> = ({ onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="flex flex-col items-center gap-2 cursor-pointer group"
        >
            <div className="w-16 h-16 relative">
                <Image
                    src="/wallpaper.png"
                    alt="Wallpapers"
                    width={64}
                    height={64}
                    className="transition-transform"
                />
            </div>
            <span className="text-white text-sm pixelated-font">wallpapers</span>
        </div>
    );
};

export default WallpaperIcon; 