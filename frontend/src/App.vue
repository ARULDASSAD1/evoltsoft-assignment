<template>
  <div class="app-container">
    <div class="header-container">
      <h1>Charging Stations</h1>
      <button @click="toggleSidebar" class="sidebar-toggle-btn">
        {{ isSidebarOpen ? 'Collapse' : 'Expand' }}
      </button>
    </div>
    <div class="main-content">
      <div class="map-container">
        <div id="map"></div>
      </div>
      <div class="stations-list-wrapper" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
        <div class="stations-list">
          <h2 v-if="chargers.length > 0">Available Stations</h2>
          <div v-for="charger in chargers" :key="charger._id" class="station-card">
            <h3>{{ charger.name }}</h3>
            <p>Status: {{ charger.status }} | Power: {{ charger.powerOutput }}kW</p>
          </div>
          <p v-if="chargers.length === 0" class="no-stations">No charging stations found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  data() {
    return {
      chargers: [],
      map: null,
      isSidebarOpen: true // Sidebar is open by default
    };
  },
  mounted() {
    this.initMap();
    this.fetchChargers();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.map);
    },
    async fetchChargers() {
      try {
        const res = await axios.get('http://localhost:3000/chargers');
        this.chargers = res.data;
        this.addMarkers();
      } catch (err) {
        console.error("API Error:", err);
      }
    },
    addMarkers() {
      this.chargers.forEach(charger => {
        L.marker([charger.location.lat, charger.location.lng])
          .addTo(this.map)
          .bindPopup(`<b>${charger.name}</b><br>Status: ${charger.status}`);
      });
    },
    handleResize() {
      if (this.map) {
        // Ensure the map resizes after DOM updates, especially for sidebar toggle
        this.$nextTick(() => {
          setTimeout(() => { // Debounce or ensure element is visible
            this.map.invalidateSize();
          }, 100); // Adjust delay if needed
        });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.handleResize(); // Call map resize when sidebar toggles
    }
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* Removed padding: 20px; to allow full height content */
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa; /* Light grey background for header */
  border-bottom: 1px solid #dee2e6; /* Subtle border */
}

.main-content {
  display: flex;
  flex: 1; /* Takes remaining height */
  overflow: hidden; /* Prevents scrollbars on main content itself */
}

.map-container {
  flex: 1; /* Takes available space */
  position: relative;
  /* Removed margin-bottom, border, border-radius as it's now full height */
  height: 100%; /* Ensure map container takes full height of main-content */
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%; /* Ensure map itself takes full height */
  width: 100%;
}

.stations-list-wrapper {
  width: 350px; /* Default width for the sidebar */
  height: 100%; /* Takes full height of main-content */
  background: #ffffff; /* Cleaner background */
  border-left: 1px solid #dee2e6; /* Border to separate from map */
  transition: width 0.3s ease-in-out;
  overflow-y: auto; /* Scroll for station list if content exceeds height */
  display: flex;
  flex-direction: column;
}

.stations-list-wrapper.sidebar-collapsed {
  width: 0;
  padding-left: 0; /* Remove padding when collapsed */
  padding-right: 0; /* Remove padding when collapsed */
  border-left: none; /* Hide border when collapsed */
  overflow: hidden; /* Hide content when collapsed */
}

.stations-list {
  padding: 15px;
  /* Removed max-height, specific background and border-radius as wrapper handles it */
  flex-grow: 1; /* Allows the list to take available space in wrapper */
}

.station-card {
  background: #f8f9fa; /* Lighter card background */
  padding: 10px 15px; /* Adjusted padding */
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #e9ecef; /* Subtle border for cards */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Softer shadow */
}

.no-stations {
  color: #6c757d; /* Softer color for placeholder text */
  font-style: italic;
  text-align: center;
  padding: 20px;
}

h1 {
  margin: 0; /* Remove default margin from h1 */
  font-size: 1.5rem; /* Adjust size as needed */
}

.sidebar-toggle-btn {
  padding: 8px 15px;
  background-color: #007bff; /* Bootstrap primary blue */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.sidebar-toggle-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Ensure h2 in sidebar has some margin */
.stations-list h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #343a40; /* Darker heading color */
}
</style>