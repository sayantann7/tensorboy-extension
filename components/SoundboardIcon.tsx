import React from 'react'
import Image from 'next/image'

interface SoundboardIconProps {
    onClick: () => void;
}

function SoundboardIcon({ onClick }: SoundboardIconProps) {
    return (
        <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
            <div className="relative w-16 h-16">
                <Image
                    src="/soundboard.png" 
                    alt="Soundboard"
                    width={64}
                    height={64}
                    className="object-contain transition-transform"
                />
            </div>
            <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                soundboard
            </div>
        </div>
    )
}

export default SoundboardIcon