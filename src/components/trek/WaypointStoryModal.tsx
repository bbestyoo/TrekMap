import { X, MapPin, Mountain, Compass, ExternalLink, Camera, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { MapService } from '../../services/map/mapService';

interface Props {
  mapService: MapService | null;
}

export default function WaypointStoryModal({ mapService }: Props) {
  const activeWaypoint = useAppStore((s) => s.activeWaypoint);
  const setActiveWaypoint = useAppStore((s) => s.setActiveWaypoint);
  const selectedTrek = useAppStore((s) => s.selectedTrek);

  if (!activeWaypoint) return null;

  const handleFlyToWaypoint = () => {
    if (mapService && activeWaypoint) {
      mapService.flyToCoordinates(activeWaypoint.lng, activeWaypoint.lat, 14, 55);
    }
  };

  const getWaypointImage = () => {
    if (activeWaypoint.photo) return activeWaypoint.photo;
    // Default contextual images based on type/name
    if (activeWaypoint.type === 'landmark' || activeWaypoint.name.includes('Monastery')) {
      return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80';
    }
    if (activeWaypoint.type === 'pass') {
      return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';
    }
    if (activeWaypoint.type === 'viewpoint') {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1589182337358-2cb63099350c?w=800&q=80';
  };

  const getWaypointStory = () => {
    if (activeWaypoint.description) return activeWaypoint.description;
    
    // Rich fallback storytelling based on location
    if (activeWaypoint.name.includes('Namche')) {
      return 'The historic trading capital of the Khumbu region. Perched inside a horseshoe-shaped natural amphitheatre, Namche is the vibrant cultural heart of the Sherpa community, buzzing with Tibetan markets, bakeries, and gear shops.';
    }
    if (activeWaypoint.name.includes('Tengboche')) {
      return 'Home to the largest Gompa in the Everest region. Surrounded by pines, rhododendrons, and the majestic north face of Ama Dablam, monks hold daily puja chants here offering blessings for Himalayan climbers.';
    }
    if (activeWaypoint.name.includes('Thorong La')) {
      return 'At 5,416 metres, Thorong La is one of the highest trekking passes on Earth. Connecting the lush valleys of Manang with the arid Mustang desert, crossing this wind-swept saddle before sunrise is an unforgettable mountaineering milestone.';
    }
    if (activeWaypoint.name.includes('Kala Patthar')) {
      return 'The preeminent viewpoint for Mount Everest. Rising above Gorak Shep at 5,545 metres, Kala Patthar offers a panoramic vista of the Everest South Col, Lhotse, Nuptse, and the sprawling Khumbu glacier below.';
    }
    if (activeWaypoint.name.includes('Poon Hill')) {
      return 'World-famous sunrise viewpoint overlooking the Annapurna and Dhaulagiri ranges. At dawn, golden light hits the snow-capped summits of over 10 peaks exceeding 7,000 metres.';
    }
    return `An essential trail waypoint on the ${selectedTrek?.name || 'Himalayan'} trek, situated at an altitude of ${activeWaypoint.elevation.toLocaleString()} metres above sea level.`;
  };

  return (
    <div className="waypoint-story-card" role="dialog" aria-label="Waypoint Details">
      <div className="wsc-image-wrap">
        <img
          src={getWaypointImage()}
          alt={activeWaypoint.name}
          className="wsc-img"
          loading="lazy"
        />
        <div className="wsc-img-overlay" />
        <button
          className="wsc-close-btn"
          onClick={() => setActiveWaypoint(null)}
          aria-label="Close details"
        >
          <X size={16} />
        </button>
        <span className="wsc-type-pill">{activeWaypoint.type.toUpperCase()}</span>
      </div>

      <div className="wsc-body">
        <div className="wsc-title-row">
          <div>
            <h3 className="wsc-name">{activeWaypoint.name}</h3>
            <span className="wsc-trek-tag">{selectedTrek?.name}</span>
          </div>
          <div className="wsc-elev-tag">
            <Mountain size={14} />
            <span>{activeWaypoint.elevation.toLocaleString()} m</span>
          </div>
        </div>

        <p className="wsc-story">{getWaypointStory()}</p>

        <div className="wsc-meta-grid">
          {activeWaypoint.distanceFromStart !== undefined && (
            <div className="wsc-meta-item">
              <span className="wsc-meta-label">Distance from Trailhead</span>
              <span className="wsc-meta-val">{activeWaypoint.distanceFromStart} km</span>
            </div>
          )}
          <div className="wsc-meta-item">
            <span className="wsc-meta-label">Coordinates</span>
            <span className="wsc-meta-val font-mono text-xs">
              {activeWaypoint.lat.toFixed(4)}°N, {activeWaypoint.lng.toFixed(4)}°E
            </span>
          </div>
        </div>

        <div className="wsc-actions">
          <button className="wsc-flyto-btn" onClick={handleFlyToWaypoint}>
            <Compass size={15} />
            <span>Center 3D View Here</span>
          </button>
        </div>
      </div>
    </div>
  );
}
