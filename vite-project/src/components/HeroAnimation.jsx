import { useEffect, useRef, useState } from 'react';

export default function MountainSlopeInteractive() {
  const containerRef = useRef(null);
  const [mouseX, setMouseX] = useState(250); // Centro del nuevo espacio (500 / 2)
  const [isExpanded, setIsExpanded] = useState(false);

  // Manejador del movimiento del mouse o gestos táctiles
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    // Calcular posición relativa dentro del contenedor
    const relativeX = clientX - rect.left;
    
    // Mapear la coordenada del DOM al espacio fijo extendido del SVG (0 a 500)
    let svgX = (relativeX / rect.width) * 500;

    // RESTRICCIÓN: Evita que el punto se salga de la curva adaptada (límites 70 a 430)
    svgX = Math.max(70, Math.min(430, svgX));

    setMouseX(svgX);
  };

  // Curva matemática de la montaña desplazada hacia abajo (k modificado de 90 a 125)
  const h = 250;
  const k = 125; 
  const a = 0.00385; // Ajuste leve de curvatura para mantener proporciones visuales óptimas

  const pointX = mouseX;
  const pointY = a * Math.pow(pointX - h, 2) + k;

  // Adaptación del sistema de coordenadas SVG al plano cartesiano educativo
  const mathX = Math.round(pointX);
  const mathY = Math.round(300 - pointY);

  // Pendiente exacta (Derivada)
  const slope = 2 * a * (pointX - h);
  const userSlope = -slope; // Inversión visual para la interfaz educativa

  // Segmentos de la línea tangente ajustados simétricamente
  const tanX1 = pointX - 70;
  const tanY1 = pointY - slope * 70;
  const tanX2 = pointX + 70;
  const tanY2 = pointY + slope * 70;

  // Clasificación de estados visuales según el valor de la pendiente
  let slopeText = 'Terreno plano';
  let slopeColor = '#F4B400';

  if (slope < -0.25) {
    slopeText = 'Subiendo rápido ↑';
    slopeColor = '#34D399';
  } else if (slope < -0.06) {
    slopeText = 'Subiendo ↑';
    slopeColor = '#6EE7B7';
  } else if (slope > 0.25) {
    slopeText = 'Bajando rápido ↓';
    slopeColor = '#F87171';
  } else if (slope > 0.06) {
    slopeText = 'Bajando ↓';
    slopeColor = '#FCA5A5';
  }

  // Inyección única de keyframes globales para las animaciones estéticas
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const key = 'mountain-animation-styles';
    if (document.getElementById(key)) return;

    const style = document.createElement('style');
    style.id = key;
    style.textContent = `
      @keyframes drawCurve { from { stroke-dashoffset: 900; } to { stroke-dashoffset: 0; } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleExpand = (e) => {
    if (e) e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleBackdropClick = (e) => {
    if (isExpanded && e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* CAPA DE FONDO / BACKDROP */}
      <div 
        onClick={handleBackdropClick}
        style={{
          ...styles.containerMaster,
          ...(isExpanded ? styles.expandedBackdrop : {})
        }}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          style={{
            ...styles.wrap,
            ...(isExpanded ? styles.expandedCard : {})
          }}
        >
          {/* Botón de control de tamaño */}
          <button
            onClick={toggleExpand}
            style={styles.expandBtn}
            aria-label={isExpanded ? "Cerrar pantalla completa" : "Abrir pantalla completa"}
          >
            {isExpanded ? '✕' : '⛶'}
          </button>

          {/* Guía inferior flotante */}
          {!isExpanded && (
            <div style={styles.instruction}>
              Mueve el cursor para explorar la montaña
            </div>
          )}

          <svg
            viewBox="0 0 500 300"
            preserveAspectRatio="xMidYMid meet" 
            style={{
              ...styles.svg,
              ...(isExpanded ? styles.svgExpanded : {})
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Rejilla de fondo adaptada al espacio extendido */}
            {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x) => (
              <line key={`v-${x}`} x1={x} y1="20" x2={x} y2="280" stroke="rgba(255,255,255,0.04)" />
            ))}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={`h-${y}`} x1="20" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.04)" />
            ))}

            {/* Curva desplazada hacia abajo (Vértice y=125, Base y=250) */}
            <path
              d="M 70 250 Q 250 125 430 250"
              fill="none"
              stroke="url(#mountainGradient)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="900"
              strokeDashoffset="900"
              filter="url(#glow)"
              style={{ animation: 'drawCurve 2s ease-out forwards' }}
            />

            {/* Línea tangente interactiva */}
            <line
              x1={tanX1}
              y1={tanY1}
              x2={tanX2}
              y2={tanY2}
              stroke={slopeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Coordenadas flotantes del punto interactivo (P = (x, f(x))) */}
            <g style={{ transition: 'transform 0.1s ease' }}>
              <rect 
                x={pointX - 45} 
                y={pointY - 32} 
                width="90" 
                height="18" 
                rx="5" 
                fill="rgba(6, 11, 20, 0.85)" 
                stroke={slopeColor} 
                strokeWidth="1"
              />
              <text 
                x={pointX} 
                y={pointY - 19} 
                textAnchor="middle" 
                fill="white" 
                fontSize="10" 
                fontFamily="monospace"
              >
                P({mathX}, {mathY})
              </text>
            </g>

            {/* Punto móvil */}
            <circle
              cx={pointX}
              cy={pointY}
              r="7.5"
              fill={slopeColor}
              filter="url(#glow)"
              style={{
                transformOrigin: `${pointX}px ${pointY}px`,
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />

            {/* TEXTOS IZQUIERDA: Ubicados de manera fija en el bloque superior seguro */}
            <g style={{ animation: 'fadeIn 1s ease-out forwards', opacity: 0 }}>
              <text x="20" y="35" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                Posición actual
              </text>
              <text x="20" y="52" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="sans-serif">
                Evaluación f(x):
              </text>
              <text x="20" y="68" fill="#60A5FA" fontSize="11" fontWeight="600" fontFamily="monospace">
                f({mathX}) = -0.0039({mathX} - 250)² + 175
                <tspan x="20" dy="14" fill="#3B82F6" fontWeight="bold">= {mathY} m</tspan>
              </text>
            </g>

            {/* TEXTOS DERECHA: Datos analíticos de la derivada */}
            <g style={{ textAnchor: 'end' }}>
              <text x="480" y="35" fill={slopeColor} fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                {slopeText}
              </text>
              <text x="480" y="52" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="sans-serif">
                Razón de cambio f'(x):
              </text>
              <text x="480" y="68" fill={slopeColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
                f'({mathX}) = -0.0077 · ({mathX} - 250)
                <tspan x="480" dy="14" fill="white" fontWeight="600">m = {userSlope.toFixed(2)}</tspan>
              </text>
            </g>

            {/* Etiquetas de guía internas reajustadas a la nueva altura */}
            <text x="440" y="270" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">
              Camino (Eje X)
            </text>
            <text x="250" y="150" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">
              Cima f'({h}) = 0
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}

const styles = {
  containerMaster: {
    display: 'contents',
  },
  expandedBackdrop: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(3, 7, 18, 0.85)', 
    backdropFilter: 'blur(16px)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
    animation: 'fadeIn 0.2s ease-out',
    padding: '12px'
  },
  wrap: {
    width: '100%',
    height: '320px',
    borderRadius: '18px',
    overflow: 'hidden',
    position: 'relative',
    background: 'linear-gradient(135deg, #060B14 0%, #0A192F 100%)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px'
  },
  expandedCard: {
    width: '96vw',
    height: '92vh',
    maxWidth: '1400px',
    maxHeight: '900px',
    borderRadius: '24px',
    boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
    animation: 'fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    pointerEvents: 'auto',
    padding: '50px 24px 24px 24px'
  },
  svg: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    display: 'block',
    userSelect: 'none',
  },
  svgExpanded: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  expandBtn: {
    position: 'absolute',
    top: '18px',
    right: '18px',
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    zIndex: 10,
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instruction: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.5)',
    color: 'rgba(255,255,255,0.8)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '11px',
    fontFamily: 'sans-serif',
    pointerEvents: 'none'
  }
};