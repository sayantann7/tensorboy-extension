"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function FilePage() {
  const params = useParams();
  const fileId = params.fileId as string;
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('wallpaperNumber') || 1);
  
  const [fileData, setFileData] = useState<{
    id: string;
    name: string;
    content: string;
    fileType: 'link' | 'md';
  } | null>(null);
  
  const [windowState, setWindowState] = useState<'normal' | 'maximized' | 'minimized'>('normal');
  // Add new state variables for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  
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
            setEditedContent(file.content || ''); // Initialize edited content
          }
        } catch (error) {
          console.error('Error loading file data:', error);
        }
      }
    }
  }, [fileId]);

  // Add save function to update content in localStorage
  const saveContent = () => {
    if (!fileData) return;
    
    const savedDesktopItems = localStorage.getItem('desktopItems');
    if (savedDesktopItems) {
      try {
        const items = JSON.parse(savedDesktopItems);
        const updatedItems = items.map((item: any) => {
          if (item.id === fileId && item.type === 'file') {
            return {
              ...item,
              content: editedContent
            };
          }
          return item;
        });
        
        localStorage.setItem('desktopItems', JSON.stringify(updatedItems));
        
        // Update fileData with new content
        setFileData({
          ...fileData,
          content: editedContent
        });
        
        // Switch back to view mode
        setIsEditMode(false);
      } catch (error) {
        console.error('Error saving file data:', error);
      }
    }
  };

  if (!fileData) {
    // ... existing loading/not found UI ...
    return (
      <div className="relative w-screen min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" style={{ backgroundImage: `url(/wallpapers/${wallpaper}.gif)` }} />
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

  // Don't show edit functionality for non-markdown files
  const isMarkdownFile = fileData.fileType === 'md';

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
          
          {/* Edit/Save buttons for markdown files */}
          {isMarkdownFile && (
            <div className="flex gap-2">
              {isEditMode ? (
                <button 
                  onClick={saveContent}
                  className="px-3 py-1 bg-[#b8460e] hover:bg-[#a53d0c] text-white text-xs rounded transition-colors pixelated-font"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1 bg-[#b8460e] text-white text-xs rounded transition-colors pixelated-font hover:bg-[#a53d0c]"
                >
                  Edit
                </button>
              )}
              {isEditMode && (
                <button 
                  onClick={() => {
                    setIsEditMode(false);
                    setEditedContent(fileData.content); // Reset to original content
                  }}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors pixelated-font"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* File content */}
        {windowState !== 'minimized' && (
          isEditMode && isMarkdownFile ? (
            <div className="p-6 bg-white text-gray-800 min-h-[300px] max-h-[75vh]">
              <textarea
                className="w-full h-[calc(75vh-100px)] min-h-[300px] p-4 border border-gray-300 rounded font-mono"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="# Write your markdown here..."
              />
            </div>
          ) : (
            <div className="p-6 bg-white text-gray-800 min-h-[300px] max-h-[75vh] overflow-y-auto">
              <ReactMarkdown>
                {fileData.content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </div>
  );
}