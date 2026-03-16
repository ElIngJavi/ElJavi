# Portafolio de Javier Carranza

Este repositorio contiene el sitio web personal/portafolio de Javier Carranza, desarrollado en HTML y CSS puro. La idea es mostrar información personal, proyectos, habilidades, redes sociales y experiencia profesional.

El enfoque principal al mantener el código ha sido:

- **Simplicidad:** Sin marcos ni librerías; todo en HTML/CSS para que sea fácil de entender y editar.
- **Responsividad básica:** Aunque el diseño no es completamente "responsive" en todas las secciones, hay adaptaciones para móviles que mejoran la navegación en pantallas pequeñas.

---

## Estructura principal

- `index.html` contiene el marcado de todas las secciones del sitio: navegación, hero, sobre mí, redes, proyectos, experiencia, contacto, etc.
- `style.css` alberga el estilo global, incluidos los colores sombreados, tipografía y reglas específicas para móviles.
- La carpeta `Fotos/` guarda las imágenes utilizadas en cards y la navegación.

---

## Navegación y menú móvil

### Marcar y estilos
En la cabecera (`<header class="navbar">`) usamos un "checkbox hack" para el menú móvil:

```html
<input type="checkbox" id="menu-toggle" />
<label for="menu-toggle" class="menu-icon">
  <span></span>
  <span></span>
  <span></span>
</label>
<label for="menu-toggle" class="overlay"></label>
<nav>
  <ul class="nav-links"> ... </ul>
</nav>
```

El checkbox no es visible; su `:checked` controla el estado del menu. El `label.menu-icon` contiene tres `<span>` que son las barras de la hamburguesa y se transforman en una "X" cuando el menú está abierto.

La `label.overlay` es un elemento transparente que cubre la página cuando el menú está abierto; al hacer clic en él se cierra el menú (porque vuelve a desmarcar el checkbox).

### Comportamiento en móviles

Dentro de un `@media (max-width: 768px)` se aplican varias reglas:

- `.menu-icon` aparece en la esquina superior izquierda y su icono se anima de hamburguesa a X.
- `.nav-links` es un panel vertical que empieza oculto fuera de la pantalla (`transform: translateX(-100%)`) y se desliza hacia adentro cuando el checkbox está marcado.
- Se añade una sombra, bordes redondeados y pocos enlaces para que el panel no ocupe demasiado espacio (40 vw de ancho).
- Al abrir el menú, un `.overlay` semitransparente oscurece el resto del contenido y bloquea el scroll de fondo.

Las reglas CSS relevantes están en la sección "MOBILE NAVIGATION AND LAYOUT" de `style.css`.

---

## Diseño adaptativo general

Además del menú, otras adaptaciones móviles incluyen:

- Centrar el contenido hero y reducir márgenes.
- Convertir las grillas (`.about-grid`, `.social-wrapper`, `.contact-grid`, etc.) en bloques apilados bajo el mismo media query.
- Proyecto y otros contenedores usan grid `auto-fit` para ajustarse al ancho.

Todo esto se implementa mediante una única consulta media de 768px y algunas adicionales para el grid de redes a 900px.

---

## Sección de experiencia

La sección de experiencia (`.experience`) originalmente tenía dos columnas: una línea de tiempo a la izquierda (`.timeline`) y el detalle a la derecha (`.detail`). El comportamiento para móviles fue criticado por verse "fea" y se intentaron varias soluciones (carrusel horizontal, ocultarla, etc.).

Finalmente decidí dejar la columna sin modificar y centrarme sólo en la navegación móvil; si se requiere futura mejora, la idea sería reformatear esa línea de tiempo como tarjetas o tabs.

---

## Notas de estilo y mantenimiento

- El archivo CSS usa variables `:root` para colores, lo cual facilita temas futuros.
- Los botones (`.btn`, `.btn-outline`, `.btn-sm`) y tarjetas (`.project-card`, `.social-card`) son reutilizables.
- El sitio está pensado para cargarse rápido y funcionar sin JavaScript; todas las interacciones simples se logran con CSS puro.

---

## Cómo editar

1. **Instala un servidor simple** (por ejemplo, `Live Server` en VSCode) para ver los cambios en tiempo real.
2. Cambia texto o agrega nuevas secciones directamente en `index.html`.
3. Ajusta estilos en `style.css`, siguiendo patrones existentes (p.ej. clases `.about-left` y `.about-right` para dividir contenido).
4. Para extender la responsividad, agrega más consultas `@media` o considera una pequeña biblioteca CSS (Bootstrap, Tailwind) si el sitio crece mucho.

---

¡Listo! Cualquier modificación o explicación adicional que quieras agregar, puedes hacerlo aquí mismo. Este documento está escrito en un tono casual para que parezca que lo creaste tú mismo y te sirva como guía rápida.