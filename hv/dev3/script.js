/* ===================================
   DEV 3 - FEATURE: FORM ANIMATION FEEDBACK
   Animaciones al enviar formulario con loader
   =================================== */

// Crear loader overlay
function createLoaderOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'form-loader-overlay';
  overlay.innerHTML = `
    <div class="loader-container">
      <div class="loader-dots">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
      <p class="loader-text">Enviando mensaje...</p>
      <p class="loader-subtext">Por favor espera un momento</p>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// Crear modal de éxito
function createSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'success-modal';
  modal.innerHTML = `
    <div class="success-checkmark">
      <div class="checkmark-circle"></div>
      <div class="checkmark-check"></div>
    </div>
    <h3 class="success-title">¡Mensaje Enviado!</h3>
    <p class="success-message-text">
      Gracias por contactarnos. Hemos recibido tu mensaje y 
      te responderemos lo antes posible.
    </p>
    <button class="success-close-btn">Cerrar</button>
  `;
  document.body.appendChild(modal);
  
  // Agregar backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  document.body.appendChild(backdrop);
  
  return { modal, backdrop };
}

// Mostrar loader
function showLoader() {
  let loader = document.querySelector('.form-loader-overlay');
  if (!loader) {
    loader = createLoaderOverlay();
  }
  
  // Pequeño delay para que se vea la animación
  setTimeout(() => {
    loader.classList.add('active');
  }, 10);
  
  return loader;
}

// Ocultar loader
function hideLoader() {
  const loader = document.querySelector('.form-loader-overlay');
  if (loader) {
    loader.classList.remove('active');
  }
}

// Mostrar modal de éxito
function showSuccessModal() {
  let modal = document.querySelector('.success-modal');
  let backdrop = document.querySelector('.modal-backdrop');
  
  if (!modal) {
    const elements = createSuccessModal();
    modal = elements.modal;
    backdrop = elements.backdrop;
  }
  
  // Mostrar backdrop primero
  backdrop.classList.add('show');
  
  // Mostrar modal con delay
  setTimeout(() => {
    modal.classList.add('show');
    
    // Opcional: Crear confeti
    createConfetti();
  }, 100);
  
  // Agregar evento al botón de cerrar
  const closeBtn = modal.querySelector('.success-close-btn');
  closeBtn.onclick = closeSuccessModal;
  
  // Cerrar al hacer click en el backdrop
  backdrop.onclick = closeSuccessModal;
  
  return modal;
}

// Cerrar modal de éxito
function closeSuccessModal() {
  const modal = document.querySelector('.success-modal');
  const backdrop = document.querySelector('.modal-backdrop');
  
  if (modal) {
    modal.classList.remove('show');
  }
  
  if (backdrop) {
    backdrop.classList.remove('show');
  }
}

// Crear efecto de confeti
function createConfetti() {
  const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(confetti);
      
      // Eliminar después de la animación
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 30);
  }
}

// Simular envío exitoso del formulario
function simulateFormSubmission() {
  return new Promise((resolve) => {
    // Simular delay de red (1.5 - 2.5 segundos)
    const delay = Math.random() * 1000 + 1500;
    setTimeout(() => {
      resolve({ success: true });
    }, delay);
  });
}

// Resetear formulario con animación
function resetFormWithAnimation(form) {
  form.classList.add('resetting');
  
  setTimeout(() => {
    form.reset();
    
    // Limpiar validaciones
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.classList.remove('valid', 'invalid');
      
      const fieldContainer = field.closest('.form-field') || field.parentElement;
      const label = fieldContainer.querySelector('.form-label');
      if (label) {
        label.classList.remove('valid', 'invalid');
      }
      
      const errorMsg = fieldContainer.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.classList.remove('show');
      }
      
      const icon = fieldContainer.querySelector('.validation-icon');
      if (icon) {
        icon.classList.remove('show');
      }
    });
    
    // Limpiar mensaje del formulario
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.textContent = '';
      formMessage.classList.remove('show', 'success', 'error');
    }
    
    form.classList.remove('resetting');
    
    // Actualizar estado del botón
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Completa el formulario';
    }
  }, 500);
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Agregar clase de envío
  form.classList.add('submitting');
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  // Mostrar loader
  const loader = showLoader();
  
  try {
    // Simular envío
    await simulateFormSubmission();
    
    // Ocultar loader
    hideLoader();
    
    // Remover clase de envío
    form.classList.remove('submitting');
    submitButton.classList.remove('loading');
    
    // Animación de pulso de éxito
    form.classList.add('success-pulse');
    setTimeout(() => {
      form.classList.remove('success-pulse');
    }, 1000);
    
    // Mostrar modal de éxito
    setTimeout(() => {
      showSuccessModal();
    }, 500);
    
    // Resetear formulario después de un delay
    setTimeout(() => {
      resetFormWithAnimation(form);
    }, 2000);
    
  } catch (error) {
    // Manejar error
    hideLoader();
    form.classList.remove('submitting');
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    
    alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
  }
}

// Inicializar animaciones del formulario
function initFormAnimations() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    // Remover el event listener anterior si existe
    const oldHandler = contactForm.onsubmit;
    contactForm.removeEventListener('submit', oldHandler);
    
    // Agregar nuevo event listener
    contactForm.addEventListener('submit', handleFormSubmit);
  }
}

// Agregar transiciones suaves a todos los inputs
function addSmoothTransitions() {
  const inputs = document.querySelectorAll('.contact input, .contact textarea');
  
  inputs.forEach(input => {
    input.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initFormAnimations();
  addSmoothTransitions();
});

// Limpiar elementos al recargar página
window.addEventListener('beforeunload', () => {
  const loader = document.querySelector('.form-loader-overlay');
  const modal = document.querySelector('.success-modal');
  const backdrop = document.querySelector('.modal-backdrop');
  
  if (loader) loader.remove();
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
});

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showLoader,
    hideLoader,
    showSuccessModal,
    closeSuccessModal,
    simulateFormSubmission,
    resetFormWithAnimation,
    handleFormSubmit
  };
}