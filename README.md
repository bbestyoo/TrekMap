# Himalaya Trek Explorer

An interactive map-based explorer for trekking routes in the Nepal Himalaya.
Route geometry, waypoints, and elevation profiles are fetched live from open
APIs — no hardcoded trail coordinates.

## Features

- 🗺️ Interactive MapLibre map with terrain, satellite, and vector views
- 🥾 9 curated Nepal treks (EBC, Annapurna Circuit, Langtang, Manaslu, etc.)
- 📡 **Live route data** from OpenStreetMap via the Overpass API
- ⛰️ **Live elevation profiles** from NASA SRTM 30m data via OpenTopoData
- 📍 Auto-discovered waypoints (villages, huts, passes, peaks) from OSM
- 🔍 Search across treks, places, and loaded waypoints
- 💾 7-day localStorage cache for offline-friendly repeat visits
- 📊 Elevation chart with hover-synced waypoint highlighting

## Tech Stack

- **React + TypeScript + Vite**
- **Zustand** for state management
- **MapLibre GL JS** for the map
- **Overpass API** for OSM route geometry and waypoints
- **OpenTopoData** (SRTM 30m) for elevation sampling

## Getting Started

```bash
npm install
npm run dev