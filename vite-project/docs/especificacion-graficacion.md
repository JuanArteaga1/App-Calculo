# Especificacion del Sistema de Graficacion Interactiva - LimitsHub

## 1. Stack tecnologico recomendado

| Libreria | Version | Rol |
|---|---|---|
| [math.js](https://mathjs.org/) | >= 14.x | Motor de calculo numerico y simbolico |
| [function-plot](https://mauriciopoppe.github.io/function-plot/) | >= 1.24.x | Renderizado 2D de funciones matematicas |

### Por que este stack y no otro

| Alternativa | Problema |
|---|---|
| **Plot.js** | Mas orientado a datos estadisticos, no a curvas matematicas. Overkill para f(x). |
| **Chart.js** | No renderiza funciones continuas correctamente sin sampleo manual. |
| **Desmos API** | Embed via iframe, requiere internet, no tienes control sobre la UI ni los eventos. Sirve si quieres "usar una calculadora ya hecha", no si quieres construir la tuya. |
| **Canvas/SVG puro** | Demasiado trabajo implementar ejes, grid, escalado, zoom, etiquetas desde cero. |

### Como se conectan math.js y function-plot

```js
import { evaluate, derivative } from 'mathjs'
import functionPlot from 'function-plot'

// 1. Evaluar funcion numericamente
const valor = evaluate('x^2', { x: 3 })  // -> 9

// 2. Derivar simbolicamente
const dfStr = derivative('x^2', 'x').toString()  // -> '2 * x'

// 3. Graficar ambas curvas
functionPlot({
  target: '#plot',
  data: [
    { fn: 'x^2', color: '#0047CC' },          // f(x)
    { fn: dfStr, color: '#F4B400', dash: [5] } // f'(x) punteada
  ]
})
```

La combinacion es oficial: en las propias demos de math.js usan function-plot para mostrar graficos de funciones evaluadas con math.js.

---

## 2. Que se quiere graficar exactamente

### 2.1 LIMITES - 9 temas (1.1 al 1.9)

**Inputs minimos del estudiante:**
- `f(x)` - expresion de la funcion (ej: `(x^2 - 4)/(x - 2)`)
- `a` - valor al que se aproxima x

**Elementos visuales en la grafica:**
- Curva de `f(x)` en un rango amplio
- Linea vertical punteada en `x = a`
- Punto animado que se desplaza hacia `(a, L)` desde izquierda y derecha
- Tabla lateral con valores `f(a - h)`, `f(a - h/2)`, etc.
- Display del valor del limite `L`

**Casos especiales a detectar/diferenciar:**

| Caso | Deteccion | Visualizacion |
|---|---|---|
| **Limite finito con discontinuidad removible** | Evaluar cerca de `a` da un valor, pero `f(a)` es indefinido o distinto | Circulo hueco en `(a, f(a))` |
| **Limite infinito (asintota vertical)** | `|f(a + h)| -> infinito` cuando `h -> 0` | Linea discontinua vertical, zoom out automatico |
| **Limites laterales distintos** | `f(a-) != f(a+)` | Dos puntos de distinto color en cada lado, mensaje "No existe limite" |
| **Asintotas** | Evaluar limites al infinito | Lineas punteadas horizontales/oblicuas |

**Prop tipo:**
```js
modo: 'limite'
params: { fn: 'x^2', a: 2 }
```

---

### 2.2 DERIVADAS - 10 temas (2.1 al 2.10)

**Inputs minimos del estudiante:**
- `f(x)` - expresion de la funcion (ej: `x^2`)
- `x0` - punto donde se evalua la derivada

**Elementos visuales en la grafica:**
- Curva de `f(x)`
- **Recta tangente** en `(x0, f(x0))`: se construye como `y = m*(x - x0) + f(x0)` donde `m = f'(x0)`
- **Recta secante animable**: recta que pasa por `(x0, f(x0))` y `(x0 + h, f(x0 + h))`
- **Slider `h -> 0`**: al moverlo, la secante se acerca a la tangente
- Panel con: `f'(x) = ...` (simbologo) y `f'(x0) = ...` (numerico)

**Calculo:**
```js
const d = derivative(fnStr, 'x')
const m = d.evaluate({ x: x0 })
```

**Prop tipo:**
```js
modo: 'derivada'
params: { fn: 'x^2', x0: 2, h: 0.5 }  // h controlable por slider
```

---

### 2.3 APLICACIONES - 12 temas (3.1 al 3.12)

Aqui hay multiples subtipos, cada uno con su logica:

| Subtipo | Temas | Inputs | Visualizacion |
|---|---|---|---|
| **Crecimiento/decrecimiento** | 3.2 | `f(x)` | Curva + flechas verdes (crece) / rojas (decrece) en intervalos |
| **Extremos (max/min)** | 3.3, 3.5 | `f(x)` | Puntos rojos/verdes en criticos con etiquetas |
| **Concavidad** | 3.4 | `f(x)` | Curva coloreada por concavidad + `f''(x)` como segunda curva |
| **Optimizacion** | 3.6 | `f(x)` + restriccion | Curva con punto optimo resaltado + valor numerico |
| **TVM / Rolle** | 3.7, 3.8 | `f(x), a, b` | Recta secante en `[a,b]` + recta tangente paralela en `c` |
| **L'Hopital** | 3.9 | `f(x), g(x), a` | Dos curvas + limite de `f/g` y limite de `f'/g'` |
| **Aprox. lineal** | 3.10 | `f(x), a` | Curva + recta tangente + aproximacion en `x` cercano |
| **Analisis completo** | 3.11 | `f(x)` | Todo lo anterior combinado en un dashboard |

**Prop tipo:**
```js
modo: 'aplicacion'
subtipo: 'extremos' | 'concavidad' | 'lhopital' | 'tvm'
params: { fn: 'x^3 - 3x', a: -2, b: 2 }
```

---

## 3. Arquitectura del componente `<GraphZone>`

### 3.1 Estructura

```jsx
<GraphZone
  modo="limite"            // "limite" | "derivada" | "aplicacion"
  subtipo="extremos"       // solo para modo="aplicacion"
  params={{
    fn: '(x^2 - 4)/(x - 2)',
    a: 2,
    x0: 2,
    h: 0.5
  }}
  onResult={(data) => console.log(data)}  // callback opcional
/>
```

### 3.2 Internamente

El componente delega en tres funciones especializadas:

```
GraphZone
|- renderLimite(params)      - Dibuja curva + x=a + animacion + tabla
|- renderDerivada(params)    - Dibuja curva + tangente + secante + slider h
|- renderAplicacion(params)  - Switchea por subtipo
      |- renderExtremos()
      |- renderConcavidad()
      |- renderLhopital()
      |- renderTVM()
```

Cada funcion usa `functionPlot` para dibujar y `math.js` para evaluar/derivar.

### 3.3 Layout del componente

```
+------------------------------------------+
|  Inputs:  [f(x) = ______]  [a = ___]   |
|           [x0 = ___]  [h = ====●===]     |
+------------------------------------------+
|                                          |
|         AREA DE GRAFICACION              |
|    (functionPlot: ejes, grid, curvas,   |
|     puntos animados, rectas tangentes,   |
|     zoom/pan interactivo por defecto)    |
|                                          |
+------------------------------------------+
| Resultados:                              |
|   lim f(x) = 4                           |
|   x->2                                   |
|                                          |
|   f(1.9) = 3.9 | f(2.1) = 4.1          |
|   f(1.99) = 3.99 | f(2.01) = 4.01      |
+------------------------------------------+
```

---

## 4. Numerico, simbolico o ambos

| Aspecto | Enfoque | Libreria |
|---|---|---|
| **Dibujar la curva `f(x)`** | Numerico: samplear puntos en un rango | function-plot (nativo) |
| **Calcular `f(a)`, `f(a + h)`** | Numerico: `math.evaluate(fn, {x: valor})` | math.js |
| **Obtener `f'(x)` como expresion** | Simbolico: `math.derivative(fn, 'x').toString()` | math.js |
| **Evaluar `f'(x0)`** | Numerico: `math.derivative(fn, 'x').evaluate({x: x0})` | math.js |
| **Construir recta tangente** | Simbolico: `m = f'(x0)`, luego funcion lineal | math.js + function-plot |
| **Resolver `f'(x) = 0`** | Numerico: busqueda por intervalo | math.js (evaluacion) |
| **Mostrar paso a paso** | Simbolico: mostrar `f'(x) = 2x` como string | math.js |

**Resumen**: 80% numerico para la visualizacion, 20% simbolico para mostrar resultados exactos.

---

## 5. Comportamiento por tipo de leccion

| Tipo de leccion | Evaluar (math.js) | Graficar (function-plot) | Interaccion |
|---|---|---|---|
| **Limite** | `f(a-h)`, `f(a+h)` con `h` decreciente | `f(x)` + linea `x=a` + punto animado | Slider automatico de acercamiento + tabla de valores |
| **Derivada** | `f(x0)`, `f'(x0)`, recta tangente | `f(x)` + tangente + secante (opcional) | Slider `h` que mueve la secante hacia la tangente |
| **Crecimiento** | `f'(x)` en intervalos | `f(x)` con colores por signo de `f'` | Click en punto para ver pendiente |
| **Extremos** | `f'(x) = 0` numerico | `f(x)` + puntos max/min con etiquetas | Hover sobre punto muestra coordenadas |
| **Concavidad** | `f''(x)` | `f(x)` + `f''(x)` como segunda curva | Cambio de color en puntos de inflexion |
| **TVM / Rolle** | Pendiente promedio, `f'(c)` | Recta secante `[a,b]` + tangente en `c` | Slider `c` que se mueve entre `a` y `b` |
| **L'Hopital** | `f(a)`, `g(a)`, `f'(a)`, `g'(a)` | `f(x)`, `g(x)` + razon | Animacion de acercamiento a `a` |
| **Optimizacion** | Funcion objetivo, derivada, punto optimo | Curva + punto optimo resaltado | Input de restricciones |

---

## 6. Resumen de implementacion

```
npm install mathjs function-plot
```

```
src/
  components/
    GraphZone.jsx           <- Componente principal (orquestador)
    graficos/
      renderLimite.js       <- Logica de limites
      renderDerivada.js     <- Logica de derivadas
      renderAplicacion.js   <- Logica de aplicaciones (switchea subtipos)
      helpers.js            <- utils: construir recta tangente, tabla valores, etc.
  styles/
    GraphZone.css           <- Estilos del componente
```
