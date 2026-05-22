parte de limites 


# UNIDAD 1: LÍMITES Y CONTINUIDAD (DESARROLLO EXTENSO)

---

# 1.1. Introducción – Definición de límite

## **Concepto:**

El concepto de límite es uno de los pilares fundamentales del cálculo diferencial, ya que permite estudiar el comportamiento de una función cuando la variable independiente se aproxima a un valor específico.

En términos simples, el límite responde a la pregunta:

**¿A qué valor se acerca una función cuando x se aproxima a cierto número?**

No siempre importa el valor exacto de la función en ese punto, sino cómo se comporta alrededor de él.

### Definición formal:

\lim_{x \to a} f(x)=L

Esto significa que cuando **x** toma valores cada vez más cercanos a **a**, entonces **f(x)** se aproxima a **L**.

---

## **Interpretación intuitiva:**

Imagina que conduces hacia una estación de peaje. A medida que te acercas, puedes estimar tu posición respecto a ella sin necesidad de haber llegado exactamente. Eso mismo ocurre con el límite: analiza la aproximación.

---

## **Condiciones para que exista un límite:**

1. La función debe acercarse a un único valor.
2. Ese valor debe ser el mismo por ambos lados.
3. No es obligatorio que la función esté definida en ese punto.

---

## **Ejemplo práctico 1: Sustitución directa**

Sea:

[
f(x)=x+4
]

Calcular:

[
\lim_{x\to2}(x+4)
]

Sustituyendo:

[
2+4=6
]

### Resultado:

[
\lim_{x\to2}(x+4)=6
]

---

## **Ejemplo práctico 2: Indeterminación**

[
\lim_{x\to2}\frac{x^2-4}{x-2}
]

Sustituyendo:

[
\frac{0}{0}
]

Esto es una indeterminación.

Factorizamos:

[
\frac{(x-2)(x+2)}{x-2}
]

Simplificamos:

[
x+2
]

Ahora:

[
\lim_{x\to2}(x+2)=4
]

### Resultado:

El límite existe y vale 4.

---

## **Aplicación en la vida real:**

* Velocidad instantánea
* Crecimiento poblacional
* Economía (costos marginales)
* Ingeniería estructural

---

---

# 1.2. Propiedades de los límites de funciones

## **Concepto:**

Las propiedades de los límites permiten simplificar cálculos complejos sin resolver toda la función desde cero.

Si:

[
\lim_{x\to a}f(x)=L
\quad \text{y} \quad
\lim_{x\to a}g(x)=M
]

Entonces:

---

## **1. Propiedad de suma**

[
\lim_{x\to a}[f(x)+g(x)]=L+M
]

### Ejemplo:

[
\lim_{x\to3}(x^2+2x)
]

[
=9+6=15
]

---

## **2. Propiedad de resta**

[
\lim_{x\to a}[f(x)-g(x)]=L-M
]

---

## **3. Multiplicación**

[
\lim_{x\to a}[f(x)g(x)]=LM
]

---

## **4. Cociente**

[
\lim_{x\to a}\frac{f(x)}{g(x)}=\frac{L}{M}
\quad M\neq0
]

---

## **5. Potencias**

[
\lim_{x\to a}[f(x)]^n=L^n
]

---

## **Ejemplo práctico completo:**

[
\lim_{x\to2}(x^3+4x-1)
]

[
=8+8-1=15
]

---

## **Importancia:**

Estas propiedades se usan en:

* Física
* Estadística
* Modelos financieros
* Programación matemática

---

---

# 1.3. Límites laterales – Límite por la izquierda y por la derecha

## **Concepto:**

Los límites laterales estudian el comportamiento de la función desde un solo lado.

---

## **Límite por la izquierda:**

[
\lim_{x\to a^-}f(x)
]

Valores menores que a.

---

## **Límite por la derecha:**

[
\lim_{x\to a^+}f(x)
]

