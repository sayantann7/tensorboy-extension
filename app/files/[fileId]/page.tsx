"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function FilePage() {
  const params = useParams();
  const fileId = params.fileId as string;
  
  const [fileData, setFileData] = useState<{
    id: string;
    name: string;
    content: string;
    fileType: 'link' | 'md';
  } | null>(null);
  
  const [windowState, setWindowState] = useState<'normal' | 'maximized' | 'minimized'>('normal');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load desktop items from localStorage
      const savedDesktopItems = localStorage.getItem('desktopItems');
      if (savedDesktopItems) {
        try {
          const items = JSON.parse(savedDesktopItems);
          const file = items.find((item: any) => item.id === fileId && item.type === 'file');
          if (file) {
            setFileData({
              id: file.id,
              name: file.name,
              content: file.content || '',
              fileType: file.fileType || 'md'
            });
          }
        } catch (error) {
          console.error('Error loading file data:', error);
        }
      }
    }
  }, [fileId]);

  if (!fileData) {
    return (
      <div className="relative w-screen min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" />
          <div className="absolute inset-0 bg-black/30" />
          <video src="/bg-video.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-3" />
        </div>
        
        <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
          <Link href="/"><h1 className="text-white text-4xl pixelated-font mb-8">{'<-'} Go Back</h1></Link>
          <h1 className="text-white text-xl pixelated-font">File not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" />
        <div className="absolute inset-0 bg-black/30" />
        <video src="/bg-video.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-3" />
      </div>
      
      <div className="absolute top-8 left-8 z-30">
        <Link href="/"><h1 className="text-white text-2xl pixelated-font">{'<-'} Go Back</h1></Link>
      </div>
      
      {/* Mac-like window */}
      <div 
        className={`
          relative mx-auto z-20 bg-white rounded-lg shadow-xl overflow-hidden
          ${windowState === 'normal' ? 'w-[700px] mt-24' : ''}
          ${windowState === 'maximized' ? 'w-[90%] h-[85vh] mt-16' : ''}
          ${windowState === 'minimized' ? 'w-[700px] h-12 mt-24' : ''}
        `}
      >
        {/* Window title bar */}
        <div className="bg-gray-200 px-4 py-2 flex items-center">
          {/* Control buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={() => window.history.back()}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <button 
              onClick={() => setWindowState(windowState === 'minimized' ? 'normal' : 'minimized')}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            />
            <button 
              onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            />
          </div>
          
          {/* File name in center */}
          <div className="flex-1 text-center text-gray-700 font-medium truncate">
            {fileData.name}
          </div>
          
          {/* Empty space to balance the layout */}
          <div className="w-[46px]"></div>
        </div>
        
        {/* File content */}
        {windowState !== 'minimized' && (
          <div className="p-6 bg-white text-gray-800 min-h-[300px] max-h-[75vh] overflow-y-auto">
            <ReactMarkdown>
              {fileData.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}