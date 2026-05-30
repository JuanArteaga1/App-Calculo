import { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate, derivative } from 'mathjs';
import { resolverConIA } from '../services/openaiService';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';
import TablaAproximacion from './graficos/TablaAproximacion';

export default function GraphZone({ modo = 'limite', subtipo = '', title = 'Laboratorio de Graficación' }) {
  const defaults = modo === 'limite'
    ? { fn: '(x^2 - 4)/(x - 2)', a: '2', x0: '2', h: '0.5' }
    : { fn: 'x^2', a: '2', x0: '2', h: '0.5' };

  const [fn, setFn] = useState(defaults.fn);
  const [a, setA] = useState(defaults.a);
  const [x0, setX0] = useState(defaults.x0);
  const [h, setH] = useState(defaults.h);
  const [resultado, setResultado] = useState(null);
  const [tablaData, setTablaData] = useState([]);
  const [vista, setVista] = useState('grafica');
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Desplazamiento del centro de la gráfica (para arrastrar y mover)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Estados para interactividad dinámica (Ventana flotante / Tooltip)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, mathX: 0, mathY: 0, visible: false });
  const [iaAbierta, setIaAbierta] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaRespuesta, setIaRespuesta] = useState('');
  const [iaError, setIaError] = useState('');

  const plotAreaRef = useRef(null); 
  const svgRef = useRef(null);
  const staticGroupRef = useRef(null); 
  const mathRef = useRef(null);

  // Guardar referencias de escalado para la interactividad síncrona
  const scalesRef = useRef({ scaleX: (x) => 0, scaleY: (y) => 0, invertX: (px) => 0, xMin: 0, xMax: 0, yMin: 0, yMax: 0 });

  useEffect(() => {
    if (mathRef.current && iaRespuesta) {
      renderMathInElement(mathRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
        errorColor: '#DC2626',
      });
    }
  }, [iaRespuesta]);

  const safeEvaluate = useCallback((expr, vars) => {
    try {
      const value = evaluate(expr, vars);
      return typeof value === 'number' ? value : Number(value);
    } catch {
      return null;
    }
  }, []);

  const safeDerivative = useCallback((expr) => {
    try { return derivative(expr, 'x').toString(); } catch { return null; }
  }, []);

  const getFocusPoint = useCallback(() => {
    if (modo === 'limite') return Number.parseFloat(a) || 0;
    if (modo === 'derivada') return Number.parseFloat(x0) || 0;
    return 0;
  }, [a, x0, modo]);

  const drawEmptyGraph = useCallback(() => {
    const svg = svgRef.current;
    const staticGroup = staticGroupRef.current;
    if (!svg || !staticGroup) return;

    const width = svg.clientWidth || 680;
    const height = svg.clientHeight || 360;
    const padding = 44;
    const ns = 'http://www.w3.org/2000/svg';
    const create = (tag, attrs = {}) => {
      const el = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      return el;
    };

    staticGroup.innerHTML = '';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    for (let i = 0; i <= 8; i++) {
      const x = padding + ((width - padding * 2) * i) / 8;
      staticGroup.appendChild(create('line', { x1: x, y1: padding, x2: x, y2: height - padding, stroke: '#E2E8F0', 'stroke-width': '1' }));
    }
    for (let i = 0; i <= 6; i++) {
      const y = padding + ((height - padding * 2) * i) / 6;
      staticGroup.appendChild(create('line', { x1: padding, y1: y, x2: width - padding, y2: y, stroke: '#E2E8F0', 'stroke-width': '1' }));
    }

    const text = create('text', {
      x: width / 2,
      y: height / 2,
      'text-anchor': 'middle',
      fill: '#64748B',
      'font-size': isFullscreen ? '18' : '14',
      'font-family': 'Inter, system-ui, sans-serif',
      'font-weight': '700',
    });
    text.textContent = 'Ingresa la ecuación y presiona Resolver para cargar la gráfica';
    staticGroup.appendChild(text);
  }, [isFullscreen]);

  const drawGraph = useCallback((expr, currentZoom, currentPan = panOffset) => {
    const svg = svgRef.current;
    const staticGroup = staticGroupRef.current;
    if (!svg || !staticGroup) return;

    const width = svg.clientWidth || 680;
    const height = svg.clientHeight || 360;
    const padding = isFullscreen ? 60 : 46;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    
    const focus = getFocusPoint();
    const range = Math.max(0.35, 4 / currentZoom);
    
    const unitsPerPixelX = (range * 2) / innerWidth;
    const mathPanX = currentPan.x * unitsPerPixelX;
    
    const xMin = focus - range - mathPanX;
    const xMax = focus + range - mathPanX;
    
    const samples = 700;
    const points = [];
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const x = (focus - range) + ((range * 2) * i) / samples;
      const y = safeEvaluate(expr, { x });
      if (y !== null && Number.isFinite(y)) {
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }

    if (yMin === Infinity || yMax === -Infinity) {
      yMin = -5;
      yMax = 5;
    }

    const yPad = (yMax - yMin) * 0.16 || 1;
    yMin -= yPad;
    yMax += yPad;

    const unitsPerPixelY = (yMax - yMin) / innerHeight;
    const mathPanY = currentPan.y * unitsPerPixelY;
    yMin += mathPanY;
    yMax += mathPanY;

    points.length = 0;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const y = safeEvaluate(expr, { x });
      if (y !== null && Number.isFinite(y)) {
        points.push({ x, y });
      }
    }

    if (!points.length) {
      setError('No se pudo evaluar la función en el rango seleccionado.');
      drawEmptyGraph();
      return;
    }

    const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * innerWidth;
    const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * innerHeight;
    const invertX = (px) => xMin + ((px - padding) / innerWidth) * (xMax - xMin);
    scalesRef.current = { scaleX, scaleY, invertX, xMin, xMax, yMin, yMax };

    const ns = 'http://www.w3.org/2000/svg';
    const create = (tag, attrs = {}) => {
      const el = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      return el;
    };

    staticGroup.innerHTML = '';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const labelFontSize = isFullscreen ? '14' : '10';
    for (let i = 0; i <= 8; i++) {
      const xVal = xMin + ((xMax - xMin) * i) / 8;
      const sx = scaleX(xVal);
      staticGroup.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#E2E8F0', 'stroke-width': '0.8' }));
      const label = create('text', { x: sx, y: height - padding + (isFullscreen ? 24 : 18), 'text-anchor': 'middle', fill: '#64748B', 'font-size': labelFontSize });
      label.textContent = xVal.toFixed(currentZoom > 2 ? 2 : 1);
      staticGroup.appendChild(label);
    }

    for (let i = 0; i <= 6; i++) {
      const yVal = yMin + ((yMax - yMin) * i) / 6;
      const sy = scaleY(yVal);
      staticGroup.appendChild(create('line', { x1: padding, y1: sy, x2: width - padding, y2: sy, stroke: '#E2E8F0', 'stroke-width': '0.8' }));
      const label = create('text', { x: padding - 8, y: sy + 4, 'text-anchor': 'end', fill: '#64748B', 'font-size': labelFontSize });
      label.textContent = yVal.toFixed(currentZoom > 2 ? 2 : 1);
      staticGroup.appendChild(label);
    }

    const yAxis = scaleY(0);
    if (yAxis >= padding && yAxis <= height - padding) {
      staticGroup.appendChild(create('line', { x1: padding, y1: yAxis, x2: width - padding, y2: yAxis, stroke: '#94A3B8', 'stroke-width': '1.2' }));
    }

    const xAxis = scaleX(0);
    if (xAxis >= padding && xAxis <= width - padding) {
      staticGroup.appendChild(create('line', { x1: xAxis, y1: padding, x2: xAxis, y2: height - padding, stroke: '#94A3B8', 'stroke-width': '1.2' }));
    }

    let path = '';
    points.forEach((point, index) => {
      const sx = scaleX(point.x);
      const sy = scaleY(point.y);
      if (sy >= padding && sy <= height - padding) {
        path += path === '' ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
      } else {
        path += ' ';
      }
    });
    if (path) {
      staticGroup.appendChild(create('path', { d: path, fill: 'none', stroke: '#0047CC', 'stroke-width': isFullscreen ? '3.5' : '2.6' }));
    }

    if (modo === 'limite') {
      const aNum = Number.parseFloat(a);
      const sx = scaleX(aNum);
      if (sx >= padding && sx <= width - padding) {
        staticGroup.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#F4B400', 'stroke-width': '2', 'stroke-dasharray': '7,5' }));
      }

      const offsets = [0.35 / currentZoom, 0.18 / currentZoom, 0.08 / currentZoom];
      offsets.forEach((offset, index) => {
        const leftY = safeEvaluate(expr, { x: aNum - offset });
        const rightY = safeEvaluate(expr, { x: aNum + offset });
        
        if (leftY !== null && Number.isFinite(leftY)) {
          const cx = scaleX(aNum - offset);
          const cy = scaleY(leftY);
          if (cx >= padding && cx <= width - padding && cy >= padding && cy <= height - padding) {
            staticGroup.appendChild(create('circle', { cx, cy, r: String((isFullscreen ? 7 : 5) - index), fill: '#10B981', stroke: '#fff', 'stroke-width': '1.5' }));
          }
        }
        if (rightY !== null && Number.isFinite(rightY)) {
          const cx = scaleX(aNum + offset);
          const cy = scaleY(rightY);
          if (cx >= padding && cx <= width - padding && cy >= padding && cy <= height - padding) {
            staticGroup.appendChild(create('circle', { cx, cy, r: String((isFullscreen ? 7 : 5) - index), fill: '#EF4444', stroke: '#fff', 'stroke-width': '1.5' }));
          }
        }
      });
    }

    if (modo === 'derivada') {
      const x0Num = Number.parseFloat(x0);
      const fx0 = safeEvaluate(expr, { x: x0Num });
      const dStr = safeDerivative(expr);
      const m = dStr ? safeEvaluate(dStr, { x: x0Num }) : null;

      if (fx0 !== null && Number.isFinite(fx0)) {
        const cx = scaleX(x0Num);
        const cy = scaleY(fx0);
        if (cx >= padding && cx <= width - padding && cy >= padding && cy <= height - padding) {
          staticGroup.appendChild(create('circle', { cx, cy, r: isFullscreen ? '7' : '5', fill: '#EF4444', stroke: '#fff', 'stroke-width': '2' }));
        }
      }

      if (fx0 !== null && m !== null && Number.isFinite(fx0) && Number.isFinite(m)) {
        const b = fx0 - m * x0Num;
        staticGroup.appendChild(create('line', {
          x1: scaleX(xMin),
          y1: scaleY(m * xMin + b),
          x2: scaleX(xMax),
          y2: scaleY(m * xMax + b),
          stroke: '#EF4444',
          'stroke-width': '2',
          'stroke-dasharray': '7,5',
        }));
      }
    }
  }, [a, x0, modo, safeEvaluate, safeDerivative, getFocusPoint, drawEmptyGraph, isFullscreen, panOffset]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const resizeObserver = new ResizeObserver(() => {
      if (resultado) {
        drawGraph(fn, zoom, panOffset);
      } else {
        drawEmptyGraph();
      }
    });

    resizeObserver.observe(svg);
    return () => resizeObserver.disconnect();
  }, [drawGraph, drawEmptyGraph, fn, zoom, resultado, panOffset]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheelNative = (event) => {
      if (!resultado || vista !== 'grafica') return;
      event.preventDefault(); 
      const delta = event.deltaY < 0 ? 0.35 : -0.35;
      const normalizedZoom = Math.min(8, Math.max(0.5, zoom + delta));
      setZoom(normalizedZoom);
      drawGraph(fn, normalizedZoom, panOffset);
    };

    svg.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheelNative);
  }, [resultado, vista, zoom, fn, panOffset, drawGraph]);

  const toggleFullscreen = () => {
    if (!plotAreaRef.current) return;
    if (!document.fullscreenElement) {
      plotAreaRef.current.requestFullscreen().catch((err) => {
        console.error(`Error al activar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Función para reestablecer la vista por defecto de la gráfica
  const resetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    if (resultado) {
      setTimeout(() => drawGraph(fn, 1, { x: 0, y: 0 }), 0);
    }
  };

  const handleMouseDown = (event) => {
    if (!resultado) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!resultado || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    if (isDraggingRef.current) {
      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;
      
      dragStartRef.current = { x: event.clientX, y: event.clientY };
      setPanOffset((prev) => {
        const nextPan = { x: prev.x + deltaX, y: prev.y - deltaY };
        drawGraph(fn, zoom, nextPan);
        return nextPan;
      });
      return;
    }

    const mouseX = event.clientX - rect.left;
    const { invertX, scaleX, scaleY, xMin, xMax, yMin, yMax } = scalesRef.current;
    const mathX = invertX(mouseX);
    if (mathX >= xMin && mathX <= xMax) {
      const mathY = safeEvaluate(fn, { x: mathX });
      if (mathY !== null && Number.isFinite(mathY) && mathY >= yMin && mathY <= yMax) {
        const cx = scaleX(mathX);
        const cy = scaleY(mathY);

        setMousePos({
          x: cx,
          y: cy,
          mathX: mathX,
          mathY: mathY,
          visible: true
        });
      } else {
        setMousePos((prev) => ({ ...prev, visible: false }));
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setMousePos((prev) => ({ ...prev, visible: false }));
  };

  const handleGraphClick = () => {
    if (isDraggingRef.current || !mousePos.visible) return;
    
    const valorRedondeado = mousePos.mathX.toFixed(4);
    if (modo === 'limite') {
      setA(valorRedondeado);
    } else if (modo === 'derivada') {
      setX0(valorRedondeado);
    }
  };

  useEffect(() => {
    if (resultado) {
      calcular();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, x0]);

  const calcular = useCallback(() => {
    setError('');
    loading || setLoading(true);
    setIaAbierta(false);
    setIaRespuesta('');
    setIaError('');

    try {
      if (!fn.trim()) {
        setError('Ingresa una función f(x).');
        drawEmptyGraph();
        return;
      }

      const testValue = safeEvaluate(fn, { x: 1 });
      if (testValue === null || Number.isNaN(testValue)) {
        setError('No se puede evaluar la función. Usa sintaxis como x^2, sin(x), e^x o (x^2 - 4)/(x - 2).');
        drawEmptyGraph();
        return;
      }

      const hValues = [0.5, 0.1, 0.01, 0.001, 0.0001];
      let nextResult;
      let nextTable = [];

      if (modo === 'limite') {
        const aNum = Number.parseFloat(a) || 0;
        const leftNear = safeEvaluate(fn, { x: aNum - 0.00001 });
        const rightNear = safeEvaluate(fn, { x: aNum + 0.00001 });
        const atPoint = safeEvaluate(fn, { x: aNum });

        nextTable = hValues.map((step) => ({
          h: step,
          izq: safeEvaluate(fn, { x: aNum - step }),
          der: safeEvaluate(fn, { x: aNum + step }),
        }));
        nextResult = {
          tipo: 'limite',
          titulo: `Límite cuando x tiende a ${aNum}`,
          detalle: leftNear !== null && rightNear !== null
            ? `Izquierda ≈ ${leftNear.toFixed(6)} · Derecha ≈ ${rightNear.toFixed(6)}`
            : 'No se pudo evaluar uno de los lados del límite.',
          extra: atPoint !== null && Number.isFinite(atPoint) ? `f(${aNum}) = ${atPoint.toFixed(6)}` : `f(${aNum}) no está definida.`,
        };
      } else if (modo === 'derivada') {
        const x0Num = Number.parseFloat(x0) || 0;
        const dStr = safeDerivative(fn);
        const fx0 = safeEvaluate(fn, { x: x0Num });
        const m = dStr ? safeEvaluate(dStr, { x: x0Num }) : null;

        nextTable = hValues.map((step) => {
          const left = safeEvaluate(fn, { x: x0Num - step });
          const right = safeEvaluate(fn, { x: x0Num + step });
          return {
            h: step,
            izq: left !== null && fx0 !== null ? (fx0 - left) / step : null,
            der: right !== null && fx0 !== null ? (right - fx0) / step : null,
          };
        });
        nextResult = {
          tipo: 'derivada',
          titulo: `Derivada en x = ${x0Num}`,
          detalle: dStr ? `f'(x) = ${dStr}` : 'No se pudo calcular la derivada simbólica.',
          extra: m !== null && Number.isFinite(m) ? `Pendiente aproximada: ${m.toFixed(6)}` : 'No se pudo evaluar la pendiente.',
        };
      } else {
        nextResult = {
          tipo: 'general',
          titulo: 'Gráfica generada',
          detalle: subtipo ? `Modo de aplicación: ${subtipo}` : 'Explora la función con el zoom.',
          extra: '',
        };
      }

      setResultado(nextResult);
      setTablaData(nextTable);
      setVista('grafica');
      setTimeout(() => drawGraph(fn, zoom, panOffset), 0);
    } finally {
      setLoading(false);
    }
  }, [fn, a, x0, modo, subtipo, safeEvaluate, safeDerivative, drawGraph, drawEmptyGraph, zoom, panOffset]);

  const updateZoom = useCallback((nextZoom) => {
    const normalizedZoom = Math.min(8, Math.max(0.5, nextZoom));
    setZoom(normalizedZoom);
    if (resultado) drawGraph(fn, normalizedZoom, panOffset);
  }, [drawGraph, fn, resultado, panOffset]);

  const handleResolverIA = useCallback(async () => {
    setIaAbierta(true);
    setIaLoading(true);
    setIaError('');
    setIaRespuesta('');

    const aNum = Number.parseFloat(a) || 0;
    const x0Num = Number.parseFloat(x0) || 0;
    const res = await resolverConIA(modo, { fn, a: aNum, x0: x0Num, h });

    if (!res.ok) {
      setIaError(res.error === 'NO_API_KEY'
        ? 'Configura VITE_OPENAI_API_KEY en tu archivo .env para usar la resolución con IA.'
        : res.error);
    } else {
      setIaRespuesta(res.respuesta);
    }

    setIaLoading(false);
  }, [fn, a, x0, h, modo]);

  const renderIa = () => {
    if (!iaAbierta) return null;
    return (
      <div style={styles.iaPanel}>
        {iaLoading && <p style={styles.iaText}>Resolviendo paso a paso...</p>}
        {iaError && <p style={styles.iaError}>{iaError}</p>}
        {iaRespuesta && (
          <div ref={mathRef} style={styles.iaRespuesta}>
            {iaRespuesta.split('\n').map((line, index) => (
              <p key={index} style={styles.iaLine}>{line}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Dimensiones base del tooltip escaladas dinámicamente según el zoom actual
  const tooltipWidth = (isFullscreen ? 240 : 160) * (0.85 + zoom * 0.15);
  const tooltipHeight = (isFullscreen ? 110 : 75) * (0.85 + zoom * 0.15);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIconWrap}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 4 22 Q 10 6 14 14 Q 18 22 24 8" stroke="#0047CC" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="14" cy="14" r="2" fill="#F4B400" />
            <line x1="4" y1="14" x2="24" y2="14" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="14" y1="4" x2="14" y2="24" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
        </div>
        <div style={{ flexGrow: 1 }}>
          <div style={styles.headerTitle}>{title}</div>
          <div style={styles.headerSubtitle}>Haz clic en cualquier punto de la curva para fijar un nuevo objetivo de análisis</div>
        </div>
      </div>

      <div style={styles.formBlock}>
        <div style={styles.inputGroupWide}>
          <label style={styles.label}>Ecuación a resolver: f(x)</label>
          <input style={styles.input} value={fn} onChange={(e) => setFn(e.target.value)} placeholder="(x^2 - 4)/(x - 2)" />
        </div>

        <div className="graph-params-grid" style={styles.paramsGrid}>
          {modo === 'limite' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>x tiende a (a)</label>
              <input style={styles.input} value={a} onChange={(e) => setA(e.target.value)} placeholder="2" />
            </div>
          )}

          {modo === 'derivada' && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Punto evaluar (x0)</label>
                <input style={styles.input} value={x0} onChange={(e) => setX0(e.target.value)} placeholder="2" />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Incremento (h)</label>
                <input style={styles.input} value={h} onChange={(e) => setH(e.target.value)} placeholder="0.5" />
              </div>
            </>
          )}
        </div>

        <div style={styles.actions}>
          <button type="button" style={styles.solveBtn} onClick={calcular} disabled={loading}>
            {loading ? 'Resolviendo...' : '▶ Resolver'}
          </button>
          <button
            type="button"
            style={{ ...styles.viewBtn, ...(vista === 'grafica' ? styles.viewBtnActive : {}) }}
            onClick={() => {
              setVista('grafica');
              if (resultado) setTimeout(() => drawGraph(fn, zoom, panOffset), 0);
            }}
          >
            Ver gráfica
          </button>
          <button
            type="button"
            style={{ ...styles.viewBtn, ...(vista === 'tabla' ? styles.viewBtnActive : {}) }}
            onClick={() => setVista('tabla')}
            disabled={!resultado}
          >
            Ver valores de aproximación
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {resultado && (
        <div style={styles.resultSummary}>
          <div>
            <div style={styles.resultTitle}>{resultado.titulo}</div>
            <div style={styles.resultText}>{resultado.detalle}</div>
            {resultado.extra && <div style={styles.resultText}>{resultado.extra}</div>}
          </div>
          <button type="button" style={styles.iaButton} onClick={handleResolverIA} disabled={iaLoading}>
            IA paso a paso
          </button>
        </div>
      )}

      {vista === 'grafica' && (
        <div ref={plotAreaRef} style={{ ...styles.plotArea, ...(isFullscreen ? styles.fullscreenPlotArea : {}) }}>
          <div style={styles.zoomBar}>
            <button type="button" style={styles.zoomBtn} onClick={() => updateZoom(zoom - 0.5)} disabled={!resultado}>-</button>
            <span style={styles.zoomLabel}>Zoom {zoom.toFixed(1)}x</span>
            <button type="button" style={styles.zoomBtn} onClick={() => updateZoom(zoom + 0.5)} disabled={!resultado}>+</button>
            
            {/* Nuevo Botón de Restablecer */}
            <button type="button" style={styles.resetBtn} onClick={resetZoom} disabled={!resultado} title="Restablecer tamaño original">
              ↺ Restablecer
            </button>

            <span style={styles.zoomHint}>Arrastra para moverte por el plano. Usa la rueda del mouse para cambiar el zoom.</span>
            
            <button type="button" onClick={toggleFullscreen} style={styles.fullscreenBtn} title="Alternar pantalla completa">
              {isFullscreen ? '✕ Salir del Plano' : '⛶ Pantalla Completa'}
            </button>
          </div>

          <div style={{ position: 'relative', height: isFullscreen ? 'calc(100% - 110px)' : '360px' }}>
            
            {isFullscreen && resultado && (
              <div style={styles.floatingResultsOverlay}>
                <div style={styles.floatingResultsTitle}>{resultado.titulo}</div>
                <div style={styles.floatingResultsDetail}>{resultado.detalle}</div>
                {resultado.extra && <div style={styles.floatingResultsExtra}>{resultado.extra}</div>}
              </div>
            )}

            <svg 
              ref={svgRef} 
              style={{ ...styles.svg, height: '100%' }} 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onClick={handleGraphClick}
            >
              <g ref={staticGroupRef} id="static-elements" />

              {mousePos.visible && (
                <g key="interactive-overlay" style={{ pointerEvents: 'none' }}>
                  <circle cx={mousePos.x} cy={mousePos.y} r={isFullscreen ? "8" : "6"} fill="#0047CC" stroke="#fff" strokeWidth="2" />
                  
                  <line x1={mousePos.x} y1={mousePos.y} x2={mousePos.x} y2={svgRef.current ? svgRef.current.clientHeight - (isFullscreen ? 60 : 46) : 314} stroke="#0047CC" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                  <line x1={isFullscreen ? 60 : 46} y1={mousePos.y} x2={mousePos.x} y2={mousePos.y} stroke="#0047CC" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />

                  <g transform={`translate(${mousePos.x > (svgRef.current?.clientWidth - (tooltipWidth + 20) || 450) ? mousePos.x - (tooltipWidth + 10) : mousePos.x + 15}, ${mousePos.y > (isFullscreen ? 300 : 200) ? mousePos.y - (tooltipHeight + 15) : mousePos.y + 15})`}>
                    <rect width={tooltipWidth} height={tooltipHeight} rx="8" fill="#0F172A" opacity="0.95" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" />
                    
                    {/* Fuentes escaladas con base al zoom matemático */}
                    <text x="14" y={(isFullscreen ? 26 : 20) * (0.9 + zoom * 0.1)} fill="#38BDF8" fontSize={(isFullscreen ? 11 : 9) * (0.9 + zoom * 0.1)} fontFamily="Inter" fontWeight="800" letterSpacing="0.5px">CLICK PARA FIJAR PUNTO</text>
                    <text x="14" y={(isFullscreen ? 56 : 42) * (0.9 + zoom * 0.1)} fill="#fff" fontSize={(isFullscreen ? 16 : 13) * (0.9 + zoom * 0.1)} fontFamily="monospace">x = {mousePos.mathX.toFixed(4)}</text>
                    <text x="14" y={(isFullscreen ? 84 : 60) * (0.9 + zoom * 0.1)} fill="#10B981" fontSize={(isFullscreen ? 16 : 13) * (0.9 + zoom * 0.1)} fontFamily="monospace">f(x) = {mousePos.mathY.toFixed(4)}</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {resultado && modo === 'limite' && (
            <div style={{ ...styles.legend, ...(isFullscreen ? styles.fullscreenLegend : {}) }}>
              <span><i style={{ ...styles.dot, background: '#10B981' }} /> Aproximación por izquierda</span>
              <span><i style={{ ...styles.dot, background: '#EF4444' }} /> Aproximación por derecha</span>
              <span><i style={{ ...styles.dot, background: '#F4B400' }} /> Punto objetivo</span>
            </div>
          )}
        </div>
      )}

      {vista === 'tabla' && (
        <div style={styles.tableWrap}>
          {resultado ? <TablaAproximacion datos={tablaData} modo={modo} /> : <p style={styles.emptyText}>Primero resuelve una ecuación.</p>}
        </div>
      )}

      {renderIa()}
    </div>
  );
}

const styles = {
  container: {
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 20px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  headerIconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'rgba(0,71,204,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: 800,
    fontSize: '15px',
    color: '#1E293B',
    fontFamily: "'Poppins', sans-serif",
  },
  headerSubtitle: {
    fontSize: '12px',
    color: '#64748B',
  },
  fullscreenBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    background: '#0F172A',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'background 0.2s',
  },
  formBlock: {
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  paramsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  inputGroupWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #D8E1EE',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    background: '#fff',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  solveBtn: {
    padding: '11px 22px',
    borderRadius: '12px',
    border: 'none',
    background: '#0047CC',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,71,204,0.24)',
  },
  viewBtn: {
    padding: '11px 16px',
    borderRadius: '12px',
    border: '1px solid #D8E1EE',
    background: '#fff',
    color: '#334155',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  viewBtnActive: {
    borderColor: '#0047CC',
    color: '#0047CC',
    background: 'rgba(0,71,204,0.06)',
  },
  errorBox: {
    margin: '0 20px 16px',
    padding: '12px 14px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    color: '#B91C1C',
    fontSize: '14px',
    fontWeight: 600,
  },
  resultSummary: {
    margin: '0 20px 16px',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #BFDBFE',
    background: '#EFF6FF',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resultTitle: {
    color: '#1E293B',
    fontWeight: 800,
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
  },
  resultText: {
    color: '#1E40AF',
    fontSize: '13px',
    marginTop: '4px',
  },
  iaButton: {
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid #0A1628',
    background: '#0A1628',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  plotArea: {
    margin: '0 20px 20px',
    background: '#F8FAFC',
    borderRadius: '14px',
    border: '1px dashed #CBD5E1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  fullscreenPlotArea: {
    margin: '0px',
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
    border: 'none',
    background: '#F8FAFC',
  },
  zoomBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    flexWrap: 'wrap',
  },
  zoomBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    border: '1px solid #D8E1EE',
    background: '#fff',
    color: '#1E293B',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #D8E1EE',
    background: '#FFF',
    color: '#0047CC',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  zoomLabel: {
    fontSize: '12px',
    color: '#334155',
    fontWeight: 800,
  },
  zoomHint: {
    fontSize: '12px',
    color: '#64748B',
  },
  svg: {
    width: '100%',
    display: 'block',
    background: '#F8FAFC',
    cursor: 'grab',
  },
  legend: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    padding: '10px 12px',
    background: '#fff',
    borderTop: '1px solid #E2E8F0',
    color: '#64748B',
    fontSize: '12px',
    fontWeight: 700,
    marginTop: 'auto',
  },
  fullscreenLegend: {
    padding: '16px 20px',
    fontSize: '14px',
  },
  dot: {
    display: 'inline-block',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    marginRight: '6px',
  },
  tableWrap: {
    margin: '0 20px 20px',
  },
  emptyText: {
    margin: 0,
    padding: '18px',
    color: '#64748B',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px dashed #CBD5E1',
  },
  iaPanel: {
    margin: '0 20px 20px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    background: '#fff',
    padding: '16px',
  },
  iaText: {
    margin: 0,
    color: '#64748B',
    fontSize: '14px',
  },
  iaError: {
    margin: 0,
    color: '#B91C1C',
    fontSize: '14px',
    fontWeight: 600,
  },
  iaRespuesta: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#334155',
  },
  iaLine: {
    margin: '0 0 8px',
  },
  floatingResultsOverlay: {
    position: 'absolute',
    top: '20px',
    left: '60px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#fff',
    zIndex: 10,
    maxWidth: '320px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    fontFamily: "'Inter', system-ui, sans-serif",
    pointerEvents: 'none',
  },
  floatingResultsTitle: {
    fontWeight: 800,
    fontSize: '13px',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  floatingResultsDetail: {
    fontSize: '14px',
    color: '#F1F5F9',
    marginTop: '6px',
    fontWeight: '500',
  },
  floatingResultsExtra: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '4px',
  }
};