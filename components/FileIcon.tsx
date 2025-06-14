"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownModal from './MarkdownModal';

interface FileIconProps {
    text: string;
    url: string;
    icon?: string;
    content?: string;
    fileType?: string;
}

function FileIcon({ text, url, icon, content = '', fileType }: FileIconProps) {
    const [showMarkdownModal, setShowMarkdownModal] = useState(false);
    
    let iconSrc;
    const fileIsLink = url.startsWith('https://') ? true : false;
    const isMarkdownFile = fileType === 'md' || (!fileIsLink && !url.startsWith('http'));
    
    if (url.startsWith('https://')) {
        iconSrc = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    } else {
        iconSrc = `/file.png`;
    }
    
    const handleFileClick = (e: React.MouseEvent) => {
        if (isMarkdownFile) {
            e.preventDefault();
            setShowMarkdownModal(true);
        }
    };
    
    return (
        <>
            {fileIsLink ? (
                <Link href={url} target="_blank">
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <Image
                                src={iconSrc}
                                alt="File"
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized={iconSrc.startsWith('https://')} // Necessary for external images
                            />
                        </div>
                        <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                            {text}
                        </div>
                    </div>
                </Link>
            ) : (
                <>
                    <Link href={url} onClick={handleFileClick}>
                        <div className="flex flex-col items-center">
                            <div className="relative w-16 h-16">
                                <Image
                                    src={iconSrc}
                                    alt="File"
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                    unoptimized={iconSrc.startsWith('https://')}
                                />
                            </div>
                            <div className="mt-0 text-center text-white text-sm pixelated-font bg-opacity-50 px-2 py-1">
                                {text}
                            </div>
                        </div>
                    </Link>
                    
                    {/* Markdown Modal */}
                    {isMarkdownFile && (
                        <MarkdownModal
                            isOpen={showMarkdownModal}
                            onClose={() => setShowMarkdownModal(false)}
                            fileName={text}
                            content={content}
                            fileUrl={url}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default FileIcon;