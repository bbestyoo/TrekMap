export default function AttributionBar() {
  return (
    <div className="attribution-bar" role="contentinfo" aria-label="Map data attribution">
      <span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</span>
      <span className="attr-sep">·</span>
      <span>© <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a></span>
      <span className="attr-sep">·</span>
      <span>Terrain: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener noreferrer">AWS Terrain Tiles</a></span>
      <span className="attr-sep">·</span>
      <span>Trek data: ODbL</span>
    </div>
  );
}
