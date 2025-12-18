document.addEventListener("DOMContentLoaded", () => {
  // Intentar con ambos IDs: para pacientes (select) y secretaria (input hidden)
  const inputProfesionalId = document.getElementById("profesional-select") || document.getElementById("profesional-id");
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

  async function obtenerAgendas(profesionalId, sucursalId = null) {
    try {
      console.log(`🔍 Obteniendo agendas para profesional ID: ${profesionalId}, Sucursal ID: ${sucursalId}`);
      
      let url = `/agendas/agendas/${profesionalId}`;
      if (sucursalId) {
        url += `?sucursalId=${sucursalId}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ Error HTTP al obtener agendas: ${res.status}`);
        return [];
      }
      const agendas = await res.json();
      console.log(`✅ Agendas recibidas del servidor (cantidad: ${agendas.length}):`, agendas);
      console.log('📋 Detalles de agendas:', agendas.map(a => ({
        id: a.id,
        sucursal_id: a.sucursal_id,
        horario: `${a.horario_inicio}-${a.horario_fin}`,
        dias: a.dias
      })));
      return agendas;
    } catch (err) {
      console.error("❌ Error al obtener las agendas:", err);
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

  async function verificarDisponibilidadGeneral(profesionalId, fechaInicio, fechaFin) {
    try {
      // Verificar horarios disponibles en un rango de fechas representativo
      const agendas = window._agendas || [];
      if (agendas.length === 0) {
        return false;
      }

      // Verificar las próximas 2 semanas o hasta el fin de la agenda
      const hoy = new Date(fechaInicio);
      const limite = new Date(hoy);
      limite.setDate(limite.getDate() + 14);
      const fechaLimite = limite < new Date(fechaFin) ? limite : new Date(fechaFin);

      // Revisar cada día en el rango
      for (let d = new Date(hoy); d <= fechaLimite; d.setDate(d.getDate() + 1)) {
        const fecha = d.toISOString().split('T')[0];
        const dia = normalizarDia(d.toLocaleDateString("es-AR", { weekday: "long" }));
        
        // Verificar si es un día permitido
        if (!window._diasPermitidos.includes(dia)) {
          continue;
        }

        // Obtener las agendas para ese día
        const agendasDelDia = agendas.filter(agenda => {
          // Parsear fechas correctamente para evitar problemas de zona horaria
          const [yearInicio, monthInicio, dayInicio] = agenda.dia_inicio.split('T')[0].split('-').map(Number);
          const diaInicio = new Date(yearInicio, monthInicio - 1, dayInicio);
          
          const [yearFin, monthFin, dayFin] = agenda.dia_fin.split('T')[0].split('-').map(Number);
          const diaFin = new Date(yearFin, monthFin - 1, dayFin);
          
          const [year, month, day] = fecha.split('-').map(Number);
          const fechaActual = new Date(year, month - 1, day);
          
          const enRango = fechaActual >= diaInicio && fechaActual <= diaFin;
          
          return (
            agenda.dias.includes(dia) &&
            enRango
          );
        });

        if (agendasDelDia.length === 0) {
          continue;
        }

        // Generar horarios para este día
        let horariosDelDia = [];
        agendasDelDia.forEach(agenda => {
          const horarios = generarHorarios(
            agenda.horario_inicio.substring(0, 5),
            agenda.horario_fin.substring(0, 5),
            agenda.tiempo_consulta
          );
          horariosDelDia = horariosDelDia.concat(horarios);
        });

        // Verificar estados de los horarios
        try {
          const res = await fetch(`/turnos/horarios/estado?profesionalId=${profesionalId}&fecha=${fecha}`);
          const estados = await res.json();
          const estadosConfirmados = estados.confirmados || [];
          const estadosReservados = estados.reservados || [];

          // Verificar si hay al menos un horario libre o con posibilidad de sobreturno
          for (const hora of horariosDelDia) {
            const estado = estadosConfirmados.includes(hora) ? "Confirmado" 
                         : estadosReservados.includes(hora) ? "Reservada" 
                         : null;

            // Si está libre, hay disponibilidad
            if (!estado) {
              return true;
            }

            // Si está reservado, verificar si aún hay cupo de sobreturnos
            if (estado === "Reservada") {
              const cantidadSobreturnos = await verificarSobreturno(profesionalId, fecha);
              const agenda = agendasDelDia.find(a => typeof a.max_sobreturnos === "number");
              if (agenda && cantidadSobreturnos < agenda.max_sobreturnos) {
                return true;
              }
            }
          }
        } catch (err) {
          console.error("Error verificando disponibilidad:", err);
        }
      }

      return false; // No hay horarios disponibles
    } catch (err) {
      console.error("Error en verificarDisponibilidadGeneral:", err);
      return true; // En caso de error, asumir que hay disponibilidad
    }
  }

  function generarHorarios(horaInicio, horaFin, duracion) {
    const horarios = [];
    let inicio = new Date(`2025-05-05T${horaInicio}`);
    const fin = new Date(`2025-05-05T${horaFin}`);
    
    // Parsear la duración correctamente (HH:MM:SS)
    const partiesDuracion = duracion.split(":");
    const horas = parseInt(partiesDuracion[0]) || 0;
    const minutos = parseInt(partiesDuracion[1]) || 0;
    const totalMinutos = (horas * 60) + minutos;
    
    // Validación: evitar bucle infinito si la duración es 0 o inválida
    if (totalMinutos <= 0) {
      console.error("Duración inválida:", duracion, "- Total minutos:", totalMinutos);
      return [];
    }
    
    console.log(`Generando horarios: ${horaInicio} a ${horaFin}, cada ${totalMinutos} minutos`);

    while (inicio < fin) {
      const h = inicio.getHours().toString().padStart(2, "0");
      const m = inicio.getMinutes().toString().padStart(2, "0");
      horarios.push(`${h}:${m}`); //para solo usar la hora
      inicio.setMinutes(inicio.getMinutes() + totalMinutos); //le sumamos los tiempos de consulta
    }

    return horarios;
  }

  async function obtenerAusencias(profesionalId, fecha) {
    try {
      const res = await fetch(
        `/agendas/ausencias/verificar?profesional_especialidad_id=${profesionalId}&fecha=${fecha}`
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

let horariosDisponibles = 0;

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
      horariosDisponibles++;
    }
  } else {
    horariosDisponibles++;
  }

  selectHorario.appendChild(option);
}

// Verificar si no hay horarios disponibles
if (horariosDisponibles === 0) {
  selectHorario.innerHTML = "<option disabled selected>No hay horarios disponibles para este día</option>";
  selectHorario.disabled = true;
}
  } catch (error) {
    console.error("Error al cargar estados de turnos:", error);
    // En caso de error, mostrar horarios sin estados especiales
    selectHorario.innerHTML = "<option disabled selected>Error al cargar horarios</option>";
  }
}

  // Cuando seleccionan un profesional (puede ser select para pacientes o input hidden para secretaria)
  let previousProfesionalId = null;
  let isLoadingAgendas = false; // Flag para evitar llamadas múltiples
  let debounceTimeout = null;
  let observer = null;
  
  // Función para manejar el cambio de profesional
  function handleProfesionalChange() {
    if (isLoadingAgendas || isLoadingHorarios) {
      console.log("Bloqueando cambio de profesional porque hay una carga en progreso");
      return;
    }
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    debounceTimeout = setTimeout(() => {
      const profesionalId = inputProfesionalId.value;
      
      if (profesionalId && profesionalId !== previousProfesionalId && !isLoadingAgendas) {
        previousProfesionalId = profesionalId;
        cargarAgendasProfesional(profesionalId);
      } else if (!profesionalId && previousProfesionalId && !isLoadingAgendas) {
        // Si se limpia el profesional, resetear todo
        previousProfesionalId = null;
        resetearSeleccion();
      }
    }, 300);
  }
  
  if (inputProfesionalId) {
    // Si es un select (pacientes), usar evento change
    if (inputProfesionalId.tagName === 'SELECT') {
      inputProfesionalId.addEventListener('change', handleProfesionalChange);
    } else {
      // Si es un input hidden (secretaria con autocompletado), usar MutationObserver
      observer = new MutationObserver(() => {
        handleProfesionalChange();
      });
      
      observer.observe(inputProfesionalId, { 
        attributes: true, 
        attributeFilter: ['value'] 
      });
      
      // También escuchar el evento input como respaldo
      inputProfesionalId.addEventListener('input', handleProfesionalChange);
    }
  }
  
  async function cargarAgendasProfesional(profesionalId) {
    // Marcar que estamos cargando para evitar llamadas múltiples
    isLoadingAgendas = true;
    
    try {
      // Obtener la sucursal seleccionada si existe el filtro
      const sucursalSelect = document.getElementById('sucursal-filtro');
      const sucursalId = sucursalSelect ? sucursalSelect.value : null;
      
      console.log('🏥 Cargando agendas con filtro de sucursal:', sucursalId);
      
      const agendas = await obtenerAgendas(profesionalId, sucursalId);
      if (!agendas.length) {
        alert("El medico no tiene turnos en este momento para la sucursal y especialidad seleccionadas");
        inputProfesionalId.value = "";
        selectHorario.value = "";
        selectHorario.disabled = true;
        inputFecha.value = "";
        inputFecha.disabled = true;

        window._agendas = [];
        window._diasPermitidos = [];
        
        isLoadingAgendas = false;
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
    console.log("window._agendas guardado:", window._agendas);

    const diasPermitidosSet = new Set(); //set elimina duplicados pero manteniendo horarios
    agendas.forEach((agenda) => {
      console.log(`Procesando agenda ${agenda.id}, dias:`, agenda.dias);
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

    // Verificar si hay horarios disponibles en alguna fecha
    const tieneHorariosDisponibles = await verificarDisponibilidadGeneral(profesionalId, minFechaTurno, maxDate);
    
    if (!tieneHorariosDisponibles) {
      alert("El médico no tiene más turnos disponibles en este momento");
      inputProfesionalId.value = "";
      selectHorario.value = "";
      selectHorario.disabled = true;
      inputFecha.value = "";
      inputFecha.disabled = true;
      window._agendas = [];
      window._diasPermitidos = [];
      if (fp) fp.destroy();
      isLoadingAgendas = false;
      return;
    }
    
    // Marcar que terminamos de cargar
    isLoadingAgendas = false;
    } catch (error) {
      console.error("Error al cargar agendas:", error);
      isLoadingAgendas = false;
    }
  }
  
  function resetearSeleccion() {
    selectHorario.value = "";
    selectHorario.disabled = true;
    inputFecha.value = "";
    inputFecha.disabled = true;
    window._agendas = [];
    window._diasPermitidos = [];
    if (fp) fp.destroy();
  }

  // Cuando seleccionan una fecha
  let isLoadingHorarios = false;
  let lastLoadedFecha = null;

if (inputFecha) {
  inputFecha.addEventListener("change", async () => {
    const profesionalId = inputProfesionalId.value;
    const fecha = inputFecha.value;
    
    // Hacer una copia local inmediata para evitar que se sobrescriba
    const agendasCopia = JSON.parse(JSON.stringify(window._agendas || []));
  
  console.log("=== INICIO PROCESAMIENTO FECHA ===");
  console.log("Agendas copiadas:", agendasCopia);
  
  // Prevenir carga duplicada
  if (!fecha || agendasCopia.length === 0 || isLoadingHorarios || lastLoadedFecha === fecha) {
    console.log("Deteniendo: fecha vacía, sin agendas, o carga duplicada");
    return;
  }
  
  isLoadingHorarios = true;
  lastLoadedFecha = fecha;
  
  try {
    const [ano, mes, dia] = fecha.split("-");
    const fechaObj = new Date(ano, mes - 1, dia, 12);
    const diaSemana = normalizarDia(
      fechaObj.toLocaleDateString("es-AR", { weekday: "long" })
    );

    const fechaStr = fechaObj.toISOString().slice(0, 10);

    console.log("Día mapeado:", diaSemana);
    console.log("Agendas a filtrar:", agendasCopia);
    console.log("Fecha seleccionada:", fechaStr);

    const agendasDelDia = agendasCopia.filter((agenda) => {
      const inicioStr = new Date(agenda.dia_inicio).toISOString().slice(0, 10);
      const finStr = new Date(agenda.dia_fin).toISOString().slice(0, 10);
      
      const incluye = agenda.dias.includes(diaSemana);
      const enRango = fechaStr >= inicioStr && fechaStr <= finStr;
      const resultado = incluye && enRango;
      
      console.log(`Verificando agenda ${agenda.id}:`, {
        diasAgenda: agenda.dias,
        diaBuscado: diaSemana,
        incluye,
        inicioStr,
        finStr,
        fechaStr,
        enRango,
        RESULTADO: resultado
      });

      return resultado;
    });

  console.log("Agendas que coinciden con el día y fecha:", agendasDelDia);
  
  // Si no hay agendas para este día, detener
  if (agendasDelDia.length === 0) {
    console.warn("No hay agendas disponibles para esta fecha");
    selectHorario.innerHTML = "<option disabled selected>No hay horarios disponibles para este día</option>";
    isLoadingHorarios = false;
    return;
  }

  let horariosBase = [];
  for (const agenda of agendasDelDia) {
    const franjas = generarHorarios(
      agenda.horario_inicio,
      agenda.horario_fin,
      agenda.tiempo_consulta
    );
    horariosBase.push(...franjas);
  }
  
  // Limitar horarios para prevenir sobrecarga de memoria
  if (horariosBase.length > 100) {
    console.error("Demasiados horarios generados:", horariosBase.length);
    selectHorario.innerHTML = "<option disabled selected>Error: Configuración de agenda inválida</option>";
    isLoadingHorarios = false;
    return;
  }

  const ausencias = await obtenerAusencias(profesionalId, fecha);
  console.log("Ausencias recibidas:", ausencias);


  // Acá es donde llamamos a la función que carga los horarios con sus estados!
  await cargarHorariosConEstados(profesionalId, fecha, horariosBase, agendasDelDia);
  
  } catch (error) {
    console.error("Error al procesar fecha seleccionada:", error);
  } finally {
    isLoadingHorarios = false;
  }
  });
}


if (selectHorario) {
  selectHorario.addEventListener("change", () => {
    const option = selectHorario.options[selectHorario.selectedIndex];
    const esSobreturno = option.dataset.sobreturno === "true";
    const maxAlcanzado = option.dataset.maxAlcanzado === "true";
    const esSobreturnoInput = document.getElementById("es_sobreturno");

    // Solo intentar setear el valor si el input existe (vista de crear turno)
    if (esSobreturnoInput) {
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
    }
  });
}
});
