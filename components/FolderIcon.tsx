import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

interface FolderIconProps {
    text: string;
    url: string;
}

function FolderIcon({ text, url }: FolderIconProps) {
    return (
        <Link href={url}>
            <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                    <Image
                        src="/folder.png"
                        alt="Folder"
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                </div>
                <div className="mt-0 text-center text-white text-sm font-bold bg-black bg-opacity-50 px-2 py-1">
                    {text}
                </div>
            </div>
        </Link>
    )
}

export default FolderIcon