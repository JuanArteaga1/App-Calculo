import { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate, derivative } from 'mathjs';
import { resolverConIA } from '../services/openaiService';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

export default function GraphZone({ modo = 'limite', subtipo = '', title = 'Laboratorio de Graficación' }) {
  const getDefaults = () => {
    if (modo === 'limite') return { fn: 'x^2', a: '2', x0: '2', h: '0.5' };
    if (modo === 'derivada') return { fn: 'x^2', a: '2', x0: '2', h: '0.5' };
    return { fn: 'x^2', a: '2', x0: '2', h: '0.5' };
  };
  const defaults = getDefaults();

  const [fn, setFn] = useState(defaults.fn);
  const [a, setA] = useState(defaults.a);
  const [x0, setX0] = useState(defaults.x0);
  const [h, setH] = useState(defaults.h);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para la resolución con IA
  const [iaAbierta, setIaAbierta] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaRespuesta, setIaRespuesta] = useState('');
  const [iaError, setIaError] = useState('');

  const svgRef = useRef(null);
  const mathRef = useRef(null);

  // Renderizar LaTeX de la respuesta de IA con KaTeX
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
  }, [iaRespuesta, iaAbierta]);

  const safeEvaluate = useCallback((expr, vars) => {
    try { return evaluate(expr, vars); } catch { return null; }
  }, []);

  const safeDerivative = useCallback((expr) => {
    try { return derivative(expr, 'x').toString(); } catch { return null; }
  }, []);

  const handleGraficar = useCallback(() => {
    setError('');
    setResultado(null);
    setLoading(true);
    setIaAbierta(false);
    setIaRespuesta('');
    setIaError('');

    try {
      const aNum = parseFloat(a);
      const x0Num = parseFloat(x0);
      const hNum = parseFloat(h);

      if (!fn.trim()) { setError('Ingresa una función f(x).'); setLoading(false); return; }

      const testVal = safeEvaluate(fn, { x: 1 });
      if (testVal === null || isNaN(testVal)) {
        setError('No se puede evaluar la función. Usa sintaxis como: x^2, sin(x), e^x, etc.');
        setLoading(false); return;
      }

      dibujarSVG(fn, modo, { a: aNum, x0: x0Num, h: hNum });

      let res = {};
      if (modo === 'limite') {
        const valA = safeEvaluate(fn, { x: aNum });
        const valIzq = safeEvaluate(fn, { x: aNum - 0.001 });
        const valDer = safeEvaluate(fn, { x: aNum + 0.001 });
        res = {
          mensaje: `Análisis de límite cuando x → ${aNum}`,
          fEnA: valA !== null ? valA.toFixed(6) : 'No definido',
          fEnA_izq: valIzq !== null ? valIzq.toFixed(6) : 'No definido',
          fEnA_der: valDer !== null ? valDer.toFixed(6) : 'No definido',
        };
      } else if (modo === 'derivada') {
        const dStr = safeDerivative(fn);
        const fx0 = safeEvaluate(fn, { x: x0Num });
        const m = dStr ? safeEvaluate(dStr, { x: x0Num }) : null;
        res = {
          derivada: dStr || 'No se pudo calcular',
          fEnX0: fx0 !== null ? fx0.toFixed(4) : '?',
          pendienteTangente: m !== null ? m : '?',
          ecuacionTangente: m !== null && fx0 !== null ? `y = ${m.toFixed(4)}(x - ${x0Num}) + ${fx0.toFixed(4)}` : 'No se pudo calcular',
          h: hNum,
        };
      } else {
        res = { mensaje: 'Gráfica generada. Modifica los parámetros para explorar.' };
      }

      setResultado(res);
    } catch (e) {
      setError('Error inesperado: ' + e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fn, a, x0, h, modo, safeEvaluate, safeDerivative]);

  const handleResolverIA = useCallback(async () => {
    setIaAbierta(true);
    setIaLoading(true);
    setIaError('');
    setIaRespuesta('');

    const aNum = parseFloat(a) || 0;
    const x0Num = parseFloat(x0) || 0;

    const res = await resolverConIA(modo, { fn, a: aNum, x0: x0Num, h });

    if (!res.ok) {
      if (res.error === 'NO_API_KEY') {
        setIaError('Para usar la resolución con IA, debes configurar tu API key de OpenAI. Crea un archivo .env en la raíz del proyecto con: VITE_OPENAI_API_KEY=tu_clave_aqui');
      } else {
        setIaError(res.error);
      }
    } else {
      setIaRespuesta(res.respuesta);
    }

    setIaLoading(false);
  }, [fn, a, x0, h, modo]);

  const dibujarSVG = useCallback((funcion, modoCalc, params) => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';

    const width = svg.clientWidth || 600;
    const height = svg.clientHeight || 320;
    const padding = 40;
    const w = width - 2 * padding;
    const h = height - 2 * padding;

    let xMin, xMax;
    if (modoCalc === 'limite') { xMin = params.a - 3; xMax = params.a + 3; }
    else if (modoCalc === 'derivada') { xMin = params.x0 - 3; xMax = params.x0 + 3; }
    else { xMin = -5; xMax = 5; }

    const puntos = [];
    let yMin = Infinity, yMax = -Infinity;
    const nSamples = 200;

    for (let i = 0; i <= nSamples; i++) {
      const x = xMin + (xMax - xMin) * (i / nSamples);
      const y = safeEvaluate(funcion, { x });
      if (y !== null && !isNaN(y) && isFinite(y)) {
        puntos.push({ x, y });
        yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
      }
    }

    if (puntos.length === 0) { setError('No se pudo evaluar la función en el rango seleccionado.'); return; }

    const yPad = (yMax - yMin) * 0.1 || 1;
    yMin -= yPad; yMax += yPad;

    const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * w;
    const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * h;

    let pathD = '';
    let first = true;
    for (const p of puntos) {
      const sx = scaleX(p.x);
      const sy = scaleY(p.y);
      pathD += first ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
      first = false;
    }

    const ns = 'http://www.w3.org/2000/svg';
    const create = (tag, attrs = {}) => {
      const el = document.createElementNS(ns, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      return el;
    };

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const y0 = scaleY(0);
    if (y0 >= padding && y0 <= height - padding) {
      svg.appendChild(create('line', { x1: padding, y1: y0, x2: width - padding, y2: y0, stroke: '#94A3B8', 'stroke-width': '1' }));
    }

    const x0s = scaleX(0);
    if (x0s >= padding && x0s <= width - padding) {
      svg.appendChild(create('line', { x1: x0s, y1: padding, x2: x0s, y2: height - padding, stroke: '#94A3B8', 'stroke-width': '1' }));
    }

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = scaleX(x);
      svg.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#E2E8F0', 'stroke-width': '0.5' }));
      const text = create('text', { x: sx, y: height - padding + 15, 'text-anchor': 'middle', fill: '#64748B', 'font-size': '10' });
      text.textContent = x; svg.appendChild(text);
    }

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = scaleY(y);
      svg.appendChild(create('line', { x1: padding, y1: sy, x2: width - padding, y2: sy, stroke: '#E2E8F0', 'stroke-width': '0.5' }));
      const text = create('text', { x: padding - 8, y: sy + 4, 'text-anchor': 'end', fill: '#64748B', 'font-size': '10' });
      text.textContent = y; svg.appendChild(text);
    }

    svg.appendChild(create('path', { d: pathD, fill: 'none', stroke: '#0047CC', 'stroke-width': '2.5' }));

    if (modoCalc === 'limite') {
      const sx = scaleX(params.a);
      svg.appendChild(create('line', { x1: sx, y1: padding, x2: sx, y2: height - padding, stroke: '#F4B400', 'stroke-width': '2', 'stroke-dasharray': '6,4' }));
      const fa = safeEvaluate(funcion, { x: params.a });
      if (fa !== null && isFinite(fa)) {
        svg.appendChild(create('circle', { cx: sx, cy: scaleY(fa), r: '5', fill: '#F4B400', stroke: '#fff', 'stroke-width': '2' }));
      }
    }

    if (modoCalc === 'derivada') {
      const sx0 = scaleX(params.x0);
      const fx0 = safeEvaluate(funcion, { x: params.x0 });
      if (fx0 !== null && isFinite(fx0)) {
        const sy0 = scaleY(fx0);
        svg.appendChild(create('circle', { cx: sx0, cy: sy0, r: '5', fill: '#EF4444', stroke: '#fff', 'stroke-width': '2' }));
        const dStr = safeDerivative(funcion);
        const m = dStr ? safeEvaluate(dStr, { x: params.x0 }) : null;
        if (m !== null && isFinite(m)) {
          const b = fx0 - m * params.x0;
          const tx1 = xMin, ty1 = m * tx1 + b;
          const tx2 = xMax, ty2 = m * tx2 + b;
          svg.appendChild(create('line', {
            x1: scaleX(tx1), y1: scaleY(ty1), x2: scaleX(tx2), y2: scaleY(ty2),
            stroke: '#EF4444', 'stroke-width': '2', 'stroke-dasharray': '6,4',
          }));
        }
      }
    }
  }, [safeEvaluate, safeDerivative]);

  const inputStyle = {
    padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0',
    fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none',
    minWidth: '120px', flex: 1,
  };
  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const renderResultadoIA = () => {
    if (!iaAbierta) return null;

    return (
      <div style={styles.iaPanel}>
        <div style={styles.iaHeader}>
          <span style={styles.iaEmoji}>🤖</span>
          <div>
            <div style={styles.iaTitle}>Resolución paso a paso con IA</div>
            <div style={styles.iaSubtitle}>Modelo: OpenAI o3-mini</div>
          </div>
          <button style={styles.iaClose} onClick={() => setIaAbierta(false)} title="Cerrar">✕</button>
        </div>

        {iaLoading && (
          <div style={styles.iaLoading}>
            <div style={styles.spinner} />
            <p style={styles.iaLoadingText}>La IA está resolviendo el ejercicio paso a paso... Esto puede tomar unos segundos.</p>
          </div>
        )}

        {iaError && (
          <div style={styles.iaError}>
            <strong>⚠ No se pudo conectar con la IA</strong>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5 }}>{iaError}</p>
          </div>
        )}

        {iaRespuesta && (
          <div style={styles.iaContent}>
            <div ref={mathRef} style={styles.iaRespuesta}>
              {iaRespuesta.split('\n').map((line, i) => (
                <p key={i} style={styles.iaLine}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>📊</div>
        <div>
          <div style={styles.headerTitle}>{title}</div>
          <div style={styles.headerSubtitle}>Laboratorio interactivo de graficación</div>
        </div>
      </div>

      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={labelStyle}>f(x) =</label>
          <input style={inputStyle} value={fn} onChange={(e) => setFn(e.target.value)} placeholder="x^2" />
        </div>

        {modo === 'limite' && (
          <div style={styles.inputGroup}>
            <label style={labelStyle}>x →</label>
            <input style={inputStyle} value={a} onChange={(e) => setA(e.target.value)} placeholder="2" />
          </div>
        )}

        {modo === 'derivada' && (
          <>
            <div style={styles.inputGroup}>
              <label style={labelStyle}>x₀ =</label>
              <input style={inputStyle} value={x0} onChange={(e) => setX0(e.target.value)} placeholder="2" />
            </div>
            <div style={styles.inputGroup}>
              <label style={labelStyle}>h =</label>
              <input style={inputStyle} value={h} onChange={(e) => setH(e.target.value)} placeholder="0.5" />
            </div>
          </>
        )}

        <button style={styles.btn} onClick={handleGraficar} disabled={loading}>
          {loading ? 'Graficando...' : '▶ Resolver y Graficar'}
        </button>
      </div>

      <div style={styles.plotArea}>
        <svg ref={svgRef} style={styles.svg} />
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>⚠ Error:</strong> {error}
        </div>
      )}

      {resultado && (
        <div style={styles.results}>
          {resultado.mensaje && (
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Resultado</div>
              <div style={styles.resultValue}>{resultado.mensaje}</div>
            </div>
          )}
          {resultado.derivada && (
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Derivada</div>
              <div style={styles.resultValue}>f&apos;(x) = {resultado.derivada}</div>
            </div>
          )}
          {resultado.pendienteTangente !== undefined && (
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Pendiente Tangente</div>
              <div style={styles.resultValue}>f&apos;(x₀) = {resultado.pendienteTangente}</div>
              {resultado.ecuacionTangente && <div style={styles.resultSub}>Ecuación: {resultado.ecuacionTangente}</div>}
            </div>
          )}
          {resultado.fEnA !== undefined && (
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Evaluación</div>
              <div style={styles.resultSub}>f({a}) = {resultado.fEnA}</div>
              <div style={styles.resultSub}>f({a}-0.001) ≈ {resultado.fEnA_izq}</div>
              <div style={styles.resultSub}>f({a}+0.001) ≈ {resultado.fEnA_der}</div>
            </div>
          )}

          {/* Botón de IA */}
          <div style={styles.iaCta}>
            <div style={styles.iaCtaText}>
              <span style={styles.iaCtaEmoji}>🧠</span>
              ¿Quieres ver la resolución paso a paso del ejercicio?
            </div>
            <button style={styles.iaCtaBtn} onClick={handleResolverIA} disabled={iaLoading}>
              {iaLoading ? 'Consultando IA...' : '🤖 Ver resolución con IA'}
            </button>
          </div>
        </div>
      )}

      {renderResultadoIA()}
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
    gap: '16px',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC',
  },
  headerIcon: { fontSize: '22px' },
  headerTitle: { fontWeight: 700, fontSize: '15px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" },
  headerSubtitle: { fontSize: '12px', color: '#64748B' },
  inputRow: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px', padding: '0 20px',
  },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '100px', flex: 1 },
  btn: {
    padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0047CC', color: '#fff',
    fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,71,204,0.25)',
    transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  },
  plotArea: {
    minHeight: '320px', background: '#F8FAFC', margin: '0 20px', borderRadius: '12px',
    border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  svg: { width: '100%', height: '320px', display: 'block' },
  results: { padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  resultCard: { background: '#F8FAFC', borderRadius: '12px', padding: '14px 16px', border: '1px solid #E2E8F0' },
  resultLabel: {
    fontSize: '11px', fontWeight: 700, color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
  },
  resultValue: { fontSize: '15px', fontWeight: 700, color: '#1E293B', fontFamily: "'Poppins', sans-serif" },
  resultSub: { fontSize: '13px', color: '#64748B', marginTop: '4px' },
  errorBox: {
    padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: '10px', color: '#DC2626', fontSize: '14px', margin: '0 20px',
  },

  // IA CTA
  iaCta: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '12px', flexWrap: 'wrap',
    padding: '14px 16px', background: '#EFF6FF', borderRadius: '12px',
    border: '1px solid #BFDBFE',
  },
  iaCtaText: {
    fontSize: '14px', color: '#1E40AF', fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  iaCtaEmoji: { fontSize: '18px' },
  iaCtaBtn: {
    padding: '10px 18px', borderRadius: '10px', border: 'none',
    background: '#0A1628', color: '#fff', fontSize: '13px', fontWeight: 700,
    cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  // IA Panel
  iaPanel: {
    margin: '0 20px 20px',
    background: '#fff', borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  iaHeader: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 16px', background: '#0A1628', color: '#fff',
  },
  iaEmoji: { fontSize: '20px' },
  iaTitle: { fontWeight: 700, fontSize: '14px', fontFamily: "'Poppins', sans-serif" },
  iaSubtitle: { fontSize: '11px', opacity: 0.75 },
  iaClose: {
    marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none',
    color: '#fff', width: '28px', height: '28px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px',
  },
  iaLoading: {
    padding: '32px 24px', textAlign: 'center', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '12px',
  },
  spinner: {
    width: '32px', height: '32px', borderRadius: '50%',
    border: '3px solid #E2E8F0', borderTopColor: '#0047CC',
    animation: 'spin 1s linear infinite',
  },
  iaLoadingText: { fontSize: '14px', color: '#64748B', margin: 0, maxWidth: '280px' },
  iaError: {
    padding: '16px', background: '#FEF2F2', color: '#991B1B', fontSize: '14px',
  },
  iaContent: { padding: '16px', maxHeight: '500px', overflowY: 'auto' },
  iaRespuesta: { fontSize: '14px', lineHeight: 1.7, color: '#334155' },
  iaLine: { margin: '0 0 8px' },
  iaMath: {
    fontFamily: "'Courier New', monospace", fontWeight: 700,
    color: '#0047CC', background: '#EFF6FF', padding: '1px 4px', borderRadius: '4px',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
