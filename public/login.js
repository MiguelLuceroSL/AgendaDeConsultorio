document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();  // Evitar el envío del formulario por defecto
    console.log("entramos al front")
    // Obtener los datos del formulario
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        // Enviar los datos al backend
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);

            // Decodificar el token para extraer el rol
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            const userRole = tokenPayload.rol;

            // Redirigir al usuario según su rol
            switch (userRole) {
                case 'paciente':
                    window.location.href = '/pacientes/paciente';
                    break;
                case 'secretaria':
                    window.location.href = '/secretarias/secretaria';
                    break;
                case 'administrador':
                    window.location.href = '/administradores/administrador';
                    break;
                default:
                    window.location.href = '/login';
            }
        } else {
            alert('Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error al hacer login:', error);
    }
});

// Función de logout
function logout() {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al login
    window.location.href = '/login';
}