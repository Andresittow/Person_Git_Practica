/* ===================================
   DEV 2 - FEATURE: ACTIVE LINK HIGHLIGHT
   Detectar sección visible y resaltar enlace activo
   =================================== */

// Configuración
const config = {
  rootMargin: '-50% 0px -50% 0px', // Detectar cuando la sección está centrada
  threshold: 0,
  activeClass: 'active',
  offset: 100 // Offset para compensar el header fijo
};

// Objeto para almacenar las secciones observadas
const sections = new Map();

// Función para actualizar el enlace activo
function updateActiveLink(sectionId) {
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Remover clase active de todos
    link.classList.remove(config.activeClass);
    
    // Remover badge si existe
    const badge = link.querySelector('.active-badge');
    if (badge) {
      badge.remove();
    }
    
    // Agregar clase active al enlace correspondiente
    if (href === `#${sectionId}`) {
      link.classList.add(config.activeClass);
      
      // Opcional: Agregar badge "Actual"
      // Descomentar para activar
      /*
      const activeBadge = document.createElement('span');
      activeBadge.className = 'active-badge';
      activeBadge.textContent = 'Actual';
      link.appendChild(activeBadge);
      */
    }
  });
}

// Función para obtener la sección más visible
function getMostVisibleSection() {
  const scrollPosition = window.pageYOffset + config.offset;
  let currentSection = null;
  let maxVisibility = 0;
  
  sections.forEach((data, section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.pageYOffset;
    const sectionBottom = sectionTop + rect.height;
    
    // Calcular cuánto de la sección es visible
    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
      const visibility = 1 - Math.abs((scrollPosition - sectionTop) / rect.height);
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        currentSection = section.id;
      }
    }
  });
  
  return currentSection;
}

// Callback del Intersection Observer
function handleIntersection(entries) {
  entries.forEach(entry => {
    const sectionId = entry.target.id;
    sections.set(entry.target, {
      isIntersecting: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio
    });
  });
  
  // Actualizar el enlace activo basado en la sección más visible
  const visibleSection = getMostVisibleSection();
  if (visibleSection) {
    updateActiveLink(visibleSection);
  }
}

// Crear el Intersection Observer
const sectionObserver = new IntersectionObserver(handleIntersection, {
  rootMargin: config.rootMargin,
  threshold: config.threshold
});

// Método alternativo usando scroll para mayor precisión
function detectActiveSectionOnScroll() {
  const scrollPosition = window.pageYOffset + window.innerHeight / 2;
  
  const allSections = document.querySelectorAll('section[id]');
  let currentActiveSection = null;
  
  allSections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentActiveSection = section.id;
    }
  });
  
  if (currentActiveSection) {
    updateActiveLink(currentActiveSection);
  }
}

// Throttle para optimizar rendimiento
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Inicializar el sistema de detección
function initActiveLinkHighlight() {
  // Encontrar todas las secciones con ID
  const allSections = document.querySelectorAll('section[id]');
  
  if (allSections.length === 0) {
    console.warn('No se encontraron secciones con ID');
    return;
  }
  
  // Observar cada sección
  allSections.forEach(section => {
    sectionObserver.observe(section);
    sections.set(section, { isIntersecting: false, intersectionRatio: 0 });
  });
  
  // Agregar listener de scroll como método alternativo
  window.addEventListener('scroll', throttle(detectActiveSectionOnScroll, 100), { passive: true });
  
  // Detectar sección activa inicial
  setTimeout(() => {
    detectActiveSectionOnScroll();
  }, 100);
}

// Smooth scroll mejorado para los enlaces
function enhanceSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar inmediatamente el enlace activo
        setTimeout(() => {
          updateActiveLink(targetId);
        }, 500);
        
        // Cerrar menú móvil si está abierto
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });
}

// Crear indicador de progreso de scroll (opcional)
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', throttle(() => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, 10), { passive: true });
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
  initActiveLinkHighlight();
  enhanceSmoothScroll();
  
  // Opcional: Crear barra de progreso
  // Descomentar para activar
  // createScrollProgress();
});

// Actualizar al redimensionar
window.addEventListener('resize', throttle(() => {
  detectActiveSectionOnScroll();
}, 200));

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initActiveLinkHighlight,
    updateActiveLink,
    detectActiveSectionOnScroll
  };
}