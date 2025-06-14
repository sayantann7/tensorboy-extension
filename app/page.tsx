"use client";
import FolderIcon from "@/components/FolderIcon";
import FileIcon from "@/components/FileIcon";
import Taskbar from "@/components/Taskbar";
import { useEffect, useState, useRef } from "react";
import SoundboardIcon from "@/components/SoundboardIcon";
import Soundboard from "@/components/Soundboard";

export default function Home() {
  const [currentTime, setCurrentTime] = useState('00:00 AM');
  const [greeting, setGreeting] = useState('good morning hacker');
  const [wallpaperNumber, setWallpaperNumber] = useState(1);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(true);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Add new state variables for mission customization
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [missionText, setMissionText] = useState('days till the next drop');
  const [missionEndDate, setMissionEndDate] = useState(() => {
    // Default to 38 days from now
    const date = new Date();
    date.setDate(date.getDate() + 38);
    return date;
  });
  const [daysRemaining, setDaysRemaining] = useState(38);
  // Replace with seconds remaining
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Context menu states
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Desktop items state - keep positions but remove drag functionality
  const [desktopItems, setDesktopItems] = useState<Array<{
    id: string;
    type: 'file' | 'folder';
    name: string;
    url: string;
    fileType?: 'link' | 'md';
    icon?: string;
    content?: string;
    position: { x: number, y: number };
  }>>([]);

  // Default folders with positions - initialize without window references
  const [defaultFolders, setDefaultFolders] = useState([
    { id: 'ai-news', name: 'ai news', url: '/folders/ai-news', position: { x: 0, y: 80 } },
    { id: 'internships', name: 'internships', url: '/folders/internships', position: { x: 0, y: 170 } },
    { id: 'hackathons', name: 'hackathons', url: '/folders/hackathons', position: { x: 0, y: 260 } }
  ]);

  // New file/folder modal states
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPosition, setNewItemPosition] = useState({ x: 0, y: 0 });

  // For file content when creating a new file
  const [fileFormat, setFileFormat] = useState<'link' | 'md'>('link');
  const [fileUrl, setFileUrl] = useState('');
  const [fileContent, setFileContent] = useState('');

  // Load saved settings from localStorage only once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load wallpaper number from localStorage
      const savedWallpaperNumber = localStorage.getItem('wallpaperNumber');
      if (savedWallpaperNumber) {
        setWallpaperNumber(parseInt(savedWallpaperNumber, 10));
      }

      const savedMissionText = localStorage.getItem('missionText');
      if (savedMissionText) {
        setMissionText(savedMissionText);
      }

      const savedMissionEndDate = localStorage.getItem('missionEndDate');
      if (savedMissionEndDate) {
        const parsedDate = new Date(savedMissionEndDate);
        // Only update if it's a valid date
        if (!isNaN(parsedDate.getTime())) {
          setMissionEndDate(parsedDate);
        }
      }

      // Load desktop items
      const savedDesktopItems = localStorage.getItem('desktopItems');
      if (savedDesktopItems) {
        try {
          setDesktopItems(JSON.parse(savedDesktopItems));
        } catch (error) {
          console.error('Error loading desktop items:', error);
        }
      }

      // Load default folder positions
      const savedDefaultFolders = localStorage.getItem('defaultFolders');
      if (savedDefaultFolders) {
        try {
          setDefaultFolders(JSON.parse(savedDefaultFolders));
        } catch (error) {
          console.error('Error loading default folders:', error);
        }
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Add a separate effect to position items after mounting
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Now it's safe to access window properties
      setDefaultFolders(folders =>
        folders.map(folder => ({
          ...folder,
          position: {
            x: window.innerWidth - 140,
            y: folder.position.y
          }
        }))
      );

      // Also handle window resize if needed
      const handleResize = () => {
        setDefaultFolders(folders =>
          folders.map(folder => ({
            ...folder,
            position: {
              x: window.innerWidth - 140,
              y: folder.position.y
            }
          }))
        );
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Save default folders when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('defaultFolders', JSON.stringify(defaultFolders));
    }
  }, [defaultFolders]);

  // Separate effect for time updates and calculations
  useEffect(() => {
    // Function to update time
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12) || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setCurrentTime(timeString);

      if (hours >= 5 && hours < 12) {
        setGreeting('good morning hacker');
      } else if (hours >= 12 && hours < 18) {
        setGreeting('good afternoon hacker');
      } else {
        setGreeting('good evening hacker');
      }
    }

    // Initial time update
    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []); // Empty dependency array - only run once on mount

  // Effect for mission timer calculation - update every second
  useEffect(() => {
    // Function to calculate time remaining with seconds
    function calculateTimeRemaining() {
      const now = new Date();
      const timeDiff = missionEndDate.getTime() - now.getTime();

      if (timeDiff <= 0) {
        // Mission ended
        setDaysRemaining(0);
        setSecondsRemaining(0);
        return;
      }

      // Calculate whole days
      const wholeDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      // Calculate remaining seconds after removing whole days
      const remainingMs = timeDiff % (1000 * 60 * 60 * 24);
      const seconds = Math.floor(remainingMs / 1000);

      setDaysRemaining(wholeDays);
      setSecondsRemaining(seconds);
    }

    // Initial calculation
    calculateTimeRemaining();

    // Update calculation every second
    const timerInterval = setInterval(calculateTimeRemaining, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [missionEndDate]); // Only recalculate when mission end date changes

  // Add click handler to close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setShowContextMenu(false);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Format seconds as 6 digits (padded with zeros)
  const formattedSeconds = secondsRemaining.toString().padStart(6, '0');

  // Function to cycle to the next wallpaper
  const handleNextWallpaper = () => {
    const nextNumber = wallpaperNumber >= 12 ? 1 : wallpaperNumber + 1;
    setWallpaperNumber(nextNumber);
    localStorage.setItem('wallpaperNumber', nextNumber.toString());
    setShowContextMenu(false);
  };

  // Handle right-click on background to show context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Function to handle creating new files/folders
  const handleCreateNewItem = (type: 'file' | 'folder') => {
    setNewItemType(type);
    setNewItemPosition({ x: contextMenuPosition.x, y: contextMenuPosition.y });
    setShowNewItemModal(true);
    setShowContextMenu(false);
  };

  // Save new item (file or folder)
  const handleSaveNewItem = () => {
    if (!newItemName) {
      alert('Please enter a name');
      return;
    }

    if (newItemType === 'file') {
      // For files, handle different file formats
      let icon = '';

      // Set appropriate icon based on file type
      if (fileFormat === 'link') {
        // Extract domain from URL for favicon
        try {
          if (fileUrl) {
            // Use Google's favicon service to get the icon
            const url = new URL(fileUrl);
            icon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
          } else {
            // Fallback to default link icon if URL is empty
            icon = '/link.png';
          }
        } catch (error) {
          // If URL parsing fails, use default icon
          console.error('Invalid URL:', error);
          icon = '/link.png';
        }
      } else if (fileFormat === 'md') {
        icon = '/markdown.png';
      }

      const newItem = {
        id: Date.now().toString(),
        type: newItemType,
        name: newItemName,
        url: fileFormat === 'link' ? fileUrl : `/files/${Date.now()}`,
        fileType: fileFormat,
        icon: icon,
        content: fileFormat === 'md' ? fileContent : '',
        position: newItemPosition
      };

      const updatedItems = [...desktopItems, newItem];
      setDesktopItems(updatedItems);

      // Save to localStorage
      localStorage.setItem('desktopItems', JSON.stringify(updatedItems));

    } else {
      // Handle folder creation
      const newItem = {
        id: Date.now().toString(),
        type: newItemType,
        name: newItemName,
        url: `/folders/${newItemName.toLowerCase().replace(/\s+/g, '-')}`,
        position: newItemPosition
      };

      const updatedItems = [...desktopItems, newItem];
      setDesktopItems(updatedItems);

      // Save to localStorage
      localStorage.setItem('desktopItems', JSON.stringify(updatedItems));
    }

    // Reset form fields
    setFileFormat('link');
    setFileUrl('');
    setFileContent('');
    setShowNewItemModal(false);
  };

  // Handle mission timer click
  const handleMissionTimerClick = () => {
    setShowMissionModal(true);
  };

  // Handle saving mission settings
  const handleSaveMissionSettings = () => {
    // Save to localStorage
    localStorage.setItem('missionText', missionText);
    localStorage.setItem('missionEndDate', missionEndDate.toISOString());
    setShowMissionModal(false);
  };

  // Function to handle direct text changes from modal
  const handleMissionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setMissionText(newText);
  };

  const closeDisclaimerModal = () => {
    setShowDisclaimerModal(false);
  };

  const handlePreviousWallpaper = () => {
    const prevNumber = wallpaperNumber <= 1 ? 12 : wallpaperNumber - 1;
    setWallpaperNumber(prevNumber);
    localStorage.setItem('wallpaperNumber', prevNumber.toString());
    setShowContextMenu(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* Soundboard Modal */}
      <Soundboard isOpen={showSoundboard} onClose={() => setShowSoundboard(false)} />


      {/* Beta Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]" onClick={closeDisclaimerModal}>
          <div className="bg-[#222] border border-white/30 p-6 w-[500px] rounded-sm" onClick={(e) => e.stopPropagation()}>
            {/* Window title bar with Mac-style controls */}
            <div className="flex items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={closeDisclaimerModal}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
              </div>
              <div className="flex-1 ml-20 pl-8 text-white font-medium truncate pixelated-font">
                Beta Notice
              </div>
            </div>

            {/* Modal content */}
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
      )}

      {/* ——— Background image/video layer with context menu handler ——— */}
      <div
        onContextMenu={handleContextMenu}
        className={`
          absolute inset-0
          bg-cover bg-center bg-no-repeat
          filter grayscale-[50%] brightness-65 contrast-100
          z-0
        `}
        style={{ backgroundImage: `url(/wallpapers/${wallpaperNumber}.gif)` }}
      />

      {/* ——— Optional tint on top of the image ——— */}
      <div className="absolute inset-0 bg-black/30 z-10" onContextMenu={handleContextMenu} />

      {/* ——— Video layer (untouched by the image filter) ——— */}
      <video
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        className="
          absolute inset-0
          w-full h-full object-cover
          z-20
          opacity-5
        "
        onContextMenu={handleContextMenu}
      />

      {/* ——— Default Folders ——— */}
      <div className="absolute top-1/20 right-8 flex flex-col gap-10 z-30">
        <FolderIcon text="ai news" url="http://localhost:3000/folders/ai-news" />
        <FolderIcon text="internships" url="http://localhost:3000/folders/internships" />
        <FolderIcon text="hackathons" url="http://localhost:3000/folders/hackathons" />
        <SoundboardIcon onClick={() => setShowSoundboard(true)} />
      </div>

      {/* ——— Custom Desktop Items ——— */}
      {desktopItems.map(item => (
        <div
          key={item.id}
          className="absolute z-30"
          style={{
            left: `${item.position.x}px`,
            top: `${item.position.y}px`
          }}
        >
          {item.type === 'file' ? (
            <FileIcon text={item.name} url={item.url} />
          ) : (
            <FolderIcon text={item.name} url={item.url} />
          )}
        </div>
      ))}

      {/* ——— Intro Text ——— */}
      <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">welcome to tensor protocol</h1>
        <h1 className="text-white text-xl pixelated-font">checkout the latest drop <a href="#" target="_blank" className="text-white/50 underline">link</a></h1>
        <h1 className="text-white text-xl pixelated-font">not subscribed yet? <a href="#" target="_blank" className="text-white/50 underline">sub here</a></h1>
      </div>

      {/* ——— Timer ——— */}
      <div
        className="absolute top-[250px] left-[580px] flex flex-col gap-0 z-30 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleMissionTimerClick}
      >
        <h1 className="text-white text-[140px] pixelated-font p-0 leading-tight">{daysRemaining}<span className="text-[40px]">.{formattedSeconds}</span></h1>
        <h1 className="text-white text-[30px] pixelated-font -mt-4">{missionText}</h1>
      </div>

      <div className="absolute bottom-2 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">{greeting}</h1>
      </div>

      <div className="absolute bottom-7 right-8 flex items-center gap-4 z-30">
        <h1 className="text-white text-xl pixelated-font">{currentTime}</h1>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed z-[200] bg-[#222] border border-white/30 shadow-lg rounded-sm overflow-hidden"
          style={{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-52">
            <button
              onClick={() => handleCreateNewItem('file')}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Create New File
            </button>
            <button
              onClick={() => handleCreateNewItem('folder')}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Create New Folder
            </button>
            <div className="w-full h-px bg-white/20 my-1"></div>
            <button
              onClick={handlePreviousWallpaper}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="5 15 10 10 21 21"></polyline>
              </svg>
              Previous Wallpaper
            </button>
            <button
              onClick={handleNextWallpaper}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Next Wallpaper
            </button>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={() => setShowNewItemModal(false)}>
          <div className="bg-[#222] border border-white/30 p-6 w-[400px] rounded-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-2xl pixelated-font mb-6">
              Create New {newItemType === 'file' ? 'File' : 'Folder'}
            </h2>

            <div className="mb-6">
              <label className="block text-white pixelated-font mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={newItemType === 'file' ? 'New File' : 'New Folder'}
                autoFocus
              />
            </div>

            {newItemType === 'file' && (
              <div className="mb-6">
                <label className="block text-white pixelated-font mb-2">File Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="fileType"
                      checked={fileFormat === 'link'}
                      onChange={() => setFileFormat('link')}
                      className="mr-2"
                    />
                    Link
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="fileType"
                      checked={fileFormat === 'md'}
                      onChange={() => setFileFormat('md')}
                      className="mr-2"
                    />
                    Markdown
                  </label>
                </div>
              </div>
            )}

            {newItemType === 'file' && fileFormat === 'link' && (
              <div className="mb-6">
                <label className="block text-white pixelated-font mb-2">URL</label>
                <input
                  type="text"
                  className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            )}

            {newItemType === 'file' && fileFormat === 'md' && (
              <div className="mb-6">
                <label className="block text-white pixelated-font mb-2">Content</label>
                <textarea
                  className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm h-40"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="# Markdown content here"
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowNewItemModal(false)}
                className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-white/30 text-white pixelated-font transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleSaveNewItem}
                className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
              >
                create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission Settings Modal */}
      {showMissionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="bg-[#222] border border-white/30 p-6 w-[500px] rounded-sm">
            <h2 className="text-white text-2xl pixelated-font mb-6">Mission Settings</h2>

            <div className="mb-4">
              <label className="block text-white pixelated-font mb-2">Mission End Date</label>
              <input
                type="datetime-local"
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={missionEndDate.toISOString().slice(0, 16)}
                onChange={(e) => setMissionEndDate(new Date(e.target.value))}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white pixelated-font mb-2">Mission Text</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={missionText}
                onChange={handleMissionTextChange}
                placeholder="days till the next drop"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowMissionModal(false)}
                className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-white/30 text-white pixelated-font transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleSaveMissionSettings}
                className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
              >
                save changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}