import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Navigation, MapPin, Footprints, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { MapService } from '../../services/map/mapService';

interface Props {
  mapService: MapService | null;
}

export default function VirtualHikeControl({ mapService }: Props) {
  const selectedTrek = useAppStore((s) => s.selectedTrek);
  const isHikePlaying = useAppStore((s) => s.isHikePlaying);
  const hikeProgress = useAppStore((s) => s.hikeProgress);
  const hikeSpeed = useAppStore((s) => s.hikeSpeed);
  const currentHikePoint = useAppStore((s) => s.currentHikePoint);
  const startVirtualHike = useAppStore((s) => s.startVirtualHike);
  const pauseVirtualHike = useAppStore((s) => s.pauseVirtualHike);
  const setHikeProgress = useAppStore((s) => s.setHikeProgress);
  const setHikeSpeed = useAppStore((s) => s.setHikeSpeed);

  const timerRef = useRef<number | null>(null);

  // Animation Loop
  useEffect(() => {
    if (!isHikePlaying || !selectedTrek) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 60;
    const step = 0.35 * hikeSpeed;

    timerRef.current = window.setInterval(() => {
      setHikeProgress(Math.min(100, hikeProgress + step));
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHikePlaying, hikeProgress, hikeSpeed, selectedTrek, setHikeProgress]);

  // Stop when reaching 100%
  useEffect(() => {
    if (hikeProgress >= 100 && isHikePlaying) {
      pauseVirtualHike();
    }
  }, [hikeProgress, isHikePlaying, pauseVirtualHike]);

  // Sync camera / map point
  useEffect(() => {
    if (currentHikePoint && mapService) {
      mapService.updateHikerPosition(currentHikePoint.lng, currentHikePoint.lat);
    }
  }, [currentHikePoint, mapService]);

  if (!selectedTrek) return null;

  const handleTogglePlay = () => {
    if (isHikePlaying) {
      pauseVirtualHike();
    } else {
      if (hikeProgress >= 100) {
        setHikeProgress(0);
      }
      startVirtualHike();
    }
  };

  const handleReset = () => {
    pauseVirtualHike();
    setHikeProgress(0);
  };

  const cycleSpeed = () => {
    if (hikeSpeed === 1) setHikeSpeed(2);
    else if (hikeSpeed === 2) setHikeSpeed(4);
    else setHikeSpeed(1);
  };

  return (
    <div className="virtual-hike-panel" aria-label="Virtual Hike Simulator">
      <div className="vh-header">
        <div className="vh-title-tag">
          <Footprints size={14} className="text-emerald-400" />
          <span>Virtual Hike Mode</span>
        </div>
        <div className="vh-speed-toggle" onClick={cycleSpeed} title="Click to change playback speed">
          <FastForward size={12} />
          <span>{hikeSpeed}x</span>
        </div>
      </div>

      {/* Progress slider */}
      <div className="vh-timeline-wrap">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={hikeProgress}
          onChange={(e) => setHikeProgress(parseFloat(e.target.value))}
          className="vh-slider"
        />
        <div className="vh-track-fill" style={{ width: `${hikeProgress}%` }} />
      </div>

      {/* Live Hiker Telemetry */}
      <div className="vh-telemetry">
        <div className="vh-telemetry-col">
          <span className="vh-label">Current Position</span>
          <span className="vh-val font-semibold">
            {currentHikePoint?.nearestWaypoint?.name || selectedTrek.startPoint}
          </span>
        </div>
        <div className="vh-telemetry-col">
          <span className="vh-label">Altitude</span>
          <span className="vh-val text-emerald-300">
            ⛰ {currentHikePoint ? currentHikePoint.elevation.toLocaleString() : selectedTrek.stats.minElevationM} m
          </span>
        </div>
        <div className="vh-telemetry-col">
          <span className="vh-label">Progress</span>
          <span className="vh-val">
            Day {currentHikePoint?.dayNumber || 1} of {currentHikePoint?.totalDays || selectedTrek.stats.durationDays.max} ({Math.round(hikeProgress)}%)
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="vh-controls">
        <button className="vh-btn-secondary" onClick={handleReset} title="Reset to start">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        <button className={`vh-btn-primary ${isHikePlaying ? 'playing' : ''}`} onClick={handleTogglePlay}>
          {isHikePlaying ? (
            <>
              <Pause size={16} />
              <span>Pause Hike</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>{hikeProgress >= 100 ? 'Replay Hike' : 'Play Virtual Hike'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
