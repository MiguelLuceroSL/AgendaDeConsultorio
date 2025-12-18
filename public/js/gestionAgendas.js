document.addEventListener('DOMContentLoaded', () => {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  const buscador = document.getElementById('buscador-profesional');
  const profesionalCards = document.querySelectorAll('.profesional-card');

  // Funcionalidad de eliminación
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', async (e) => {
      const agendaId = e.target.getAttribute('data-agenda-id');
      
      try {
        // Primera llamada: verificar si tiene turnos
        const response = await fetch(`/agendas/${agendaId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ confirmar: false })
        });

        const data = await response.json();

        if (data.requiereConfirmacion) {
          // Si tiene turnos, mostrar confirmación personalizada
          const confirmar = confirm(`${data.mensaje}\n\n¿Desea continuar con la eliminación?`);
          
          if (!confirmar) return;

          // Segunda llamada: eliminar con confirmación
          const responseConfirmado = await fetch(`/agendas/${agendaId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ confirmar: true })
          });

          const dataConfirmado = await responseConfirmado.json();

          if (responseConfirmado.ok) {
            alert(dataConfirmado.message || 'Agenda eliminada correctamente. Los turnos han sido marcados como "Por reasignar".');
            window.location.reload();
          } else {
            alert(dataConfirmado.error || 'No se pudo eliminar la agenda');
          }
        } else if (response.ok) {
          // Si no tiene turnos, eliminar directamente
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
