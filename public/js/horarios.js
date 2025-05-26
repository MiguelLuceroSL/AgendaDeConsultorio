/*document.addEventListener("DOMContentLoaded", () => {
 const fecha = document.getElementById("fecha")
    fecha.addEventListener("submit", async function (e) {
      e.preventDefault();
      try {
        const response = await fetch("/turnosDisponibles/"+fecha, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Error al hacer login:", error.message);
      }
    });
});*/


/*document.addEventListener('DOMContentLoaded', () => {
    const horarioSelect = document.getElementById('horario');
    const horaInicio = 9;
    const horaFin = 18;
    const intervalo = 30; 
  
    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalo) {
        const opcionHora = document.createElement('option');
        const horaString = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        opcionHora.value = horaString;
        opcionHora.textContent = horaString;
        horarioSelect.appendChild(opcionHora);
      }
    }
  });*/

document.addEventListener('DOMContentLoaded', () => {

const selectProfesional = document.getElementById('profesional');
const inputFecha = document.getElementById('fecha');
const selectHorario = document.getElementById('horario');

let agenda = null;

function renderHorarios(horarios) {
  selectHorario.innerHTML = '<option disabled selected>Selecciona un horario</option>';
  horarios.forEach(hora => {
    const option = document.createElement('option');
    option.value = hora;
    option.textContent = hora;
    selectHorario.appendChild(option);
  });
}

async function obtenerAgenda(profesionalId) {
  try {
    const res = await fetch(`/agenda/agendas/${profesionalId}`);
    const data = await res.json();
    return data[0];
  } catch (err) {
    console.error('Error al obtener la agenda:', err);
    return null;
  }
}

async function obtenerTurnosOcupados(profesionalId, fecha) {
  try {
    const res = await fetch(`/turnos/horarios/ocupados?profesionalId=${profesionalId}&fecha=${fecha}`)
    return await res.json(); // array de horarios ocupados
  } catch (err) {
    console.error('Error al obtener turnos ocupados:', err);
    return [];
  }
}

function generarHorarios(horaInicio, horaFin, duracion) {
  const horarios = [];
  let actual = new Date(`1970-01-01T${horaInicio}`);
  const fin = new Date(`1970-01-01T${horaFin}`);
  const minutos = parseInt(duracion.split(':')[1]);

  while (actual < fin) {
    horarios.push(actual.toTimeString().slice(0, 5));
    actual.setMinutes(actual.getMinutes() + minutos);
  }

  return horarios;
}

// Cuando seleccionan un profesional
selectProfesional.addEventListener('change', async () => {
  const profesionalId = selectProfesional.value;
  if (!profesionalId) return;

  agenda = await obtenerAgenda(profesionalId);
  const diaInicio = new Date(agenda.dia_inicio).toISOString().split('T')[0];
const diaFin = agenda.dia_fin ? new Date(agenda.dia_fin).toISOString().split('T')[0] : null;

inputFecha.setAttribute('min', diaInicio);
if (diaFin) inputFecha.setAttribute('max', diaFin);
else inputFecha.removeAttribute('max'); // sin fin

inputFecha.disabled = false;
inputFecha.value = ''; // reinicia la fecha seleccionada
selectHorario.innerHTML = '<option disabled selected>Selecciona un horario</option>';
});

// Cuando seleccionan una fecha
inputFecha.addEventListener('change', async () => {
  const profesionalId = selectProfesional.value;
  const fecha = inputFecha.value;
  if (!profesionalId || !fecha || !agenda) return;

  const horariosBase = generarHorarios(
    agenda.horario_inicio,
    agenda.horario_fin,
    agenda.tiempo_consulta
  );

  const ocupados = await obtenerTurnosOcupados(profesionalId, fecha);
  const disponibles = horariosBase.filter(h => !ocupados.includes(h));

  renderHorarios(disponibles);
});


});