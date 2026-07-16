import React, { useEffect, useState } from 'react';

const ScoreGauge = ({ score = 0, size = 160 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score count
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.min(score, Math.round((score / steps) * step));
      setAnimatedScore(current);
      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 50;
  const strokeWidth = 10;
  const sqSize = size;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const center = sqSize / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color based on score
  const getColor = (s) => {
    if (s >= 80) return 'var(--success)';
    if (s >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="gauge-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={viewBox} className="gauge-svg">
        <circle
          className="gauge-bg"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className="gauge-value"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          stroke={getColor(score)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.8s ease-in-out',
          }}
        />
      </svg>
      <div className="gauge-text">
        <div className="gauge-score" style={{ color: getColor(score) }}>
          {animatedScore}
        </div>
        <div className="gauge-label">Score</div>
      </div>
    </div>
  );
};

export default ScoreGauge;
