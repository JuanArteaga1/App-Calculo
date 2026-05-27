# Plan de Mejoras - App de Cálculo 1

## Resumen General

Este documento detalla el plan de mejoras para la aplicación "App de cálculo 1", una plataforma educativa universitaria de aprendizaje de Cálculo I construida con React + Vite. Las mejoras abarcan cambios visuales, de usabilidad e interactividad en 4 áreas principales: Hero de Cálculo I, tarjetas de unidades, páginas de tema, y laboratorio de graficación.

---

## 1. Hero de Cálculo 1 (Calculo1.jsx)

### Cambio de texto en descripción
**Línea actual:** 74-76 (`Calculo1.jsx`)
```
Aprende a tu ritmo con contenido interactivo y visualizaciones dinámicas.
```
**Cambiar a:**
```
Aprende con el curso y refuerza a tu ritmo con contenido interactivo y visualizaciones dinámicas.
```

### Reemplazar foto estática por animación SVG/CSS
**Línea actual:** 92-98 (`Calculo1.jsx`) — `<img src="/Estudiantes(1).jpeg" ...>`

**Propuesta:** Crear un nuevo componente `HeroAnimation.jsx` en `src/components/` que contenga una animación SVG con los siguientes elementos:
- Una curva de función (ej. f(x) = x²) dibujada como `<path>` SVG
- Una línea tangente que se desplace a lo largo de la curva (animación CSS `@keyframes`)
- Puntos que se muevan aproximándose a un valor `a` desde ambos lados
- Fórmulas matemáticas visibles (límite, derivada) que aparezcan con fade
- Colores consistentes con la paleta: `#0047CC` (azul), `#F4B400` (amarillo/dorado), `#fff`

**Técnica:** SVG inline + CSS animations (`stroke-dasharray`, `stroke-dashoffset`, `@keyframes`)

---

## 2. Tarjetas de Unidades con Logos Animados (Calculo1.jsx)

### Objetivo
Reemplazar los íconos estáticos emoji (∞, ∂, ⚡) por íconos SVG animados con CSS en las tarjetas de presentación de:
- Límites y Continuidad (∞)
- Derivadas (∂)
- Aplicaciones de la Derivada (⚡)

### Implementación

Crear un nuevo componente `AnimatedIcon.jsx` en `src/components/` que reciba un `type` prop ('limite', 'derivada', 'aplicacion') y renderice un SVG con animación.

**Para Límites (∞):**
- SVG del símbolo infinito que se dibuja progresivamente con `stroke-dashoffset`
- Puntos que orbitan alrededor del símbolo
- Animación continua tipo "latido" (pulse)

**Para Derivadas (∂):**
- SVG del símbolo de derivada parcial
- Efecto de trazado progresivo (draw effect)
- Destello/brillo que recorre el contorno (shimmer)

**Para Aplicaciones (⚡):**
- SVG de un rayo/energía
- Efecto de resplandor pulsante
- Pequeñas partículas alrededor

**Técnica:** SVG inline con clases CSS animadas usando `@keyframes`

### Archivos a modificar
- **Nuevo:** `src/components/AnimatedIcon.jsx`
- **Modificar:** `src/pages/Calculo1.jsx` (líneas 31-33, 114-117) — reemplazar `{unidad.icono}` por `<AnimatedIcon type={unidad.id} />`

---

## 3. Mejoras en Página de Tema (TemaPage.jsx)

### 3a. Video Explicativo desde la Biblioteca Multimedia

**Objetivo:** Al entrar a cada tema, mostrar automáticamente el video correspondiente de la biblioteca multimedia que coincida con el tema actual.

**Implementación:**
1. Agregar función de búsqueda en `src/data/videos.js` que devuelva el video que corresponda al `unidadId` + `temaId` actual
2. Crear componente `TemaVideo.jsx` en `src/components/` que:
   - Busque el video correspondiente en `videosBase[]`
   - Muestre el thumbnail de YouTube con overlay de play
   - Al hacer clic, incruste el iframe de YouTube
   - Si no hay video específico para ese tema, muestre un placeholder con mensaje "Próximamente"
