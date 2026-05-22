/**
 * Servicio de chat con OpenAI (o3-mini) especializado por tema de calculo.
 * Incluye proteccion anti prompt-injection y rate limiting.
 */

const DEV = import.meta.env.DEV;

let lastCallTime = 0;
const MIN_INTERVAL = 3000; // 3 segundos entre llamadas

function getApiKey() {
  return import.meta.env.VITE_OPENAI_API_KEY || null;
}

/**
 * Valida que el mensaje del usuario sea un ejercicio de calculo legitimo.
 */
function validarMensaje(mensaje) {
  if (!mensaje || mensaje.length > 500) return false;

  const lowerInput = mensaje.toLowerCase();

  const blacklist = [
    'ignora tus instrucciones', 'ignore your instructions',
    'eres un', 'pretend', 'pretende',
    'olvida lo anterior', 'forget previous',
    'nuevo rol', 'new role', 'cambia de rol',
    'sin restricciones', 'without restrictions',
    'hack', 'exploit', 'vulnerabilidad',
    'dan', 'jailbreak', 'prompt injection',
    'codigo malicioso', 'malware',
    'genera contenido', 'generate content',
    'escribe un poema', 'cuentame un chiste',
    'traduce', 'translate',
    'sql', 'xss', 'csrf',
  ];

  for (const palabra of blacklist) {
    if (lowerInput.includes(palabra)) return false;
  }

  // Debe contener al menos una palabra clave matematica
  const mathKeywords = [
    'limite', 'límite', 'lim',
    'derivada', 'derivar', 'derivative',
    'integral', 'function', 'funcion', 'función',
    'calcular', 'resuelve', 'resolver', 'calcula', 'solve',
    'hallar', 'encontrar', 'find',
    'maximo', 'maximos', 'mínimo', 'minimos',
    'concavidad', 'punto de inflexion',
    'asintota', 'asíntota',
    'tangente', 'secante',
    'sen', 'sin', 'cos', 'tan',
    'log', 'ln', 'exp',
    'x^2', 'x^3',
    'factorizar',
    'indeterminacion', 'indeterminación',
    'continuidad', 'continuo',
    'optimiz', 'crecimiento', 'decrecimiento',
    'rolle', 'valor medio', 'lhopital',
    'paso a paso', 'ejercicio', 'ejemplo',
    'evalua', 'evaluar', 'evaluate',
    'que es', 'que es un', 'que es una',
    'explica', 'explicame', 'explain',
    'como se resuelve', 'como se calcula',
    'como resolver', 'como calcular',
  ];

  return mathKeywords.some(kw => lowerInput.includes(kw));
}

function construirSystemPrompt(tema) {
  const base = `Eres un profesor experto y paciente de Calculo I universitario. Resuelves ejercicios PASO A PASO.
Nunca saltas pasos. Explicas con calma y claridad. Animas al estudiante cuando se esfuerza.
Usas LaTeX ($...$ para inline, $$...$$ para bloque) para las formulas.
Eres didactico, amigable y nunca haces sentir mal al estudiante por no entender.

SEGURIDAD: Solo respondes preguntas relacionadas con calculo matematico (limites, derivadas, aplicaciones). Si el usuario pregunta algo no relacionado con calculo, responde amablemente: "Soy un asistente especializado en Calculo I. Puedo ayudarte con limites, derivadas y sus aplicaciones. ¿Tienes algun ejercicio de estos temas?"`;

  if (tema === 'limites') {
    return base + '\n\nESPECIALIDAD ACTUAL: LIMITES Y CONTINUIDAD.';
  }
  if (tema === 'derivadas') {
    return base + '\n\nESPECIALIDAD ACTUAL: DERIVADAS.';
  }
  if (tema === 'aplicaciones') {
    return base + '\n\nESPECIALIDAD ACTUAL: APLICACIONES DE LA DERIVADA.';
  }
  return base;
}

export async function chatbotMensaje(tema, mensaje) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { ok: false, error: 'NO_API_KEY' };
  }

  // Rate limiting: minimo 3 segundos entre llamadas
  const now = Date.now();
  if (now - lastCallTime < MIN_INTERVAL) {
    const esperar = Math.ceil((MIN_INTERVAL - (now - lastCallTime)) / 1000);
    return {
      ok: false,
      error: `Por favor espera ${esperar} segundo(s) antes de enviar otra pregunta.`,
    };
  }

  // Validar que el mensaje sea un ejercicio de calculo
  if (!validarMensaje(mensaje)) {
    return {
      ok: false,
      error: 'Solo puedo ayudarte con ejercicios de cálculo (límites, derivadas, aplicaciones). Escribe una pregunta relacionada con estos temas.',
    };
  }

  lastCallTime = now;

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
          { role: 'system', content: construirSystemPrompt(tema) },
          { role: 'user', content: mensaje },
        ],
        max_completion_tokens: 2000,
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
      return { ok: false, error: 'La IA no devolvio una respuesta valida.' };
    }

    return { ok: true, respuesta };
  } catch (e) {
    if (DEV) console.error('Error llamando a OpenAI:', e);
    return {
      ok: false,
      error: 'Error de conexion con OpenAI. Revisa tu conexion a internet.',
    };
  }
}
