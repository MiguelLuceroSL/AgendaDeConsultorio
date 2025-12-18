document.addEventListener("DOMContentLoaded", () => {
  const profesionalIdInput = document.getElementById("profesional-id");
  const fechaInicioInput = document.getElementById("fecha_inicio");
  const fechaFinInput = document.getElementById("fecha_fin");
  const form = document.getElementById("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); //siempre prevenimos el submit por defecto
    
    const fechaInicio = fechaInicioInput.value.trim();
    const fechaFin = fechaFinInput.value.trim();

    if (!fechaInicio || !fechaFin) {
      alert("Debes completar tanto la fecha de inicio como la fecha de fin.");
      return;
    }

    const profesional_especialidad_id = profesionalIdInput.value;
    const tipo = document.querySelector('select[name="tipo"]').value;

    try {
      //primera llamada: verificamos si hay turnos
      const formData = new FormData(form);
      const response = await fetch('/agendas/ausencias/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profesional_especialidad_id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          tipo,
          confirmar: false
        })
      });

      const contentType = response.headers.get("content-type");
      
      //si la respuesta es HTML, significa que se registró exitosamente sin turnos
      if (contentType && contentType.includes("text/html")) {
        //recargamos la pagina para mostrar la vista de exito
        window.location.reload();
        return;
      }

      const data = await response.json();

      if (data.requiereConfirmacion) {
        
        const mensaje = `${data.mensaje}\n\n¿Desea continuar con el registro de la ausencia?`;
        
        const confirmar = confirm(mensaje);
        
        if (!confirmar) return;

        //segunda llamada: registramos con confirmación
        const responseConfirmado = await fetch('/agendas/ausencias/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profesional_especialidad_id,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            tipo,
            confirmar: true
          })
        });

        if (responseConfirmado.ok) {
          alert('Ausencia registrada correctamente. Los turnos han sido marcados como "Por reasignar".');
          window.location.reload();
        } else {
          const errorData = await responseConfirmado.json();
          alert(errorData.error || 'Error al registrar la ausencia');
        }
      } else {
        alert('Error al registrar la ausencia');
      }
    } catch (error) {
      console.error('Error al registrar ausencia:', error);
      alert('Error al registrar la ausencia');
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

  //observamos cambios en el campo oculto del autocomplete
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

  //observamos cambios en el valor del input oculto
  observer.observe(profesionalIdInput, {
    attributes: true,
    attributeFilter: ['value']
  });

  //tambien escuchamos el evento input
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
