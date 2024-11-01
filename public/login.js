document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("1F- Entramos al front");

        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Permite que las cookies se envíen automáticamente
            });

            const data = await response.json();
            console.log("2F-🚀 ~ data:", data);

            if (response.ok) {
                // Realizar la solicitud para obtener el rol del usuario
                const responseRole = await fetch('/auth/role', { credentials: 'include' });
                console.log('!!!!RESPONSE ROLE: ', responseRole);
                const roleData = await responseRole.json();
                console.log("3F-🚀 ~ roleData:", roleData);

                const userRole = roleData.rol;
                console.log("4F-🚀 ~ userRole:", userRole);
                
                if (userRole === 'paciente') {
                    console.log("5F-ENTRAMOS AL USERROLE");
                    try {
                        const responsePaciente = await fetchWithAuth('/pacientes/paciente');
                        console.log("🚀 ~ responsePaciente:", responsePaciente);
                        if (responsePaciente.ok) {
                            setTimeout(() => {
                                window.location.href = '/pacientes/paciente';
                            }, 2000);
                        } else {
                            console.error('Error al acceder a la vista protegida:', await responsePaciente.text());
                            alert('No se pudo acceder a la vista del paciente.');
                        }
                    } catch (error) {
                        console.error('Error en la solicitud de redirección:', error.message);
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
    options.credentials = 'include'; // Habilitar cookies en la solicitud
    return await fetch(url, options);
}


// Función de logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}