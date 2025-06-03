<template>
  <div class="app-container">
    <h1>Charging Stations</h1>
    <div class="map-container">
      <div id="map"></div>
    </div>
    <div class="stations-list">
      <h2 v-if="chargers.length > 0">Available Stations</h2>
      <div v-for="charger in chargers" :key="charger._id" class="station-card">
        <h3>{{ charger.name }}</h3>
        <p>Status: {{ charger.status }} | Power: {{ charger.powerOutput }}kW</p>
      </div>
      <p v-if="chargers.length === 0" class="no-stations">No charging stations found</p>
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
      map: null
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
        const res = await axios.get('https://evoltsoft-assignment-8enw.onrender.com/chargers');
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
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.map-container {
  flex: 1;
  position: relative;
  margin-bottom: 20px;
  border: 1px solid #000000;
  border-radius: 8px;
  overflow: hidden;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.stations-list {
  max-height: 30vh;
  overflow-y: auto;
  padding: 10px;
  background: #37e083;
  border-radius: 8px;
}

.station-card {
  background: rgb(213, 98, 98);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-stations {
  color: #3c0909;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}
</style>