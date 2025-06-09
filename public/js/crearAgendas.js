document.addEventListener('DOMContentLoaded',() =>{
    const filas = document.querySelectorAll('tbody tr');

    flatpickr("#tiempo_consulta", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "00:15",
    maxTime: "03:00",
    defaultHour: 0,
    defaultMinute: 30,
  });

    filas.forEach(fila => {
        const checkbox = fila.querySelector('input[type="checkbox"]')
        const inputs = fila.querySelectorAll('input[type="time"]');

    const mananaInicio = fila.querySelector('input[name*="[manana_inicio]"]');
    const mananaFin = fila.querySelector('input[name*="[manana_fin]"]');
    const tardeInicio = fila.querySelector('input[name*="[tarde_inicio]"]');
    const tardeFin = fila.querySelector('input[name*="[tarde_fin]"]');

    
    if (mananaInicio && mananaFin && mananaInicio.value && mananaFin.value) {
      if (mananaInicio.value >= mananaFin.value) {
        alert("En un turno mañana, la hora de inicio no puede ser mayor o igual a la de fin.");
        error = true;
      }
    }

    
    if (tardeInicio && tardeFin && tardeInicio.value && tardeFin.value) {
      if (tardeInicio.value >= tardeFin.value) {
        alert("En un turno tarde, la hora de inicio no puede ser mayor o igual a la de fin.");
        error = true;
      }
    }


    inputs.forEach(input => {
      flatpickr(input, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minTime: input.name.includes('manana') ? "01:00" : "12:59",
        maxTime: input.name.includes('manana') ? "13:00" : "23:59"
      });
    });

    inputs.forEach(input => input.disabled = !checkbox.cheked);

    checkbox.addEventListener('change', () =>{
        inputs.forEach(input => input.disabled = !checkbox.checked)
    })

    })
})