document.querySelector('select[name="especialidad"]').addEventListener('change', function () {
  const especialidad = this.value;
  fetch(`/profesional/listar?especialidad=${especialidad}`)
    .then(response => response.text())
    .then(html => {
      document.body.innerHTML = html;
    })
    .catch(error => console.error('Error al cargar los profesionales:', error));
});