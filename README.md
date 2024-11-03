# Metrónomo Polirrítmico

[![Issues](https://img.shields.io/github/issues/sanxofon/mc)](https://github.com/sanxofon/mc/issues)
[![License: GNU](https://img.shields.io/badge/License-GNU-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Un metrónomo polirrítmico e irregular para músicos, creado como una PWA (Progressive Web App) para usar offline. Esta versión introduce mejoras significativas en la generación de sonido y la flexibilidad de configuración.

## Demo

Puedes probar la demo en vivo aquí: [https://sanxofon.github.io/mc/](https://sanxofon.github.io/mc/)

## Novedades de la versión 2.1

Esta versión (v2.1) introduce algunas mejoras con respecto a la versión anterior (v2.0 - [enlace a v2.0](https://github.com/sanxofon/mc/tree/v2.0)):

* **Lógica más estable en el loop:**  Ahora se utiliza requestAnimationFrame en vez de setTimeout para generar el loop.
* **Se han corregido errores generales** Algunos textos en configuración se han corregido y se ha agregado la posibilidad de escuchar los distintos *sonidos* disponibles.

### BUGS de esta versión

- **El metrónomo se detiene cuando la ventana/pestaña del navegador pierde el foco** El problema es que requestAnimationFrame depende del bucle de renderizado del navegador y, si el navegador no está renderizando activamente, la animación no continuará.

## Novedades de la versión 2.0

La versión (v2.0) introduce importantes mejoras con respecto a la versión anterior (v1.9 - [enlace a v1.9](https://github.com/sanxofon/mc/tree/v1.9)):

* **Sonidos MP3:**  Se reemplazó el oscilador por la librería Howler.js para reproducir sonidos MP3 reales.  Esto proporciona una mayor variedad de sonidos y una experiencia más rica para el músico.
* **Control de sonido por pista:**  Los parámetros "Octava" y "Tipo" ahora se utilizan para seleccionar el sonido de golpe y acento para cada pista individualmente.  Esto ofrece una flexibilidad mucho mayor para crear patrones rítmicos complejos y personalizados.

### BUGS de esta versión

- **Comúnmente el loop se arruina** Se acelera mucho o desacelera por falta de poder en el CPU. El método de SetTimeout para hacer el loop no es confiable.

## Características

* Define hasta 5 pistas de ritmo independientes.
* Ajusta el número de pulsos y el volumen de cada pista.
* Selecciona el sonido de golpe y acento para cada pista usando "Octava" y "Tipo"
* Crea patrones rítmicos complejos con acentos y silencios.
* Control preciso del tempo (CPM - Compases Por Minuto).
* Interfaz visual intuitiva que muestra el estado de cada pista.
* Funciona offline gracias a la tecnología PWA.

## Instalación

Para usar el metrónomo localmente, simplemente clona este repositorio:

```bash
git clone https://github.com/sanxofon/mc.git
```

Luego, abre el archivo `index.html` en tu navegador.

## Uso

1. **Controles principales:** Usa los botones PLAY/STOP y el slider de volumen para controlar la reproducción.
2. **Configuración de pistas:** Ajusta los parámetros de cada pista (Número, Activo, BPM, Pulso, Vol, Octava, Tipo) en la tabla.  "Octava" y "Tipo" ahora seleccionan el sonido de cada pista.
3. **Clave rítmica:** Introduce una clave rítmica en el campo "Clave" usando la notación específica (ej. "7.1/5.1").
4. **Configuración avanzada:** Haz clic en "Opciones avanzadas" para acceder a parámetros adicionales como el compás actual, el CPM real y la precisión del temporizador.
5. **Configuración de sonidos:** La configuración de sonidos ahora se realiza individualmente para cada pista usando los parámetros "Octava" y "Tipo".


## Tecnologías utilizadas

* HTML
* CSS
* JavaScript
* Howler.js (para la reproducción de audio MP3)
* Service Workers (para funcionalidad offline)
* Math.js (para cálculos rítmicos)


## Licencia

Este proyecto está licenciado bajo la Licencia Pública General de GNU versión 3 - [GNU](https://www.gnu.org/licenses/gpl-3.0).


## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un "issue" para reportar errores o sugerir nuevas características.


## Créditos

Creado por Santiago C. Novaro - [https://lengua.la](https://lengua.la)