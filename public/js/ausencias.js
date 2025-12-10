document.addEventListener("DOMContentLoaded", () => {
  const profesionalIdInput = document.getElementById("profesional-id");
  const fechaInicioInput = document.getElementById("fecha_inicio");
  const fechaFinInput = document.getElementById("fecha_fin");


  form.addEventListener("submit", (e) => {
  const fechaInicio = fechaInicioInput.value.trim();
  const fechaFin = fechaFinInput.value.trim();

  if (!fechaInicio || !fechaFin) {
    e.preventDefault();
    alert("Debes completar tanto la fecha de inicio como la fecha de fin.");
  }
});

  let agendas = [];

  const normalizarDia = (fecha) =>
    fecha
      .toLocaleDateString("es-AR", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  async function obtenerAgendas(profesionalId) {
    const res = await fetch(`/agendas/agendas/${profesionalId}`);
    return await res.json();
  }

  function diasPermitidos() {
    const dias = new Set();
    agendas.forEach((a) => a.dias.forEach((d) => dias.add(d)));
    return [...dias];
  }

  function rangoDias(fecha, min, max) {
    const f = new Date(fecha);
    return f >= new Date(min) && f <= new Date(max);
  }

  let fpInicio = null;
  let fpFin = null;

  // Observar cambios en el campo oculto del autocomplete
  const observer = new MutationObserver(async () => {
    const profesionalId = profesionalIdInput.value;
    if (!profesionalId) return;

    agendas = await obtenerAgendas(profesionalId);
    if (!agendas.length) {
      alert("Este profesional no tiene agendas activas.");
      return;
    }

    const minDate = agendas.reduce(
      (min, a) => (new Date(a.dia_inicio) < min ? new Date(a.dia_inicio) : min),
      new Date(8640000000000000)
    );
    const maxDate = agendas.reduce(
      (max, a) => (new Date(a.dia_fin) > max ? new Date(a.dia_fin) : max),
      new Date(-8640000000000000)
    );
    const diasValidos = diasPermitidos();

    const disableFunc = (date) => {
      const dia = normalizarDia(date);
      const enRango = rangoDias(date, minDate, maxDate);
      return !diasValidos.includes(dia) || !enRango;
    };

    if (fpInicio) fpInicio.destroy();
    if (fpFin) fpFin.destroy();

    fpInicio = flatpickr(fechaInicioInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc],
    });

    fpFin = flatpickr(fechaFinInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc],
    });
  });

  // Observar cambios en el valor del input oculto
  observer.observe(profesionalIdInput, {
    attributes: true,
    attributeFilter: ['value']
  });

  // También escuchar el evento input
  profesionalIdInput.addEventListener('input', async () => {
    const profesionalId = profesionalIdInput.value;
    if (!profesionalId) return;

    agendas = await obtenerAgendas(profesionalId);
    if (!agendas.length) {
      alert("Este profesional no tiene agendas activas.");
      return;
    }

    const minDate = agendas.reduce(
      (min, a) => (new Date(a.dia_inicio) < min ? new Date(a.dia_inicio) : min),
      new Date(8640000000000000)
    );
    const maxDate = agendas.reduce(
      (max, a) => (new Date(a.dia_fin) > max ? new Date(a.dia_fin) : max),
      new Date(-8640000000000000)
    );
    const diasValidos = diasPermitidos();

    const disableFunc = (date) => {
      const dia = normalizarDia(date);
      const enRango = rangoDias(date, minDate, maxDate);
      return !diasValidos.includes(dia) || !enRango;
    };

    if (fpInicio) fpInicio.destroy();
    if (fpFin) fpFin.destroy();

    fpInicio = flatpickr(fechaInicioInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc],
    });

    fpFin = flatpickr(fechaFinInput, {
      dateFormat: "Y-m-d",
      disable: [disableFunc],
    });
  });

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = e.target.dataset.id;

      if (!confirm("¿Estás seguro de que querés eliminar esta ausencia?"))
        return;

      try {
        const res = await fetch(`/agendas/ausencias/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Ausencia eliminada correctamente.");
          document.querySelector(`tr[data-id="${id}"]`)?.remove();
        } else {
          alert(data.error || "Error al eliminar la ausencia.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error de conexión al eliminar la ausencia.");
      }
    }
  });
});
