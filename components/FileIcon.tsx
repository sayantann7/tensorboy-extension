// Replace the entire file with:

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

interface FileIconProps {
    text: string;
    url: string;
    icon?: string;
}

function FileIcon({ text, url }: FileIconProps) {
    let icon;
    const fileIsLink = url.startsWith('https://') ? true : false;
    if (url.startsWith('https://')) {
        icon = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    }else{
        icon = `/file.png`;
    }
    return (
        <>
            {fileIsLink ? (
                <Link href={url} target="_blank">
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <Image
                                src={icon}
                                alt="File"
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized={icon.startsWith('https://')} // Necessary for external images
                            />
                        </div>
                        <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                            {text}
                        </div>
                    </div>
                </Link>
            ) : (
                <Link href={url}>
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <Image
                                src={icon}
                                alt="File"
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized={icon.startsWith('https://')} // Necessary for external images
                            />
                        </div>
                        <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                            {text}
                        </div>
                    </div>
                </Link>
            )}
        </>
    )
}

export default FileIcon