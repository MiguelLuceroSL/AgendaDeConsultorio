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
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("2F-🚀 ~ data:", data);
            
            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);

                // Decodificar el token para obtener el rol del usuario
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                console.log("3F-🚀 ~ tokenPayload:", tokenPayload)
                
                const userRole = tokenPayload.rol;
                console.log("4F-🚀 ~ userRole:", userRole)
                if (userRole === 'paciente') {
                    console.log("5F-ENTRAMOS AL USERROLE");
                    try {
                        const response = await fetchWithAuth('/pacientes/paciente');
                        console.log("🚀 ~ response:", response)
                        if (response.ok) {
                            setTimeout(()=>{
                                window.location.href = '/pacientes/paciente' 
                            },2000)
                        } else {
                            console.error('Error al acceder a la vista protegida:', await response.text());
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
    const token = localStorage.getItem('token');
    console.log("TOKEN DE LA FUNCION fetchWithAuth🚀:", token)
    console.log("OPTIONS HEADERS: ",options.headers)
    options.headers = {};
    options.headers['authorization'] = `Bearer ${token}`;
    console.log("OPTIONS HEADERS 2: ",options.headers)
    console.log("URL DENTRO DE LA FUNCION: ",url)
    return await fetch(url, options);
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}