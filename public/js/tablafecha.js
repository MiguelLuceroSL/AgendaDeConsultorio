document.addEventListener('DOMContentLoaded', () => {
  $('#tablaTurnos').DataTable({
    language: {
      url: '/js/tablaIdioma.json'
    },
    order: [[4, 'asc']],
    searching: false,
    columnDefs: [{
      targets: [6,7,8],
      orderable : false
    }]
  });
});