import { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate, derivative } from 'mathjs';
import { resolverConIA } from '../services/openaiService';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';
import TablaAproximacion from './graficos/TablaAproximacion';

export default function GraphZone({ modo = 'limite', subtipo = '', title = 'Laboratorio de Graficacion' }) {
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

  const [iaAbierta, setIaAbierta] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaRespuesta, setIaRespuesta] = useState('');
  const [iaError, setIaError] = useState('');

  const svgRef = useRef(null);
  const mathRef = useRef(null);

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
    if (!svg) return;

    const width = svg.clientWidth || 680;
    const height = svg.clientHeight || 360;
    const padding = 44;
    const ns = 'http://www.w3.org/2000/svg';
    const create = (tag, attrs = {}) => {
      const el = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      return el;
    };

    svg.innerHTML = '';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    for (let i = 0; i <= 8; i++) {
      const x = padding + ((width - padding * 2) * i) / 8;
      svg.appendChild(create('line', { x1: x, y1: padding, x2: x, y2: height - padding, stroke: '#E2E8F0', 'stroke-width': '1' }));
    }
    for (let i = 0; i <= 6; i++) {
      const y = padding + ((height - padding * 2) * i) / 6;
      svg.appendChild(create('line', { x1: padding, y1: y, x2: width - padding, y2: y, stroke: '#E2E8F0', 'stroke-width': '1' }));
    }

    const text = create('text', {
      x: width / 2,
      y: height / 2,
      'text-anchor': 'middle',
      fill: '#64748B',
      'font-size': '14',
      'font-family': 'Inter, system-ui, sans-serif',
      'font-weight': '700',
    });
    text.textContent = 'Ingresa la ecuacion y presiona Resolver para cargar la grafica';
    svg.appendChild(text);
  }, []);

  useEffect(() => {
    drawEmptyGraph();
  }, [drawEmptyGraph]);

  const drawGraph = useCallback((expr, currentZoom) => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth || 680;
    const height = svg.clientHeight || 360;
    const padding = 46;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    const focus = getFocusPoint();
    const range = Math.max(0.35, 4 / currentZoom);
    const xMin = focus - range;
    const xMax = focus + range;
    const samples = 700;
    const points = [];
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const y = safeEvaluate(expr, { x });
      if (y !== null && Number.isFinite(y)) {
        points.push({ x, y });
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }

    if (!points.length) {
      setError('No se pudo evaluar la funcion en el rango seleccionado.');
      drawEmptyGraph();
      return;
    }

    const yPad = (yMax - yMin) * 0.16 || 1;
    yMin -= yPad;
    yMax += yPad;

    const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * innerWidth;
    const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * innerHeight;

    const ns = 'http://www.w3.org/2000/svg';
    const create = (tag, attrs = {}) => {
      const el = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      return el;
    };

    svg.innerHTML = '';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    for (let i = 0; i <= 8; i++) {
      const xVal = xMin + ((xMax - xMin) * i) / 8;
      const sx = scaleX(xVal);
      svg.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#E2E8F0', 'stroke-width': '0.8' }));
      const label = create('text', { x: sx, y: height - padding + 18, 'text-anchor': 'middle', fill: '#64748B', 'font-size': '10' });
      label.textContent = xVal.toFixed(currentZoom > 2 ? 2 : 1);
      svg.appendChild(label);
    }

    for (let i = 0; i <= 6; i++) {
      const yVal = yMin + ((yMax - yMin) * i) / 6;
      const sy = scaleY(yVal);
      svg.appendChild(create('line', { x1: padding, y1: sy, x2: width - padding, y2: sy, stroke: '#E2E8F0', 'stroke-width': '0.8' }));
      const label = create('text', { x: padding - 8, y: sy + 4, 'text-anchor': 'end', fill: '#64748B', 'font-size': '10' });
      label.textContent = yVal.toFixed(currentZoom > 2 ? 2 : 1);
      svg.appendChild(label);
    }

    const yAxis = scaleY(0);
    if (yAxis >= padding && yAxis <= height - padding) {
      svg.appendChild(create('line', { x1: padding, y1: yAxis, x2: width - padding, y2: yAxis, stroke: '#94A3B8', 'stroke-width': '1.2' }));
    }

    const xAxis = scaleX(0);
    if (xAxis >= padding && xAxis <= width - padding) {
      svg.appendChild(create('line', { x1: xAxis, y1: padding, x2: xAxis, y2: height - padding, stroke: '#94A3B8', 'stroke-width': '1.2' }));
    }

    let path = '';
    points.forEach((point, index) => {
      const sx = scaleX(point.x);
      const sy = scaleY(point.y);
      path += index === 0 ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
    });
    svg.appendChild(create('path', { d: path, fill: 'none', stroke: '#0047CC', 'stroke-width': '2.6' }));

    if (modo === 'limite') {
      const aNum = Number.parseFloat(a);
      const sx = scaleX(aNum);
      svg.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#F4B400', 'stroke-width': '2', 'stroke-dasharray': '7,5' }));

      const offsets = [0.35 / currentZoom, 0.18 / currentZoom, 0.08 / currentZoom];
      offsets.forEach((offset, index) => {
        const leftY = safeEvaluate(expr, { x: aNum - offset });
        const rightY = safeEvaluate(expr, { x: aNum + offset });
        if (leftY !== null && Number.isFinite(leftY)) {
          svg.appendChild(create('circle', { cx: scaleX(aNum - offset), cy: scaleY(leftY), r: String(5 - index), fill: '#10B981', stroke: '#fff', 'stroke-width': '1.5' }));
        }
        if (rightY !== null && Number.isFinite(rightY)) {
          svg.appendChild(create('circle', { cx: scaleX(aNum + offset), cy: scaleY(rightY), r: String(5 - index), fill: '#EF4444', stroke: '#fff', 'stroke-width': '1.5' }));
        }
      });
    }

    if (modo === 'derivada') {
      const x0Num = Number.parseFloat(x0);
      const fx0 = safeEvaluate(expr, { x: x0Num });
      const dStr = safeDerivative(expr);
      const m = dStr ? safeEvaluate(dStr, { x: x0Num }) : null;

      if (fx0 !== null && Number.isFinite(fx0)) {
        svg.appendChild(create('circle', { cx: scaleX(x0Num), cy: scaleY(fx0), r: '5', fill: '#EF4444', stroke: '#fff', 'stroke-width': '2' }));
      }

      if (fx0 !== null && m !== null && Number.isFinite(fx0) && Number.isFinite(m)) {
        const b = fx0 - m * x0Num;
        svg.appendChild(create('line', {
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
  }, [a, x0, modo, safeEvaluate, safeDerivative, getFocusPoint, drawEmptyGraph]);

  const calcular = useCallback(() => {
    setError('');
    setLoading(true);
    setIaAbierta(false);
    setIaRespuesta('');
    setIaError('');

    try {
      if (!fn.trim()) {
        setError('Ingresa una funcion f(x).');
        drawEmptyGraph();
        return;
      }

      const testValue = safeEvaluate(fn, { x: 1 });
      if (testValue === null || Number.isNaN(testValue)) {
        setError('No se puede evaluar la funcion. Usa sintaxis como x^2, sin(x), e^x o (x^2 - 4)/(x - 2).');
        drawEmptyGraph();
        return;
      }

      const hValues = [0.5, 0.1, 0.01, 0.001, 0.0001];
      let nextResult;
      let nextTable = [];

      if (modo === 'limite') {
        const aNum = Number.parseFloat(a);
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
          titulo: `Limite cuando x tiende a ${aNum}`,
          detalle: leftNear !== null && rightNear !== null
            ? `Izquierda ≈ ${leftNear.toFixed(6)} · Derecha ≈ ${rightNear.toFixed(6)}`
            : 'No se pudo evaluar uno de los lados del limite.',
          extra: atPoint !== null && Number.isFinite(atPoint) ? `f(${aNum}) = ${atPoint.toFixed(6)}` : `f(${aNum}) no esta definida.`,
        };
      } else if (modo === 'derivada') {
        const x0Num = Number.parseFloat(x0);
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
          detalle: dStr ? `f'(x) = ${dStr}` : 'No se pudo calcular la derivada simbolica.',
          extra: m !== null && Number.isFinite(m) ? `Pendiente aproximada: ${m.toFixed(6)}` : 'No se pudo evaluar la pendiente.',
        };
      } else {
        nextResult = {
          tipo: 'general',
          titulo: 'Grafica generada',
          detalle: subtipo ? `Modo de aplicacion: ${subtipo}` : 'Explora la funcion con el zoom.',
          extra: '',
        };
      }

      setResultado(nextResult);
      setTablaData(nextTable);
      setVista('grafica');
      setZoom(1);
      drawGraph(fn, 1);
    } finally {
      setLoading(false);
    }
  }, [fn, a, x0, modo, subtipo, safeEvaluate, safeDerivative, drawGraph, drawEmptyGraph]);

  const updateZoom = useCallback((nextZoom) => {
    const normalizedZoom = Math.min(8, Math.max(0.5, nextZoom));
    setZoom(normalizedZoom);
    if (resultado) drawGraph(fn, normalizedZoom);
  }, [drawGraph, fn, resultado]);

  const handleWheel = useCallback((event) => {
    if (!resultado || vista !== 'grafica') return;
    event.preventDefault();
    updateZoom(zoom + (event.deltaY < 0 ? 0.35 : -0.35));
  }, [resultado, updateZoom, vista, zoom]);

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
        ? 'Configura VITE_OPENAI_API_KEY en tu archivo .env para usar la resolucion con IA.'
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
        <div>
          <div style={styles.headerTitle}>{title}</div>
          <div style={styles.headerSubtitle}>Escribe una ecuacion, resuelve y explora la grafica con zoom</div>
        </div>
      </div>

      <div style={styles.formBlock}>
        <div style={styles.inputGroupWide}>
          <label style={styles.label}>Ecuacion a resolver: f(x)</label>
          <input style={styles.input} value={fn} onChange={(e) => setFn(e.target.value)} placeholder="(x^2 - 4)/(x - 2)" />
        </div>

        <div className="graph-params-grid" style={styles.paramsGrid}>
          {modo === 'limite' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>x tiende a</label>
              <input style={styles.input} value={a} onChange={(e) => setA(e.target.value)} placeholder="2" />
            </div>
          )}

          {modo === 'derivada' && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>x0</label>
                <input style={styles.input} value={x0} onChange={(e) => setX0(e.target.value)} placeholder="2" />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>h</label>
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
              if (resultado) drawGraph(fn, zoom);
            }}
          >
            Ver grafica
          </button>
          <button
            type="button"
            style={{ ...styles.viewBtn, ...(vista === 'tabla' ? styles.viewBtnActive : {}) }}
            onClick={() => setVista('tabla')}
            disabled={!resultado}
          >
            Ver valores de aproximacion
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
        <div style={styles.plotArea}>
          <div style={styles.zoomBar}>
            <button type="button" style={styles.zoomBtn} onClick={() => updateZoom(zoom - 0.5)} disabled={!resultado}>-</button>
            <span style={styles.zoomLabel}>Zoom {zoom.toFixed(1)}x</span>
            <button type="button" style={styles.zoomBtn} onClick={() => updateZoom(zoom + 0.5)} disabled={!resultado}>+</button>
            <span style={styles.zoomHint}>Tambien puedes usar la rueda del mouse sobre la grafica.</span>
          </div>
          <svg ref={svgRef} style={styles.svg} onWheel={handleWheel} />
          {resultado && modo === 'limite' && (
            <div style={styles.legend}>
              <span><i style={{ ...styles.dot, background: '#10B981' }} /> Aproximacion por izquierda</span>
              <span><i style={{ ...styles.dot, background: '#EF4444' }} /> Aproximacion por derecha</span>
              <span><i style={{ ...styles.dot, background: '#F4B400' }} /> Punto objetivo</span>
            </div>
          )}
        </div>
      )}

      {vista === 'tabla' && (
        <div style={styles.tableWrap}>
          {resultado ? <TablaAproximacion datos={tablaData} modo={modo} /> : <p style={styles.emptyText}>Primero resuelve una ecuacion.</p>}
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
    height: '360px',
    display: 'block',
    background: '#F8FAFC',
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
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .graph-params-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}
