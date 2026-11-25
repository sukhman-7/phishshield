import { getVerdictMeta } from '../utils/verdicts';

/**
 * SVG radial threat score gauge (0-100) colored by verdict tone.
 */
export function ThreatGauge({ score = 0, verdict = '' }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const { color } = getVerdictMeta(verdict);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="gauge-wrap" aria-label={`Threat score ${clamped} out of 100`}>
      <svg className="gauge-svg" viewBox="0 0 84 84">
        <circle className="gauge-track" cx="42" cy="42" r={radius} />
        <circle
          className="gauge-progress"
          cx="42"
          cy="42"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score">{clamped}</span>
        <span className="gauge-unit">/ 100</span>
      </div>
    </div>
  );
}
