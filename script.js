const menuToggle=document.getElementById("menuToggle")
const navMenu=document.getElementById("navMenu")

menuToggle.addEventListener("click",()=>{
navMenu.classList.toggle("active")
})

document.querySelectorAll("a[href^='#']").forEach(link=>{
link.addEventListener("click",e=>{
e.preventDefault()
const target=document.querySelector(link.getAttribute("href"))
target.scrollIntoView({behavior:"smooth"})
})
})

const ctaButton=document.getElementById("ctaButton")

ctaButton.addEventListener("click",()=>{
alert("Bienvenido a WorkspacePro")
})

const contactForm=document.getElementById("contactForm")
const formMessage=document.getElementById("formMessage")

contactForm.addEventListener("submit",e=>{
e.preventDefault()

const name=document.getElementById("nameInput").value.trim()
const email=document.getElementById("emailInput").value.trim()
const message=document.getElementById("messageInput").value.trim()

if(name===""||email===""||message===""){
formMessage.textContent="Por favor completa todos los campos"
formMessage.style.color="red"
}else{
formMessage.textContent="Mensaje enviado correctamente"
formMessage.style.color="green"
contactForm.reset()
}
})