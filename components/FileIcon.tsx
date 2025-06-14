import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

interface FileIconProps {
    text: string;
    url: string;
}

function FileIcon({ text, url }: FileIconProps) {
    return (
        <Link href={url}>
            <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                    <Image
                        src="/file.png"
                        alt="File"
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                </div>
                <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                    {text}
                </div>
            </div>
        </Link>
    )
}

export default FileIcon