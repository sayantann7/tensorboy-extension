"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function FilePage() {
  const params = useParams();
  const fileId = params?.fileId as string;
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
        className="relative mx-auto top-22 left-5 z-20 w-[720px] h-[540px] rounded-[7px] border-[3px] border-[#3a3a3a] overflow-hidden bg-white"
        style={{
          background: 'white',
          borderTop: '4px solid #b8460e',
          borderLeft: '4px solid #b8460e',
          borderRight: '4px solid #b8460e',
          borderBottom: '4px solid #b8460e',
        }}
      >
        {/* Window title bar */}
        <div className="flex items-center px-4 py-1.5" style={{ background: 'linear-gradient(90deg, #b8460e 0%, #a53d0c 100%)', borderBottom: '2.5px solid #b8460e', boxShadow: '0 2px 8px 0 #b8460e', height: '38px' }}>
          {/* Control buttons */}
          <div className="flex space-x-2 mr-3">
            <button
              onClick={() => window.history.back()}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#ff5f56] hover:bg-[#ff8783] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Close"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
            <button
              onClick={() => setWindowState(windowState === 'minimized' ? 'normal' : 'minimized')}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#ffbd2e] hover:bg-[#ffe29a] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Minimize"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
            <button
              onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#27c93f] hover:bg-[#7fffa1] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Maximize"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
          </div>
          {/* File name right-aligned */}
          <div className="flex-1 text-right text-white font-bold text-[1.15rem] tracking-wide pixelated-font truncate drop-shadow-sm select-none" style={{ textShadow: '0 1px 2px #0a51c2, 0 0 2px #fff' }}>
            <span style={{letterSpacing: '0.04em'}}>{fileData.name}</span>
          </div>
          {/* Edit/Save buttons for markdown files */}
          {isMarkdownFile && (
            <div className="flex gap-2 ml-4">
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
        {/* Menu bar */}
        <div className="flex items-center px-4 py-1 bg-[#f3e7c4] border-b border-[#bfc1c6] text-[0.98rem] font-semibold text-[#222] pixelated-font select-none" style={{height: '28px', fontFamily: 'monospace'}}>
          <span className="mr-6 cursor-pointer hover:underline">File</span>
          <span className="mr-6 cursor-pointer hover:underline">View</span>
          <span className="mr-6 cursor-pointer hover:underline">Play</span>
          <span className="mr-6 cursor-pointer hover:underline">Tools</span>
          <span className="mr-6 cursor-pointer hover:underline">Help</span>
        </div>
        {/* File content */}
        {windowState !== 'minimized' && (
          isEditMode && isMarkdownFile ? (
            <div className="p-8 bg-white text-[#222] min-h-[300px] max-h-[340px]">
              <textarea
                className="w-full h-[calc(60vh-100px)] min-h-[300px] p-4 border border-gray-300 rounded font-mono"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="# Write your markdown here..."
              />
            </div>
          ) : (
            <div className="p-8 bg-white text-[#222] min-h-[300px] max-h-[340px] overflow-y-auto pixelated-font text-[1.05rem] leading-relaxed relative" style={{ fontFamily: 'monospace, \"Pixelated\", \"Chicago\", \"Courier New\", Courier, monospace' }}>
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