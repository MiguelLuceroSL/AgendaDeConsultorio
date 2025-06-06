document.addEventListener('DOMContentLoaded', () => {
  $('#tablaTurnos').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    order: [[4, 'asc']],
    searching: false,
    columnDefs: [{
      targets: [6,7,8],
      orderable : false
    }]
  });
});