import React, { useState, useEffect, useCallback } from 'react';
import { Camera, AlertTriangle, Shield, Eye, CheckCircle, Clock, MapPin, XCircle, Video } from 'lucide-react';

// --- Simulated Backend API (api.js concept) ---
const cameras = [
  { id: 'cam-1', name: 'Camera 01', location: 'Shop Floor A' },
  { id: 'cam-2', name: 'Camera 02', location: 'Vault' },
  { id: 'cam-3', name: 'Camera 03', location: 'Entrance' },
];

let incidentsData = [
  {
    id: 'inc-1',
    cameraId: 'cam-1',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+1',
    resolved: false,
  },
  {
    id: 'inc-2',
    cameraId: 'cam-2',
    type: 'Gun Threat',
    tsStart: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // 85 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+2',
    resolved: false,
  },
  {
    id: 'inc-3',
    cameraId: 'cam-1',
    type: 'Face Recognized',
    tsStart: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 120 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 115).toISOString(), // 115 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+3',
    resolved: false,
  },
  {
    id: 'inc-4',
    cameraId: 'cam-3',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 180 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 175).toISOString(), // 175 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+4',
    resolved: true, // Already resolved
  },
  {
    id: 'inc-5',
    cameraId: 'cam-2',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 240 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 235).toISOString(), // 235 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+5',
    resolved: false,
  },
  {
    id: 'inc-6',
    cameraId: 'cam-1',
    type: 'Gun Threat',
    tsStart: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 300 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 295).toISOString(), // 295 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+6',
    resolved: false,
  },
  {
    id: 'inc-7',
    cameraId: 'cam-3',
    type: 'Face Recognized',
    tsStart: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 360 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 355).toISOString(), // 355 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+7',
    resolved: false,
  },
  {
    id: 'inc-8',
    cameraId: 'cam-1',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 420 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 415).toISOString(), // 415 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+8',
    resolved: true,
  },
  {
    id: 'inc-9',
    cameraId: 'cam-2',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 480 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 475).toISOString(), // 475 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+9',
    resolved: false,
  },
  {
    id: 'inc-10',
    cameraId: 'cam-3',
    type: 'Gun Threat',
    tsStart: new Date(Date.now() - 1000 * 60 * 540).toISOString(), // 540 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 535).toISOString(), // 535 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+10',
    resolved: false,
  },
  {
    id: 'inc-11',
    cameraId: 'cam-1',
    type: 'Face Recognized',
    tsStart: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 600 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 595).toISOString(), // 595 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+11',
    resolved: false,
  },
  {
    id: 'inc-12',
    cameraId: 'cam-2',
    type: 'Unauthorized Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 660).toISOString(), // 660 mins ago
    tsEnd: new Date(Date.now() - 1000 * 60 * 655).toISOString(), // 655 mins ago
    thumbnailUrl: 'https://placehold.co/160x90/1a202c/e2e8f0?text=Incident+12',
    resolved: false,
  },
];

const api = {
  getIncidents: async (resolvedOnly = false) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const filteredIncidents = resolvedOnly
      ? incidentsData.filter(inc => inc.resolved)
      : incidentsData.filter(inc => !inc.resolved);

    // Sort by newest first
    return filteredIncidents.sort((a, b) => new Date(b.tsStart) - new Date(a.tsStart));
  },
  resolveIncident: async (id) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = incidentsData.findIndex(inc => inc.id === id);
    if (index > -1) {
      incidentsData[index] = { ...incidentsData[index], resolved: true };
      return incidentsData[index];
    }
    throw new Error('Incident not found');
  },
  getAllIncidents: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return incidentsData.sort((a, b) => new Date(a.tsStart) - new Date(b.tsStart)); // Sort by oldest first for timeline
  },
  getCameras: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return cameras;
  }
};

// --- Utility Functions ---
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getIncidentTypeIcon = (type) => {
  switch (type) {
    case 'Unauthorized Access':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'Gun Threat':
      return <Shield className="w-5 h-5 text-red-600" />;
    case 'Face Recognized':
      return <Eye className="w-5 h-5 text-green-500" />;
    default:
      return <AlertTriangle className="w-5 h-5 text-gray-400" />;
  }
};

const getIncidentTypeColor = (type) => {
  switch (type) {
    case 'Unauthorized Access':
      return 'bg-red-500';
    case 'Gun Threat':
      return 'bg-red-600';
    case 'Face Recognized':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// --- Components ---

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg flex justify-between items-center rounded-b-lg">
      <div className="flex items-center space-x-2">
        <Video className="w-8 h-8 text-blue-400" />
        <span className="text-white text-2xl font-semibold font-inter">SecureSight</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 text-sm font-inter">User: Admin</span>
        {/* Add more nav items here if needed */}
      </div>
    </nav>
  );
};

