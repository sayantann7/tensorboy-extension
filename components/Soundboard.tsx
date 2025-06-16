"use client";

import React, { useState } from 'react';
import { useSoundboard } from '@/context/SoundboardContext';

interface SoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Soundboard: React.FC<SoundboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'soundtracks' | 'presets'>('soundtracks');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);
  const { 
    playingTracks, 
    volumes, 
    soundtracks, 
    togglePlay, 
    handleVolumeChange, 
    createPreset,
    stopAllTracks,
    presets,
    playPreset,
    deletePreset
  } = useSoundboard();
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  if (!isOpen) return null;

  return (
    // Overlay div that closes the modal when clicked
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      {/* Modal content div that prevents click propagation */}
      <div className="relative bg-[#222] border border-white/30 p-6 w-[600px] rounded-sm" onClick={(e) => e.stopPropagation()}>
        {/* Window title bar with Mac-style controls */}
        <div className="flex items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
          </div>
          <div className="flex-1 ml-20 pl-8 text-white font-medium truncate pixelated-font">
            Chill Soundboard
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('soundtracks')}
            className={`px-4 py-2 ${activeTab === 'soundtracks' ? 'bg-white text-black' : 'bg-[#444] text-white'} rounded-t-sm`}
          >Soundtracks</button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 ml-2 ${activeTab === 'presets' ? 'bg-white text-black' : 'bg-[#444] text-white'} rounded-t-sm`}
          >Presets</button>
        </div>
        {/* Tab content */}
        {activeTab === 'soundtracks' ? (
          <> 
            {/* Controls: Create Preset on left, Stop All on right */}
            <div className="flex justify-between mb-6">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
              >
                Create Preset
              </button>
              <button
                onClick={() => { stopAllTracks(); setActivePresetIndex(null); }}
                className="px-4 py-2 bg-black hover:opacity-90 border border-white/30 text-white pixelated-font transition-colors"
              >
                Stop All
              </button>
            </div>
            {isPresetModalOpen && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#222] p-4 rounded-sm border border-white/30 w-1/2">
                  <h3 className="text-white mb-2 pixelated-font">Enter Preset Name</h3>
                  <input
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="w-full p-2 mb-4 bg-[#333] text-white rounded-sm"
                    placeholder="Preset name"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        createPreset(presetName);
                        setPresetName('');
                        setIsPresetModalOpen(false);
                      }}
                      disabled={!presetName}
                      className="px-4 py-2 bg-[#4CAF50] hover:opacity-90 border border-white/30 text-white pixelated-font transition-colors disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setPresetName('');
                        setIsPresetModalOpen(false);
                      }}
                      className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Soundtrack grid */}
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {soundtracks.map((track) => (
                <div key={track.src} className="bg-[#333] p-4 rounded-sm border border-white/20">              
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white pixelated-font">{track.name}</h3>
                    <button 
                      onClick={() => togglePlay(track.src)}
                      className={`px-3 py-1 text-sm ${playingTracks[track.src] ? 'bg-[#4CAF50]' : 'bg-[#b8460e]'} hover:opacity-90 border border-white/30 text-white pixelated-font transition-colors`}
                    >
                      {playingTracks[track.src] ? 'Pause' : 'Play'}
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-white pixelated-font text-xs mr-2">Volume</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volumes[track.src] || 0.5}
                      onChange={(e) => handleVolumeChange(track.src)(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-[#555] rounded-sm appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {presets.length === 0 ? (
                <div className="text-white text-center mt-10">No presets created.</div>
              ) : (
                <ul>
                  {presets.map((preset, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-[#333] p-4 rounded-sm border border-white/20 mb-2">
                    <span className="text-white pixelated-font">{preset.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (activePresetIndex === idx) {
                            stopAllTracks();
                            setActivePresetIndex(null);
                          } else {
                            playPreset(idx);
                            setActivePresetIndex(idx);
                          }
                        }}
                        className={`px-3 py-1 text-sm border border-white/30 text-white pixelated-font transition-colors ${activePresetIndex === idx ? 'bg-[#4CAF50]' : 'bg-[#b8460e]'}`}
                      >
                        {activePresetIndex === idx ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={() => deletePreset(idx)}
                        className="px-3 py-1 bg-red-600 hover:opacity-90 border border-white/30 text-white pixelated-font transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                   </li>
                  ))}
                </ul>
              )}
            </div>
          )}
       </div>
     </div>
   );
};

export default Soundboard;