3. Insertar `<TemaVideo>` en `TemaPage.jsx` dentro del contenido principal, antes de la zona de gráficos

**Archivos a modificar/crear:**
- **Nuevo:** `src/components/TemaVideo.jsx`
- **Modificar:** `src/pages/TemaPage.jsx` (insertar componente en la sección main)
- **Modificar (opcional):** `src/data/videos.js` (agregar función `getVideoByTema(unidadId, temaId)`)

### 3b. Sección "¿No te acuerdas?" con enlace a Saberes Previos

**Objetivo:** Agregar una sección que pregunte al estudiante si recuerda los conceptos previos necesarios, con un enlace directo a la página de Saberes Previos.

**Implementación:**
1. Mapear cada tema a sus saberes previos relevantes:
   - **Límites** → Funciones y Gráficas, Aritmética y Álgebra Básica
   - **Derivadas** → Funciones y Gráficas, Ecuaciones e Inecuaciones
   - **Aplicaciones** → Todo lo anterior

2. Crear componente `SaberesRelacionados.jsx` en `src/components/` que:
   - Muestre un callout con emoji 💡
   - Pregunte "¿No recuerdas algún concepto previo?"
   - Liste los saberes previos relevantes (de `SaberesPrevios.jsx`)
   - Tenga un botón/Link "Repasar saberes previos →" que lleve a `/saberes-previos`

3. Insertar en `TemaPage.jsx` en la sidebar o en el contenido principal

**Archivos:**
- **Nuevo:** `src/components/SaberesRelacionados.jsx`
- **Modificar:** `src/pages/TemaPage.jsx`

### 3c. Logos más interactivos en TemaPage

**Objetivo:** Agregar animaciones sutiles a los íconos/logos dentro de la página de tema (header, breadcrumb, sidebar).

**Implementación:**
- Agregar `AnimatedIcon` en el cardHeader del tema (línea 127 en `TemaPage.jsx`)
- Animar el ícono de progreso en la sidebar con CSS
- Agregar un gradiente animado sutil en el fondo del cardHeader

---

## 4. Mejoras en el Laboratorio de Graficación (GraphZone.jsx)

### 4a. Resultados ANTES de la gráfica

**Cambio:** Reordenar los elementos en `GraphZone.jsx` para que los resultados de evaluación aparezcan ANTES del área del gráfico SVG.

**Layout actual:** Inputs → SVG Gráfica → Resultados → Botón IA
**Layout nuevo:** Inputs → **Resultados** → SVG Gráfica → Botón IA

**Líneas a modificar:** 343-394 en `GraphZone.jsx` — intercambiar orden de `results` y `plotArea`

### 4b. Mostrar aproximación por AMBOS lados con más valores

**Objetivo:** Agregar una tabla de aproximación que muestre valores de la función acercándose a `a` desde ambos lados (izquierda y derecha) con múltiples valores de h decrecientes.

**Implementación:**
1. En `GraphZone.jsx`, función `handleGraficar()` (línea 56), expandir el cálculo de límites:
   - Generar tabla con h = {0.5, 0.1, 0.01, 0.001, 0.0001} (5 pasos)
   - Para cada h, calcular f(a-h) y f(a+h)
   - Mostrar en formato tabla legible

2. Crear componente `TablaAproximacion.jsx` en `src/components/graficos/` que renderice la tabla con estilo:
```
|   h   |  f(a-h) ← Izquierda  |  f(a+h) → Derecha  |
|-------|----------------------|--------------------|
| 0.5   |       3.5           |       4.5          |
| 0.1   |       3.9           |       4.1          |
| 0.01  |       3.99          |       4.01         |
| 0.001 |       3.999         |       4.001        |
```

