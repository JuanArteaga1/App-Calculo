import functionPlot from 'function-plot';
import { evaluarFuncion, generarTablaLimites, analizarLimite } from './helpers';

export function renderLimite(containerId, params, onResult) {
  const { fn, a } = params;
  if (!fn || a === undefined || a === '') {
    return { error: 'Ingresa una funcion f(x) y un valor a.' };
  }

  const aNum = parseFloat(a);
  if (isNaN(aNum)) {
    return { error: 'El valor a debe ser un numero.' };
  }

  const container = document.getElementById(containerId);
  if (!container) return { error: 'Contenedor no encontrado' };
  container.innerHTML = '';

  const testVal = evaluarFuncion(fn, aNum + 0.1);
  if (testVal === null) {
    return { error: 'No se puede evaluar la funcion. Revisa la sintaxis (usa x como variable).' };
  }

  const analisis = analizarLimite(fn, aNum);
  const rango = analisis.esInfinito ? 4 : 2;
  const xMin = aNum - rango;
  const xMax = aNum + rango;

  try {
    functionPlot({
      target: `#${containerId}`,
      width: container.clientWidth || 600,
      height: 320,
      xAxis: { domain: [xMin, xMax] },
      yAxis: { domain: [undefined, undefined] },
      grid: true,
      data: [{
        fn: fn,
        color: '#0047CC',
        nSamples: 500,
        graphType: 'polyline',
      }],
    });
  } catch (e) {
    return { error: 'Error al dibujar la grafica: ' + e.message };
  }

  const tabla = generarTablaLimites(fn, aNum, 0.5, 6);

  const resultado = {
    tipo: analisis.tipo,
    mensaje: analisis.mensaje,
    valorIzq: analisis.valorIzq,
    valorDer: analisis.valorDer,
    tabla,
    esInfinito: analisis.esInfinito,
  };

  if (onResult) onResult(resultado);
  return resultado;
}
