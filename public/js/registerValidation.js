console.log('Register validation cargado');

document.addEventListener('DOMContentLoaded', () => {
  const formRegister = document.querySelector('.formRegister');

  if (!formRegister) {
    console.log('No existe el form de registro');
    return;
  }

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault(); // ⛔ frena SIEMPRE

    const nombre = document.getElementById('registerNombre').value.trim();
    const dni = document.getElementById('registerDni').value;
    const telefono = document.getElementById('registerTelefono').value;
    const fecha = document.getElementById('registerFechaNacimiento').value;
    const pass = document.getElementById('registerPassword').value;
    const confirmPass = document.getElementById('registerConfirmPassword').value;

    // Nombre: solo letras y espacios
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    if (!nombreRegex.test(nombre)) {
      alert('El nombre solo puede contener letras y espacios');
      return;
    }

    // DNI mínimo 8
    if (dni.length < 8) {
      alert('El DNI debe tener al menos 8 dígitos');
      return;
    }

    // Teléfono mínimo 10
    if (telefono.length < 10) {
      alert('El teléfono debe tener al menos 10 dígitos');
      return;
    }

    // Fecha no futura
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha > hoy) {
      alert('La fecha de nacimiento no puede ser futura');
      return;
    }

    // Passwords iguales
    if (pass !== confirmPass) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // ✅ todo OK → recién acá entra al backend
    formRegister.submit();
  });
});