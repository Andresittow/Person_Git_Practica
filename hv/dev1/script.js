/* ===================================
   DEV 1 - FEATURE: SCROLL ANIMATIONS
   Implementación con Intersection Observer
   =================================== */

// Configuración del Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

// Callback para cuando un elemento es visible
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Opcional: dejar de observar después de animar (mejor rendimiento)
      // observer.unobserve(entry.target);
    }
  });
}

// Crear el observer
const scrollObserver = new IntersectionObserver(handleIntersection, observerOptions);

// Función para inicializar animaciones
function initScrollAnimations() {
  // Seleccionar todos los elementos que deben animarse
  const animatedElements = document.querySelectorAll(`
    .card,
    h2,
    .hero-text,
    .testimonial,
    .contact form,
    .cv-header,
    .cv-card
  `);
  
  animatedElements.forEach((element, index) => {
    // Asignar clase de animación según el tipo de elemento
    if (element.classList.contains('card')) {
      element.classList.add('slide-up');
      // Añadir delay escalonado a las cards
      if (index % 3 === 0) element.classList.add('delay-1');
      if (index % 3 === 1) element.classList.add('delay-2');
      if (index % 3 === 2) element.classList.add('delay-3');
    } else if (element.tagName === 'H2') {
      element.classList.add('fade-in');
    } else if (element.classList.contains('testimonial')) {
      element.classList.add('scale-in');
    } else if (element.classList.contains('cv-card')) {
      element.classList.add('slide-right');
    } else {
      element.classList.add('fade-in');
    }
    
    // Observar el elemento
    scrollObserver.observe(element);
  });
}

// Función para animar elementos específicos con efectos personalizados
function animateOnScroll(selector, animationClass) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.classList.add(animationClass);
    scrollObserver.observe(element);
  });
}

// Efecto paralaje suave para el hero
function initParallaxEffect() {
  const heroImage = document.querySelector('.hero-image img');
  
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${rate}px)`;
      }
    });
  }
}

// Contador animado para números (opcional)
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = Math.floor(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Revelar elementos con delay progresivo
function revealElementsWithDelay(selector, baseDelay = 100) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    element.style.transitionDelay = `${baseDelay * index}ms`;
    scrollObserver.observe(element);
  });
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Pequeño delay para asegurar que el CSS se cargó
  setTimeout(() => {
    initScrollAnimations();
    initParallaxEffect();
    
    // Animar elementos específicos con efectos personalizados
    animateOnScroll('.hero-text h1', 'slide-up');
    animateOnScroll('.hero-text p', 'fade-in');
    animateOnScroll('.cta-button', 'scale-in');
    
    // Revelar cards con delay progresivo
    revealElementsWithDelay('.grid .card', 150);
    
  }, 100);
});

// Animación de entrada inicial para el hero
window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '1';
  }
});

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScrollAnimations,
    animateOnScroll,
    animateCounter,
    revealElementsWithDelay
  };
}