Valores mayores que a.

---

## **Condición de existencia:**

[
\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)
]

---

## **Ejemplo práctico:**

[
f(x)=
\begin{cases}
3 & x<2 \
7 & x>2
\end{cases}
]

### Izquierda:

[
\lim_{x\to2^-}f(x)=3
]

### Derecha:

[
\lim_{x\to2^+}f(x)=7
]

### Conclusión:

No existe límite general.

---

## **Aplicación real:**

Tarifas por consumo, cambios de velocidad, sistemas digitales.

---

---

# 1.4. Límites al infinito y en infinito

## **Concepto:**

Analizan el comportamiento extremo de una función.

---

## **Límite al infinito**

Cuando x crece o decrece sin límite.

Ejemplo:

[
\lim_{x\to\infty}\frac{1}{x}=0
]

---

## **Límite en infinito**

Cuando una función crece indefinidamente cerca de un punto.

Ejemplo:

[
\lim_{x\to0^+}\frac{1}{x}=\infty
]

---

## **Interpretación:**

* Crecimiento poblacional
* Intereses financieros
* Sistemas físicos

---

---

# 1.5. Asíntotas verticales, horizontales y oblicuas

## **Concepto:**

Las asíntotas son rectas a las que una función se aproxima.

---

## **Verticales**

Ocurren cuando el denominador se hace cero:

[
f(x)=\frac{1}{x-1}
]

Asíntota:
[
x=1
]

---

## **Horizontales**

Se estudian con:

[
\lim_{x\to\infty}f(x)
]

Ejemplo:
[
\frac{2x+1}{x}=2
]

Asíntota:
[
y=2
]

---

## **Oblicuas**

Cuando el grado del numerador es uno mayor.

Ejemplo:
[
\frac{x^2+1}{x}=x+\frac{1}{x}
]

Asíntota:
[
y=x
]

---

---

# 1.6. Límites trigonométricos

## **Concepto:**

Son límites fundamentales para derivadas y análisis matemático.

### Principal:

\lim_{x \to 0}\frac{\sin x}{x}=1

---

## Otros importantes:

[
\lim_{x\to0}\frac{\tan x}{x}=1
]

[
\lim_{x\to0}\frac{1-\cos x}{x}=0
]

---

## Aplicaciones:

* Ondas
* Sonido
* Electricidad
* Ingeniería civil

---

---

# 1.7. Continuidad lateral

## **Concepto:**

Una función tiene continuidad lateral si coincide con su límite lateral correspondiente.

### Por izquierda:

[
\lim_{x\to a^-}f(x)=f(a)
]

### Por derecha:

[
\lim_{x\to a^+}f(x)=f(a)
]

---

## Ejemplo:

Horarios de atención, impuestos escalonados.

---

---

# 1.8. Continuidad de una función en intervalos abiertos, cerrados y semiabiertos

## **Intervalo abierto (a,b):**

Continua en cada punto interno.

---

## **Intervalo cerrado [a,b]:**

Debe cumplir continuidad lateral en extremos.

---

## **Semiabierto [a,b):**

Se adapta según el extremo incluido.

---

## Ejemplo:

[
f(x)=x^2
]

Es continua porque no tiene interrupciones.

---

---

# 1.9. Discontinuidad removible y discontinuidad esencial

## **Discontinuidad removible**

Existe límite, pero el punto está mal definido.

Ejemplo:
[
\frac{x^2-9}{x-3}
]

Se simplifica:
[
x+3
]

Hueco en x=3.

---

## **Discontinuidad esencial**

No existe límite único o tiende a infinito.

### Ejemplo salto:

[
f(x)=
\begin{cases}
1 & x<0 \
4 & x>0
\end{cases}
]

---

## **Ejemplo infinita:**

[
f(x)=\frac{1}{x}
]

---

# CONCLUSIÓN GENERAL:

El estudio de límites y continuidad permite comprender:

