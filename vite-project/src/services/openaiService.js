/**
 * Servicio para interactuar con la API de OpenAI (modelo o3-mini)
 * Resuelve ejercicios de cálculo paso a paso.
 *
 * NOTA DE SEGURIDAD: En una aplicación de producción real,
 * esta llamada DEBE ir a través de un backend proxy para no
 * exponer la API key en el cliente. Por ahora es un frontend
 * educativo/demo.
 */

const DEV = import.meta.env.DEV;

/**
 * Obtiene la API key de OpenAI.
 */
function getApiKey() {
  return import.meta.env.VITE_OPENAI_API_KEY || null;
}

/**
 * Valida que el input del usuario sea un ejercicio de cálculo
 * y no un intento de jailbreak o prompt injection.
 * Retorna true si el input es válido.
 */
function validarInputSeguro(input) {
  if (!input || input.length > 500) return false;

  // Palabras clave sospechosas de jailbreak / prompt injection
  const blacklist = [
    'ignora tus instrucciones', 'ignore your instructions',
    'eres un', 'pretend', 'pretende', 'actúa como si',
    'olvida lo anterior', 'forget previous',
    'nuevo rol', 'new role', 'cambia de rol',
    'sin restricciones', 'without restrictions', 'no rules',
    'hack', 'exploit', 'vulnerabilidad',
    'dan', 'jailbreak', 'prompt injection',
    'codigo malicioso', 'malware', 'virus',
    'genera contenido', 'generate content',
    'escribe un poema', 'write a poem', 'cuentame un chiste',
    'traduce', 'translate',
    'sql', 'xss', 'csrf',
  ];

  const lowerInput = input.toLowerCase();
  for (const palabra of blacklist) {
    if (lowerInput.includes(palabra)) return false;
  }

  // Debe contener al menos una palabra clave de matematicas/calculo
  const mathKeywords = [
    'limite', 'límite', 'lim', 'limit',
    'derivada', 'derivar', 'derivative', 'differentiate',
    'integral', 'integrar',
    'funcion', 'función', 'function',
    'calcular', 'resuelve', 'resolver', 'calcula', 'solve',
    'hallar', 'encontrar', 'find',
    'ecuacion', 'ecuación',
    'maximo', 'maximos', 'mínimo', 'minimos',
    'concavidad', 'punto de inflexion',
    'asintota', 'asíntota',
    'tangente', 'secante',
    'sen', 'sin', 'cos', 'tan',
    'log', 'ln', 'exp', 'e^',
    'x^2', 'x^3', 'x^',
    'factorizar', 'factorize',
    'indeterminacion', 'indeterminación',
    'continuidad', 'continuo',
    'optimiz', 'crecimiento', 'decrecimiento',
    'rolle', 'valor medio', 'lhopital', 'l\'hopital',
    'evaluar', 'evaluate', 'evaluar en',
    'paso a paso', 'step by step',
  ];

  const tieneMathKeyword = mathKeywords.some(kw => lowerInput.includes(kw));
  if (!tieneMathKeyword) return false;

  return true;
}

/**
 * Arma el prompt según el modo y parámetros del ejercicio.
 */
