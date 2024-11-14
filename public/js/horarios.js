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


document.addEventListener('DOMContentLoaded', () => {
    const horarioSelect = document.getElementById('horario');
    const horaInicio = 9;
    const horaFin = 18;
    const intervalo = 30; // 30 minutos
  
    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalo) {
        const opcionHora = document.createElement('option');
        const horaString = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        opcionHora.value = horaString;
        opcionHora.textContent = horaString;
        horarioSelect.appendChild(opcionHora);
      }
    }
  });
