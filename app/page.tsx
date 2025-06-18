"use client";
import FolderIcon from "@/components/FolderIcon";
import FileIcon from "@/components/FileIcon";
import Taskbar from "@/components/Taskbar";
import { useEffect, useState, useRef } from "react";
import SoundboardIcon from "@/components/SoundboardIcon";
import Soundboard from "@/components/Soundboard";
import DisclaimerModal from "@/components/DisclaimerModal";
import ReactDOM from 'react-dom';
import { uploadWallpaper } from "@/lib/utils";
import WallpaperIcon from "@/components/WallpaperIcon";
import { getWallpapers, Wallpaper } from "@/lib/wallpapers";

// Update the existing PriorityList component
const PriorityList = () => {
  const [priorities, setPriorities] = useState<{ id: number; text: string; completed: boolean }[]>([
    { id: 1, text: '', completed: false },
    { id: 2, text: '', completed: false },
    { id: 3, text: '', completed: false }
  ]);

  const [showPriorityModal, setShowPriorityModal] = useState(false);
  // Ensure portal only runs on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // Load saved priorities from localStorage on component mount
    if (typeof window !== 'undefined') {
      const savedPriorities = localStorage.getItem('priorities');
      if (savedPriorities) {
        try {
          setPriorities(JSON.parse(savedPriorities));
        } catch (error) {
          console.error('Error loading priorities:', error);
        }
      }
    }
  }, []);

  const handleSavePriorities = () => {
    localStorage.setItem('priorities', JSON.stringify(priorities));
    setShowPriorityModal(false);
  };

  const handleTextChange = (id: number, text: string) => {
    const newPriorities = priorities.map(priority =>
      priority.id === id ? { ...priority, text } : priority
    );
    setPriorities(newPriorities);
  };

  const handleCompletedChange = (id: number, completed: boolean) => {
    const newPriorities = priorities.map(priority =>
      priority.id === id ? { ...priority, completed } : priority
    );
    setPriorities(newPriorities);
    localStorage.setItem('priorities', JSON.stringify(newPriorities));
  };
  // Prepare safe portal root and modal on client
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  const priorityModal = mounted && showPriorityModal && portalRoot
    ? ReactDOM.createPortal(
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]"
        onClick={() => setShowPriorityModal(false)}
        style={{ isolation: 'isolate' }}
      >
        <div
          className="bg-[#222] border border-white/30 p-6 w-[400px] rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-2xl pixelated-font mb-6">Set Priorities</h2>

          {priorities.map(priority => (
            <div key={priority.id} className="mb-6">
              <label className="block text-white pixelated-font mb-2">Priority {priority.id}</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priority.completed}
                  onChange={(e) => handleCompletedChange(priority.id, e.target.checked)}
                  className="mr-2 bg-[#333] border border-white/30"
                />
                <input
                  type="text"
                  className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                  value={priority.text}
                  onChange={(e) => handleTextChange(priority.id, e.target.value)}
                  placeholder={`Enter priority ${priority.id}`}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowPriorityModal(false)}
              className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-white/30 text-white pixelated-font transition-colors"
            >cancel</button>
            <button
              onClick={handleSavePriorities}
              className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors"
            >save</button>
          </div>
        </div>
      </div>,
      portalRoot
    )
    : null;

  // Render priority list UI
  const listUI = (
    <div
      className="mt-6 p-4 cursor-pointer text-xl"
      onClick={() => setShowPriorityModal(true)}
    >
      <h2 className="text-white text-xl pixelated-font mb-4">priorities</h2>
      {priorities.map(priority => (
        <div key={priority.id} className="flex items-center mb-3">
          <div className="flex items-center gap-2">
          <span className={`text-white pixelated-font w-6 ${priority.completed ? 'line-through' : ''}`}>P{priority.id}</span>
            <input
              type="checkbox"
              checked={priority.completed}
              onChange={(e) => {
                e.stopPropagation();
                handleCompletedChange(priority.id, e.target.checked);
              }}
              className="mr-0 bg-[#333] border border-white/30"
              onClick={(e) => e.stopPropagation()}
            />
            <span className={`pixelated-font ${priority.completed ? 'line-through text-white/50' : 'text-white/80'}`}>
              {priority.text || `Set priority ${priority.id}...`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // If running on server, return list only to avoid document errors
  if (typeof window === 'undefined') {
    return listUI;
  }

  // Client render with modal portal
  return (
    <>
      {listUI}
      {priorityModal}
    </>
  );
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState('00:00 AM');
  const [greeting, setGreeting] = useState('good morning hacker');
  const [username, setUsername] = useState('');
  const [wallpaperNumber, setWallpaperNumber] = useState(0);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(true);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);

  useEffect(() => {
    // Check localStorage only on client-side
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');

    if (!hasSeenDisclaimer) {
      setShowDisclaimerModal(true);
      localStorage.setItem('hasSeenDisclaimer', 'true');
    }

    setHasCheckedStorage(true);
  }, []);
  // Load stored username
  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

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
        setGreeting(`good morning ${username || 'hacker'}`);
      } else if (hours >= 12 && hours < 18) {
        setGreeting(`good afternoon ${username || 'hacker'}`);
      } else {
        setGreeting(`good evening ${username || 'hacker'}`);
      }
    }

    // Initial time update
    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [username]); // Re-run when username changes to update greeting

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

  // File context menu states
  const [showFileContextMenu, setShowFileContextMenu] = useState(false);
  const [fileContextMenuPosition, setFileContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newItemRename, setNewItemRename] = useState('');


  // Load saved settings from localStorage only once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load wallpapers from backend
      const loadWallpapers = async () => {
        try {
          setIsLoadingWallpapers(true);
          const wallpapersData = await getWallpapers();
          setWallpapers(wallpapersData);
          
          // Set default wallpaper to first one if none selected
          const savedWallpaperId = localStorage.getItem('wallpaperId');
          if (savedWallpaperId) {
            const index = wallpapersData.findIndex((w: Wallpaper) => w.id === savedWallpaperId);
            if (index !== -1) {
              setWallpaperNumber(index);
            }
          }
        } catch (error) {
          console.error('Error loading wallpapers:', error);
        } finally {
          setIsLoadingWallpapers(false);
        }
      };
      
      loadWallpapers();

      // Load other settings
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
        setGreeting(`good morning ${username || 'hacker'}`);
      } else if (hours >= 12 && hours < 18) {
        setGreeting(`good afternoon ${username || 'hacker'}`);
      } else {
        setGreeting(`good evening ${username || 'hacker'}`);
      }
    }

    // Initial time update
    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [username]); // Re-run when username changes to update greeting

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
    if (wallpapers.length === 0) return;
    
    const nextIndex = (wallpaperNumber + 1) % wallpapers.length;
    setWallpaperNumber(nextIndex);
    localStorage.setItem('wallpaperId', wallpapers[nextIndex].id);
    setShowContextMenu(false);
  };

  const handlePreviousWallpaper = () => {
    if (wallpapers.length === 0) return;
    
    const prevIndex = (wallpaperNumber - 1 + wallpapers.length) % wallpapers.length;
    setWallpaperNumber(prevIndex);
    localStorage.setItem('wallpaperId', wallpapers[prevIndex].id);
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

  // Delete a desktop item
  const handleDeleteItem = () => {
    if (!selectedItem) return;

    const updatedItems = desktopItems.filter(item => item.id !== selectedItem.id);
    setDesktopItems(updatedItems);

    // Save to localStorage
    localStorage.setItem('desktopItems', JSON.stringify(updatedItems));

    setShowFileContextMenu(false);
  };

  // Start rename process
  const handleStartRename = () => {
    if (!selectedItem) return;
    setIsRenaming(true);
    setNewItemRename(selectedItem.name);
    setShowFileContextMenu(false);
  };

  // Save renamed item
  const handleSaveRename = () => {
    if (!selectedItem || !newItemRename) return;

    const updatedItems = desktopItems.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          name: newItemRename,
          // Update URL for folders to match the new name
          ...(item.type === 'folder' ? {
            url: `/folders/${newItemRename.toLowerCase().replace(/\s+/g, '-')}`
          } : {})
        };
      }
      return item;
    });

    setDesktopItems(updatedItems);

    // Save to localStorage
    localStorage.setItem('desktopItems', JSON.stringify(updatedItems));

    setIsRenaming(false);
    setSelectedItem(null);
  };

  // Add click handler to close context menus when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setShowContextMenu(false);
      setShowFileContextMenu(false);

      // If user clicks outside while renaming, save the rename
      if (isRenaming) {
        handleSaveRename();
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isRenaming]); // Add isRenaming to dependencies

  // Handle right-click on desktop items
  const handleItemContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show context menu for user-created items
    const isDefaultFolder = defaultFolders.some(folder => folder.id === item.id);
    if (isDefaultFolder) return;

    setSelectedItem(item);
    setShowFileContextMenu(true);
    setFileContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(false); // Hide the desktop context menu if it's open
  };

  // Modify the handleSaveNewItem function
  const handleSaveNewItem = () => {
    if (!newItemName) {
      alert('Please enter a name');
      return;
    }

    // Calculate the position for the new item
    const itemPosition = calculateItemPosition();

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
        position: itemPosition // Use calculated position instead of clicked position
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
        position: itemPosition // Use calculated position instead of clicked position
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

  const [useTimeSelection, setUseTimeSelection] = useState(false);

  // New state for upload wallpaper modal
  const [showUploadWallpaperModal, setShowUploadWallpaperModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadSubmitted, setUploadSubmitted] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  // State for mobile/tablet detection
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Handler for upload submit
  const handleUploadSubmit = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch('/api/upload-wallpaper', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      const imageUrl = data.fileUrl || '';

      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
        setIsUploading(false);
      } else {
        setUploadedUrl(data.fileUrl || '');
        console.log("Wallpaper uploaded successfully:", data.fileUrl);
        const uploadResult = await uploadWallpaper(imageUrl, localStorage.getItem('username') ?? '');
        if (uploadResult.error) {
          setUploadError(uploadResult.error);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
        setUploadSubmitted(true);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Unexpected error occurred during upload');
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const checkDeviceSize = () => {
      if (typeof window !== 'undefined') {
        setIsMobileOrTablet(window.innerWidth < 1024); // Consider devices under 1024px as mobile/tablet
      }
    };

    // Initial check
    checkDeviceSize();

    // Add resize listener
    window.addEventListener('resize', checkDeviceSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  const calculateItemPosition = () => {
    // Count existing user items
    const itemCount = desktopItems.length;

    // Each column has 5 items maximum
    const columnIndex = Math.floor(itemCount / 5);
    const rowIndex = itemCount % 5;

    // Start positioning from the right side of the screen
    // For the default column (columnIndex = 0), use the same position as default folders
    const rightOffset = 250 + (columnIndex * 100); // Use pixels instead of rem units

    // Calculate Y position with appropriate spacing
    const yPosition = 40 + (rowIndex * 130);

    // Calculate x position from the right edge of the screen
    // Use window.innerWidth if available, otherwise use a reasonable default
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const xPosition = screenWidth - rightOffset;

    // Ensure the icon stays within screen boundaries
    return {
      x: Math.max(100, Math.min(screenWidth - 100, xPosition)), // Keep at least 100px from edges
      y: yPosition
    };
  };

  const [showWallpaperWindow, setShowWallpaperWindow] = useState(false);
  const [wallpaperWindowState, setWallpaperWindowState] = useState<'normal' | 'maximized' | 'minimized'>('normal');

  if (isMobileOrTablet) {
    return (
      <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background video with 10% opacity */}
        <video
          src="/bg-video.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-8 z-0"
        />

        {/* Content stays above the video */}
        <div className="max-w-md relative z-10">
          <h1 className="text-white text-3xl pixelated-font mb-6">desktop only</h1>
          <p className="text-white/80 pixelated-font mb-6">
            this website is designed for desktop experiences only.
            Please visit on a PC to explore the full experience.
          </p>
          <p className="text-white/80 pixelated-font mt-8 text-sm">
            made with love by tensorboy
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Greeting display now shows custom username */}
      {/* Soundboard Modal */}
      <Soundboard isOpen={showSoundboard} onClose={() => setShowSoundboard(false)} />


      {/* Beta Disclaimer Modal */}
      <DisclaimerModal onClose={closeDisclaimerModal} />

      <div className="absolute bottom-18 left-4 z-30 w-100">
        <PriorityList />
      </div>

      {/* ——— Background image/video layer with context menu handler ——— */}
      <div
        onContextMenu={handleContextMenu}
        className={`
          absolute inset-0
          bg-cover bg-center bg-no-repeat
          filter grayscale-[50%] brightness-65 contrast-100
          z-0
        `}
        style={{ 
          backgroundImage: !isLoadingWallpapers && wallpapers.length > 0 
            ? `url(${wallpapers[wallpaperNumber].imageUrl})` 
            : 'none' 
        }}
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
        <FolderIcon text="ai news" url="https://tensorboy-extension.vercel.app/default-folders/ai-news" />
        <FolderIcon text="internships" url="https://tensorboy-extension.vercel.app/default-folders/internships" />
        <FolderIcon text="hackathons" url="https://tensorboy-extension.vercel.app/default-folders/hackathons" />
        <WallpaperIcon onClick={() => {
          setShowWallpaperWindow(true);
          setWallpaperWindowState('normal');
        }} />
        <SoundboardIcon onClick={() => setShowSoundboard(true)} />
      </div>

      {/* Wallpaper Window */}
      {showWallpaperWindow && (
        <div 
          className={`
            fixed z-[200] bg-white rounded-lg shadow-xl overflow-hidden
            ${wallpaperWindowState === 'normal' ? 'w-[800px] h-[600px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
            ${wallpaperWindowState === 'minimized' ? 'w-[800px] h-12 bottom-0 left-1/2 transform -translate-x-1/2' : ''}
          `}
        >
          {/* Window Title Bar */}
          <div className="bg-[#333] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowWallpaperWindow(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"
              />
              <button 
                onClick={() => setShowWallpaperWindow(false)}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"
              />
              <button 
                onClick={() => window.location.href = '/wallpapers'}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400"
              />
            </div>
            <span className="text-white text-sm pixelated-font">Wallpapers</span>
            <div className="w-12" /> {/* Spacer for symmetry */}
          </div>

          {/* Window Content */}
          {wallpaperWindowState !== 'minimized' && (
            <div className="w-full h-[calc(100%-40px)]">
              <iframe 
                src="/wallpapers" 
                className="w-full h-full border-none"
              />
            </div>
          )}
        </div>
      )}

      {/* ——— Custom Desktop Items ——— */}
      {desktopItems.map(item => (
        <div
          key={item.id}
          className="absolute z-30"
          style={{
            left: `${item.position.x}px`,
            top: `${item.position.y}px`
          }}
          onContextMenu={(e) => handleItemContextMenu(e, item)}
        >
          {item.type === 'file' ? (
            isRenaming && selectedItem?.id === item.id ? (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  className="w-20 bg-[#333] text-white p-1 border border-white/30 rounded-sm text-center"
                  value={newItemRename}
                  onChange={(e) => setNewItemRename(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="h-12"></div>
              </div>
            ) : (
              <FileIcon
                text={item.name}
                url={item.url}
                icon={item.icon}
                content={item.content || ''}
                fileType={item.fileType}
              />
            )
          ) : (
            isRenaming && selectedItem?.id === item.id ? (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  className="w-20 bg-[#333] text-white p-1 border border-white/30 rounded-sm text-center"
                  value={newItemRename}
                  onChange={(e) => setNewItemRename(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="h-12"></div>
              </div>
            ) : (
              <FolderIcon text={item.name} url={item.url} />
            )
          )}
        </div>
      ))}

      {/* File/Folder Context Menu */}
      {showFileContextMenu && selectedItem && (
        <div
          className="fixed z-[200] bg-[#222] border border-white/30 shadow-lg rounded-sm overflow-hidden"
          style={{ left: `${fileContextMenuPosition.x}px`, top: `${fileContextMenuPosition.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-52">
            <button
              onClick={handleStartRename}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Rename
            </button>
            <button
              onClick={handleDeleteItem}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ——— Intro Text ——— */}
      <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
        <h1 className="text-white text-xl pixelated-font mb-8">tensor extension - beta</h1>
        {/* <h1 className="text-white text-xl pixelated-font">checkout the latest drop <a href="https://protocol.tensorboy.com/last-email" target="_blank" className="text-white/50 underline">link</a></h1>
        <h1 className="text-white text-xl pixelated-font">not subscribed yet? <a href="https://protocol.tensorboy.com" target="_blank" className="text-white/50 underline">sub here</a></h1> */}
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
            {/* <button
              onClick={() => handleCreateNewItem('folder')}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Create New Folder
            </button> */}
            <div className="w-full h-px bg-white/20 my-1"></div>
            {/* <button
              onClick={handlePreviousWallpaper}
              className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="5 15 10 10 21 21"></polyline>
              </svg>
              Previous Wallpaper
            </button> */}
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
            {/* <div className="w-full h-px bg-white/20 my-1"></div>
            <button onClick={() => { setShowUploadWallpaperModal(true); setShowContextMenu(false); }} className="w-full px-4 py-2 text-left text-white text-sm pixelated-font hover:bg-black/50 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Add your own</button> */}
          </div>
        </div>
      )}

      {/* Upload Wallpaper Modal */}
      {showUploadWallpaperModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300]" onClick={() => setShowUploadWallpaperModal(false)}>
          <div className="bg-[#222] border border-white/30 p-6 w-[500px] rounded-sm" onClick={(e) => e.stopPropagation()}>
            {!uploadSubmitted ? (
              <>
                <h2 className="text-white text-2xl pixelated-font mb-4">Upload Wallpaper</h2>

                {/* Prettier file input replacement */}
                <div className="mb-6">
                  <div className="relative border border-white/30 rounded-sm bg-[#333] p-4 cursor-pointer hover:bg-[#444] transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setUploadedFile(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <div className="flex items-center justify-center gap-3 text-white pixelated-font">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>{uploadedFile ? uploadedFile.name : 'Choose wallpaper file...'}</span>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="mt-4 p-3 border border-white/30 rounded-sm bg-[#333]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-white pixelated-font truncate max-w-[300px]">{uploadedFile.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }}
                          className="text-white hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2 text-red-500 pixelated-font">{uploadError}</div>
                  )}
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading || !uploadedFile}
                  className={`px-4 py-2 ${isUploading ? 'bg-gray-500' : 'bg-[#b8460e] hover:bg-[#a53d0c]'} border border-white/30 text-white pixelated-font transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isUploading ? 'Submitting...' : 'Submit'}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-white text-2xl pixelated-font mb-4">Thanks for your submission!</h2>
                <p className="text-white mb-4">Our team will review your wallpaper and add it to the collection if approved.</p>
                <button onClick={() => { setShowUploadWallpaperModal(false); setUploadSubmitted(false); }} className="px-4 py-2 bg-[#b8460e] hover:bg-[#a53d0c] border border-white/30 text-white pixelated-font transition-colors">Close</button>
              </>
            )}
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
                type="date"
                className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                value={missionEndDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  // Always set time to 12am (00:00) when changing the date
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    // Set time to 00:00:00 (12am)
                    newDate.setHours(0, 0, 0, 0);
                    setMissionEndDate(newDate);
                  }
                }}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useTimeCheckbox"
                  className="mr-2 bg-[#333] border border-white/30"
                  checked={useTimeSelection}
                  onChange={(e) => setUseTimeSelection(e.target.checked)}
                />
                <label htmlFor="useTimeCheckbox" className="text-white pixelated-font">
                  Include specific time (optional)
                </label>
              </div>

              {useTimeSelection && (
                <input
                  type="time"
                  className="w-full bg-[#333] text-white p-2 border border-white/30 rounded-sm"
                  value={`${missionEndDate.getHours().toString().padStart(2, '0')}:${missionEndDate.getMinutes().toString().padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(missionEndDate);
                    newDate.setHours(hours, minutes, 0, 0);
                    setMissionEndDate(newDate);
                  }}
                />
              )}

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