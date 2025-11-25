document.addEventListener('DOMContentLoaded', () => {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  const buscador = document.getElementById('buscador-profesional');
  const profesionalCards = document.querySelectorAll('.profesional-card');

  // Funcionalidad de eliminación
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', async (e) => {
      const agendaId = e.target.getAttribute('data-agenda-id');
      
      const confirmar = confirm('¿Está seguro de que desea eliminar esta agenda? Esta acción no se puede deshacer.');
      
      if (!confirmar) return;

      try {
        const response = await fetch(`/agendas/${agendaId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || 'Agenda eliminada correctamente');
          window.location.reload();
        } else {
          alert(data.error || 'No se pudo eliminar la agenda');
        }
      } catch (error) {
        console.error('Error al eliminar agenda:', error);
        alert('Error al eliminar la agenda');
      }
    });
  });

  // Funcionalidad de búsqueda
  if (buscador) {
    buscador.addEventListener('input', (e) => {
      const textoBusqueda = e.target.value.toLowerCase().trim();

      profesionalCards.forEach(card => {
        const nombreProfesional = card.querySelector('.profesional-nombre').textContent.toLowerCase();
        
        if (nombreProfesional.includes(textoBusqueda)) {
          card.classList.remove('oculto');
        } else {
          card.classList.add('oculto');
        }
      });
    });
  }
});
