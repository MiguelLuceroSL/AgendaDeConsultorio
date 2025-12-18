  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnEliminarSecreListaEspera")) {
      const id = e.target.dataset.id;

      if (!confirm("¿Estás seguro de que querés eliminar esta persona de las esperas?"))
        return;

      try {
        const res = await fetch(`/secretaria/espera/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Espera eliminada correctamente.");
          //buscamos el boton y eliminamos su fila padre (tr)
          e.target.closest('tr')?.remove();
        } else {
          alert(data.error || "Error al eliminar la espera.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error de conexión al eliminar la espera.");
      }
    }
  });