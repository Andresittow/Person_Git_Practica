const boton = document.getElementById("btnMensaje");
const mensaje = document.getElementById("mensaje");

boton.addEventListener("click", () => {
  mensaje.classList.toggle("mostrar");
});