function construirPrompt(modo, params) {
  const { fn, a, x0 } = params;

  if (modo === 'limite') {
    return `Actúa como un profesor experto de Cálculo I universitario.
  
  Tu tarea es RESOLVER PASO A PASO el siguiente límite y explicarlo con calma,
  como si se lo enseñaras a un estudiante con ansiedad matemática. Usa lenguaje
  sencillo, tono amable y motívalo en el proceso. No asumas que ya sabe mucho.
  
  PROBLEMA:
  Calcular el límite de f(x) = ${fn} cuando x → ${a}.
  
  Estructura OBLIGATORIA de la respuesta:
  
  1. Identificación del tipo de límite
     - Explica qué tipo de límite es (finito, infinito, con asíntota, etc.)
     - Di brevemente por qué.
  
  2. Primer intento: sustitución directa
     - Intenta reemplazar x por ${a} en f(x).
     - Explica qué valor se obtiene o si aparece una forma indeterminada.
  
  3. Elección de la técnica
     - Si hay indeterminación, explica QUÉ técnica usarás (factorización,
       racionalización, simplificación, etc.) y POR QUÉ es adecuada.
  
  4. Desarrollo algebraico paso a paso
     - Muestra cada transformación de la expresión en una línea separada.
     - En cada paso, explica con una frase sencilla qué estás haciendo
       (por ejemplo: "ahora factorizamos", "dividimos todo entre x", etc.).
  
  5. Cálculo del límite y verificación
     - Una vez simplificada la expresión, vuelve a sustituir x por ${a}.
     - Explica cómo obtienes el valor final del límite.
     - Comenta brevemente si el resultado tiene sentido.
  
  6. Interpretación geométrica
     - Explica qué significa el resultado en la gráfica de f(x).
     - Menciona qué pasa con la función cuando x se acerca a ${a}.
  
  MUY IMPORTANTE:
  - No des solo el resultado final.
  - Muestra TODO el procedimiento con pasos numerados y explicaciones claras.
  - Evita el lenguaje técnico innecesario y prioriza que el estudiante entienda.`;
  }

  if (modo === 'derivada') {
    return `Actúa como un profesor experto de Cálculo I universitario.
  
  Tu tarea es RESOLVER PASO A PASO la siguiente derivada y explicarla con calma,
  como si se la enseñaras a un estudiante con ansiedad matemática. Usa lenguaje
  sencillo, tono amable y motiva al estudiante. No asumas que ya sabe todas las reglas.
  
  PROBLEMA:
  Hallar la derivada de f(x) = ${fn}.
  Luego evaluar esa derivada en x = ${x0 || '0'}.
  
  Estructura OBLIGATORIA de la respuesta:
  
  1. Identificación de la expresión y de las reglas
     - Reescribe claramente f(x).
     - Indica qué reglas de derivación vas a usar
       (potencia, constante, suma/resta, producto, cociente, cadena, etc.).
     - Explica brevemente por qué esas reglas son necesarias.
  
  2. Derivación paso a paso
     - Aplica las reglas una por una.
     - Muestra cada paso en una línea separada.
     - En cada paso, explica con una frase sencilla qué estás haciendo
       (por ejemplo: "aplicamos la regla de la potencia", "usamos la regla del producto", etc.).
  
  3. Simplificación de la derivada
     - Simplifica la expresión obtenida (junta términos semejantes, factoriza si ayuda).
     - Explica brevemente cada simplificación importante.
     - Indica claramente la forma final de f'(x).
  
  4. Evaluación en el punto x = ${x0 || '0'}
     - Sustituye x = ${x0 || '0'} en f'(x).
     - Muestra los cálculos numéricos paso a paso.
     - Indica el valor numérico final de la pendiente en ese punto.
  
  5. Interpretación geométrica
     - Explica qué significa el valor de la derivada en x = ${x0 || '0'}.
     - Menciona que representa la pendiente de la recta tangente a la gráfica de f(x)
       en ese punto, y describe si la función está creciendo o decreciendo allí.
  
  MUY IMPORTANTE:
  - No des solo la fórmula final.
  - Muestra TODO el procedimiento con pasos claros y numerados.
  - Evita lenguaje excesivamente técnico y prioriza que el estudiante entienda.`;
  }

  return `Actúa como un profesor experto de Cálculo I universitario.

  Tu tarea es RESOLVER PASO A PASO el siguiente problema de cálculo:

  f(x) = ${fn}

  Primero, identifica claramente qué tipo de problema es
  (por ejemplo: límite, derivada, máximo/mínimo, etc.),
  y luego resuélvelo explicando cada paso con calma y claridad,
  como si se lo enseñaras a un estudiante que se siente abrumado con las matemáticas.

  Usa lenguaje sencillo, evita tecnicismos innecesarios y, en cada paso,
  explica brevemente qué haces y por qué lo haces.

  IMPORTANTE:
  - No muestres solo la respuesta final.
  - Muestra TODO el procedimiento de forma ordenada y fácil de seguir.`;
  }

/**
 * Envía el ejercicio a OpenAI y devuelve la resolución paso a paso.
 * @param {string} modo - 'limite' | 'derivada' | 'aplicacion'
 * @param {Object} params - { fn, a, x0, h }
 * @returns {Promise<{ok: boolean, respuesta?: string, error?: string}>}
 */
export async function resolverConIA(modo, params) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { ok: false, error: 'NO_API_KEY' };
  }

  const prompt = construirPrompt(modo, params);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'o3-mini',
        messages: [
          {
            role: 'system',
            content:
              'Eres un profesor paciente de Cálculo I. Resuelves paso a paso. Nunca saltas pasos. Usas LaTeX simple ($...$) para fórmulas. Animas al estudiante. Eres claro y didáctico. IMPORTANTE: Solo respondes preguntas de cálculo matemático. Si te preguntan algo no relacionado con cálculo, responde educadamente que solo puedes ayudar con ejercicios de cálculo.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_completion_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (DEV) console.error('OpenAI API error:', errData);
      return {
        ok: false,
        error: `Error ${response.status}: ${errData.error?.message || response.statusText}`,
      };
    }

    const data = await response.json();
    const respuesta = data.choices?.[0]?.message?.content?.trim();

    if (!respuesta) {
      return { ok: false, error: 'La IA no devolvió una respuesta válida.' };
    }

    return { ok: true, respuesta };
  } catch (e) {
    if (DEV) console.error('Error llamando a OpenAI:', e);
    return {
      ok: false,
      error: 'Error de conexión con OpenAI. Revisa tu conexión a internet.',
    };
  }
}