* Cambios instantáneos
* Movimiento
* Diseño estructural
* Predicción científica
* Inteligencia artificial
* Economía matemática

## Idea clave:

**Los límites estudian hacia dónde va una función; la continuidad analiza si llega sin interrupciones.**


parte de derivadas 

# UNIDAD 2: DERIVADAS (DESARROLLO EXTENSO)

---

# 2.1. Introducción – Definición de derivada

## **Concepto:**

La derivada es uno de los conceptos más importantes del cálculo diferencial, ya que mide cómo cambia una función en un instante específico. Representa la **razón de cambio instantánea** de una variable respecto a otra.

En términos sencillos:
**La derivada indica qué tan rápido cambia una cantidad en un momento determinado.**

Por ejemplo:

* Velocidad de un automóvil en un segundo exacto.
* Cambio de temperatura en un instante.
* Crecimiento de una población.

---

## **Definición formal:**

f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}

Donde:

* **f(x+h) - f(x)** representa el cambio en la función.
* **h** representa un cambio muy pequeño en x.
* Al hacer (h \to 0), obtenemos el cambio instantáneo.

---

## **Interpretación práctica:**

Si una persona recorre una distancia:
[
d(t)=t^2
]

Su velocidad instantánea será:
[
d'(t)=2t
]

En (t=3):
[
v=2(3)=6
]

### Resultado:

A los 3 segundos, la velocidad es 6 unidades/segundo.

---

## **Importancia:**

La derivada se utiliza en:

* Ingeniería
* Física
* Economía
* Biología
* Inteligencia artificial

---

---

# 2.2. Interpretación geométrica y física de la derivada

# **Interpretación geométrica**

## **Concepto:**

Geométricamente, la derivada representa la pendiente de la recta tangente a una curva en un punto.

### Si:

* Pendiente positiva → la función crece.
* Pendiente negativa → la función decrece.
* Pendiente cero → punto máximo o mínimo posible.

---

## **Ejemplo:**

[
f(x)=x^2
]

Derivada:
[
f'(x)=2x
]

En x=2:
[
f'(2)=4
]

### Interpretación:

La pendiente de la tangente en x=2 es 4.

---

# **Interpretación física**

## **Velocidad instantánea**

Si:
[
s(t)=t^2+3t
]

Entonces:
[
v(t)=s'(t)=2t+3
]

---

## **Aceleración**

[
a(t)=v'(t)
]

---

## **Aplicación real:**

* Movimiento de vehículos
* Caída libre
* Electricidad
* Costos marginales

---

---

# 2.3. Reglas básicas de derivación

## **Concepto:**

Permiten derivar funciones sin usar siempre la definición límite.

---

## **1. Derivada de constante**

[
\frac{d}{dx}(c)=0
]

Ejemplo:
[
\frac{d}{dx}(8)=0
]

---

## **2. Regla de potencia**

\frac{d}{dx}(x^n)=nx^{n-1}

Ejemplo:
[
\frac{d}{dx}(x^4)=4x^3
]

---

## **3. Suma y resta**

[
(f\pm g)'=f' \pm g'
]

---

## **4. Multiplicación**

[
(fg)'=f'g+fg'
]

---

## **5. División**

[
\left(\frac{f}{g}\right)'=\frac{f'g-fg'}{g^2}
]

---

## **Ejemplo práctico:**

[
f(x)=x^2+3x
]

[
f'(x)=2x+3
]

---

---

# 2.4. Regla de la cadena

## **Concepto:**

Se utiliza cuando una función está dentro de otra función.

### Fórmula:

[
\frac{d}{dx}[f(g(x))]=f'(g(x))g'(x)
]

---

## **Ejemplo:**

[
y=(3x+2)^4
]

### Paso 1:

Función externa:
[
u^4
]

### Paso 2:

Interna:
[
u=3x+2
]

### Derivada:

