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

  function renderHorarios(horarios) {
    selectHorario.innerHTML =
      "<option disabled selected>Selecciona un horario</option>";
    horarios.forEach((hora) => {
      const option = document.createElement("option");
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

  async function verificarSobreturno(profesionalId, fecha, hora) {
  const res = await fetch(`/turnos/sobreturnos/verificar?profesionalId=${profesionalId}&fecha=${fecha}&hora=${hora}`);
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
minFechaTurno.setDate(minFechaTurno.getDate() + 1);

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
      horariosBase.push(...franjas); //se juntam todas las franjas horarias en un solo array
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

      // Logs iniciales
      console.log("Horarios originales generados:", horariosBase);
      console.log("Bloqueos parciales recibidos:", bloqueos);

      horariosBase = horariosBase.filter((hora) => {
        const [h, m] = hora.split(":");
        const horaDate = new Date(2025, 0, 1, h, m);

        const estaBloqueado = bloqueos.some((b) => {
          if (!b.hora_inicio || !b.hora_fin) return false;
          const inicio = new Date(`2025-01-01T${b.hora_inicio}`);
          const fin = new Date(`2025-01-01T${b.hora_fin}`);
          const bloqueado = horaDate >= inicio && horaDate < fin;

          if (bloqueado) {
            console.log(
              `Eliminando ${hora} por bloqueo entre ${b.hora_inicio} y ${b.hora_fin}`
            );
          }

          return bloqueado;
        });

        return !estaBloqueado;
      });

      console.log("Horarios luego de aplicar bloqueos:", horariosBase);
    }

  const { confirmados, reservados } = await obtenerHorariosPorEstado(profesionalId, fecha);

for (const hora of horariosBase) {
  if (confirmados.includes(hora)) {
    continue; // si está confirmado, no lo muestra
  }

  const option = document.createElement("option");
  option.value = hora;
  option.textContent = hora;

  if (reservados.includes(hora)) {
    const cantidadSobreturnos = await verificarSobreturno(profesionalId, fecha, hora);
    const agenda = agendasDelDia.find(a => a.max_sobreturnos !== null);

    if (!agenda || cantidadSobreturnos >= agenda.max_sobreturnos) {
      continue;
    } else {
      option.style.backgroundColor = "gold";
      option.textContent += " (Sobreturno)";
      option.setAttribute("data-sobreturno", "true");
    }
  }

  selectHorario.appendChild(option);
}
  });


  selectHorario.addEventListener("change", () => {
  const selectedOption = selectHorario.options[selectHorario.selectedIndex];
  if (selectedOption && selectedOption.dataset.sobreturno === "true") {
    alert("Este horario ya está reservado. Estás creando un sobreturno.");
  }
});
});
