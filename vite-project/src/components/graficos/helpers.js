import { evaluate, derivative } from 'mathjs';

/**
 * Evalua una funcion en un punto dado.
 * @param {string} fnStr - expresion tipo 'x^2'
 * @param {number} xVal - valor de x
 * @returns {number|null} resultado o null si hay error
 */
export function evaluarFuncion(fnStr, xVal) {
  try {
    return evaluate(fnStr, { x: xVal });
  } catch (e) {
    return null;
  }
}

/**
 * Deriva una funcion simbolicamente y retorna la expresion como string.
 * @param {string} fnStr - expresion tipo 'x^2'
 * @returns {string|null} derivada como string o null
 */
export function derivarFuncion(fnStr) {
  try {
    const d = derivative(fnStr, 'x');
    return d.toString();
  } catch (e) {
    return null;
  }
}

/**
 * Genera una tabla de valores alrededor de un punto.
 * Util para limites: evalua f(a - h), f(a - h/2), ..., f(a + h).
 * @param {string} fnStr
 * @param {number} a
 * @param {number} h - valor inicial de h (ej: 0.5)
 * @param {number} pasos - cuantos puntos generar
 * @returns {Array<{h: number, izq: number|null, der: number|null}>}
 */
export function generarTablaLimites(fnStr, a, h, pasos = 5) {
  const tabla = [];
  let hActual = h;
  for (let i = 0; i < pasos; i++) {
    const izq = evaluarFuncion(fnStr, a - hActual);
    const der = evaluarFuncion(fnStr, a + hActual);
    tabla.push({ h: hActual, izq, der });
    hActual = hActual / 2;
  }
  return tabla;
}

/**
 * Construye la ecuacion de la recta tangente a f en x0.
 * @param {string} fnStr
 * @param {number} x0
 * @returns {{pendiente: number, intercepto: number, ecuacion: string}|null}
 */
export function rectaTangente(fnStr, x0) {
  const dStr = derivarFuncion(fnStr);
  if (!dStr) return null;
  const m = evaluarFuncion(dStr, x0);
  const fx0 = evaluarFuncion(fnStr, x0);
  if (m === null || fx0 === null) return null;
  // y - fx0 = m(x - x0) -> y = m*x - m*x0 + fx0
  const b = fx0 - m * x0;
  const ecuacion = `${m} * x + ${b}`;
  return { pendiente: m, intercepto: b, ecuacion: ecuacion };
}

/**
 * Construye la ecuacion de la recta secante que pasa por (x0, f(x0)) y (x0+h, f(x0+h)).
 * @param {string} fnStr
 * @param {number} x0
 * @param {number} h
 * @returns {{pendiente: number, intercepto: number, ecuacion: string}|null}
 */
export function rectaSecante(fnStr, x0, h) {
  const fx0 = evaluarFuncion(fnStr, x0);
  const fxh = evaluarFuncion(fnStr, x0 + h);
  if (fx0 === null || fxh === null || h === 0) return null;
  const m = (fxh - fx0) / h;
  const b = fx0 - m * x0;
  return { pendiente: m, intercepto: b, ecuacion: `${m} * x + ${b}` };
}

/**
 * Detecta casos especiales de limites basado en evaluacion numerica.
 * @param {string} fnStr
 * @param {number} a
 * @returns {{tipo: string, mensaje: string, valorIzq: number|null, valorDer: number|null, esInfinito: boolean}}
 */
export function analizarLimite(fnStr, a) {
  const h = 0.001;
  const izq = evaluarFuncion(fnStr, a - h);
  const der = evaluarFuncion(fnStr, a + h);
  const fa = evaluarFuncion(fnStr, a);

  let tipo = 'limite_finito';
  let mensaje = '';
  let esInfinito = false;

  // Detectar infinito
  if ((izq !== null && Math.abs(izq) > 1e6) || (der !== null && Math.abs(der) > 1e6)) {
    tipo = 'limite_infinito';
    mensaje = 'El limite tiende a infinito (asintota vertical)';
    esInfinito = true;
  } else if (izq !== null && der !== null && Math.abs(izq - der) > 0.1) {
    tipo = 'limites_diferentes';
    mensaje = `Limite izquierdo: ${izq.toFixed(4)}, limite derecho: ${der.toFixed(4)}. No existe el limite general.`;
  } else if (fa !== null && izq !== null && Math.abs(fa - izq) > 0.01) {
    tipo = 'discontinuidad_removible';
    mensaje = `Existe limite (${izq.toFixed(4)}) pero f(${a}) = ${fa.toFixed(4)}. Discontinuidad removible.`;
  } else if (izq !== null) {
    mensaje = `El limite existe y es aproximadamente ${izq.toFixed(4)}`;
  } else {
    mensaje = 'No se pudo evaluar la funcion cerca del punto.';
  }

  return { tipo, mensaje, valorIzq: izq, valorDer: der, esInfinito };
}

/**
 * Busca puntos criticos numericamente evaluando f'(x) en un grid.
 * @param {string} fnStr
 * @param {number} min
 * @param {number} max
 * @param {number} paso
 * @returns {Array<{x: number, y: number, tipo: string}>}
 */
export function buscarExtremos(fnStr, min = -10, max = 10, paso = 0.1) {
  const dStr = derivarFuncion(fnStr);
  if (!dStr) return [];

  const criticos = [];
  let signoAnterior = 0;

  for (let x = min; x <= max; x += paso) {
    const val = evaluarFuncion(dStr, x);
    if (val === null) continue;
    const signo = Math.sign(val);

    if (signoAnterior !== 0 && signo !== 0 && signo !== signoAnterior) {
      // Cambio de signo -> punto critico
      const xCrit = x - paso / 2;
      const yCrit = evaluarFuncion(fnStr, xCrit);
      const tipo = signoAnterior > 0 && signo < 0 ? 'maximo' : 'minimo';
      criticos.push({ x: xCrit, y: yCrit, tipo });
    }
    signoAnterior = signo;
  }

  return criticos;
}

/**
 * Genera datos para function-plot a partir de una expresion.
 * @param {string} fnStr
 * @param {string} color
 * @param {Array} [opts]
 * @returns {Object} objeto de data para function-plot
 */
export function crearTrazo(fnStr, color = '#0047CC', opts = {}) {
  return {
    fn: fnStr,
    color,
    ...opts,
  };
}
