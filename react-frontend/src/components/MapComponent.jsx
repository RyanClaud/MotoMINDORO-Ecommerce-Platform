import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPhone, FaStar, FaRoute, FaTimes, FaCrosshairs, FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronUp, FaVolumeUp, FaVolumeMute, FaPlay, FaPause } from 'react-icons/fa';
import LocationPermissionModal from './LocationPermissionModal';
import generateStoreBanner from '../utils/generateStoreBanner';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create custom DivIcon with emoji and colored background
const createCustomIcon = (shopType) => {
  let emoji, bgColor, label;
  
  switch (shopType) {
    case 'vulcanizing_shop':
      emoji = '🔧';
      bgColor = '#eab308'; // yellow-500
      label = 'Vulcanizing';
      break;
    case 'gasoline_station':
      emoji = '⛽';
      bgColor = '#dc2626'; // red-600
      label = 'Gas Station';
      break;
    case 'motorcycle_shop':
    default:
      emoji = '🏍️';
      bgColor = '#2563eb'; // blue-600
      label = 'Motorcycle';
      break;
  }

  return L.divIcon({
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <div style="
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: ${bgColor};
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">${label}</div>
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: ${bgColor};
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 20px;
            display: block;
          ">${emoji}</span>
        </div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 40px; height: 50px;">
      <div style="
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: #16a34a;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">You</div>
      <div style="
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 40px;
        background: #16a34a;
        border-radius: 50% 50% 50% 0;
        transform: translateX(-50%) rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 20px;
          display: block;
        ">📍</span>
      </div>
    </div>
  `,
  className: 'custom-marker',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

// Get icon based on shop type
const getShopIcon = (shopType) => {
  return createCustomIcon(shopType);
};

// Routing component
function RoutingMachine({ userLocation, destination, onRouteFound, onInstructionsFound }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      show: false, // Hide the instruction panel
      addWaypoints: false,
      fitSelectedRoutes: true, // Auto-fit the route in view
      lineOptions: {
        styles: [
          { 
            color: '#2563eb', 
            weight: 6, 
            opacity: 0.8,
            className: 'route-line'
          }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: () => null, // Don't create default markers (we have our own)
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving' // Use driving profile for motorcycles
      }),
      showAlternatives: false,
      altLineOptions: {
        styles: [
          { color: '#6b7280', weight: 4, opacity: 0.4 }
        ]
      }
    }).addTo(map);

    // Hide the routing instructions container
    const container = routingControl.getContainer();
    if (container) {
      container.style.display = 'none';
    }

    // Listen for route found event
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      const route = routes[0];
      const summary = route.summary;
      
      // Calculate distance and time
      const distance = (summary.totalDistance / 1000).toFixed(1); // Convert to km
      const time = Math.round(summary.totalTime / 60); // Convert to minutes
      
      console.log(`Route found: ${distance} km, ${time} minutes`);
      
      // Update route info with actual calculated values
      if (onRouteFound) {
        onRouteFound({ distance, time });
      }

      // Extract turn-by-turn instructions
      if (onInstructionsFound && route.instructions) {
        const instructions = route.instructions.map((instruction, index) => ({
          id: index,
          text: instruction.text,
          distance: (instruction.distance / 1000).toFixed(2), // Convert to km
          time: Math.round(instruction.time / 60), // Convert to minutes
          type: instruction.type,
          direction: instruction.direction,
          road: instruction.road || 'Unnamed road'
        }));
        onInstructionsFound(instructions);
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination, onRouteFound, onInstructionsFound]);

  return null;
}

// Component to recenter map on user location
function RecenterMap({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  
  return null;
}

const MapComponent = ({ stores = [] }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [showRouting, setShowRouting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [recenterTrigger, setRecenterTrigger] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Debug: Log when userLocation changes
  useEffect(() => {
    if (userLocation) {
      console.log('User location updated:', userLocation);
    }
  }, [userLocation]);

  // Auto-speak when route instructions are loaded and voice is enabled
  useEffect(() => {
    if (voiceEnabled && routeInstructions.length > 0 && currentStepIndex === 0) {
      // Speak first instruction when route is ready
      const timer = setTimeout(() => {
        speakInstruction(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeInstructions, voiceEnabled]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      alert('Geolocation is not supported by your browser');
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        console.log('Location obtained:', newLocation);
      },
      (error) => {
        console.log('Location access denied:', error);
        let errorMessage = 'Unable to get your location. ';
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += 'Please allow location access in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage += 'Location request timed out.';
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Watch position for real-time updates
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        console.log('Location updated:', newLocation);
      },
      (error) => {
        console.log('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);
  };

  useEffect(() => {
    // Check if we should show the location modal
    const hasAskedBefore = localStorage.getItem('locationPermissionAsked');
    
    if (!hasAskedBefore) {
      // Show modal after a short delay
      setTimeout(() => {
        setShowLocationModal(true);
      }, 1000);
    } else {
      // Try to get location silently
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    setLocationPermissionAsked(true);
    localStorage.setItem('locationPermissionAsked', 'true');
    requestLocation();
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    setLocationPermissionAsked(true);
    localStorage.setItem('locationPermissionAsked', 'true');
  };

  const handleRecenterOnUser = () => {
    if (userLocation) {
      setRecenterTrigger(userLocation);
    } else {
      // Try to request location again
      setShowLocationModal(true);
    }
  };

  // Cleanup watch position on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getCenter = () => {
    if (stores.length === 0) return [13.0833, 121.4167];
    const avgLat = stores.reduce((sum, store) => sum + parseFloat(store.latitude), 0) / stores.length;
    const avgLng = stores.reduce((sum, store) => sum + parseFloat(store.longitude), 0) / stores.length;
    return [avgLat, avgLng];
  };

  const handleGetDirections = (store) => {
    if (!userLocation) {
      alert('Please allow location access to get directions');
      return;
    }
    setSelectedStore(store);
    setRouteDestination([parseFloat(store.latitude), parseFloat(store.longitude)]);
    setShowRouting(true);
    
    // Calculate straight-line distance for immediate feedback
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      parseFloat(store.latitude),
      parseFloat(store.longitude)
    );
    setRouteInfo({ distance: distance.toFixed(1), time: Math.round(distance * 2) }); // Rough estimate
  };

  const handleClearRoute = () => {
    setRouteDestination(null);
    setShowRouting(false);
    setRouteInfo(null);
    setSelectedStore(null);
    setRouteInstructions([]);
    setShowDirections(false);
    setVoiceEnabled(false);
    setCurrentStepIndex(0);
    stopSpeaking();
  };

  // Speech Synthesis Functions
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    const newVoiceState = !voiceEnabled;
    setVoiceEnabled(newVoiceState);

    if (newVoiceState && routeInstructions.length > 0) {
      // Announce voice navigation started
      speak('Voice navigation started. Follow the directions.');
      // Speak first instruction after a short delay
      setTimeout(() => {
        speakInstruction(0);
      }, 2000);
    } else {
      stopSpeaking();
    }
  };

  const speakInstruction = (index) => {
    if (!voiceEnabled || !routeInstructions[index]) return;

    const instruction = routeInstructions[index];
    let speechText = instruction.text;

    // Add distance information if available
    if (instruction.distance > 0) {
      const distanceKm = parseFloat(instruction.distance);
      if (distanceKm < 1) {
        const meters = Math.round(distanceKm * 1000);
        speechText += ` in ${meters} meters`;
      } else {
        speechText += ` in ${distanceKm} kilometers`;
      }
    }

    speak(speechText);
  };

  const speakCurrentStep = () => {
    speakInstruction(currentStepIndex);
  };

  const speakNextStep = () => {
    if (currentStepIndex < routeInstructions.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      speakInstruction(nextIndex);
    }
  };

  const speakPreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      speakInstruction(prevIndex);
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get direction icon based on instruction type
  const getDirectionIcon = (type, direction) => {
    const iconClass = "text-2xl text-gray-600";
    
    // Map instruction types to icons
    if (type === 'Straight' || type === 'Head') {
      return <FaArrowUp className={iconClass} />;
    } else if (type === 'Right' || direction === 'Right') {
      return <FaArrowRight className={iconClass} />;
    } else if (type === 'Left' || direction === 'Left') {
      return <FaArrowLeft className={iconClass} />;
    } else if (type === 'SlightRight') {
      return <FaArrowRight className={`${iconClass} transform -rotate-45`} />;
    } else if (type === 'SlightLeft') {
      return <FaArrowLeft className={`${iconClass} transform rotate-45`} />;
    } else if (type === 'SharpRight') {
      return <FaArrowRight className={`${iconClass} transform rotate-45`} />;
    } else if (type === 'SharpLeft') {
      return <FaArrowLeft className={`${iconClass} transform -rotate-45`} />;
    } else if (type === 'DestinationReached' || type === 'WaypointReached') {
      return <span className="text-2xl">🏁</span>;
    } else if (type === 'Continue') {
      return <FaArrowUp className={iconClass} />;
    } else if (type === 'TurnAround' || type === 'Uturn') {
      return <FaArrowDown className={`${iconClass} transform rotate-180`} />;
    } else {
      return <FaArrowUp className={iconClass} />;
    }
  };

  const center = getCenter();
  const getZoom = () => {
    if (stores.length === 0) return 10;
    if (stores.length === 1) return 13;
    return 10;
  };

  return (
    <>
      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />

      <div className="h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 relative">
        {/* Location Status Banner */}
        {userLocation ? (
          <div className="absolute top-4 left-4 z-[1000] bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">📍 Your Location Active</span>
          </div>
        ) : (
          <button
            onClick={() => setShowLocationModal(true)}
            className="absolute top-4 left-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
          >
            <FaMapMarkerAlt />
            <span className="font-semibold text-sm">Enable Location</span>
          </button>
        )}

        {/* Route Information Panel */}
        {showRouting && routeInfo && selectedStore && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-2xl p-4 min-w-[300px] animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FaRoute className="text-blue-600 text-xl" />
                <h3 className="font-bold text-gray-900">Route to {selectedStore.name}</h3>
              </div>
              <button
                onClick={handleClearRoute}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Distance</p>
                <p className="text-2xl font-bold text-blue-600">{routeInfo.distance} km</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Est. Time</p>
                <p className="text-2xl font-bold text-green-600">{routeInfo.time} min</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Route displayed</span>
                </div>
                {routeInstructions.length > 0 && (
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-all ${
                      voiceEnabled 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={voiceEnabled ? 'Voice navigation ON' : 'Voice navigation OFF'}
                  >
                    {voiceEnabled ? <FaVolumeUp className="text-sm" /> : <FaVolumeMute className="text-sm" />}
                  </button>
                )}
              </div>
              {routeInstructions.length > 0 && (
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
                >
                  <span>{showDirections ? 'Hide' : 'Show'} Directions</span>
                  {showDirections ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Turn-by-Turn Directions Panel */}
        {showRouting && showDirections && routeInstructions.length > 0 && (
          <div className="absolute top-32 left-4 z-[1000] bg-white rounded-xl shadow-2xl w-80 max-h-[500px] overflow-hidden animate-slide-in-left">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FaRoute className="text-xl" />
                  <h3 className="font-bold">Turn-by-Turn Directions</h3>
                </div>
                <button
                  onClick={() => setShowDirections(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100">
                  {routeInstructions.length} steps • {routeInfo.distance} km
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-all ${
                      voiceEnabled 
                        ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    }`}
                    title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                  >
                    {voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                  </button>
                  {isSpeaking && (
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Speaking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[420px] custom-scrollbar">
              {routeInstructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className={`p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    index === 0 ? 'bg-green-50' : ''
                  } ${index === routeInstructions.length - 1 ? 'bg-red-50' : ''} ${
                    index === currentStepIndex && voiceEnabled ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-green-600' :
                      index === routeInstructions.length - 1 ? 'bg-red-600' :
                      index === currentStepIndex && voiceEnabled ? 'bg-blue-700' :
                      'bg-blue-600'
                    } text-white text-sm font-bold`}>
                      {index === 0 ? '🚩' : index === routeInstructions.length - 1 ? '🏁' : index}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm flex-1">
                          {instruction.text}
                        </p>
                        {voiceEnabled && (
                          <button
                            onClick={() => {
                              setCurrentStepIndex(index);
                              speakInstruction(index);
                            }}
                            className="ml-2 p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                            title="Speak this instruction"
                          >
                            <FaVolumeUp className="text-sm" />
                          </button>
                        )}
                      </div>
                      {instruction.road && instruction.road !== 'Unnamed road' && (
                        <p className="text-xs text-gray-600 mb-1">
                          on <span className="font-medium">{instruction.road}</span>
                        </p>
                      )}
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {instruction.distance > 0 && (
                          <span className="flex items-center">
                            <FaRoute className="mr-1" />
                            {instruction.distance} km
                          </span>
                        )}
                        {instruction.time > 0 && (
                          <span>~{instruction.time} min</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getDirectionIcon(instruction.type, instruction.direction)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Navigation Controls */}
            {voiceEnabled && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Step {currentStepIndex + 1} of {routeInstructions.length}
                  </span>
                  {isSpeaking && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span>Speaking</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={speakPreviousStep}
                    disabled={currentStepIndex === 0}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FaArrowLeft />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={speakCurrentStep}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaPlay />
                    <span>Repeat</span>
                  </button>
                  <button
                    onClick={speakNextStep}
                    disabled={currentStepIndex === routeInstructions.length - 1}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Next</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          {/* Recenter on User Location Button */}
          <button
            onClick={handleRecenterOnUser}
            className={`p-3 rounded-lg shadow-lg transition-all flex items-center justify-center ${
              userLocation 
                ? 'bg-white text-blue-600 hover:bg-blue-50' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            title={userLocation ? "Center on my location" : "Enable location first"}
          >
            <FaCrosshairs className="text-xl" />
          </button>

          {/* Clear Route Button */}
          {showRouting && (
            <button
              onClick={handleClearRoute}
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all flex items-center space-x-2"
            >
              <FaTimes />
              <span>Clear</span>
            </button>
          )}
        </div>
      
      <MapContainer
        center={center}
        zoom={getZoom()}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker with pulsing circle */}
        {userLocation && (
          <>
            {/* Pulsing accuracy circle */}
            <Circle
              center={userLocation}
              radius={50}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.2,
                weight: 2,
                className: 'pulse-circle'
              }}
            />
            
            {/* User marker */}
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>
                <div className="text-center p-2">
                  <p className="font-bold text-green-600 mb-1">📍 Your Location</p>
                  <p className="text-xs text-gray-600">Real-time tracking active</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Recenter trigger */}
        {recenterTrigger && <RecenterMap center={recenterTrigger} />}

        {/* Store markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
            icon={getShopIcon(store.shop_type)}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-2">
                {/* Auto-generated banner */}
                {(() => {
                  const bannerData = generateStoreBanner(store.name, store.shop_type);
                  return (
                    <div className={`w-full h-32 bg-gradient-to-br ${bannerData.gradient} rounded-lg mb-3 flex items-center justify-center relative overflow-hidden`}>
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 37a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10-17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                      <div className="text-center z-10">
                        <div className="text-5xl mb-2">{bannerData.icon}</div>
                        <div className="text-sm font-bold text-white opacity-90">{bannerData.initials}</div>
                      </div>
                    </div>
                  );
                })()}

                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    store.shop_type === 'motorcycle_shop' ? 'bg-blue-100 text-blue-800' :
                    store.shop_type === 'vulcanizing_shop' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {store.shop_type === 'motorcycle_shop' ? '🏍️ Motorcycle Shop' :
                     store.shop_type === 'vulcanizing_shop' ? '🔧 Vulcanizing Shop' :
                     '⛽ Gas Station'}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2">{store.name}</h3>

                {store.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{store.description}</p>
                )}

                <div className="flex items-start text-sm text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                  <span>{store.address}, {store.city}</span>
                </div>

                <div className="flex items-center text-sm text-gray-700 mb-3">
                  <FaPhone className="mr-2 text-blue-600" />
                  <a href={`tel:${store.phone}`} className="hover:text-blue-600">{store.phone}</a>
                </div>

                {store.reviews && store.reviews.length > 0 && (
                  <div className="flex items-center mb-3">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">
                      {(store.reviews.reduce((acc, r) => acc + r.rating, 0) / store.reviews.length).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">({store.reviews.length})</span>
                  </div>
                )}

                <Link
                  to={`/stores/${store.id}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md mb-2"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleGetDirections(store)}
                  disabled={!userLocation}
                  className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FaRoute />
                  <span>{userLocation ? 'Get Directions' : 'Enable Location'}</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Routing */}
        {showRouting && userLocation && routeDestination && (
          <RoutingMachine
            userLocation={userLocation}
            destination={routeDestination}
            onRouteFound={(info) => setRouteInfo(info)}
            onInstructionsFound={(instructions) => setRouteInstructions(instructions)}
          />
        )}
      </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;

// Add custom styles for markers
const style = document.createElement('style');
style.textContent = `
  .custom-marker {
    background: transparent !important;
    border: none !important;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
  }
  
  .pulse-circle {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.1);
    }
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
