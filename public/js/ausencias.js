document.addEventListener("DOMContentLoaded", () => {
  const profesionalSelect = document.getElementById("profesional_especialidad_id");
  const fechaInicioInput = document.getElementById("fecha_inicio");
  const fechaFinInput = document.getElementById("fecha_fin");
  const horaInicioSelect = document.getElementById("hora_inicio");
  const horaFinSelect = document.getElementById("hora_fin");

  let agendas = [];

  const normalizarDia = (fecha) =>
    fecha.toLocaleDateString("es-AR", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  async function obtenerAgendas(profesionalId) {
    const res = await fetch(`/agendas/agendas/${profesionalId}`);
    return await res.json();
  }

  function generarHorarios(horaInicio, horaFin, duracion) {
    const horarios = [];
    let inicio = new Date(`2025-01-01T${horaInicio}`);
    const fin = new Date(`2025-01-01T${horaFin}`);
    const minutos = parseInt(duracion.split(":")[1]);

    while (inicio < fin) {
      horarios.push(inicio.toTimeString().slice(0, 5));
      inicio.setMinutes(inicio.getMinutes() + minutos);
    }

    return horarios;
  }

  function renderHorarios(horarios) {
    horaInicioSelect.innerHTML = "<option value='' disabled selected>Inicio</option>";
    horaFinSelect.innerHTML = "<option value='' disabled selected>Fin</option>";
    horarios.forEach(h => {
      const opt1 = document.createElement("option");
      opt1.value = h;
      opt1.textContent = h;
      horaInicioSelect.appendChild(opt1);

      const opt2 = opt1.cloneNode(true);
      horaFinSelect.appendChild(opt2);
    });
  }

  function filtrarAgendasPorDia(fecha) {
    const dia = normalizarDia(new Date(fecha));
    return agendas.filter(a => a.dias.includes(dia));
  }

  function diasPermitidos() {
    const dias = new Set();
    agendas.forEach(a => a.dias.forEach(d => dias.add(d)));
    return [...dias];
  }

  function dateInRange(fecha, min, max) {
    const f = new Date(fecha);
    return f >= new Date(min) && f <= new Date(max);
  }

  let fpInicio = null;
  let fpFin = null;

  profesionalSelect.addEventListener("change", async () => {
    const profesionalId = profesionalSelect.value;
    if (!profesionalId) return;

    agendas = await obtenerAgendas(profesionalId);
    if (!agendas.length) {
      alert("Este profesional no tiene agendas activas.");
      return;
    }

    const minDate = agendas.reduce((min, a) => new Date(a.dia_inicio) < min ? new Date(a.dia_inicio) : min, new Date(8640000000000000));
    const maxDate = agendas.reduce((max, a) => new Date(a.dia_fin) > max ? new Date(a.dia_fin) : max, new Date(-8640000000000000));
    const diasValidos = diasPermitidos();

    const disableFunc = (date) => {
      const dia = normalizarDia(date);
      const enRango = dateInRange(date, minDate, maxDate);
      return !diasValidos.includes(dia) || !enRango;
    };

    if (fpInicio) fpInicio.destroy();
    if (fpFin) fpFin.destroy();

    fpInicio = flatpickr(fechaInicioInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc],
      onChange: ([date]) => {
        const agendasDia = filtrarAgendasPorDia(date);
        let horarios = [];
        agendasDia.forEach(a => {
          horarios.push(...generarHorarios(a.horario_inicio, a.horario_fin, a.tiempo_consulta));
        });
        renderHorarios(horarios);
      }
    });

    fpFin = flatpickr(fechaFinInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc]
    });
  });
});