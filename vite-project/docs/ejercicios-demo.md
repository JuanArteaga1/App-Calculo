# Ejercicios de Prueba - Laboratorio de Graficación

Copia y pega estos ejercicios en los inputs del **Laboratorio de Graficación** de cada lección para probar el sistema.

---

## LÍMITES (Modo: `limite`)

### Ejercicio 1: Límite por sustitución directa
- **f(x)**: `x^2 + 3*x - 1`
- **x →**: `2`
- **Resultado esperado**: Límite = 9
- **Qué ver**: Curva continua, punto amarillo en (2, 9)

### Ejercicio 2: Indeterminación 0/0 (discontinuidad removible)
- **f(x)**: `(x^2 - 4)/(x - 2)`
- **x →**: `2`
- **Resultado esperado**: Límite = 4 (f(2) no definido, pero límite sí existe)
- **Qué ver**: Curva con "hueco" en x=2, punto amarillo en (2, 4)

### Ejercicio 3: Límite con raíz
- **f(x)**: `(sqrt(x + 1) - 1)/x`
- **x →**: `0`
- **Resultado esperado**: Límite = 0.5
- **Qué ver**: Acercamiento a (0, 0.5)

### Ejercicio 4: Límites laterales diferentes
- **f(x)**: `abs(x)/x`
- **x →**: `0`
- **Resultado esperado**: No existe el límite (izq = -1, der = 1)
- **Qué ver**: Dos valores diferentes en cada lado

### Ejercicio 5: Límite trigonométrico
- **f(x)**: `sin(x)/x`
- **x →**: `0`
- **Resultado esperado**: Límite = 1
- **Qué ver**: Curva que se acerca a y=1 cuando x→0

### Ejercicio 6: Límite al infinito
- **f(x)**: `1/x`
- **x →**: `0`
- **Resultado esperado**: Límite = ∞ (asíntota vertical)
- **Qué ver**: Curva que tiende a ±∞ cerca de x=0

### Ejercicio 7: Límite de función racional
- **f(x)**: `(3*x^2 - 2*x + 1)/(x^2 + 1)`
- **x →**: `1`
- **Resultado esperado**: Límite = 1
- **Qué ver**: Curva suave pasando por (1, 1)

---

## DERIVADAS (Modo: `derivada`)

### Ejercicio 1: Derivada de potencia
- **f(x)**: `x^3`
- **x₀**: `2`
- **h**: `0.5`
- **Resultado esperado**: f'(x) = 3x², f'(2) = 12
- **Qué ver**: Curva cúbica, punto rojo en (2, 8), tangente con pendiente 12

### Ejercicio 2: Derivada de parábola
- **f(x)**: `x^2 - 4*x + 3`
- **x₀**: `1`
- **h**: `0.5`
- **Resultado esperado**: f'(x) = 2x - 4, f'(1) = -2
- **Qué ver**: Parábola, punto en (1, 0), tangente decreciente

### Ejercicio 3: Derivada trigonométrica
- **f(x)**: `sin(x)`
- **x₀**: `pi/2` (ingresar como `1.5708` o usar `pi/2`)
- **h**: `0.5`
- **Resultado esperado**: f'(x) = cos(x), f'(π/2) = 0
- **Qué ver**: Seno con tangente horizontal en el máximo

### Ejercicio 4: Derivada exponencial
- **f(x)**: `e^x`
- **x₀**: `0`
- **h**: `0.5`
- **Resultado esperado**: f'(x) = e^x, f'(0) = 1
- **Qué ver**: Exponencial, tangente con pendiente 1 en (0, 1)

### Ejercicio 5: Derivada de cociente (regla de la cadena implícita)
- **f(x)**: `sqrt(x)`
- **x₀**: `4`
- **h**: `0.5`
- **Resultado esperado**: f'(x) = 1/(2√x), f'(4) = 0.25
- **Qué ver**: Raíz cuadrada con tangente suave

### Ejercicio 6: Producto notables
- **f(x)**: `(x + 1)*(x - 2)`
- **x₀**: `0`
- **h**: `0.5`
- **Resultado esperado**: f'(x) = 2x - 1, f'(0) = -1
- **Qué ver**: Parábola expandida, tangente en (0, -2)

---

## APLICACIONES (Modo: `aplicacion`)

### Ejercicio 1: Máximos y mínimos
- **f(x)**: `x^3 - 3*x`
- **Subtipo**: `extremos`
- **Resultado esperado**: Máximo en (-1, 2), Mínimo en (1, -2)
- **Qué ver**: Curva con punto alto en x=-1 y punto bajo en x=1

### Ejercicio 2: Concavidad
- **f(x)**: `x^3`
- **Subtipo**: `concavidad`
- **Resultado esperado**: f''(x) = 6x, cóncava abajo para x<0, arriba para x>0
- **Qué ver**: Curva con cambio de inflexión en (0, 0)

### Ejercicio 3: Teorema del Valor Medio
- **f(x)**: `x^2`
- **Subtipo**: `tvm`
- **a**: `0`
- **b**: `2`
- **Resultado esperado**: Pendiente secante = 2, existe c=1 donde f'(1)=2
- **Qué ver**: Recta secante roja y tangente paralela en x=1

### Ejercicio 4: Función cuadrática con restricción
- **f(x)**: `-x^2 + 4*x`
- **Subtipo**: `extremos`
- **Resultado esperado**: Máximo en (2, 4)
- **Qué ver**: Parábola invertida con pico en x=2

### Ejercicio 5: Polinomio de grado 4
- **f(x)**: `x^4 - 4*x^2`
- **Subtipo**: `extremos`
- **Resultado esperado**: Máximos en x=0, mínimos en x=±√2
- **Qué ver**: Curva en "W" con puntos críticos

---

## Funciones soportadas por math.js

Puedes usar cualquiera de estas en los inputs:

| Operación | Sintaxis | Ejemplo |
|---|---|---|
| Potencia | `x^2`, `x^3` | `x^2 + 1` |
| Raíz cuadrada | `sqrt(x)` | `sqrt(x + 1)` |
| Valor absoluto | `abs(x)` | `abs(x)/x` |
| Seno | `sin(x)` | `sin(x)/x` |
| Coseno | `cos(x)` | `cos(x)^2` |
| Tangente | `tan(x)` | `tan(x)` |
| Exponencial | `e^x` o `exp(x)` | `e^x` |
| Logaritmo natural | `log(x)` o `ln(x)` | `log(x + 1)` |
| Pi | `pi` | `sin(pi/2)` |
| Paréntesis | `(x + 1)/(x - 1)` | `(x^2 - 1)/(x - 1)` |

---

## Tips de prueba

1. **Si la función no grafica**: Revisa que uses `x` como variable (no X mayúscula)
2. **Si sale error de sintaxis**: Prueba con funciones más simples primero (`x^2`, `sin(x)`)
3. **Si el gráfico está vacío**: El rango automático puede estar fuera de vista. Prueba con valores de `a` o `x0` cercanos a 0.
4. **Para ver mejor discontinuidades**: Usa funciones como `(x^2-1)/(x-1)` con `a=1`
