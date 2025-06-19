"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
  fileUrl: string;  // Added the fileUrl prop
}

const MarkdownModal: React.FC<MarkdownModalProps> = ({ 
  isOpen, 
  onClose, 
  fileName, 
  content,
  fileUrl
}) => {
  const router = useRouter();
  
  if (!isOpen) return null;
  
  const handleMaximize = () => {
    router.push(fileUrl);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] font-mono" 
      onClick={onClose}
    >
      <div 
        className="relative w-[540px] h-[640px] rounded-[7px] border-[3px] border-[#3a3a3a] overflow-hidden bg-white"
        style={{
          background: 'white',
          borderTop: '4px solid #b8460e',
          borderLeft: '4px solid #b8460e',
          borderRight: '4px solid #b8460e',
          borderBottom: '4px solid #b8460e',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window title bar */}
        <div className="flex items-center px-4 py-1.5" style={{ background: 'linear-gradient(90deg, #b8460e 0%, #a53d0c 100%)', borderBottom: '2.5px solid #b8460e', boxShadow: '0 2px 8px 0 #b8460e', height: '38px' }}>
          {/* Control buttons */}
          <div className="flex space-x-2 mr-3">
            <button 
              onClick={onClose}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#ff5f56] hover:bg-[#ff8783] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Close"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
            <button 
              onClick={onClose}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#ffbd2e] hover:bg-[#ffe29a] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Minimize"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
            <button 
              onClick={handleMaximize}
              className="w-4 h-4 rounded-full border-[1.5px] border-[#222] bg-[#27c93f] hover:bg-[#7fffa1] transition-colors shadow-[0_1px_0_#fff_inset]"
              title="Maximize"
              style={{ boxShadow: '0 1px 2px #222' }}
            />
          </div>
          {/* File name in center */}
          <div className="flex-1 text-right text-white font-bold text-[1.15rem] tracking-wide pixelated-font truncate drop-shadow-sm select-none" style={{ textShadow: '0 1px 2px #0a51c2, 0 0 2px #fff' }}>
            <span style={{letterSpacing: '0.04em'}}>{fileName}</span>
          </div>
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
        <div className="p-8 bg-white text-[#222] min-h-[300px] h-full overflow-y-auto pixelated-font text-[1.05rem] leading-relaxed relative" style={{ fontFamily: 'monospace, \"Pixelated\", \"Chicago\", \"Courier New\", Courier, monospace' }}>
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownModal;