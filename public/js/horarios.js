document.addEventListener('DOMContentLoaded', () => {

const selectProfesional = document.getElementById('profesional');
const inputFecha = document.getElementById('fecha');
const selectHorario = document.getElementById('horario');

const diasSemanaMap = {
    'domingo': 'domingo',
    'lunes': 'lunes',
    'martes': 'martes',
    'miercoles': 'miercoles',
    'miércoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sabado': 'sabado',
    'sábado': 'sabado'
  };
let fp = null;

function normalizarDia(dia) {
  return dia
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // separa las tildes de la letra y elimina tildes
    .trim();
}


function renderHorarios(horarios) {
  selectHorario.innerHTML = '<option disabled selected>Selecciona un horario</option>';
  horarios.forEach(hora => {
    const option = document.createElement('option');
    option.value = hora;
    option.textContent = hora;
    selectHorario.appendChild(option);
  });
}

async function obtenerAgendas(profesionalId) {
  try {
    const res = await fetch(`/agendas/agendas/${profesionalId}`);
    return await res.json();
  } catch (err) {
    console.error('Error al obtener las agendas:', err);
    return [];
  }
}

async function obtenerTurnosOcupados(profesionalId, fecha) {
  try {
    const res = await fetch(`/turnos/horarios/ocupados?profesionalId=${profesionalId}&fecha=${fecha}`)
    return await res.json();
  } catch (err) {
    console.error('Error al obtener turnos ocupados:', err);
    return [];
  }
}

function generarHorarios(horaInicio, horaFin, duracion) {
  const horarios = [];
  let inicio = new Date(`2025-05-05T${horaInicio}`);
  const fin = new Date(`2025-05-05T${horaFin}`);
  const minutos = parseInt(duracion.split(':')[1]);

  while (inicio < fin) {
    horarios.push(inicio.toTimeString().slice(0, 5)); //para solo usar la hora
    inicio.setMinutes(inicio.getMinutes() + minutos); //le sumamos los tiempos de consulta
  }

  return horarios;
}

// Cuando seleccionan un profesional
selectProfesional.addEventListener('change', async () => {
  const profesionalId = selectProfesional.value;
  if (!profesionalId) return;

  const agendas = await obtenerAgendas(profesionalId);
  if (!agendas.length) return;

  inputFecha.disabled = false;
  inputFecha.value = '';
  selectHorario.innerHTML = '<option disabled selected>Selecciona un horario</option>';

  // Guardar agendas para usar luego
  window._agendas = agendas;

    const diasPermitidosSet = new Set(); //set elimina duplicados pero manteniendo horarios
  agendas.forEach(agenda => {
    agenda.dias.forEach(dia => diasPermitidosSet.add(dia));  // ya vienen sin tilde, no hace falta normalizar acá
  });
  window._diasPermitidos = [...diasPermitidosSet];
  console.log('Días permitidos:', window._diasPermitidos);

  if (fp) fp.destroy(); // destruyo si ya hay un flatpickr activo

   const minDate = agendas.reduce((min, a) => {
    const d = new Date(a.dia_inicio);
    return d < min ? d : min;
  }, new Date(8640000000000000));

  const maxDate = agendas.reduce((max, a) => {
    const d = new Date(a.dia_fin);
    return d > max ? d : max;
  }, new Date(-8640000000000000));

  fp = flatpickr(inputFecha, {
    dateFormat: "Y-m-d",
    minDate,
    maxDate,
    disable: [
      function(date) {
        const dia = normalizarDia(date.toLocaleDateString('es-AR', { weekday: 'long' }));
        // Devuelvo true para deshabilitar los días NO incluidos en el array de días permitidos
        return !window._diasPermitidos.includes(dia);
      }
    ]
  });

});





// Cuando seleccionan una fecha
inputFecha.addEventListener('change', async () => {
  const profesionalId = selectProfesional.value;
  const fecha = inputFecha.value;
  const agendas = window._agendas;
  const diasPermitidos = window._diasPermitidos;
  if (!profesionalId || !fecha || !Array.isArray(agendas) || agendas.length === 0) return;
  

  const [ano, mes, dia] = fecha.split('-');
  const fechaObj = new Date(ano, mes - 1, dia, 12);
  const diaOriginal = fechaObj.toLocaleDateString('es-AR', { weekday: 'long' }).toLowerCase();
  const diaSemana = diasSemanaMap[diaOriginal];

  
  const fechaStr = fechaObj.toISOString().slice(0, 10);

  console.log('Día original:', diaOriginal);
  console.log('Día mapeado:', diaSemana);
  console.log('Agendas:', agendas);
  console.log('Fecha seleccionada:', fechaStr);
  

  const agendasDelDia = agendas.filter(agenda => {
    const inicioStr = new Date(agenda.dia_inicio).toISOString().slice(0, 10);
    const finStr = new Date(agenda.dia_fin).toISOString().slice(0, 10);

    console.log(`Analizando agenda ${agenda.id} con rango ${inicioStr} a ${finStr}`);

    return (
      agenda.dias.includes(diaSemana) &&
      fechaStr >= inicioStr &&
      fechaStr <= finStr
    );
  });

  console.log('Agendas que coinciden con el día y fecha:', agendasDelDia);

  let horariosBase = [];
  for (const agenda of agendasDelDia) {
    const franjas = generarHorarios(
      agenda.horario_inicio,
      agenda.horario_fin,
      agenda.tiempo_consulta
    );
    horariosBase.push(...franjas);
  }

  const ocupados = await obtenerTurnosOcupados(profesionalId, fecha);
  const disponibles = horariosBase.filter(h => !ocupados.includes(h));

  renderHorarios(disponibles);
});


});