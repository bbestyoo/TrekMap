import type { Waypoint } from '../../types';

interface Props {
  waypoint: Waypoint;
}

export default function WaypointPopup({ waypoint }: Props) {
  const typeLabel: Record<string, string> = {
    start: 'Starting Point',
    finish: 'Destination',
    village: 'Village',
    camp: 'Camp',
    pass: 'Mountain Pass',
    viewpoint: 'Viewpoint',
    landmark: 'Landmark',
    basecamp: 'Base Camp',
    teahouse: 'Tea House',
    checkpoint: 'Checkpoint',
  };

  return (
    <div className="waypoint-popup">
      <div className="wp-popup-type">{typeLabel[waypoint.type] ?? waypoint.type}</div>
      <div className="wp-popup-name">{waypoint.name}</div>
      <div className="wp-popup-elevation">⛰ {waypoint.elevation.toLocaleString()} m</div>
      {waypoint.distanceFromStart !== undefined && (
        <div className="wp-popup-distance">📍 {waypoint.distanceFromStart} km from start</div>
      )}
      {waypoint.description && (
        <p className="wp-popup-desc">{waypoint.description}</p>
      )}
    </div>
  );
}
