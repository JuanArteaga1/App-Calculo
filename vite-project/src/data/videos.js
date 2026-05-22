export const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'limites', label: 'Límites y Continuidad' },
  { id: 'derivadas', label: 'Derivadas' },
  { id: 'aplicaciones', label: 'Aplicaciones' },
];

export const niveles = [
  { id: 'todos', label: 'Todos' },
  { id: 'basico', label: 'Básico' },
  { id: 'intermedio', label: 'Intermedio' },
  { id: 'avanzado', label: 'Avanzado' },
];

/**
 * Extrae el video ID de YouTube de cualquier formato de URL:
 * - https://www.youtube.com/watch?v=ABC123
 * - https://youtu.be/ABC123
 * - https://youtube.com/shorts/ABC123
 * - https://www.youtube.com/embed/ABC123
 */
export function extraerYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;
  url = url.trim();
  if (url.length === 11 && /^[\w-]+$/.test(url)) return url; // ya es un ID

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
    /\/([\w-]{11})$/,
  ];

  for (const regex of patterns) {
    const match = url.match(regex);
    if (match) return match[1];
  }

  // Intentar extraer v= de query string
  try {
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get('v');
    if (v && /^[\w-]{11}$/.test(v)) return v;
  } catch {
    // no es URL válida
  }

  return null;
}

export const youtubeThumb = (id) =>
  id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '/Estudiantes(1).jpeg';

export const youtubeEmbed = (id) =>
  id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : '';