3. Resaltar visualmente la convergencia del límite (colores gradiente)

**Archivos:**
- **Nuevo:** `src/components/graficos/TablaAproximacion.jsx`
- **Modificar:** `src/components/GraphZone.jsx` (función handleGraficar y JSX de resultados)

### 4c. Más valores en la evaluación antes de la gráfica

**Objetivo:** Además de la tabla de aproximación, mostrar un resumen de evaluación más completo:
- `f(a)`: Valor de la función en el punto (si existe)
- Límite por izquierda
- Límite por derecha
- Conclusión del límite (existe / no existe / infinito)
- Para derivadas: pendiente secante (con h mostrado) + pendiente tangente

**Implementación:** Expandir el objeto `resultado` en `handleGraficar()` para incluir estos campos adicionales.

### 4d. Agregar video relacionado al tema

**Objetivo:** Igual que en TemaPage, mostrar el video relacionado al tema dentro del laboratorio de graficación.

**Implementación:**
- Pasar `unidadId` y `temaId` como props a `GraphZone`
- Insertar componente `TemaVideo` dentro del panel de GraphZone, debajo de los resultados
- O bien, mostrar un botón "Ver video explicativo" que expanda el video

### 4e. Logos más interactivos

**Objetivo:** Reemplazar emojis estáticos (📊) en el header del GraphZone por iconos SVG animados.

**Implementación:**
- Reemplazar `<span>📊</span>` (línea 305) por un SVG animado con tema de gráfico/curva
- Agregar transiciones hover en todo el panel

---

## 5. Plan de Implementación (Orden de ejecución)

### Fase 1: Componentes base (reutilizables)
1. Crear `src/components/AnimatedIcon.jsx` — SVG animados para las 3 unidades
2. Crear `src/components/TemaVideo.jsx` — Video integrado desde biblioteca
3. Crear `src/components/SaberesRelacionados.jsx` — Callout de saberes previos
4. Crear `src/components/graficos/TablaAproximacion.jsx` — Tabla de valores

### Fase 2: Hero y tarjetas de Calculo1
5. Modificar `Calculo1.jsx`:
   - Cambiar texto "Aprende a tu ritmo" → "Aprende con el curso y refuerza a tu ritmo"
   - Reemplazar foto por animación SVG/CSS (integrar en el heroRight)
   - Reemplazar emojis de unidades por `<AnimatedIcon>`

### Fase 3: TemaPage
6. Modificar `TemaPage.jsx`:
   - Insertar `<TemaVideo>` en contenido principal
   - Insertar `<SaberesRelacionados>` en sidebar o contenido
   - Agregar `<AnimatedIcon>` en cardHeader

### Fase 4: GraphZone
7. Modificar `GraphZone.jsx`:
   - Reordenar: resultados antes de la gráfica
   - Agregar tabla de aproximación por ambos lados
   - Expandir resultados de evaluación
   - Agregar video relacionado
   - Reemplazar emojis por íconos animados

### Fase 5: Pruebas y ajustes
8. Verificar responsive design en móvil y tablet
9. Probar con diferentes temas y funciones
10. Ajustar animaciones para rendimiento

---

## 6. Archivos involucrados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/AnimatedIcon.jsx` | **Nuevo** | Componente de íconos SVG animados para límites, derivadas y aplicaciones |
| `src/components/TemaVideo.jsx` | **Nuevo** | Componente para mostrar video de YouTube desde la biblioteca multimedia |
| `src/components/SaberesRelacionados.jsx` | **Nuevo** | Callout con enlace a saberes previos relevantes |
| `src/components/graficos/TablaAproximacion.jsx` | **Nuevo** | Tabla de valores de aproximación por ambos lados |
| `src/pages/Calculo1.jsx` | **Modificar** | Texto, foto → animación SVG, íconos → animados |
| `src/pages/TemaPage.jsx` | **Modificar** | Video integrado, sección saberes previos, íconos animados |
| `src/components/GraphZone.jsx` | **Modificar** | Reordenar resultados, tabla aproximación, video, íconos |
| `src/data/videos.js` | **Modificar** | Agregar función `getVideoByTema()` |
| `src/components/graficos/helpers.js` | **Modificar** (opcional) | Expandir `generarTablaLimites()` si es necesario |

