document.addEventListener("DOMContentLoaded", () => {
  const selectProfesional = document.getElementById("profesional");
  const inputFecha = document.getElementById("fecha");
  const selectHorario = document.getElementById("horario");

  const FECHA_MAXIMA = new Date(8640000000000000);
  const FECHA_MINIMA = new Date(-8640000000000000);

  let fp = null;

  function normalizarDia(dia) {
    return dia
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // separa las tildes de la letra y elimina tildes
      .trim();
  }

  /*function renderHorarios(horarios) {
    selectHorario.innerHTML =
      "<option disabled selected>Selecciona un horario</option>";
    horarios.forEach((hora) => {
      const option = document.createElement("option");
      option.value = hora;
      option.textContent = hora;
      selectHorario.appendChild(option);
    });
  }*/

  async function obtenerAgendas(profesionalId) {
    try {
      const res = await fetch(`/agendas/agendas/${profesionalId}`);
      return await res.json();
    } catch (err) {
      console.error("Error al obtener las agendas:", err);
      return [];
    }
  }

 async function obtenerHorariosPorEstado(profesionalId, fecha) {
  try {
    const res = await fetch(
      `/turnos/horarios/estado?profesionalId=${profesionalId}&fecha=${fecha}`
    );
    return await res.json();
  } catch (err) {
    console.error("Error al obtener horarios por estado:", err);
    return { confirmados: [], reservados: [] };
  }
}

  async function verificarSobreturno(profesionalId, fecha) {
    const res = await fetch(`/turnos/sobreturnos/verificar?profesionalId=${profesionalId}&fecha=${fecha}`);
    const data = await res.json();
    return data.cantidad;
}

  function generarHorarios(horaInicio, horaFin, duracion) {
    const horarios = [];
    let inicio = new Date(`2025-05-05T${horaInicio}`);
    const fin = new Date(`2025-05-05T${horaFin}`);
    const minutos = parseInt(duracion.split(":")[1]);

    while (inicio < fin) {
      const h = inicio.getHours().toString().padStart(2, "0");
      const m = inicio.getMinutes().toString().padStart(2, "0");
      horarios.push(`${h}:${m}`); //para solo usar la hora
      inicio.setMinutes(inicio.getMinutes() + minutos); //le sumamos los tiempos de consulta
    }

    return horarios;
  }

  async function obtenerAusencias(profesionalId, fecha) {
    try {
      const res = await fetch(
        `/agendas/ausencias/verificar?profesional_especialidad_id=${profesionalId}&fecha=${fecha}&hora=00:00`
      );
      return await res.json();
    } catch (err) {
      console.error("Error al obtener ausencias:", err);
      return { bloqueado: false, detalle: [] };
    }
  }

    async function cargarHorariosConEstados(profesionalId, fecha, horariosBase, agendasDelDia) {
  try {
    const res = await fetch(`/turnos/horarios/estado?profesionalId=${profesionalId}&fecha=${fecha}`);
    const estados = await res.json();

    // Combinar confirmados y reservados en un solo array para buscar estado por hora
    const estadosConfirmados = estados.confirmados || [];
const estadosReservados = estados.reservados || [];

selectHorario.innerHTML = "<option disabled selected>Selecciona un horario</option>";

const cantidadSobreturnos = await verificarSobreturno(profesionalId, fecha);
const agenda = agendasDelDia.find(a => typeof a.max_sobreturnos === "number");
const maxAlcanzado = agenda && cantidadSobreturnos >= agenda.max_sobreturnos;

for (const hora of horariosBase) {
  const estado =
    estadosConfirmados.includes(hora)
      ? "Confirmado"
      : estadosReservados.includes(hora)
        ? "Reservada"
        : null;

  if (["Confirmado", "No disponible", "Presente", "En consulta", "Atendido"].includes(estado)) {
    continue;
  }

  const option = document.createElement("option");
  option.value = hora;
  option.textContent = hora;

  if (estado === "Reservada") {
    option.setAttribute("data-sobreturno", "true");

    if (maxAlcanzado) {
      option.disabled = true;
      option.textContent += " (Máximo sobreturnos)";
      option.setAttribute("data-max-alcanzado", "true");
      option.setAttribute("data-bloqueado", "true");
    } else {
      option.style.backgroundColor = "gold";
      option.textContent += " (Sobreturno)";
      option.setAttribute("data-max-alcanzado", "false");
    }
  }

  selectHorario.appendChild(option);
}
  } catch (error) {
    console.error("Error al cargar estados de turnos:", error);
    // En caso de error, mostrar horarios sin estados especiales
    selectHorario.innerHTML = "<option disabled selected>Error al cargar horarios</option>";
  }
}

  // Cuando seleccionan un profesional
  selectProfesional.addEventListener("change", async () => {
    const profesionalId = selectProfesional.value;
    if (!profesionalId) return;

    const agendas = await obtenerAgendas(profesionalId);
    if (!agendas.length) {
      alert("El medico no tiene turnos en este momento");
      selectProfesional.value = "";
      selectHorario.value = "";
      selectHorario.disabled = true;
      inputFecha.value = "";
      inputFecha.disabled = true;

      window._agendas = [];
      window._diasPermitidos = [];

      return;
    }

    async function obtenerAusenciasTotales(profesionalId) {
  try {
    const res = await fetch(`/agendas/ausencias/totales?profesional_especialidad_id=${profesionalId}`);
    const data = await res.json();

    // Generar un array con todas las fechas del rango de cada ausencia total
    const fechasBloqueadas = [];

    data.forEach(ausencia => {
      const inicio = new Date(ausencia.fecha_inicio);
      const fin = new Date(ausencia.fecha_fin);
      for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        fechasBloqueadas.push(new Date(d)); // copiar la fecha
      }
    });

    return fechasBloqueadas;
  } catch (err) {
    console.error("Error obteniendo ausencias totales:", err);
    return [];
  }
}

    selectHorario.disabled = false;
    inputFecha.disabled = false;
    inputFecha.value = "";
    selectHorario.innerHTML =
      "<option disabled selected>Selecciona un horario</option>";

    // Guardar agendas para usar luego
    window._agendas = agendas;

    const diasPermitidosSet = new Set(); //set elimina duplicados pero manteniendo horarios
    agendas.forEach((agenda) => {
      agenda.dias.forEach((dia) => diasPermitidosSet.add(dia));
    });
    window._diasPermitidos = [...diasPermitidosSet];
    console.log("Días permitidos:", window._diasPermitidos);

    if (fp) fp.destroy(); // destruyo si ya hay un flatpickr activo

    const minDate = agendas.reduce((min, agen) => {
      const diaInicio = new Date(agen.dia_inicio);
      return diaInicio < min ? diaInicio : min;
    }, FECHA_MAXIMA);

    const maxDate = agendas.reduce((max, agen) => {
      const diaFin = new Date(agen.dia_fin);
      return diaFin > max ? diaFin : max;
    }, FECHA_MINIMA);

    const fechasAusencias = await obtenerAusenciasTotales(profesionalId);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const minFechaTurno = new Date(hoy);
    minFechaTurno.setDate(minFechaTurno.getDate() + 1)

fp = flatpickr(inputFecha, {
  dateFormat: "Y-m-d",
  minDate: minFechaTurno,
  maxDate,
  disable: [
    ...fechasAusencias,
    function (date) {
      const dia = normalizarDia(
        date.toLocaleDateString("es-AR", { weekday: "long" })
      );
      return !window._diasPermitidos.includes(dia);
    }
  ]
});
  });

  // Cuando seleccionan una fecha
inputFecha.addEventListener("change", async () => {
  const profesionalId = selectProfesional.value;
  const fecha = inputFecha.value;
  const agendas = window._agendas;
  if (!fecha || agendas.length === 0) return;

  const [ano, mes, dia] = fecha.split("-");
  const fechaObj = new Date(ano, mes - 1, dia, 12);
  const diaSemana = normalizarDia(
    fechaObj.toLocaleDateString("es-AR", { weekday: "long" })
  );

  const fechaStr = fechaObj.toISOString().slice(0, 10);

  console.log("Día mapeado:", diaSemana);
  console.log("Agendas:", agendas);
  console.log("Fecha seleccionada:", fechaStr);

  const agendasDelDia = agendas.filter((agenda) => {
    const inicioStr = new Date(agenda.dia_inicio).toISOString().slice(0, 10);
    const finStr = new Date(agenda.dia_fin).toISOString().slice(0, 10);

    return (
      agenda.dias.includes(diaSemana) &&
      fechaStr >= inicioStr &&
      fechaStr <= finStr
    );
  });

  console.log("Agendas que coinciden con el día y fecha:", agendasDelDia);

  let horariosBase = [];
  for (const agenda of agendasDelDia) {
    const franjas = generarHorarios(
      agenda.horario_inicio,
      agenda.horario_fin,
      agenda.tiempo_consulta
    );
    horariosBase.push(...franjas);
  }

  const ausencias = await obtenerAusencias(profesionalId, fecha);
  console.log("Ausencias recibidas:", ausencias);

  if (ausencias.bloqueado) {
    const bloqueos = ausencias.detalle;

    const hayBloqueoTotal = bloqueos.some(
      (b) => !b.hora_inicio && !b.hora_fin
    );
    if (hayBloqueoTotal) {
      console.warn("Bloqueo total detectado para la fecha:", fecha);
      renderHorarios([]);
      alert(
        "El médico no está disponible en esta fecha por una ausencia total."
      );
      return;
    }

    horariosBase = horariosBase.filter((hora) => {
      const [h, m] = hora.split(":");
      const horaDate = new Date(2025, 0, 1, h, m);

      const estaBloqueado = bloqueos.some((b) => {
        if (!b.hora_inicio || !b.hora_fin) return false;
        const inicio = new Date(`2025-01-01T${b.hora_inicio}`);
        const fin = new Date(`2025-01-01T${b.hora_fin}`);
        return horaDate >= inicio && horaDate < fin;
      });

      return !estaBloqueado;
    });

    console.log("Horarios luego de aplicar bloqueos:", horariosBase);
  }

  // Acá es donde llamamos a la función que carga los horarios con sus estados!
  await cargarHorariosConEstados(profesionalId, fecha, horariosBase, agendasDelDia);
});


selectHorario.addEventListener("change", () => {
  const option = selectHorario.options[selectHorario.selectedIndex];
  const esSobreturno = option.dataset.sobreturno === "true";
  const maxAlcanzado = option.dataset.maxAlcanzado === "true";
  const esSobreturnoInput = document.getElementById("es_sobreturno");


if (esSobreturno && !maxAlcanzado) {
  alert("Esta creando un sobreturno.");
  esSobreturnoInput.value = 1;
} else {
    esSobreturnoInput.value = 0;
  }

  console.log("option.dataset:", option.dataset);
  console.log("esSobreturno:", esSobreturno);
  console.log("maxAlcanzado:", maxAlcanzado);
  console.log("Valor seteado en hidden:", esSobreturnoInput.value);
});
});
