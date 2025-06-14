"use client";

import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';

interface SoundtrackProps {
    name: string;
    src: string;
}

interface SoundboardContextType {
    playingTracks: { [key: string]: boolean };
    volumes: { [key: string]: number };
    soundtracks: SoundtrackProps[];
    togglePlay: (src: string) => void;
    handleVolumeChange: (src: string) => (volume: number) => void;
    playAllTracks: () => void;
    stopAllTracks: () => void;
}

const SoundboardContext = createContext<SoundboardContextType | undefined>(undefined);

export const useSoundboard = () => {
    const context = useContext(SoundboardContext);
    if (!context) {
        throw new Error('useSoundboard must be used within a SoundboardProvider');
    }
    return context;
};

export const SoundboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // List of available soundtracks
    const soundtracks: SoundtrackProps[] = [
        { name: 'Birds', src: '/soundtracks/birds.mp3' },
        { name: 'Crickets', src: '/soundtracks/crickets.mp3' },
        { name: 'Fire', src: '/soundtracks/fire.mp3' },
        { name: 'Forest', src: '/soundtracks/forest.mp3' },
        { name: 'Heavy Rain', src: '/soundtracks/heavy-rain.mp3' },
        { name: 'Light Rain', src: '/soundtracks/light-rain.mp3' },
        { name: 'Ocean Waves', src: '/soundtracks/ocean-waves.mp3' },
        { name: 'Singing Bowl', src: '/soundtracks/singing-bowl.mp3' },
        { name: 'Thunder', src: '/soundtracks/thunder.mp3' },
        { name: 'Trickling Stream', src: '/soundtracks/trickling-stream.mp3' },
        { name: 'White Noise', src: '/soundtracks/white-noise.mp3' },
        { name: 'Wind In Trees', src: '/soundtracks/wind-in-trees.mp3' },
        { name: 'Wind', src: '/soundtracks/wind.mp3' },

    ];

    // State to track which tracks are playing and their volumes
    const [playingTracks, setPlayingTracks] = useState<{ [key: string]: boolean }>({});
    const [volumes, setVolumes] = useState<{ [key: string]: number }>({});

    // Refs to store audio elements
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

    // Initialize state on component mount
    useEffect(() => {
        const initialPlayingState: { [key: string]: boolean } = {};
        const initialVolumes: { [key: string]: number } = {};

        soundtracks.forEach(track => {
            initialPlayingState[track.src] = false;
            initialVolumes[track.src] = 0.5; // Default volume 50%

            // Create audio elements
            if (!audioRefs.current[track.src]) {
                const audio = new Audio(track.src);
                audio.loop = true;
                audioRefs.current[track.src] = audio;
            }
        });

        setPlayingTracks(initialPlayingState);
        setVolumes(initialVolumes);

        // Cleanup function to pause all audio when app unmounts
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                }
            });
        };
    }, []);

    // Toggle play/pause for a track
    const togglePlay = useCallback((src: string) => {
        const audio = audioRefs.current[src];
        if (!audio) return;

        if (playingTracks[src]) {
            audio.pause();
        } else {
            audio.volume = volumes[src];
            audio.play();
        }

        setPlayingTracks(prev => ({
            ...prev,
            [src]: !prev[src]
        }));
    }, [playingTracks, volumes]);

    // Handle volume change for a track
    const handleVolumeChange = useCallback((src: string) => (volume: number) => {
        const audio = audioRefs.current[src];
        if (audio) {
            audio.volume = volume;
        }

        setVolumes(prev => ({
            ...prev,
            [src]: volume
        }));
    }, []);

    // Play all tracks
    const playAllTracks = useCallback(() => {
        soundtracks.forEach(track => {
            const audio = audioRefs.current[track.src];
            if (audio && !playingTracks[track.src]) {
                audio.volume = volumes[track.src];
                audio.play();
            }
        });

        const allPlaying: { [key: string]: boolean } = {};
        soundtracks.forEach(track => {
            allPlaying[track.src] = true;
        });

        setPlayingTracks(allPlaying);
    }, [playingTracks, volumes]);

    // Stop all tracks
    const stopAllTracks = useCallback(() => {
        soundtracks.forEach(track => {
            const audio = audioRefs.current[track.src];
            if (audio) {
                audio.pause();
            }
        });

        const allStopped: { [key: string]: boolean } = {};
        soundtracks.forEach(track => {
            allStopped[track.src] = false;
        });

        setPlayingTracks(allStopped);
    }, []);

    return (
        <SoundboardContext.Provider
            value={{
                playingTracks,
                volumes,
                soundtracks,
                togglePlay,
                handleVolumeChange,
                playAllTracks,
                stopAllTracks
            }}
        >
            {children}
        </SoundboardContext.Provider>
    );
};