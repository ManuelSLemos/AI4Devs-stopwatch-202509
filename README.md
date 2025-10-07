# ⏱️ Stopwatch & Countdown Timer

Una aplicación web profesional y moderna que incluye un **Cronómetro (Stopwatch)** y un **Temporizador de Cuenta Atrás (Countdown Timer)**.

![Stopwatch Preview](res/stopwatch.png)

## ✨ Características

### 🏃 Cronómetro (Stopwatch)
- **Display de alta precisión**: Formato HH:MM:SS.MS (milisegundos)
- **Controles completos**:
  - ▶️ Start/Pause - Inicia o pausa el cronómetro
  - 🔄 Reset - Reinicia a 00:00:00.00
  - ⏱️ Lap - Registra tiempos parciales
- **Lista de Laps**: Visualiza los últimos 10 tiempos parciales
- **Precisión**: Actualización cada 10ms para máxima exactitud

### ⏳ Cuenta Atrás (Countdown)
- **Display claro**: Formato HH:MM:SS
- **Configuración flexible**: Inputs separados para horas, minutos y segundos
- **Presets rápidos**: Botones para 1min, 5min, 10min, 30min
- **Controles**:
  - ▶️ Start/Pause - Inicia o pausa la cuenta atrás
  - 🔄 Reset - Vuelve al tiempo configurado
- **Alertas al finalizar**:
  - ⚡ Animación visual (parpadeo y cambio de color)
  - 🔔 Sonido de alerta (beep)
  - 📢 Mensaje "TIME'S UP!"

## 🎨 Diseño

- **Interfaz moderna**: Diseño card con degradado de fondo
- **Sistema de pestañas**: Alterna fácilmente entre Stopwatch y Countdown
- **Totalmente responsive**: Adaptado para móviles, tablets y desktop
- **Paleta de colores profesional**:
  - Stopwatch: Azul (#2196F3)
  - Countdown: Verde (#4CAF50)
- **Animaciones suaves**: Transiciones CSS elegantes
- **Iconos SVG**: Interfaz visual intuitiva

## ⌨️ Atajos de Teclado

- `Space` - Start/Pause (en la pestaña activa)
- `R` - Reset
- `L` - Lap (solo en Stopwatch)

## 💾 Persistencia de Datos

La aplicación guarda automáticamente tu estado usando **localStorage**:
- ✅ Pestaña activa
- ✅ Tiempo del cronómetro
- ✅ Lista de laps
- ✅ Configuración del countdown

## 🚀 Uso

1. Abre el archivo `template/index.html` en tu navegador
2. Selecciona la pestaña deseada (Stopwatch o Countdown)
3. Usa los controles o atajos de teclado
4. ¡Disfruta de la aplicación!

## 📂 Estructura de Archivos

```
s2 - stopwatch/
├── template/
│   ├── index.html      # Estructura HTML
│   ├── styles.css      # Estilos CSS
│   └── script.js       # Lógica JavaScript
├── res/
│   └── stopwatch.png   # Imagen de preview
└── README.md           # Documentación
```

## 💻 Tecnologías

- **HTML5**: Semántico y accesible
- **CSS3**: Variables CSS, Flexbox, Grid, Animaciones
- **JavaScript ES6+**: Vanilla JS puro, sin dependencias
- **Google Fonts**: Roboto & Roboto Mono

## 🎯 Características Técnicas

- ✅ Código limpio y bien comentado
- ✅ Funciones reutilizables
- ✅ Event listeners eficientes
- ✅ Accesibilidad básica (aria-labels)
- ✅ Soporte para prefers-reduced-motion
- ✅ Sin dependencias externas

## 📱 Responsive

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (640px+)
- 💻 Desktop (1024px+)

## 🌟 Extras Implementados

- ✅ Animaciones CSS suaves
- ✅ Efectos hover en botones
- ✅ Atajos de teclado (Space, R, L)
- ✅ Persistencia con localStorage
- ✅ Accesibilidad (aria-labels, focus-visible)
- ✅ Sonido de alerta en countdown
- ✅ Auto-guardado de estado

## 🔧 Instalación

No requiere instalación. Solo abre el archivo HTML en tu navegador:

```bash
# Opción 1: Abrir directamente
open template/index.html

# Opción 2: Servidor local (opcional)
cd template
python -m http.server 8000
# Luego visita: http://localhost:8000
```

## 📝 Licencia

Proyecto libre para uso personal y educativo.

---

**Desarrollado con ❤️ usando HTML, CSS y JavaScript vanilla**
