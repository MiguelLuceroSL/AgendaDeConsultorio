document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'GET',
                    credentials: 'include' // Incluye las cookies en la solicitud
                });
                
                if (response.ok) {
                    window.location.href = '/auth/login'; // Redirige al login si el logout es exitoso
                } else {
                    console.error('Error al hacer logout:', await response.text());
                    alert('No se pudo cerrar la sesión.');
                }
            } catch (error) {
                console.error('Error en la solicitud de logout:', error.message);
            }
        });
    }
});