const IncidentPlayer = ({ currentIncident, cameras }) => {
  const mainCamera = cameras.find(cam => cam.id === currentIncident?.cameraId) || cameras[0];
  const otherCameras = cameras.filter(cam => cam.id !== mainCamera?.id);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-xl flex flex-col h-full">
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
        {/* Main video player - using a placeholder image for static content */}
        <img
          src={currentIncident?.thumbnailUrl || 'https://placehold.co/1280x720/000000/FFFFFF?text=Live+Feed'}
          alt="Main CCTV Feed"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1280x720/000000/FFFFFF?text=Live+Feed+Error'; }}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md font-inter">
          <Camera className="inline-block w-4 h-4 mr-1" />
          {mainCamera?.name || 'Camera 01'}
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md font-inter">
          {formatDate(new Date().toISOString())} - {formatTime(new Date().toISOString())}
        </div>
      </div>

      {/* Mini strip of additional camera thumbnails */}
      <div className="flex justify-center space-x-4 mt-4">
        {otherCameras.slice(0, 2).map((cam) => (
          <div key={cam.id} className="relative w-1/3 aspect-video bg-gray-700 rounded-md overflow-hidden border border-gray-600">
            <img
              src={`https://placehold.co/320x180/374151/D1D5DB?text=${cam.name.replace(' ', '+')}`}
              alt={`${cam.name} Feed`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/320x180/374151/D1D5DB?text=${cam.name.replace(' ', '+')}+Error`; }}
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-md font-inter">
              <Camera className="inline-block w-3 h-3 mr-0.5" />
              {cam.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IncidentCard = ({ incident, onResolve, cameraLocation }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [isResolvedUI, setIsResolvedUI] = useState(incident.resolved);

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      await onResolve(incident.id);
      setIsResolvedUI(true); // Optimistic UI update
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      setIsResolving(false); // Revert UI if API fails
      // Optionally show an error message to the user
    }
  };

  if (isResolvedUI) {
    return null; // Don't render if resolved
  }

  return (
    <div className="flex items-center bg-gray-800 p-3 rounded-lg shadow-md mb-3 transition-all duration-300 ease-in-out transform hover:scale-[1.01]">
      <div className="w-24 h-16 mr-3 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={incident.thumbnailUrl}
          alt="Incident Thumbnail"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x64/374151/D1D5DB?text=No+Image'; }}
        />
      </div>
      <div className="flex-grow text-white">
        <div className="flex items-center mb-1">
          <div className={`w-2 h-2 rounded-full mr-2 ${getIncidentTypeColor(incident.type)}`}></div>
          <span className="font-semibold text-sm font-inter">{incident.type}</span>
        </div>
        <div className="flex items-center text-gray-400 text-xs mb-1 font-inter">
          {getIncidentTypeIcon(incident.type)}
          <span className="ml-1">{incident.type}</span>
        </div>
        <div className="flex items-center text-gray-400 text-xs mb-1 font-inter">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{cameraLocation}</span>
        </div>
        <div className="flex items-center text-gray-400 text-xs font-inter">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}</span>
        </div>
      </div>
      <button
        onClick={handleResolve}
        disabled={isResolving}
        className={`ml-4 px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200
          ${isResolving
            ? 'bg-blue-600 text-white cursor-not-allowed opacity-75'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
          } flex items-center justify-center font-inter`}
      >
        {isResolving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resolving...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolve
          </>
        )}
      </button>
    </div>
  );
};

const IncidentList = ({ incidents, onResolve, cameras }) => {
  const getCameraName = (cameraId) => {
    return cameras.find(cam => cam.id === cameraId)?.name || 'Unknown Camera';
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-xl h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-white text-xl font-semibold mb-4 font-inter">Unresolved Incidents</h2>
      {incidents.length === 0 ? (
        <p className="text-gray-400 text-center py-8 font-inter">No unresolved incidents at this time. All clear!</p>
      ) : (
        // Slice the incidents array to show only the first 3
        incidents.slice(0, 3).map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onResolve={onResolve}
            cameraLocation={getCameraName(incident.cameraId)}
          />
        ))
      )}
      {incidents.length > 3 && (
        <p className="text-gray-400 text-center mt-4 text-sm font-inter">
          Showing 3 of {incidents.length} incidents. Scroll to see more.
        </p>
      )}
    </div>
  );
};

const IncidentTimeline = ({ incidents, cameras }) => {
  const [timelineWidth, setTimelineWidth] = useState(0);
  const timelineRef = React.useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate positions for incidents on a 24-hour timeline
  const getPositionForTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutesInDay = 24 * 60;
    const currentMinutes = hours * 60 + minutes;
    return (currentMinutes / totalMinutesInDay) * 100; // Percentage of the day
  };

  const incidentsByCamera = cameras.map(camera => ({
    ...camera,
    incidents: incidents.filter(inc => inc.cameraId === camera.id)
  }));

  const renderTimelineRuler = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return (
      <div className="relative w-full h-10 bg-gray-700 rounded-md flex items-center px-2">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex-1 text-center text-gray-400 text-xs relative"
          >
            {hour % 3 === 0 && ( // Mark every 3 hours
              <>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-inter">{hour.toString().padStart(2, '0')}:00</span>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gray-500"></div>
              </>
            )}
            {hour % 1 === 0 && hour % 3 !== 0 && ( // Smaller ticks for other hours
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-gray-600"></div>
            )}
          </div>
        ))}
        {/* Simple draggable scrubber placeholder */}
        <div className="absolute top-0 bottom-0 w-2 bg-blue-500 rounded-full cursor-grab" style={{ left: '50%' }}></div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-xl mt-4">
      <h2 className="text-white text-xl font-semibold mb-4 font-inter">Incident Timeline (24h)</h2>
      <div ref={timelineRef} className="w-full">
        {renderTimelineRuler()}
      </div>

      <div className="mt-6 space-y-4">
        {incidentsByCamera.map(camera => (
          <div key={camera.id} className="relative">
            <div className="text-gray-300 text-sm font-semibold mb-2 font-inter">{camera.name}</div>
            <div className="relative w-full h-8 bg-gray-800 rounded-md">
              {camera.incidents.map(incident => (
                <div
                  key={incident.id}
                  className={`absolute top-0 bottom-0 flex items-center justify-center px-2 rounded-md text-white text-xs font-inter
                    ${getIncidentTypeColor(incident.type)}`}
                  style={{
                    left: `${getPositionForTime(incident.tsStart)}%`,
                    width: `${Math.max(2, (new Date(incident.tsEnd).getTime() - new Date(incident.tsStart).getTime()) / (24 * 60 * 60 * 1000) * 100)}%` // Min width 2%
                  }}
                  title={`${incident.type} (${formatTime(incident.tsStart)} - ${formatTime(incident.tsEnd)})`}
                >
                  {getIncidentTypeIcon(incident.type)}
                  <span className="ml-1 hidden sm:inline">{incident.type.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [unresolvedIncidents, setUnresolvedIncidents] = useState([]);
  const [allIncidents, setAllIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMainIncident, setCurrentMainIncident] = useState(null);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUnresolved = await api.getIncidents(false);
      const fetchedAll = await api.getAllIncidents();
      const fetchedCameras = await api.getCameras();
      setUnresolvedIncidents(fetchedUnresolved);
      setAllIncidents(fetchedAll);
      setCameras(fetchedCameras);
      if (fetchedUnresolved.length > 0) {
        setCurrentMainIncident(fetchedUnresolved[0]); // Set the newest incident as main
      } else if (fetchedAll.length > 0) {
        setCurrentMainIncident(fetchedAll[0]); // Fallback to any incident if no unresolved
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      // Handle error display to user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    // Refresh incidents every 30 seconds (simulated polling)
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const handleResolveIncident = async (id) => {
    try {
      await api.resolveIncident(id);
      // Re-fetch incidents to update the list after resolution
      fetchIncidents();
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      // The IncidentCard handles optimistic UI and reverts on failure
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg font-inter">Loading SecureSight Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 font-inter">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748; /* gray-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568; /* gray-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* gray-500 */
        }
        `}
      </style>
      <Navbar />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Player */}
        <div className="lg:col-span-2">
          <IncidentPlayer currentIncident={currentMainIncident} cameras={cameras} />
        </div>
        {/* Incident List */}
        <div className="lg:col-span-1">
          <IncidentList incidents={unresolvedIncidents} onResolve={handleResolveIncident} cameras={cameras} />
        </div>
      </div>
      {/* Incident Timeline (Optional Scope) */}
      <div className="p-6 pt-0">
        <IncidentTimeline incidents={allIncidents} cameras={cameras} />
      </div>
    </div>
  );
};

export default App;
