import { useEffect, useRef } from 'react';

export default function HeroAnimation() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const key = 'hero-animation-keyframes';
    if (document.getElementById(key)) return;

    const style = document.createElement('style');
    style.id = key;
    style.textContent = `
      @keyframes drawCurve { 0% { stroke-dashoffset: 400; } 100% { stroke-dashoffset: 0; } }
      @keyframes moveTangent { 0% { transform: translateX(-60px); } 50% { transform: translateX(0px); } 100% { transform: translateX(60px); } }
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes pulsePoint { 0%, 100% { r: 3; opacity: 0.6; } 50% { r: 5; opacity: 1; } }
      @keyframes orbitParticle { 0% { transform: rotate(0deg) translateX(18px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); } }
      @keyframes shimmerGrid { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
      @keyframes floatLabel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.wrap}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 280"
        style={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#F4B400" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <linearGradient id="tangentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(244,180,0,0)" />
            <stop offset="50%" stopColor="#F4B400" />
            <stop offset="100%" stopColor="rgba(244,180,0,0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid background */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <line key={`vx${x}`} x1={x} y1="20" x2={x} y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="1" style={{ animation: 'shimmerGrid 4s ease-in-out infinite' }} />
        ))}
        {[20, 60, 100, 140, 180, 220, 260].map((y) => (
          <line key={`hy${y}`} x1="20" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" style={{ animation: 'shimmerGrid 4s ease-in-out infinite' }} />
        ))}

        {/* Axes */}
        <line x1="200" y1="20" x2="200" y2="260" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

        {/* Parabola f(x)=x²/90 */}
        <path
          d="M 60 240 Q 130 60 200 40 Q 270 60 340 240"
          fill="none"
          stroke="url(#curveGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset="400"
          filter="url(#glow)"
          style={{ animation: 'drawCurve 2.5s ease-out forwards' }}
        />

        {/* Tangent line that moves */}
        <g style={{ animation: 'moveTangent 6s ease-in-out infinite' }}>
          <line x1="140" y1="80" x2="260" y2="160" stroke="url(#tangentGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8,4" />
          <circle cx="200" cy="120" r="5" fill="#F4B400" filter="url(#glow)" />
        </g>

        {/* Points approaching from both sides */}
        <circle cx="160" cy="180" r="3" fill="#fff" style={{ animation: 'pulsePoint 2s ease-in-out infinite' }} />
        <circle cx="180" cy="140" r="3" fill="#fff" style={{ animation: 'pulsePoint 2s ease-in-out infinite 0.3s' }} />
        <circle cx="220" cy="140" r="3" fill="#fff" style={{ animation: 'pulsePoint 2s ease-in-out infinite 0.6s' }} />
        <circle cx="240" cy="180" r="3" fill="#fff" style={{ animation: 'pulsePoint 2s ease-in-out infinite 0.9s' }} />

        {/* Orbiting particles */}
        <g style={{ transformOrigin: '200px 120px', animation: 'orbitParticle 8s linear infinite' }}>
          <circle cx="200" cy="120" r="2.5" fill="#F4B400" opacity="0.8" />
        </g>
        <g style={{ transformOrigin: '200px 120px', animation: 'orbitParticle 10s linear infinite reverse' }}>
          <circle cx="200" cy="120" r="2" fill="#60A5FA" opacity="0.7" />
        </g>

        {/* Labels */}
        <text x="200" y="275" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="'Inter', sans-serif" style={{ animation: 'fadeIn 1.5s ease-out forwards 2s', opacity: 0 }}>x</text>
        <text x="390" y="204" textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="'Inter', sans-serif" style={{ animation: 'fadeIn 1.5s ease-out forwards 2.2s', opacity: 0 }}>f(x)</text>

        <text x="60" y="30" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="bold" fontFamily="'Poppins', sans-serif" style={{ animation: 'fadeIn 1.5s ease-out forwards 1.5s', opacity: 0, fontStyle: 'italic' }}>
          lim
          <tspan baselineShift="sub" fontSize="10">x→a</tspan>
          <tspan dx="4">f(x) = L</tspan>
        </text>

        <text x="280" y="100" fill="#F4B400" fontSize="13" fontWeight="600" fontFamily="'Poppins', sans-serif" style={{ animation: 'fadeIn 1.5s ease-out forwards 2.5s', opacity: 0 }}>
          f'(x) = pendiente
        </text>
      </svg>
    </div>
  );
}

const styles = {
  wrap: {
    width: '100%',
    height: '300px',
    borderRadius: '20px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0A1628 0%, #003399 50%, #0047CC 100%)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    position: 'relative',
  },
  svg: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};
