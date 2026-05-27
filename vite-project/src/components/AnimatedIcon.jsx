import { useEffect } from 'react';

export default function AnimatedIcon({ type, size = 52 }) {
  const normalizedType = {
    limites: 'limite',
    derivadas: 'derivada',
    aplicaciones: 'aplicacion',
  }[type] || type;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const key = `animated-icon-keyframes`;
    if (document.getElementById(key)) return;

    const style = document.createElement('style');
    style.id = key;
    style.textContent = `
      @keyframes drawStroke { to { stroke-dashoffset: 0; } }
      @keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 2px currentColor); opacity: 0.85; } 50% { filter: drop-shadow(0 0 8px currentColor); opacity: 1; } }
      @keyframes floatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes spinSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes flash { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      @keyframes scalePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    `;
    document.head.appendChild(style);
  }, []);

  const color =
    normalizedType === 'limite' ? '#0047CC' :
    normalizedType === 'derivada' ? '#2563EB' :
    '#059669';

  const bg = color + '12';

  const s = size - 12;
  const cx = s / 2;
  const cy = s / 2;

  const renderLimite = () => (
    <g fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={`M ${cx - 14} ${cy} C ${cx - 14} ${cy - 14}, ${cx - 4} ${cy - 14}, ${cx} ${cy} C ${cx + 4} ${cy + 14}, ${cx + 14} ${cy + 14}, ${cx + 14} ${cy} C ${cx + 14} ${cy - 14}, ${cx + 4} ${cy - 14}, ${cx} ${cy} C ${cx - 4} ${cy + 14}, ${cx - 14} ${cy + 14}, ${cx - 14} ${cy}`}
        strokeDasharray="120"
        strokeDashoffset="120"
        style={{ animation: 'drawStroke 1.8s ease-out forwards, pulseGlow 3s ease-in-out infinite 1.8s' }}
      />
      <circle cx={cx - 10} cy={cy - 6} r="2.5" fill={color} stroke="none" style={{ animation: 'floatUp 2s ease-in-out infinite' }} />
      <circle cx={cx + 10} cy={cy + 6} r="2.5" fill="#F4B400" stroke="none" style={{ animation: 'floatUp 2.2s ease-in-out infinite 0.4s' }} />
    </g>
  );

  const renderDerivada = () => (
    <g>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize={s * 0.55}
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill={color}
        style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
      >
        ∂
      </text>
      <circle
        cx={cx}
        cy={cy - 10}
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        style={{ animation: 'scalePulse 2s ease-in-out infinite' }}
      />
      <path
        d={`M ${cx - 12} ${cy + 16} Q ${cx} ${cy + 22} ${cx + 12} ${cy + 16}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="30"
        strokeDashoffset="30"
        style={{ animation: 'drawStroke 1.2s ease-out forwards 0.5s' }}
      />
    </g>
  );

  const renderAplicacion = () => (
    <g>
      <path
        d={`M ${cx} ${cy - 14} L ${cx + 6} ${cy - 2} L ${cx + 2} ${cy - 2} L ${cx + 10} ${cy + 10} L ${cx + 2} ${cy + 2} L ${cx - 2} ${cy + 2} L ${cx - 6} ${cy + 10} L ${cx - 2} ${cy - 2} L ${cx - 6} ${cy - 2} Z`}
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
      />
      <circle cx={cx - 10} cy={cy - 8} r="1.5" fill="#F4B400" style={{ animation: 'flash 1.5s ease-in-out infinite' }} />
      <circle cx={cx + 10} cy={cy + 2} r="1.5" fill="#F4B400" style={{ animation: 'flash 1.7s ease-in-out infinite 0.3s' }} />
      <circle cx={cx - 6} cy={cy + 12} r="1.5" fill="#F4B400" style={{ animation: 'flash 1.4s ease-in-out infinite 0.6s' }} />
    </g>
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: color,
        flexShrink: 0,
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        {normalizedType === 'limite' && renderLimite()}
        {normalizedType === 'derivada' && renderDerivada()}
        {normalizedType === 'aplicacion' && renderAplicacion()}
      </svg>
    </div>
  );
}
