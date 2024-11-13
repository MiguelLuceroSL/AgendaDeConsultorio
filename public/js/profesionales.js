document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const profesionalesTable = document
    .getElementById("profesionalesTable")
    .getElementsByTagName("tbody")[0];

  // Función para cargar los profesionales
  const cargarProfesionales = async () => {
    try {
      const response = await fetch("/admin/readProfesional"); // Cambiado a /admin/readProfesional
      const profesionales = await response.json();
  
      if (Array.isArray(profesionales) && profesionales.length > 0) {
        mostrarProfesionales(profesionales);
      } else {
        console.warn("No se encontraron profesionales o los datos son inválidos.");
        profesionalesTable.innerHTML = "<tr><td colspan='4'>No hay profesionales disponibles.</td></tr>";
      }
    } catch (err) {
      console.error("Error al cargar los profesionales:", err);
    }
  };

  // Función para mostrar los profesionales en la tabla
  const mostrarProfesionales = (profesionales) => {
    profesionalesTable.innerHTML = ""; // Limpia la tabla antes de mostrar los datos

    profesionales.forEach((profesional) => {
      const row = profesionalesTable.insertRow();

      row.insertCell().textContent = profesional.nombre_completo;
      row.insertCell().textContent = profesional.nombre; // Especialidad
      row.insertCell().textContent = profesional.matricula;

      const updateCell = row.insertCell();
      const updateForm = document.createElement("form");
      updateForm.action = "/admin/actualizarEspecialidad";
      updateForm.method = "POST";

      const inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.name = "profesional_id";
      inputId.value = profesional.profesional_id;
      updateForm.appendChild(inputId);

      const inputEspecialidad = document.createElement("input");
      inputEspecialidad.type = "text";
      inputEspecialidad.name = "nueva_especialidad";
      inputEspecialidad.placeholder = "Nueva especialidad";
      inputEspecialidad.required = true;
      updateForm.appendChild(inputEspecialidad);

      const inputMatricula = document.createElement("input");
      inputMatricula.type = "text";
      inputMatricula.name = "matricula";
      inputMatricula.placeholder = "Nueva matrícula";
      inputMatricula.value = profesional.matricula;
      inputMatricula.required = true;
      updateForm.appendChild(inputMatricula);

      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.textContent = "Actualizar";
      updateForm.appendChild(submitButton);

      updateCell.appendChild(updateForm);
    });
  };

  // Filtrar profesionales a medida que se escribe en el campo de búsqueda
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = profesionalesTable.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const nombre = row.cells[0].textContent.toLowerCase();
      row.style.display = nombre.includes(filter) ? "" : "none";
    });
  });

  // Cargar los profesionales cuando se carga la página
  cargarProfesionales();
});
