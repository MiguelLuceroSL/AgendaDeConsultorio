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

      const form = document.querySelector('.form-agenda');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Construir el objeto completo, por ejemplo:
  const profesional_especialidad_id = form.profesional_especialidad_id.value;
  const dia_inicio = form.dia_inicio.value;
  const dia_fin = form.dia_fin.value;
  const tiempo_consulta = form.tiempo_consulta.value;
  const max_sobreturnos = parseInt(form.max_sobreturnos.value || "0");

  
   const diasMapping = {
    'Lunes': 'lunes',
    'Martes': 'martes',
    'Miércoles': 'miercoles',
    'Jueves': 'jueves',
    'Viernes': 'viernes',
    'Sábado': 'sabado',
    'Domingo': 'domingo'
  };

  const dias = {};

  document.querySelectorAll('tbody tr').forEach(tr => {
    const diaTexto = tr.querySelector('td').textContent.trim();
    const diaKey = diasMapping[diaTexto];
    const activo = tr.querySelector('input[type="checkbox"]').checked;
    const manana_inicio = tr.querySelector('input[name*="[manana_inicio]"]').value;
    const manana_fin = tr.querySelector('input[name*="[manana_fin]"]').value;
    const tarde_inicio = tr.querySelector('input[name*="[tarde_inicio]"]').value;
    const tarde_fin = tr.querySelector('input[name*="[tarde_fin]"]').value;

    dias[diaKey] = {
      activo,
      manana_inicio,
      manana_fin,
      tarde_inicio,
      tarde_fin
    };
  });

  const bodyData = {
    profesional_especialidad_id,
    dia_inicio,
    dia_fin,
    tiempo_consulta,
    max_sobreturnos,
    dias
  };

  try {
    const response = await fetch('/agendas/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "Error al crear la agenda");
    } else {
      alert("Agenda creada correctamente");
      window.location.href = "/secretaria/home";
    }

  } catch (err) {
    console.error(err);
    alert("Error de red. Intente nuevamente.");
  }
});
})