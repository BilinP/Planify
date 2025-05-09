import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import supabase from '@backend/supabaseClient';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './FindEvent.css';
import GoogleMapsProvider from '../../GoogleMapsProvider.jsx';
import defaultImg from '../../assets/Placeholder_PFP.png';

const bucketBaseUrl = 'https://gliujspizqdmlzvnkyfb.supabase.co/storage/v1/object/public/Planify/Event/';

const FindEvent = () => {
  const [events, setEvents] = useState([]);
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priceFilter, setPriceFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
      
      // For each event, get its image URL dynamically
      const processedEvents = await Promise.all(data.map(async (event) => {
        const fileName = await getEventImageFileName(event.event_id);
        return {
          ...event,
          image: fileName 
            ? `${bucketBaseUrl}${fileName}?width=1000&height=500&quality=100`
            : defaultImg
        };
      }));
      
      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getEventImageFileName = async (eventId) => {
    const { data, error } = await supabase
      .storage
      .from('Planify')
      .list('Event', { limit: 100 });
    if (error) {
      console.error('Error listing Event images:', error);
      return null;
    }
    const file = data.find(f => f.name.startsWith(`event_${eventId}.`));
    return file ? file.name : null;
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEventClick = (event) => {
    // Use event_id if it exists (from database), otherwise use id (from sample events)
    const eventId = event.event_id || event.id;
    navigate(`/Event/${eventId}`);
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
    setShowDatePicker(false);
  };

  // Update getFilteredEvents function
  const getFilteredEvents = () => {
    return events.filter(event => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const title = (event.event_title || event.title || '').toLowerCase();
        const location = (event.location || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        
        if (!title.includes(query) && !location.includes(query) && !description.includes(query)) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === 'free' && event.price > 0) return false;
      if (priceFilter === 'paid' && event.price === 0) return false;
      
      // Category filter
      if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;

      // Date filter
      if (dateFilter === 'today') {
        const today = new Date();
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === today.getFullYear() &&
               eventDate.getMonth() === today.getMonth() &&
               eventDate.getDate() === today.getDate();
      }
      if (dateFilter === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === tomorrow.getFullYear() &&
               eventDate.getMonth() === tomorrow.getMonth() &&
               eventDate.getDate() === tomorrow.getDate();
      }
      if (dateFilter === 'this-weekend') {
        const today = new Date();
        const eventDate = new Date(event.date);
        
        // Get the current day of the week (0 = Sunday, 6 = Saturday)
        const currentDay = today.getDay();
        
        // Calculate the start of the weekend (Saturday)
        const weekendStart = new Date(today);
        weekendStart.setDate(today.getDate() + (6 - currentDay));
        weekendStart.setHours(0, 0, 0, 0);
        
        // Calculate the end of the weekend (Sunday)
        const weekendEnd = new Date(weekendStart);
        weekendEnd.setDate(weekendStart.getDate() + 1);
        weekendEnd.setHours(23, 59, 59, 999);
        
        // Check if the event date falls within this weekend
        return eventDate >= weekendStart && eventDate <= weekendEnd;
      }
      if (dateFilter === 'this-week') {
        const today = new Date();
        const eventDate = new Date(event.date);
        const diffTime = Math.abs(eventDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (selectedDate) {
        const eventDate = new Date(event.date);
        const selectedDateObj = new Date(selectedDate);
        return eventDate.getFullYear() === selectedDateObj.getFullYear() &&
               eventDate.getMonth() === selectedDateObj.getMonth() &&
               eventDate.getDate() === selectedDateObj.getDate();
      }
      
      return true;
    });
  };

  // Update handleDateSelect function
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateFilter('custom');
    setShowDatePicker(false);
  };

  // Update handleDateFilterChange function
  const handleDateFilterChange = (filter) => {
    // If clicking the same filter that's already selected, clear it
    if (dateFilter === filter) {
      setDateFilter(null);
      setSelectedDate(null);
    } else {
      setDateFilter(filter);
      if (filter !== 'custom') {
        setSelectedDate(null);
      }
    }
  };

  // Add this function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering will happen automatically through getFilteredEvents
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
                <input 
                  type="checkbox" 
                  name="date" 
                  value="today" 
                  checked={dateFilter === 'today'}
                  onChange={() => handleDateFilterChange('today')}
                />
                <span>Today</span>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  name="date" 
                  value="tomorrow" 
                  checked={dateFilter === 'tomorrow'}
                  onChange={() => handleDateFilterChange('tomorrow')}
                />
                <span>Tomorrow</span>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  name="date" 
                  value="this-weekend" 
                  checked={dateFilter === 'this-weekend'}
                  onChange={() => handleDateFilterChange('this-weekend')}
                />
                <span>This weekend</span>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  name="date" 
                  value="this-week" 
                  checked={dateFilter === 'this-week'}
                  onChange={() => handleDateFilterChange('this-week')}
                />
                <span>This week</span>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  name="date" 
                  value="custom" 
                  checked={dateFilter === 'custom'}
                  onChange={() => {
                    if (dateFilter === 'custom') {
                      setDateFilter(null);
                      setSelectedDate(null);
                    } else {
                      setShowDatePicker(true);
                    }
                  }}
                />
                <span>
                  {selectedDate 
                    ? new Date(selectedDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : 'Pick a date...'}
                </span>
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
                <input 
                  type="checkbox" 
                  name="price" 
                  value="free" 
                  checked={priceFilter === 'free'}
                  onChange={() => setPriceFilter(priceFilter === 'free' ? null : 'free')}
                />
                <span>Free</span>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  name="price" 
                  value="paid" 
                  checked={priceFilter === 'paid'}
                  onChange={() => setPriceFilter(priceFilter === 'paid' ? null : 'paid')}
                />
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
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search for events..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
        
        <div className="events-scroll">
          {getFilteredEvents().map((event) => (
            <div 
              key={event.event_id || event.id} 
              className={`event-card`}
              onClick={() => handleEventClick(event)}
            >
              <img 
                src={event.image}
                alt={event.event_title || event.title} 
                className="event-image"
                onError={(e) => {
                  console.error('Image failed to load for event:', event.event_title || event.title);
                  e.target.src = defaultImg;
                }}
              />
              <div className="event-info">
                <h3>{event.event_title || event.title}</h3>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-location">{event.location ? event.location : "ONLINE"}</p>
                <p className="event-price">{(event.price === 0 || event.price === null) ? "FREE" : `$${event.price}`}</p>
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
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#FF0000',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                }}
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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="date-picker-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowDatePicker(false)}>×</button>
            <div className="date-picker-content">
              <h2>Select Date</h2>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                dateFormat="MMMM d, yyyy"
                inline
                maxDate={new Date(2025, 11, 31)}
                minDate={new Date(2024, 0, 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindEvent;
