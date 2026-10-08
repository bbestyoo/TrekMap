import { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  onIntroComplete?: () => void;
}

export default function CinematicIntro({ onIntroComplete }: Props) {
  const [stage, setStage] = useState<'globe' | 'zoom' | 'nepal' | 'complete'>('globe');
  const [progressText, setProgressText] = useState('Initializing satellite telemetry…');
  const isIntroPlaying = useAppStore((s) => s.isIntroPlaying);
  const setIsIntroPlaying = useAppStore((s) => s.setIsIntroPlaying);

  useEffect(() => {
    if (!isIntroPlaying) {
      setStage('complete');
      return;
    }

    const t1 = setTimeout(() => {
      setStage('zoom');
      setProgressText('Atmospheric entry over the Himalayas…');
    }, 1200);

    const t2 = setTimeout(() => {
      setStage('nepal');
      setProgressText('Calibrating 3D terrain & elevation profiles…');
    }, 2400);

    const t3 = setTimeout(() => {
      setStage('complete');
      setIsIntroPlaying(false);
      onIntroComplete?.();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isIntroPlaying, setIsIntroPlaying, onIntroComplete]);

  if (stage === 'complete' || !isIntroPlaying) return null;

  const handleSkip = () => {
    setStage('complete');
    setIsIntroPlaying(false);
    onIntroComplete?.();
  };

  return (
    <div className={`cinematic-intro-overlay stage-${stage}`}>
      <div className="intro-backdrop" />
      
      <div className="intro-hud">
        <div className="intro-badge">
          <Sparkles size={14} className="intro-sparkle" />
          <span>NEPAL 3D TERRAIN EXPLORER</span>
        </div>

        <h1 className="intro-title">
          <span className="himalaya-gradient">HIMALAYA</span>
          <span className="sub-title">TREK MAP</span>
        </h1>

        <p className="intro-tagline">
          Real topographic corridors • 3D summits • Elevation profiles
        </p>

        <div className="intro-loader-wrap">
          <div className="intro-progress-bar">
            <div className={`intro-progress-fill stage-${stage}`} />
          </div>
          <div className="intro-status-row">
            <span className="intro-status-text">
              <Compass size={13} className="spin-slow" />
              {progressText}
            </span>
            <span className="intro-coords">28.3949° N, 84.1240° E</span>
          </div>
        </div>

        <button className="intro-skip-btn" onClick={handleSkip}>
          Skip Intro ➔
        </button>
      </div>
    </div>
  );
}
