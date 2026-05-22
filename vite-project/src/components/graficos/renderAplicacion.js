import functionPlot from 'function-plot';
import { evaluarFuncion, derivarFuncion, buscarExtremos } from './helpers';

export function renderAplicacion(containerId, params, onResult) {
  const { fn, subtipo, a, b, h } = params;
  if (!fn) {
    return { error: 'Ingresa una funcion f(x).' };
  }

  const container = document.getElementById(containerId);
  if (!container) return { error: 'Contenedor no encontrado' };
  container.innerHTML = '';

  const testVal = evaluarFuncion(fn, 1);
  if (testVal === null) {
    return { error: 'No se puede evaluar la funcion. Revisa la sintaxis.' };
  }

  const data = [{
    fn: fn,
    color: '#0047CC',
    nSamples: 400,
    graphType: 'polyline',
  }];

  let resultado = {};
  const xMin = -5;
  const xMax = 5;

  switch (subtipo) {
    case 'extremos': {
      const dStr = derivarFuncion(fn);
      if (dStr) {
        data.push({
          fn: dStr,
          color: '#F4B400',
          nSamples: 400,
          graphType: 'polyline',
          dash: [5, 5],
        });
      }
      const extremos = buscarExtremos(fn, xMin, xMax, 0.05);
      resultado = { subtipo: 'extremos', derivada: dStr, extremos };
      break;
    }

    case 'concavidad': {
      const dStr = derivarFuncion(fn);
      const ddStr = dStr ? derivarFuncion(dStr) : null;
      if (dStr) {
        data.push({
          fn: dStr,
          color: '#F4B400',
          nSamples: 400,
          graphType: 'polyline',
          dash: [5, 5],
        });
      }
      if (ddStr) {
        data.push({
          fn: ddStr,
          color: '#EF4444',
          nSamples: 400,
          graphType: 'polyline',
          dash: [2, 2],
        });
      }
      resultado = { subtipo: 'concavidad', primeraDerivada: dStr, segundaDerivada: ddStr };
      break;
    }

    case 'tvm': {
      const aNum = parseFloat(a || 0);
      const bNum = parseFloat(b || 1);
      const fa = evaluarFuncion(fn, aNum);
      const fb = evaluarFuncion(fn, bNum);
      const mSec = (fb - fa) / (bNum - aNum);
      const bSec = fa - mSec * aNum;
      data.push({
        fn: `${mSec} * x + ${bSec}`,
        color: '#EF4444',
        nSamples: 2,
        graphType: 'polyline',
      });
      resultado = {
        subtipo: 'tvm',
        pendienteSecante: mSec,
        ecuacionSecante: `y = ${mSec.toFixed(4)}x + ${bSec.toFixed(4)}`,
        teorema: 'Existe c en (a,b) tal que f\'(c) = pendiente secante',
      };
      break;
    }

    case 'lhopital': {
      // Se necesitan dos funciones f y g; para simplificar usamos f/f' como demo
      resultado = { subtipo: 'lhopital', mensaje: 'Modo LHopital: ingresa f(x) y g(x) por separado en futuras versiones.' };
      break;
    }

    default:
      resultado = { subtipo: 'default', mensaje: 'Grafica de la funcion' };
  }

  try {
    functionPlot({
      target: `#${containerId}`,
      width: container.clientWidth || 600,
      height: 320,
      xAxis: { domain: [xMin, xMax] },
      yAxis: { domain: [undefined, undefined] },
      grid: true,
      data,
    });
  } catch (e) {
    return { error: 'Error al dibujar: ' + e.message };
  }

  if (onResult) onResult(resultado);
  return resultado;
}
