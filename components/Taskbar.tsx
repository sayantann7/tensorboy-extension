"use client";

import { useEffect, useState } from "react";

export default function Taskbar() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-[#1a1a1a] text-white flex items-center justify-between px-2 z-50 border-t border-gray-700 shadow-[inset_0_1px_1px_#444,inset_0_-1px_1px_#000] font-mono text-xs">
      
      {/* 🪟 START button */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#2a2a2a] border border-white border-b-[#1a1a1a] border-r-[#1a1a1a] shadow-[inset_1px_1px_0_#444] rounded-sm cursor-pointer hover:brightness-125">
        <img src="/windows.png" alt="Windows" className="w-4 h-4" />
        <span className="text-white tracking-tight">Start</span>
      </div>

      {/* 🕒 Time */}
      <div className="px-2 py-1 border border-[#333] bg-[#2a2a2a] shadow-[inset_1px_1px_0_#444] rounded-sm">
        {time}
      </div>
    </div>
  );
}