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
                credentials: 'include'
            });
            console.log('dps del fetch')
            if (response.ok) {
                const data = await response.json();
                console.log("🚀 ~ data:", data)
                // Manejo de roles y redirecciones

                if (data.rol === 'paciente') {
                    console.log("Bienvenido, paciente:", data.datosPaciente.nombre_completo);
                    localStorage.setItem('datosPaciente', JSON.stringify(data.datosPaciente));
                    await redirectWithAuth('/pacientes/paciente');
                } else if (data.rol === 'admin') {
                    console.log("6F-ENTRAMOS AL USERROLE del admin");
                    await redirectWithAuth('/admin/home');
                } else if (data.rol === 'secretaria') {
                    console.log("7F-ENTRAMOS AL USERROLE de la secretaria");
                    await redirectWithAuth('/secretaria/home');
                }
            } else {
                // Extraer y mostrar mensaje de error del backend
                const errorMessage = await response.text();
                document.querySelector('#error-message').textContent = "Credenciales invalidas";
                console.log('Error del login: ', errorMessage);
            }
        } catch (error) {
            console.error('Error al hacer login:', error.message);
            document.querySelector('#error-message').textContent =
                'Ocurrió un error inesperado. Intenta nuevamente.';
        }
    });
});

async function redirectWithAuth(url) {
    try {
        const datosPaciente = JSON.parse(localStorage.getItem('datosPaciente'));
        if (datosPaciente) {
            const response = await fetchWithAuth(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datosPaciente })
            });
            if (response.ok) {
                setTimeout(() => {
                    window.location.href = url;
                }, 1000);
            } else {
                const error = await response.text();
                console.error(`Error al acceder a la vista protegida (${url}):`, error);
                alert(`No se pudo acceder a la vista protegida (${url}).`);
            }
        } else {
            const response = await fetchWithAuth(url);
            console.log(`🚀 ~ Redirect response to ${url}:`, response);
            if (response.ok) {
                setTimeout(() => {
                    window.location.href = url;
                }, 1000);
            } else {
                const error = await response.text();
                console.error(`Error al acceder a la vista protegida (${url}):`, error);
                alert(`No se pudo acceder a la vista protegida (${url}).`);
            }
        }
    } catch (error) {
        console.error('Error en la solicitud de redirección:', error.message);
    }
}

async function fetchWithAuth(url, options = {}) {
    options.credentials = 'include';
    console.log("OPTIONS!!! ", options);
    return await fetch(url, options);
}
