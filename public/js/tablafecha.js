document.addEventListener('DOMContentLoaded', () => {
  $('#tablaTurnos').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    order: [[3, 'asc']],
    searching: false
  });
});