document.addEventListener('DOMContentLoaded', () => {
  $('#tablaTurnos').DataTable({
    language: {
      url: '/js/tablaIdioma.json'
    },
    order: [[4, 'asc'], [5, 'asc']],
    searching: false,
    columnDefs: [{
      targets: [6, 7, 8, 9],
      orderable: false
    }],
    autoWidth: false
  });
});


document.addEventListener('DOMContentLoaded', () => {
  $('#listaEsperaTable').DataTable({
    language: {
      url: '/js/tablaIdioma.json'
    },
    order: [1, 'asc'],
    searching: false,
        columnDefs: [{
      targets: [1],
      orderable : false
    }]
  });
});

document.addEventListener('DOMContentLoaded', () => {
  $('#tablaAusencias').DataTable({
    language: {
      url: '/js/tablaIdioma.json'
    },
    searching: false,
        columnDefs: [{
      targets: [5],
      orderable : false
    }]
  });
});