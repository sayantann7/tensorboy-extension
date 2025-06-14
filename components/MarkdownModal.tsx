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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl overflow-hidden w-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window title bar */}
        <div className="bg-gray-200 px-4 py-2 flex items-center">
          {/* Control buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            />
            <button 
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            />
          </div>
          
          {/* File name in center */}
          <div className="flex-1 text-center text-gray-700 font-medium truncate">
            {fileName}
          </div>
        </div>
        
        {/* File content */}
        <div className="p-6 bg-white text-gray-800 min-h-[300px] max-h-[75vh] overflow-y-auto">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownModal;