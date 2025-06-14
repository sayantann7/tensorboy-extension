"use client";

import { useEffect, useState } from 'react';

export default function DisclaimerModal({ onClose }: { onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen disclaimer
        const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');

        if (!hasSeenDisclaimer) {
            // Make visible with a slight delay to avoid flash during hydration
            setTimeout(() => setIsVisible(true), 10);
            localStorage.setItem('hasSeenDisclaimer', 'true');
        }
    }, []);

    // Handle the close action
    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]" onClick={handleClose}>
            <div className="bg-[#222] border border-white/30 p-6 w-[500px] rounded-sm" onClick={(e) => e.stopPropagation()}>
                {/* Window title bar with Mac-style controls */}
                <div className="flex items-center mb-6">
                    {/* Control buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleClose}
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                        />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
                        <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
                    </div>
                    <div className="flex-1 ml-20 pl-8 text-white font-medium truncate pixelated-font">
                        Beta Notice
                    </div>
                </div>

                {/* Modal content - keep the rest of your existing content */}
                <div className="mb-6">
                    <h2 className="text-white text-xl pixelated-font mb-4">Welcome to the Beta Version</h2>
                  <p className="text-white/80 pixelated-font mb-4">
                    This is a beta version of the extension. Some features may not work as expected.
                  </p>
                  <p className="text-white/80 pixelated-font mb-4">
                    We'd love your help naming this extension! Please submit your suggestion using the link below. Thanks!
                  </p>
                  <p className="text-white/80 pixelated-font mb-6">
                    - tensorboy
                  </p>
                  <a
                    href="https://form.typeform.com/to/qSpmCYJR"
                    target="_blank"
                    className="block w-full bg-[#b8460e] hover:bg-[#a53d0c] text-white pixelated-font text-center px-4 py-3 border border-white/30 transition-colors"
                  >
                    Suggest a Name for This Extension
                  </a>
                </div>
            </div>
        </div>
    );
}