[
y'=4(3x+2)^3(3)
]

### Resultado:

[
y'=12(3x+2)^3
]

---

## **Aplicación real:**

* Temperatura compuesta
* Modelos biológicos
* Optimización

---

---

# 2.5. Derivadas de funciones algebraicas

## **Funciones polinomiales**

Ejemplo:
[
f(x)=4x^3-2x+7
]

[
f'(x)=12x^2-2
]

---

## **Funciones racionales**

[
f(x)=\frac{x+1}{x-2}
]

Usamos cociente.

---

## **Funciones radicales**

[
f(x)=\sqrt{x}=x^{1/2}
]

[
f'(x)=\frac{1}{2\sqrt{x}}
]

---

## **Aplicación:**

Diseño estructural, áreas, volúmenes.

---

---

# 2.6. Derivadas de funciones trigonométricas

## **Principales:**

[
\frac{d}{dx}(\sin x)=\cos x
]

[
\frac{d}{dx}(\cos x)=-\sin x
]

[
\frac{d}{dx}(\tan x)=\sec^2 x
]

---

## **Trigonométricas inversas**

[
\frac{d}{dx}(\arcsin x)=\frac{1}{\sqrt{1-x^2}}
]

---

## **Ejemplo práctico:**

[
f(x)=\sin x + x^2
]

[
f'(x)=\cos x +2x
]

---

## **Aplicación:**

* Ondas
* Circuitos
* Sonido
* Ingeniería

---

---

# 2.7. Derivadas de funciones exponenciales y logarítmicas

## **Exponencial natural**

[
\frac{d}{dx}(e^x)=e^x
]

---

## **Exponencial general**

[
\frac{d}{dx}(a^x)=a^x\ln a
]

---

## **Logaritmo natural**

[
\frac{d}{dx}(\ln x)=\frac{1}{x}
]

---

## **Ejemplo:**

[
f(x)=e^x+\ln x
]

[
f'(x)=e^x+\frac{1}{x}
]

---

## **Aplicación:**

* Interés compuesto
* Crecimiento bacteriano
* Decaimiento radiactivo

---

---

# 2.8. Derivación implícita

## **Concepto:**

Se usa cuando y no está despejada explícitamente.

---

## **Ejemplo:**

[
x^2+y^2=25
]

Derivando:
[
2x+2y\frac{dy}{dx}=0
]

Despejando:
[
\frac{dy}{dx}=-\frac{x}{y}
]

---

## **Aplicación:**

Circunferencias, elipses, geometría analítica.

---

---

# 2.9. Derivadas de orden superior

## **Concepto:**

Son derivadas sucesivas.

### Primera:

Velocidad

### Segunda:

Aceleración

### Tercera:

Cambio de aceleración

---

## **Ejemplo:**

[
f(x)=x^4
]

[
f'(x)=4x^3
]

[
f''(x)=12x^2
]

