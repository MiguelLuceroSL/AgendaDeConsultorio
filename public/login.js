document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Entramos al front");

        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;
        
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("🚀 ~ data:", data);
            
            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);

                // Decodificar el token para obtener el rol del usuario
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                console.log("🚀 ~ tokenPayload:", tokenPayload)
                
                const userRole = tokenPayload.rol;
                console.log("🚀 ~ userRole:", userRole)
                // Realizar una solicitud adicional si el rol es "paciente"
                if (userRole === 'paciente') {
                    console.log("ENTRAMOS AL USERROLE");
                    try {
                        window.location.href = '/pacientes/paciente';
                    } catch (error) {
                        console.error('Error al obtener datos del paciente:', error.message);
                        alert('Error al obtener datos del paciente');
                    }
                } else {
                    // Redirigir a las otras rutas según el rol
                    switch (userRole) {
                        case 'secretaria':
                            window.location.href = '/secretarias/secretaria';
                            break;
                        case 'administrador':
                            window.location.href = '/administradores/administrador';
                            break;
                        default:
                            window.location.href = '/login';
                    }
                }
            } else {
                alert('Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error al hacer login:', error.message);
        }
    });
                
});

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = `Bearer ${token}`;
    return await fetch(url, options);
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}