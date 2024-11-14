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

            const data = await response.json();
            if (response.ok) {
                if (data.rol === 'paciente') {
                    console.log("5F-ENTRAMOS AL USERROLE");
                    try {
                        const responsePaciente = await fetchWithAuth('/pacientes/paciente');
                        console.log("🚀 ~ responsePaciente:", responsePaciente);
                        if (responsePaciente.ok) {
                            setTimeout(() => {
                                window.location.href = '/pacientes/paciente';
                            }, 1000);
                        } else {
                            console.error('Error al acceder a la vista protegida:', await responsePaciente.text());
                            alert('No se pudo acceder a la vista del paciente.');
                        }
                    } catch (error) {
                        console.error('Error en la solicitud de redirección:', error.message);
                    }
                } else if (data.rol === 'admin') {
                    console.log("6F-ENTRAMOS AL USERROLE del admin");
                    try {
                        const responseAdmin = await fetchWithAuth('/admin/home');
                        console.log("🚀 ~ responseAdmin:", responseAdmin);
                        if (responseAdmin.ok) {
                            setTimeout(() => {
                                window.location.href = '/admin/home';
                            }, 1000);
                        } else {
                            console.error('Error al acceder a la vista protegida:', await responseAdmin.text());
                            alert('No se pudo acceder a la vista del admin.');
                        }
                    } catch (error) {
                        console.error('Error en la solicitud de redirección:', error.message);
                    }
                } else if (data.rol === 'secretaria') {
                    console.log("7F-ENTRAMOS AL USERROLE de la secretaria");
                    try {
                        const responseSecre = await fetchWithAuth('/secretaria/home');
                        console.log("🚀 ~ responseAdmin:", responseSecre);
                        if (responseSecre.ok) {
                            setTimeout(() => {
                                window.location.href = '/secretaria/home';
                            }, 1000);
                        } else {
                            console.error('Error al acceder a la vista protegida:', await responseSecre.text());
                            alert('No se pudo acceder a la vista de la secretaria.');
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
    options.credentials = 'include';
    console.log("OPTIONS!!! ",options);
    return await fetch(url, options);
};