[
f'''(x)=24x
]

---

## **Aplicación:**

* Movimiento
* Curvatura
* Optimización

---

---

# 2.10. Diferenciales

## **Concepto:**

El diferencial permite aproximar pequeños cambios en una función.

### Fórmula:

[
dy=f'(x)dx
]

---

## **Interpretación:**

Si x cambia un poco, y cambia aproximadamente según la pendiente.

---

## **Ejemplo práctico:**

[
y=x^2
]

Si:
[
x=4,\quad dx=0.1
]

[
dy=2(4)(0.1)=0.8
]

### Aproximación:

Cuando x pasa de 4 a 4.1, y aumenta aproximadamente 0.8.

---

## **Aplicación real:**

* Estimación de errores
* Ingeniería
* Mediciones científicas

---

# CONCLUSIÓN GENERAL

## Las derivadas permiten:

### Analizar:

* Velocidad
* Cambio
* Optimización
* Crecimiento
* Curvatura
* Error

## Idea central:

**Mientras los límites estudian la aproximación, las derivadas estudian el cambio instantáneo.**

### En resumen:

**Derivar es medir cómo cambia el mundo en tiempo real.**

parte de aplicacion de derivadas 

# UNIDAD 3: APLICACIONES DE LA DERIVADA (DESARROLLO EXTENSO)

---

# 3.1. Razones de cambio relacionadas

## **Concepto:**

Las razones de cambio relacionadas estudian situaciones donde dos o más variables cambian con respecto al tiempo y están conectadas por una ecuación.

En estos problemas, si una variable cambia, las demás también lo hacen.

### Idea principal:

Si (x) y (y) dependen del tiempo (t), entonces:

[
\frac{dx}{dt}, \quad \frac{dy}{dt}
]

representan sus velocidades de cambio.

---

## **Procedimiento general:**

1. Identificar variables.
2. Relacionarlas mediante una ecuación.
3. Derivar implícitamente respecto al tiempo.
4. Sustituir valores.

---

## **Ejemplo práctico: Globo inflándose**

Volumen de una esfera:

[
V=\frac{4}{3}\pi r^3
]

Derivando:
[
\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}
]

Si aumenta el volumen, también cambia el radio.

---

## **Aplicaciones reales:**

* Tanques llenándose
* Escaleras deslizándose
* Movimiento circular
* Ingeniería hidráulica

---

---

# 3.2. Crecimiento y decrecimiento de funciones

## **Concepto:**

La primera derivada permite determinar si una función aumenta o disminuye.

### Criterios:

### Si:

[
f'(x)>0
]
La función crece.

### Si:

[
f'(x)<0
]
La función decrece.

---

## **Ejemplo:**

[
f(x)=x^2-4x
]

Derivada:
[
f'(x)=2x-4
]

Punto crítico:
[
2x-4=0 \Rightarrow x=2
]

### Intervalos:

* (x<2): decrece
* (x>2): crece

---

## **Interpretación:**

La función baja hasta x=2 y luego sube.

---

## **Aplicación:**

* Producción empresarial
* Temperatura
* Rendimiento

---

---

# 3.3. Máximos y mínimos relativos

## **Concepto:**

Son puntos donde la función alcanza valores mayores o menores respecto a puntos cercanos.

---

## **Criterio de la primera derivada:**

1. Hallar:
   [
   f'(x)=0
   ]

2. Analizar cambio de signo.

### Si:

* a − → máximo

### Si:

− a + → mínimo

---

## **Ejemplo:**

[
f(x)=x^2-6x+5
]

[
f'(x)=2x-6
]

[
x=3
]

### Resultado:

Mínimo relativo en x=3.

---

## **Aplicación real:**

* Ganancia máxima
* Costos mínimos
* Diseño eficiente

---

---

# 3.4. Concavidad y puntos de inflexión

## **Concepto:**

La segunda derivada indica cómo se curva la gráfica.

---

## **Criterios:**

### Si:

[
f''(x)>0
]
Cóncava hacia arriba.

### Si:

[
f''(x)<0
]
Cóncava hacia abajo.

---

## **Punto de inflexión:**

Ocurre cuando cambia la concavidad.

---

## **Ejemplo:**

[
f(x)=x^3
]

[
f''(x)=6x
]

En x=0 cambia de signo.

### Resultado:

Punto de inflexión en x=0.

---

## **Aplicación:**

Economía, trayectorias, estructuras.

---

---

# 3.5. Criterio de la segunda derivada

## **Concepto:**

Permite clasificar puntos críticos más rápido.

---

## Si:

[
f'(a)=0
]

### Entonces:

### Si:

[
f''(a)>0
]
Mínimo

### Si:

[
f''(a)<0
]
Máximo

---

## **Ejemplo:**

[
f(x)=x^2
]

[
f'(x)=2x
]

[
f''(x)=2>0
]

### Resultado:

Mínimo en x=0.

---

---

# 3.6. Optimización

## **Concepto:**

Busca el mejor valor posible:

* Máxima ganancia
* Mínimo costo
* Mayor área
* Menor material

---

## **Pasos:**

1. Definir función objetivo.
2. Derivar.
3. Igualar a cero.
4. Evaluar.

---

## **Ejemplo práctico:**

Perímetro:
[
2x+2y=100
]

Área:
[
A=xy
]

Despejar:
[
y=50-x
]

[
A=x(50-x)
]

Derivar:
[
A'=50-2x
]

[
x=25
]

### Resultado:

Área máxima con cuadrado.

---

## **Aplicación:**

Arquitectura, economía, logística.

---

---

# 3.7. Teorema de Rolle

## **Concepto:**

Si una función:

1. Es continua en [a,b]
2. Derivable en (a,b)
3. (f(a)=f(b))

Entonces existe un punto c tal que:

[
f'(c)=0
]

---

## **Interpretación geométrica:**

Hay al menos una tangente horizontal.

---

## **Ejemplo:**

[
f(x)=x^2-4x+3
]
En [1,3]

---

## **Aplicación:**

Control de trayectorias.

---

---

# 3.8. Teorema del Valor Medio

## **Concepto:**

Existe un punto donde la pendiente instantánea iguala la pendiente promedio.

### Fórmula:

[
f'(c)=\frac{f(b)-f(a)}{b-a}
]

---

## **Ejemplo físico:**

Si recorres 100 km en 2 horas, en algún momento tu velocidad fue exactamente 50 km/h.

---

## **Aplicación:**

* Tránsito
* Producción
* Física

---

---

# 3.9. Regla de L’Hôpital

## **Concepto:**

Se usa para límites indeterminados:
[
\frac{0}{0},\quad \frac{\infty}{\infty}
]

---

## **Fórmula:**

[
\lim \frac{f(x)}{g(x)}=
\lim \frac{f'(x)}{g'(x)}
]

---

## **Ejemplo:**

[
\lim_{x\to0}\frac{\sin x}{x}
]

[
=\lim_{x\to0}\frac{\cos x}{1}=1
]

---

## **Aplicación:**

Modelos avanzados.

---

---

# 3.10. Aproximación lineal y diferencial

## **Concepto:**

Permite aproximar valores cercanos usando la recta tangente.

### Fórmula:

[
L(x)=f(a)+f'(a)(x-a)
]

---

## **Ejemplo:**

[
\sqrt{4.1}
]

Sea:
[
f(x)=\sqrt{x}
]

Aproximando desde x=4.

---

## **Aplicación:**

Cálculos rápidos.

---

---

# 3.11. Análisis completo de funciones

## **Concepto:**

Estudio integral de una función:

* Dominio
* Intersecciones
* Límites
* Continuidad
* Asíntotas
* Crecimiento
* Extremos
* Concavidad
* Gráfica

---

## **Objetivo:**

Comprender completamente su comportamiento.

---

## **Aplicación:**

Modelado matemático, ingeniería, economía.

---

---

# 3.12. Aplicaciones en economía, física e ingeniería

# **Economía**

## Costo marginal:

[
C'(x)
]

Cambio del costo por unidad adicional.

---

# **Física**

## Velocidad:

[
v(t)=s'(t)
]

## Aceleración:

[
a(t)=v'(t)
]

---

# **Ingeniería**

* Diseño óptimo
* Resistencia de materiales
* Electricidad
* Producción

---

# CONCLUSIÓN GENERAL

## Las aplicaciones de la derivada permiten:

### Analizar:

* Movimiento
* Optimización
* Costos
* Producción
* Curvatura
* Cambios instantáneos

## Idea central:

**La derivada no solo calcula pendientes; permite tomar decisiones, optimizar recursos y comprender fenómenos reales.**

### En resumen:

**Derivar es transformar matemáticas en soluciones para el mundo real.**
