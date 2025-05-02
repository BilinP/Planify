import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import supabase from '@backend/supabaseClient';
import './FindEvent.css';
import GoogleMapsProvider from '../../GoogleMapsProvider.jsx';

// Import images
import bakingImg from '../../assets/BakingIMG.png';
import countDownImg from '../../assets/CountDown.png';
import fundraiserImg from '../../assets/FUNdraiser.png';
import rhythmImg from '../../assets/Rhythm.png';
import brazilianDanceImg from '../../assets/braziliandance.png';
import graduationImg from '../../assets/graduationceremony.png';
import singImg from '../../assets/sing.png';
import defaultImg from '../../assets/Placeholder_PFP.png';

const FindEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentLocation, setCurrentLocation] = useState('Santa Clarita, CA');
  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState('Santa Clarita, CA');
  const [mapCenter, setMapCenter] = useState({
    lat: 34.3917,
    lng: -118.5426
  });
  const [locationMarker, setLocationMarker] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    date: true,
    price: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const categories = [
    { id: 'business', label: 'Business' },
    { id: 'food', label: 'Food & Drink' },
    { id: 'health', label: 'Health' },
    { id: 'music', label: 'Music' },
    { id: 'community', label: 'Community' }
  ];

  useEffect(() => {
    fetchEvents();

    // Try to get user's current location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setLocationMarker({ lat: latitude, lng: longitude });
          
          // Use Google Maps Geocoder to reverse geocode current lat/lng
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const addressComponents = results[0].address_components;
              // Look for a "locality" or city identifier.
              const cityComponent = addressComponents.find(component =>
                component.types.includes("locality") || component.types.includes("administrative_area_level_2")
              );
              if (cityComponent) {
                setCurrentLocation(cityComponent.long_name);
                setTempLocation(cityComponent.long_name);
              } else {
                setCurrentLocation(results[0].formatted_address);
                setTempLocation(results[0].formatted_address);
              }
            } else {
              console.error('Geocoder failed due to: ' + status);
            }
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('EventTable')
        .select('*');
      if (error) throw error;
      console.log('Fetched events:', data);
      
      // If no events found, use sample events
      if (!data || data.length === 0) {
        const sampleEvents = [
          {
            id: 1,
            title: "Baking Workshop",
            date: new Date().toISOString(),
            location: "Santa Clarita Community Center",
            price: 25,
            latitude: 34.3917,
            longitude: -118.5426,
            image: bakingImg
          },
          {
            id: 2,
            title: "Brazilian Dance Class",
            date: new Date().toISOString(),
            location: "Dance Studio",
            price: 30,
            latitude: 34.3917,
            longitude: -118.5426,
            image: brazilianDanceImg
          },
          {
            id: 3,
            title: "Graduation Ceremony 2024",
            date: new Date().toISOString(),
            location: "City Hall",
            price: 0,
            latitude: 34.3917,
            longitude: -118.5426,
            image: graduationImg
          },
          {
            id: 4,
            title: "Countdown Party",
            date: new Date().toISOString(),
            location: "Event Center",
            price: 45,
            latitude: 34.3917,
            longitude: -118.5426,
            image: countDownImg
          },
          {
            id: 5,
            title: "Community Fundraiser",
            date: new Date().toISOString(),
            location: "Community Park",
            price: 15,
            latitude: 34.3917,
            longitude: -118.5426,
            image: fundraiserImg
          },
          {
            id: 6,
            title: "Rhythm & Blues Night",
            date: new Date().toISOString(),
            location: "Music Hall",
            price: 35,
            latitude: 34.3917,
            longitude: -118.5426,
            image: rhythmImg
          },
          {
            id: 7,
            title: "Sing Along Event",
            date: new Date().toISOString(),
            location: "Auditorium",
            price: 20,
            latitude: 34.3917,
            longitude: -118.5426,
            image: singImg
          }
        ];
        setEvents(sampleEvents);
      } else {
        // For real events from database, keep using defaultImg as fallback
        const eventsWithDefaultImage = data.map(event => ({
          ...event,
          image: defaultImg
        }));
        setEvents(eventsWithDefaultImage);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLocationEdit = () => {
    console.log('Starting edit, current location:', currentLocation);
    setTempLocation(currentLocation);
    setIsLocationEditing(true);
  };

  const geocodeLocation = async (address) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const { lat, lng } = result.geometry.location;
      const newCenter = {
        lat: lat(),
        lng: lng()
      };
      
      setMapCenter(newCenter);
      setLocationMarker(newCenter);
      
      console.log('Location geocoded:', newCenter);
      return true;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return false;
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting new location:', tempLocation);
    
    const success = await geocodeLocation(tempLocation);
    if (success) {
      setCurrentLocation(tempLocation);
      setIsLocationEditing(false);
    } else {
      alert('Could not find the specified location. Please try again.');
    }
  };

  const handleLocationKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLocationSubmit(e);
    }
  };

  // Function to get the appropriate image based on event title
  const getEventImage = (title) => {
    const titleLower = title?.toLowerCase() || '';
    console.log('Looking for image for title:', titleLower); // Debug log
    
    // Check for exact matches first
    if (titleLower.includes('baking')) {
        console.log('Found baking image, path:', bakingImg);
        return bakingImg;
    }
    if (titleLower.includes('brazilian dance') || titleLower.includes('dance class')) {
        console.log('Found brazilian dance image, path:', brazilianDanceImg);
        return brazilianDanceImg;
    }
    if (titleLower.includes('graduation')) {
        console.log('Found graduation image, path:', graduationImg);
        return graduationImg;
    }
    if (titleLower.includes('countdown')) {
        console.log('Found countdown image, path:', countDownImg);
        return countDownImg;
    }
    if (titleLower.includes('fundraiser')) {
        console.log('Found fundraiser image, path:', fundraiserImg);
        return fundraiserImg;
    }
    if (titleLower.includes('rhythm')) {
        console.log('Found rhythm image, path:', rhythmImg);
        return rhythmImg;
    }
    if (titleLower.includes('sing')) {
        console.log('Found sing image, path:', singImg);
        return singImg;
    }
    
    console.log('No matching image found, using default:', defaultImg);
    return defaultImg;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Load cart from localStorage or initialize empty cart
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  };

  // Save cart to localStorage
  const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleAddToCart = (event) => {
    const cart = loadCart();
    
    // Check if event is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === event.id);
    
    if (existingItemIndex !== -1) {
      // If event exists, increment quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If event doesn't exist, add it with quantity 1
      cart.push({
        id: event.id,
        title: event.title,
        price: event.price,
        image: event.image,
        date: event.date,
        location: event.location,
        quantity: 1
      });
    }
    
    // Save updated cart
    saveCart(cart);
    
    // Show success message or feedback
    alert('Event added to cart successfully!');
    
    // Close the modal
    closeModal();
  };

  return (
    <div className="find-event-container">
      {/* Left side - Filters */}
      <div className="filters-sidebar">
        <div className="filter-section">
          <h3 onClick={() => toggleSection('category')}>
            Category
            <span className="section-toggle">
              {expandedSections.category ? '▼' : '▶'}
            </span>
          </h3>
          {expandedSections.category && (
            <div className="filter-options">
              <div className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="All"
                  checked={selectedCategory === 'All'}
                  onChange={() => setSelectedCategory('All')}
                />
                <span>All</span>
              </div>
              {categories.map(category => (
                <div className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                  />
                  <span>{category.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="filter-section">
          <h3 onClick={() => toggleSection('date')}>
            Date
            <span className="section-toggle">
              {expandedSections.date ? '▼' : '▶'}
            </span>
          </h3>
          {expandedSections.date && (
            <div className="filter-options">
              <div className="filter-option">
                <input type="radio" name="date" value="today" />
                <span>Today</span>
              </div>
              <div className="filter-option">
                <input type="radio" name="date" value="tomorrow" />
                <span>Tomorrow</span>
              </div>
              <div className="filter-option">
                <input type="radio" name="date" value="this-weekend" />
                <span>This weekend</span>
              </div>
              <div className="filter-option">
                <input type="radio" name="date" value="this-week" />
                <span>This week</span>
              </div>
              <div className="filter-option">
                <input type="radio" name="date" value="custom" />
                <span>Pick a date...</span>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <h3 onClick={() => toggleSection('price')}>
            Price
            <span className="section-toggle">
              {expandedSections.price ? '▼' : '▶'}
            </span>
          </h3>
          {expandedSections.price && (
            <div className="filter-options">
              <div className="filter-option">
                <input type="checkbox" name="price" value="free" />
                <span>Free</span>
              </div>
              <div className="filter-option">
                <input type="checkbox" name="price" value="paid" />
                <span>Paid</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle - Events List */}
      <div className="events-list">
        <div className="events-header">
          <div className="location-header">
            {!isLocationEditing ? (
              <h1 className="location-display">
                {currentLocation}
                <button className="edit-location-btn" onClick={handleLocationEdit}>
                  Change
                </button>
              </h1>
            ) : (
              <form onSubmit={handleLocationSubmit} className="location-form">
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  onKeyPress={handleLocationKeyPress}
                  className="location-input"
                  autoFocus
                  placeholder="Enter location..."
                />
                <button type="submit" className="save-location-btn">
                  Save
                </button>
              </form>
            )}
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for events..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="events-scroll">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`event-card ${selectedEvent?.id === event.id ? 'selected' : ''}`}
              onClick={() => handleEventClick(event)}
            >
              <img 
                src={event.image}
                alt={event.title} 
                className="event-image"
                onError={(e) => {
                  console.error('Image failed to load for event:', event.title);
                  e.target.src = defaultImg;
                }}
              />
              <div className="event-info">
                <h3>{event.title}</h3>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-location">{event.location}</p>
                <p className="event-price">${event.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Map */}
      <div className="map-container">
      <GoogleMapsProvider>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
          >
            {/* Location marker */}
            {locationMarker && (
              <Marker
                position={locationMarker}
                icon={
                  mapsLoaded
                    ? {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#FF0000',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2
                      }
                    : undefined
                }
              />
            )}
            
            {/* Event markers */}
            {events.map((event) => (
              <Marker
                key={event.id}
                position={{
                  lat: event.latitude || mapCenter.lat,
                  lng: event.longitude || mapCenter.lng
                }}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </GoogleMap>
        </GoogleMapsProvider>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="event-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>×</button>
            <div className="modal-content">
              <div className="modal-image-container">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = defaultImg;
                  }}
                />
              </div>
              <div className="modal-details">
                <h2>{selectedEvent.title}</h2>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <p>{new Date(selectedEvent.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <p>{selectedEvent.location}</p>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <p>${selectedEvent.price}</p>
                </div>
                <div className="event-actions">
                  <button className="action-button" onClick={() => handleAddToCart(selectedEvent)}>Add to Cart</button>
                  <button className="action-button secondary">Share Event</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindEvent;