// Videos base del sistema
export const videosBase = [
  {
    id: 'v01',
    titulo: 'Introducción a los Límites',
    descripcion: 'Concepto intuitivo de límite, notación y primeros ejemplos de sustitución directa e indeterminaciones.',
    youtubeId: 'https://www.youtube.com/watch?v=o2UTk8bsLS0&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=1',
    unidad: 'limites',
    tema: '1.1',
    duracion: '12:34',
    nivel: 'basico',
    visto: false,
  },
  {
    id: 'v02',
    titulo: 'Propiedades de los Límites',
    descripcion: 'Suma, resta, multiplicación, cociente y potencias. Resolución paso a paso de ejercicios combinados.',
    youtubeId: 'https://www.youtube.com/watch?v=nTaiyaoyJhw&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=2',
    unidad: 'limites',
    tema: '1.2',
    duracion: '15:20',
    nivel: 'basico',
    visto: true,
  },
  {
    id: 'v03',
    titulo: 'Límites Laterales',
    descripcion: 'Límites por la izquierda y por la derecha. Cómo determinar si existe el límite general.',
    youtubeId: 'https://www.youtube.com/watch?v=RdLtaXRO_Ik&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=3',
    unidad: 'limites',
    tema: '1.3',
    duracion: '10:45',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v04',
    titulo: 'Límites al Infinito',
    descripcion: 'Comportamiento de funciones cuando x tiende a infinito. Reglas prácticas para polinomios y racionales.',
    youtubeId: 'https://www.youtube.com/watch?v=LyLYoQKkOOc&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=4',
    unidad: 'limites',
    tema: '1.4',
    duracion: '14:10',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v05',
    titulo: 'Asíntotas Verticales, Horizontales y Oblicuas',
    descripcion: 'Cómo hallar y graficar asíntotas. Ejemplos detallados con funciones racionales.',
    youtubeId: 'https://www.youtube.com/watch?v=jz3WrcPJWps&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=5',
    unidad: 'limites',
    tema: '1.5',
    duracion: '18:05',
    nivel: 'avanzado',
    visto: false,
  },
  {
    id: 'v06',
    titulo: 'Límites Trigonométricos',
    descripcion: 'Demostración del límite sen(x)/x y otros límites trigonométricos fundamentales.',
    youtubeId: 'https://www.youtube.com/watch?v=kRaL0widcCY&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=6',
    unidad: 'limites',
    tema: '1.6',
    duracion: '16:30',
    nivel: 'intermedio',
    visto: true,
  },
  {
    id: 'v07',
    titulo: 'Continuidad y Discontinuidades',
    descripcion: 'Tipos de discontinuidad: removible y esencial. Cómo redefinir funciones para hacerlas continuas.',
    youtubeId: 'https://www.youtube.com/watch?v=h9lEAU5-CSg&list=PLeySRPnY35dG9t51yT4nCwQEtWwCwvBwn&index=7',
    unidad: 'limites',
    tema: '1.9',
    duracion: '13:50',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v08',
    titulo: 'Definición de Derivada',
    descripcion: 'De la idea de pendiente a la definición formal por límites. Interpretación geométrica inicial.',
    youtubeId: 'https://www.youtube.com/watch?v=uK4-s0ojHFg&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=1',
    unidad: 'derivadas',
    tema: '2.1',
    duracion: '14:15',
    nivel: 'basico',
    visto: false,
  },
  {
    id: 'v09',
    titulo: 'Reglas Básicas de Derivación',
    descripcion: 'Constante, potencia, suma, resta, multiplicación y división. Práctica intensiva de ejercicios.',
    youtubeId: 'https://www.youtube.com/watch?v=pMYdSjgzrys&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=2',
    unidad: 'derivadas',
    tema: '2.3',
    duracion: '20:00',
    nivel: 'basico',
    visto: true,
  },
  {
    id: 'v10',
    titulo: 'Regla de la Cadena',
    descripcion: 'Cómo derivar funciones compuestas paso a paso. Múltiples ejemplos de dificultad creciente.',
    youtubeId: 'https://www.youtube.com/watch?v=U7onW7mMzLM&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=3',
    unidad: 'derivadas',
    tema: '2.4',
    duracion: '17:45',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v11',
    titulo: 'Derivadas Trigonométricas e Inversas',
    descripcion: 'Tabla completa de derivadas trigonométricas y ejercicios con funciones inversas.',
    youtubeId: 'https://www.youtube.com/watch?v=uLDg8fqsuZg&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=4',
    unidad: 'derivadas',
    tema: '2.6',
    duracion: '15:30',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v12',
    titulo: 'Derivadas Exponenciales y Logarítmicas',
    descripcion: 'Derivada de e^x, a^x, ln(x) y logaritmos en cualquier base. Aplicaciones a crecimiento y de Derivada de una función, tercer ejemplo usando la definición en la que se habla del límite y de los incrementos, dentro del curso de derivadas.caimiento.',
    youtubeId: 'https://www.youtube.com/watch?v=L0BZlkBbZmI&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=5',
    unidad: 'derivadas',
    tema: '2.7',
    duracion: '16:10',
    nivel: 'intermedio',
    visto: true,
  },
  {
    id: 'v13',
    titulo: 'Derivación Implícita',
    descripcion: 'Derivada de una función, cuarto ejemplo usando la definición en la que se habla del límite y de los incrementos, dentro del curso de derivadas..',
    youtubeId: 'https://www.youtube.com/watch?v=WCvgGXxJhLU&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=6',
    unidad: 'derivadas',
    tema: '2.8',
    duracion: '14:40',
    nivel: 'avanzado',
    visto: false,
  },
  {
    id: 'v14',
    titulo: 'Derivadas de Orden Superior',
    descripcion: 'Derivada de una función, quinto ejemplo usando la definición en la que se habla del límite y de los incrementos, dentro del curso de derivadas.',
    youtubeId: 'https://www.youtube.com/watch?v=N9yGxJxvWYc&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=7',
    unidad: 'derivadas',
    tema: '2.9',
    duracion: '11:25',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v15',
    titulo: 'Razones de Cambio Relacionadas',
    descripcion: 'Explicación de cómo encontrar la derivada de una constante, explicando qué expresiones se toman como constante cuando vamos a encontrar la derivada, dentro del curso de derivadas.',
    youtubeId: 'https://www.youtube.com/watch?v=T42-57sojsA&list=PLeySRPnY35dG2UQ35tPsaVMYkQhc8Vp__&index=8',
    unidad: 'aplicaciones',
    tema: '3.1',
    duracion: '19:00',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v16',
    titulo: 'Máximos y Mínimos con la Primera Derivada',
    descripcion: 'En este directo explicaré el teorema del valor extremo para funciones continuas, qué son los puntos críticos y cómo obtener los valores máximos y mínimos locales y globales de una función dada.Y también resolveré dudas y ejercicios en directo.¡No se lo pierdan',
    youtubeId: 'https://www.youtube.com/watch?v=tfoDjGYNrKA&list=PL9SnRnlzoyX1Iczh6ssp4N36eDPlhwpoI',
    unidad: 'aplicaciones',
    tema: '3.3',
    duracion: '16:50',
    nivel: 'intermedio',
    visto: true,
  },
  {
    id: 'v17',
    titulo: 'Concavidad y Puntos de Inflexión',
    descripcion: 'En este video veremos qué son los puntos máximo y mínimo global, y máximos y mínimos locales, también veremos qué significa que una función sea creciente o decreciente, todo explicado con gráficas, y veremos de qué forma la derivada interpretada como la pendiente de la recta tangente a una gráfica, pendiente cero es recta horizontal, la cual es tangente a máximos o mínimos, y las tangentes inclinadas con pendiente positiva o negativa determinan puntos donde la función es creciente o decreciente respectivamente. Veremos también 4 pasos que debemos seguir para calcular máximos, mínimos, crecimiento y decrecimiento mediante el método o criterio de la primera derivada (dejaré para otros videos el tema del método o criterio de segunda derivada, concavidad, puntos de inflexión, etc) (Aplicación de la derivada)',
    youtubeId: 'https://www.youtube.com/watch?v=XxxnUPb-JPA&list=PL9SnRnlzoyX1Iczh6ssp4N36eDPlhwpoI&index=2',
    unidad: 'aplicaciones',
    tema: '3.4',
    duracion: '13:35',
    nivel: 'intermedio',
    visto: false,
  },
  {
    id: 'v18',
    titulo: 'Optimización de Problemas Reales',
    descripcion: 'Cómo maximizar áreas, minimizar costos y optimizar recursos usando derivadas.',
    youtubeId: 'https://www.youtube.com/watch?v=sE5jdoJd97g&list=PL9SnRnlzoyX1Iczh6ssp4N36eDPlhwpoI&index=3',
    unidad: 'aplicaciones',
    tema: '3.6',
    duracion: '21:10',
    nivel: 'avanzado',
    visto: false,
  },
  {
    id: 'v19',
    titulo: 'Teorema de Rolle y Valor Medio',
    descripcion: 'Interpretación geométrica y aplicaciones de estos teoremas fundamentales.',
    youtubeId: '5vx1gC2b4jY',
    unidad: 'aplicaciones',
    tema: '3.7',
    duracion: '15:45',
    nivel: 'avanzado',
    visto: false,
  },
  {
    id: 'v20',
    titulo: "Regla de L'Hôpital",
    descripcion: 'Resolución de indeterminaciones 0/0 e infinito/infinito mediante derivadas sucesivas.',
    youtubeId: 'eWStcJcd-mI',
    unidad: 'aplicaciones',
    tema: '3.9',
    duracion: '14:20',
    nivel: 'intermedio',
    visto: true,
  },
  {
    id: 'v21',
    titulo: 'Análisis Completo de Funciones',
    descripcion: 'Guía paso a paso para estudiar dominio, asíntotas, crecimiento, extremos, concavidad y graficar.',
    youtubeId: 'hNfE1Jx2Ofo',
    unidad: 'aplicaciones',
    tema: '3.11',
    duracion: '25:00',
    nivel: 'avanzado',
    visto: false,
  },
  {
    id: 'v22',
    titulo: 'Aplicaciones en Economía y Física',
    descripcion: 'Costo marginal, velocidad, aceleración y diseño óptimo en ingeniería.',
    youtubeId: 'p8b34CQGvYc',
    unidad: 'aplicaciones',
    tema: '3.12',
    duracion: '18:30',
    nivel: 'intermedio',
    visto: false,
  },
];