---

## 7. Notas técnicas

- **Framework:** React 18+ con Vite
- **Estilos:** CSS-in-JS (objetos de estilo inline) consistente con el patrón actual del proyecto
- **Animaciones CSS:** Usar `@keyframes` inyectados vía `document.createElement('style')` como ya se hace en varios componentes
- **SVG:** Usar elementos SVG inline creados con JSX, no archivos externos
- **Responsive:** Mantener las media queries existentes y extender si es necesario
- **Rendimiento:** Usar `will-change: transform` para animaciones, preferir `transform` y `opacity` sobre propiedades que disparen layout/paint



# Agents Skills Workspace

Esta carpeta guarda el contexto operativo para agentes IA que trabajen en LimitsHub. El orden actual usa `.agents/skills/` como base para documentar reglas, memoria, prompts, flujos y especializaciones del proyecto.

## Estructura

- `agents/`: especializacion sugerida de agentes por tipo de tarea.
- `architecture/`: reglas tecnicas y decisiones de arquitectura.
- `context/`: resumen del producto, stack, dominio academico y skills cargadas.
- `frontend/`: instrucciones del frontend, guia visual, diseno, responsive y paleta de colores.
- `memory/`: memoria viva del proyecto para futuras sesiones.
- `prompts/`: prompts reutilizables para tutor IA, resolucion paso a paso y revision de contenido.
- `tools/`: comandos y herramientas relevantes del proyecto.
- `workflows/`: flujos repetibles de trabajo para desarrollo, QA y contenido educativo.
- `frontend-design/`, `tailwind-css-patterns/`, `typescript-advanced-types/`: skills externas cargadas localmente.
- `tailwindcss-animate.md`: nota de estado para una posible adopcion futura.

## Proyecto

LimitsHub es una plataforma educativa universitaria para Calculo I hecha con React, Vite y JavaScript. El producto combina contenido academico, videos, graficacion interactiva y asistencia IA paso a paso para limites, continuidad, derivadas y aplicaciones de la derivada.

## Skills seleccionadas

Del lock propuesto se conservan como utiles: accesibilidad, frontend design, SEO, deploy a Vercel, buenas practicas Node/Vite y patrones Tailwind solo como referencia futura. Se descartan por ahora Astro, Astro framework, backend Node especializado y TypeScript avanzado porque el proyecto actual es React/Vite en JavaScript y no tiene backend propio ni TypeScript.

Las skills cargadas localmente se analizaron en `context/loaded-skills-analysis.md`.

## Prioridades para agentes

- Mantener claridad academica y tono pedagogico paciente.
- Respetar la identidad visual EdTech universitaria.
- Cuidar accesibilidad, contraste, responsive y legibilidad.
- No introducir Tailwind, TypeScript o backend sin una decision explicita del proyecto.
- Validar cambios de codigo con `npm run lint` y, si aplica, `npm run build` desde `vite-project/`.

## Mantenimiento de skills

Si una instruccion, decision, patron o correccion se repite mas de una vez, debe documentarse en la skill o archivo correspondiente dentro de `.agents/skills/`.

Regla practica:

- Instrucciones de frontend: actualizar `frontend/`.
- Reglas tecnicas: actualizar `architecture/`.
- Prompts reutilizables: actualizar `prompts/`.
- Flujos de trabajo: actualizar `workflows/`.
- Decisiones o aprendizajes del proyecto: actualizar `memory/`.
- Contexto general del producto: actualizar `context/`.

El objetivo es que las proximas sesiones no dependan de recordar conversaciones anteriores: las reglas importantes deben vivir en archivos.
