// Estructura completa de temas de Cálculo 1
// Unidad 1: Límites y Continuidad
// Unidad 2: Derivadas
// Unidad 3: Aplicaciones de la Derivada

export const unidades = [
  {
    id: 'limites',
    titulo: 'Límites y Continuidad',
    descripcion: 'Comprende el comportamiento de las funciones cuando la variable independiente se aproxima a un valor específico. Fundamento esencial para todo el cálculo diferencial.',
    icono: '∞',
    color: '#0047CC',
    temas: [
      {
        id: '1.1',
        titulo: 'Introducción – Definición de límite',
        descripcion: 'El concepto de límite responde a la pregunta: ¿A qué valor se acerca una función cuando x se aproxima a cierto número?',
        contenido: `
## Concepto

El concepto de límite es uno de los pilares fundamentales del cálculo diferencial, ya que permite estudiar el comportamiento de una función cuando la variable independiente se aproxima a un valor específico.

No siempre importa el valor exacto de la función en ese punto, sino cómo se comporta alrededor de él.

## Definición formal

lim(x→a) f(x) = L

Esto significa que cuando x toma valores cada vez más cercanos a a, entonces f(x) se aproxima a L.

## Condiciones para que exista un límite

1. La función debe acercarse a un único valor.
2. Ese valor debe ser el mismo por ambos lados.
3. No es obligatorio que la función esté definida en ese punto.

## Ejemplo práctico: Sustitución directa

Sea f(x) = x + 4

Calcular: lim(x→2) (x + 4) = 2 + 4 = 6

## Ejemplo práctico: Indeterminación

lim(x→2) (x² - 4)/(x - 2) = 0/0 → Indeterminación

Factorizamos: (x - 2)(x + 2)/(x - 2) = x + 2

Ahora: lim(x→2) (x + 2) = 4

El límite existe y vale 4.
        `
      },
      {
        id: '1.2',
        titulo: 'Propiedades de los límites de funciones',
        descripcion: 'Las propiedades permiten simplificar cálculos complejos sin resolver toda la función desde cero.',
        contenido: `
## Concepto

Si lim(x→a) f(x) = L y lim(x→a) g(x) = M, entonces:

### 1. Propiedad de suma
lim(x→a) [f(x) + g(x)] = L + M

### 2. Propiedad de resta
lim(x→a) [f(x) - g(x)] = L - M

### 3. Multiplicación
lim(x→a) [f(x) · g(x)] = L · M

### 4. Cociente
lim(x→a) [f(x)/g(x)] = L/M,  M ≠ 0

### 5. Potencias
lim(x→a) [f(x)]ⁿ = Lⁿ

## Ejemplo práctico completo

lim(x→2) (x³ + 4x - 1) = 8 + 8 - 1 = 15
        `
      },
      {
        id: '1.3',
        titulo: 'Límites laterales',
        descripcion: 'Estudian el comportamiento de la función desde un solo lado: por la izquierda o por la derecha.',
        contenido: `
## Concepto

Los límites laterales estudian el comportamiento de la función desde un solo lado.

### Límite por la izquierda
lim(x→a⁻) f(x) — Valores menores que a.

### Límite por la derecha
lim(x→a⁺) f(x) — Valores mayores que a.

## Condición de existencia

lim(x→a⁻) f(x) = lim(x→a⁺) f(x) = L

Entonces lim(x→a) f(x) = L

## Ejemplo práctico

f(x) = { 3 si x < 2; 7 si x > 2 }

Izquierda: lim(x→2⁻) f(x) = 3
Derecha: lim(x→2⁺) f(x) = 7

Conclusión: No existe límite general.
        `
      },
      {
        id: '1.4',
        titulo: 'Límites al infinito y en infinito',
        descripcion: 'Analizan el comportamiento extremo de una función cuando x crece o decrece sin límite.',
        contenido: `
## Concepto

Analizan el comportamiento extremo de una función.

### Límite al infinito
Cuando x crece o decrece sin límite.

Ejemplo: lim(x→∞) 1/x = 0

### Límite en infinito
Cuando una función crece indefinidamente cerca de un punto.

Ejemplo: lim(x→0⁺) 1/x = ∞

## Interpretación
- Crecimiento poblacional
- Intereses financieros
- Sistemas físicos
        `
      },
      {
        id: '1.5',
        titulo: 'Asíntotas verticales, horizontales y oblicuas',
        descripcion: 'Rectas a las que una función se aproxima cada vez más sin nunca tocarlas.',
        contenido: `
## Concepto

Las asíntotas son rectas a las que una función se aproxima.

### Verticales
Ocurren cuando el denominador se hace cero.

Ejemplo: f(x) = 1/(x - 1) → Asíntota: x = 1

### Horizontales
Se estudian con lim(x→∞) f(x)

Ejemplo: (2x + 1)/x = 2 → Asíntota: y = 2

### Oblicuas
Cuando el grado del numerador es uno mayor.

Ejemplo: (x² + 1)/x = x + 1/x → Asíntota: y = x
        `
      },
      {
        id: '1.6',
        titulo: 'Límites trigonométricos',
        descripcion: 'Límites fundamentales para derivadas y análisis matemático.',
        contenido: `
## Concepto

Son límites fundamentales para derivadas y análisis matemático.

### Principal
lim(x→0) sen(x)/x = 1

### Otros importantes
- lim(x→0) tan(x)/x = 1
- lim(x→0) (1 - cos(x))/x = 0

## Aplicaciones
- Ondas
- Sonido
- Electricidad
- Ingeniería civil
        `
      },
      {
        id: '1.7',
        titulo: 'Continuidad lateral',
        descripcion: 'Una función tiene continuidad lateral si coincide con su límite lateral correspondiente.',
        contenido: `
## Concepto

Una función tiene continuidad lateral si coincide con su límite lateral correspondiente.

### Por izquierda
lim(x→a⁻) f(x) = f(a)

### Por derecha
lim(x→a⁺) f(x) = f(a)

## Ejemplo
Horarios de atención, impuestos escalonados.
        `
      },
      {
        id: '1.8',
        titulo: 'Continuidad en intervalos abiertos, cerrados y semiabiertos',
        descripcion: 'Análisis de la continuidad según el tipo de intervalo considerado.',
        contenido: `
## Intervalo abierto (a, b)

Continua en cada punto interno.

## Intervalo cerrado [a, b]

Debe cumplir continuidad lateral en extremos.

## Semiabierto [a, b)

Se adapta según el extremo incluido.

## Ejemplo

f(x) = x² es continua porque no tiene interrupciones.
        `
      },
      {
        id: '1.9',
        titulo: 'Discontinuidad removible y discontinuidad esencial',
        descripcion: 'Clasificación de los tipos de discontinuidad que puede presentar una función.',
        contenido: `
## Discontinuidad removible

Existe límite, pero el punto está mal definido.

Ejemplo: (x² - 9)/(x - 3) → Se simplifica a x + 3. Hueco en x = 3.

## Discontinuidad esencial

No existe límite único o tiende a infinito.

### Ejemplo salto
f(x) = { 1 si x < 0; 4 si x > 0 }

### Ejemplo infinita
f(x) = 1/x

## Conclusión

Los límites estudian hacia dónde va una función; la continuidad analiza si llega sin interrupciones.
        `
      }
    ]
  },
  {
    id: 'derivadas',
    titulo: 'Derivadas',
    descripcion: 'Mide cómo cambia una función en un instante específico. Representa la razón de cambio instantánea y la pendiente de la recta tangente.',
    icono: '∂',
    color: '#2563EB',
    temas: [
      {
        id: '2.1',
        titulo: 'Introducción – Definición de derivada',
        descripcion: 'La derivada indica qué tan rápido cambia una cantidad en un momento determinado.',
        contenido: `
## Concepto

La derivada es uno de los conceptos más importantes del cálculo diferencial, ya que mide cómo cambia una función en un instante específico. Representa la razón de cambio instantánea.

## Definición formal

f'(x) = lim(h→0) [f(x+h) - f(x)] / h

Donde:
- f(x+h) - f(x) representa el cambio en la función.
- h representa un cambio muy pequeño en x.

## Interpretación práctica

Si d(t) = t² (distancia), entonces d'(t) = 2t (velocidad).

En t = 3: v = 2(3) = 6 unidades/segundo.

## Importancia
- Ingeniería
- Física
- Economía
- Biología
- Inteligencia artificial
        `
      },
      {
        id: '2.2',
        titulo: 'Interpretación geométrica y física de la derivada',
        descripcion: 'Geométricamente es la pendiente de la recta tangente; físicamente es velocidad y aceleración.',
        contenido: `
## Interpretación geométrica

Geométricamente, la derivada representa la pendiente de la recta tangente a una curva en un punto.

- Pendiente positiva → la función crece.
- Pendiente negativa → la función decrece.
- Pendiente cero → punto máximo o mínimo.

Ejemplo: f(x) = x² → f'(x) = 2x

En x = 2: f'(2) = 4. La pendiente de la tangente es 4.

## Interpretación física

### Velocidad instantánea
Si s(t) = t² + 3t, entonces v(t) = s'(t) = 2t + 3

### Aceleración
a(t) = v'(t)

## Aplicación real
- Movimiento de vehículos
- Caída libre
- Electricidad
- Costos marginales
        `
      },
      {
        id: '2.3',
        titulo: 'Reglas básicas de derivación',
        descripcion: 'Permiten derivar funciones sin usar siempre la definición por límite.',
        contenido: `
## Concepto

Permiten derivar funciones sin usar siempre la definición límite.

### 1. Derivada de constante
d/dx (c) = 0

### 2. Regla de potencia
d/dx (xⁿ) = n·xⁿ⁻¹

Ejemplo: d/dx (x⁴) = 4x³

### 3. Suma y resta
(f ± g)' = f' ± g'

### 4. Multiplicación
(fg)' = f'g + fg'

### 5. División
(f/g)' = (f'g - fg') / g²

## Ejemplo práctico
f(x) = x² + 3x → f'(x) = 2x + 3
        `
      },
      {
        id: '2.4',
        titulo: 'Regla de la cadena',
        descripcion: 'Se utiliza cuando una función está dentro de otra función (funciones compuestas).',
        contenido: `
## Concepto

Se utiliza cuando una función está dentro de otra función.

### Fórmula

(d/dx)[f(g(x))] = f'(g(x)) · g'(x)

## Ejemplo

y = (3x + 2)⁴

Paso 1: Función externa → u⁴
Paso 2: Interna → u = 3x + 2

Derivada: y' = 4(3x + 2)³ · (3) = 12(3x + 2)³

## Aplicación real
- Temperatura compuesta
- Modelos biológicos
- Optimización
        `
      },
      {
        id: '2.5',
        titulo: 'Derivadas de funciones algebraicas',
        descripcion: 'Incluye polinomiales, racionales y radicales.',
        contenido: `
## Funciones polinomiales

Ejemplo: f(x) = 4x³ - 2x + 7 → f'(x) = 12x² - 2

## Funciones racionales

f(x) = (x + 1)/(x - 2) → Usamos regla del cociente.

## Funciones radicales

f(x) = √x = x^(1/2) → f'(x) = 1/(2√x)

## Aplicación
Diseño estructural, áreas, volúmenes.
        `
      },
      {
        id: '2.6',
        titulo: 'Derivadas de funciones trigonométricas',
        descripcion: 'Derivadas de seno, coseno, tangente y sus funciones inversas.',
        contenido: `
## Principales

- d/dx (sen x) = cos x
- d/dx (cos x) = -sen x
- d/dx (tan x) = sec² x

## Trigonométricas inversas

- d/dx (arcsen x) = 1/√(1 - x²)

## Ejemplo práctico

f(x) = sen x + x² → f'(x) = cos x + 2x

## Aplicación
- Ondas
- Circuitos
- Sonido
- Ingeniería
        `
      },
      {
        id: '2.7',
        titulo: 'Derivadas de funciones exponenciales y logarítmicas',
        descripcion: 'Incluye la función especial e^x cuya derivada es ella misma.',
        contenido: `
## Exponencial natural

d/dx (e^x) = e^x

## Exponencial general

d/dx (a^x) = a^x · ln(a)

## Logaritmo natural

d/dx (ln x) = 1/x

## Ejemplo

f(x) = e^x + ln x → f'(x) = e^x + 1/x

## Aplicación
- Interés compuesto
- Crecimiento bacteriano
- Decaimiento radiactivo
        `
      },
      {
        id: '2.8',
        titulo: 'Derivación implícita',
        descripcion: 'Se usa cuando y no está despejada explícitamente en términos de x.',
        contenido: `
## Concepto

Se usa cuando y no está despejada explícitamente.

## Ejemplo

x² + y² = 25

Derivando: 2x + 2y · dy/dx = 0

Despejando: dy/dx = -x/y

## Aplicación
Circunferencias, elipses, geometría analítica.
        `
      },
      {
        id: '2.9',
        titulo: 'Derivadas de orden superior',
        descripcion: 'Son derivadas sucesivas: primera (velocidad), segunda (aceleración), tercera (jerk).',
        contenido: `
## Concepto

Son derivadas sucesivas.

### Primera: Velocidad
### Segunda: Aceleración
### Tercera: Cambio de aceleración

## Ejemplo

f(x) = x⁴
- f'(x) = 4x³
- f''(x) = 12x²
- f'''(x) = 24x

## Aplicación
- Movimiento
- Curvatura
- Optimización
        `
      },
      {
        id: '2.10',
        titulo: 'Diferenciales',
        descripcion: 'Permiten aproximar pequeños cambios en una función usando su derivada.',
        contenido: `
## Concepto

El diferencial permite aproximar pequeños cambios en una función.

### Fórmula

dy = f'(x) · dx

## Ejemplo práctico

y = x²

Si x = 4, dx = 0.1:
dy = 2(4)(0.1) = 0.8

Aproximación: Cuando x pasa de 4 a 4.1, y aumenta aproximadamente 0.8.

## Aplicación real
- Estimación de errores
- Ingeniería
- Mediciones científicas
        `
      }
    ]
  },
  {
    id: 'aplicaciones',
    titulo: 'Aplicaciones de la Derivada',
    descripcion: 'Herramientas para resolver problemas reales de optimización, movimiento, economía e ingeniería usando derivadas.',
    icono: '⚡',
    color: '#059669',
    temas: [
      {
        id: '3.1',
        titulo: 'Razones de cambio relacionadas',
        descripcion: 'Estudian situaciones donde dos o más variables cambian con respecto al tiempo y están conectadas.',
        contenido: `
## Concepto

Las razones de cambio relacionadas estudian situaciones donde dos o más variables cambian con respecto al tiempo y están conectadas por una ecuación.

## Procedimiento general

1. Identificar variables.
2. Relacionarlas mediante una ecuación.
3. Derivar implícitamente respecto al tiempo.
4. Sustituir valores.

## Ejemplo práctico: Globo inflándose

Volumen de una esfera: V = (4/3)πr³

Derivando: dV/dt = 4πr² · dr/dt

Si aumenta el volumen, también cambia el radio.

## Aplicaciones reales
- Tanques llenándose
- Escaleras deslizándose
- Movimiento circular
- Ingeniería hidráulica
        `
      },
      {
        id: '3.2',
        titulo: 'Crecimiento y decrecimiento de funciones',
        descripcion: 'La primera derivada permite determinar si una función aumenta o disminuye.',
        contenido: `
## Concepto

La primera derivada permite determinar si una función aumenta o disminuye.

## Criterios

- Si f'(x) > 0 → La función crece.
- Si f'(x) < 0 → La función decrece.

## Ejemplo

f(x) = x² - 4x
f'(x) = 2x - 4

Punto crítico: 2x - 4 = 0 → x = 2

Intervalos:
- x < 2: decrece
- x > 2: crece

## Aplicación
- Producción empresarial
- Temperatura
- Rendimiento
        `
      },
      {
        id: '3.3',
        titulo: 'Máximos y mínimos relativos',
        descripcion: 'Son puntos donde la función alcanza valores mayores o menores respecto a puntos cercanos.',
        contenido: `
## Concepto

Son puntos donde la función alcanza valores mayores o menores respecto a puntos cercanos.

## Criterio de la primera derivada

1. Hallar f'(x) = 0
2. Analizar cambio de signo.

- + a - → máximo
- - a + → mínimo

## Ejemplo

f(x) = x² - 6x + 5
f'(x) = 2x - 6 → x = 3

Resultado: Mínimo relativo en x = 3.

## Aplicación real
- Ganancia máxima
- Costos mínimos
- Diseño eficiente
        `
      },
      {
        id: '3.4',
        titulo: 'Concavidad y puntos de inflexión',
        descripcion: 'La segunda derivada indica cómo se curva la gráfica de una función.',
        contenido: `
## Concepto

La segunda derivada indica cómo se curva la gráfica.

## Criterios

- Si f''(x) > 0 → Cóncava hacia arriba.
- Si f''(x) < 0 → Cóncava hacia abajo.

## Punto de inflexión

Ocurre cuando cambia la concavidad.

## Ejemplo

f(x) = x³
f''(x) = 6x

En x = 0 cambia de signo.

Resultado: Punto de inflexión en x = 0.

## Aplicación
Economía, trayectorias, estructuras.
        `
      },
      {
        id: '3.5',
        titulo: 'Criterio de la segunda derivada',
        descripcion: 'Permite clasificar puntos críticos más rápidamente que usando solo la primera derivada.',
        contenido: `
## Concepto

Permite clasificar puntos críticos más rápido.

Si f'(a) = 0:

- Si f''(a) > 0 → Mínimo
- Si f''(a) < 0 → Máximo

## Ejemplo

f(x) = x²
f'(x) = 2x
f''(x) = 2 > 0

Resultado: Mínimo en x = 0.
        `
      },
      {
        id: '3.6',
        titulo: 'Optimización',
        descripcion: 'Busca el mejor valor posible: máxima ganancia, mínimo costo, mayor área, menor material.',
        contenido: `
## Concepto

Busca el mejor valor posible:
- Máxima ganancia
- Mínimo costo
- Mayor área
- Menor material

## Pasos

1. Definir función objetivo.
2. Derivar.
3. Igualar a cero.
4. Evaluar.

## Ejemplo práctico

Perímetro: 2x + 2y = 100
Área: A = xy

Despejar: y = 50 - x → A = x(50 - x)

Derivar: A' = 50 - 2x → x = 25

Resultado: Área máxima con cuadrado.

## Aplicación
Arquitectura, economía, logística.
        `
      },
      {
        id: '3.7',
        titulo: 'Teorema de Rolle',
        descripcion: 'Si una función continua en [a,b] cumple f(a)=f(b), existe un punto con tangente horizontal.',
        contenido: `
## Concepto

Si una función:
1. Es continua en [a,b]
2. Derivable en (a,b)
3. f(a) = f(b)

Entonces existe un punto c tal que f'(c) = 0.

## Interpretación geométrica

Hay al menos una tangente horizontal.

## Ejemplo

f(x) = x² - 4x + 3 en [1, 3]

## Aplicación
Control de trayectorias.
        `
      },
      {
        id: '3.8',
        titulo: 'Teorema del Valor Medio',
        descripcion: 'Existe un punto donde la pendiente instantánea iguala la pendiente promedio.',
        contenido: `
## Concepto

Existe un punto donde la pendiente instantánea iguala la pendiente promedio.

### Fórmula

f'(c) = [f(b) - f(a)] / (b - a)

## Ejemplo físico

Si recorres 100 km en 2 horas, en algún momento tu velocidad fue exactamente 50 km/h.

## Aplicación
- Tránsito
- Producción
- Física
        `
      },
      {
        id: '3.9',
        titulo: "Regla de L'Hôpital",
        descripcion: 'Se usa para límites indeterminados del tipo 0/0 o ∞/∞.',
        contenido: `
## Concepto

Se usa para límites indeterminados: 0/0, ∞/∞

### Fórmula

lim f(x)/g(x) = lim f'(x)/g'(x)

## Ejemplo

lim(x→0) sen(x)/x = lim(x→0) cos(x)/1 = 1

## Aplicación
Modelos avanzados.
        `
      },
      {
        id: '3.10',
        titulo: 'Aproximación lineal y diferencial',
        descripcion: 'Permite aproximar valores cercanos usando la recta tangente.',
        contenido: `
## Concepto

Permite aproximar valores cercanos usando la recta tangente.

### Fórmula

L(x) = f(a) + f'(a)(x - a)

## Ejemplo

√4.1

Sea f(x) = √x, aproximando desde x = 4.

## Aplicación
Cálculos rápidos.
        `
      },
      {
        id: '3.11',
        titulo: 'Análisis completo de funciones',
        descripcion: 'Estudio integral: dominio, intersecciones, límites, continuidad, asíntotas, crecimiento, extremos, concavidad y gráfica.',
        contenido: `
## Concepto

Estudio integral de una función:
- Dominio
- Intersecciones
- Límites
- Continuidad
- Asíntotas
- Crecimiento
- Extremos
- Concavidad
- Gráfica

## Objetivo

Comprender completamente su comportamiento.

## Aplicación
Modelado matemático, ingeniería, economía.
        `
      },
      {
        id: '3.12',
        titulo: 'Aplicaciones en economía, física e ingeniería',
        descripcion: 'Costos marginales, velocidad, aceleración, diseño óptimo y resistencia de materiales.',
        contenido: `
## Economía

### Costo marginal
C'(x) — Cambio del costo por unidad adicional.

## Física

### Velocidad
v(t) = s'(t)

### Aceleración
a(t) = v'(t)

## Ingeniería

- Diseño óptimo
- Resistencia de materiales
- Electricidad
- Producción

## Conclusión

La derivada no solo calcula pendientes; permite tomar decisiones, optimizar recursos y comprender fenómenos reales.

Derivar es transformar matemáticas en soluciones para el mundo real.
        `
      }
    ]
  }
];

export function getUnidadById(id) {
  return unidades.find(u => u.id === id);
}

export function getTemaById(unidadId, temaId) {
  const unidad = getUnidadById(unidadId);
  if (!unidad) return null;
  return unidad.temas.find(t => t.id === temaId);
}
