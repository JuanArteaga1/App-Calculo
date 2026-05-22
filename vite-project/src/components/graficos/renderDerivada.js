import functionPlot from 'function-plot';
import { evaluarFuncion, derivarFuncion, rectaTangente, rectaSecante } from './helpers';

export function renderDerivada(containerId, params, onResult) {
  const { fn, x0, h } = params;
  if (!fn || x0 === undefined || x0 === '') {
    return { error: 'Ingresa una funcion f(x) y un valor x0.' };
  }

  const x0Num = parseFloat(x0);
  const hNum = h !== undefined && h !== '' ? parseFloat(h) : 0.5;

  if (isNaN(x0Num)) {
    return { error: 'El valor x0 debe ser un numero.' };
  }

  const container = document.getElementById(containerId);
  if (!container) return { error: 'Contenedor no encontrado' };
  container.innerHTML = '';

  // Verificar funcion valida
  const testVal = evaluarFuncion(fn, x0Num);
  if (testVal === null) {
    return { error: 'No se puede evaluar la funcion. Revisa la sintaxis.' };
  }

  // Calcular derivada simbolica
  const dStr = derivarFuncion(fn);
  const mTangente = dStr ? evaluarFuncion(dStr, x0Num) : null;
  const fx0 = evaluarFuncion(fn, x0Num);

  // Recta tangente
  const tangente = rectaTangente(fn, x0Num);

  // Recta secante (si hay h)
  const secante = !isNaN(hNum) && hNum !== 0 ? rectaSecante(fn, x0Num, hNum) : null;

  // Preparar datos
  const data = [{
    fn: fn,
    color: '#0047CC',
    nSamples: 400,
    graphType: 'polyline',
  }];

  // Dibujar derivada f'(x) como segunda curva (opcional, punteada)
  if (dStr) {
    data.push({
      fn: dStr,
      color: '#F4B400',
      nSamples: 400,
      graphType: 'polyline',
      fnType: 'linear',
    });
  }

  // Trazo tangente
  if (tangente) {
    data.push({
      fn: tangente.ecuacion,
      color: '#EF4444',
      nSamples: 2,
      graphType: 'polyline',
    });
  }

  // Trazo secante
  if (secante) {
    data.push({
      fn: secante.ecuacion,
      color: '#10B981',
      nSamples: 2,
      graphType: 'polyline',
      dash: [5, 5],
    });
  }

  const rango = 3;
  try {
    functionPlot({
      target: `#${containerId}`,
      width: container.clientWidth || 600,
      height: 320,
      xAxis: { domain: [x0Num - rango, x0Num + rango] },
      yAxis: { domain: [undefined, undefined] },
      grid: true,
      data,
      tip: {
        xLine: true,
        yLine: true,
      },
    });
  } catch (e) {
    return { error: 'Error al dibujar: ' + e.message };
  }

  const resultado = {
    derivada: dStr,
    fEnX0: fx0,
    pendienteTangente: mTangente,
    ecuacionTangente: tangente ? `y = ${tangente.pendiente.toFixed(4)}(x - ${x0Num}) + ${fx0.toFixed(4)}` : null,
    ecuacionSecante: secante ? `m = ${secante.pendiente.toFixed(4)}` : null,
    h: hNum,
  };

  if (onResult) onResult(resultado);
  return resultado;
}
