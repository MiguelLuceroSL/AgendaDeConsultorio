class AutocompletarProfesionalEspecialidad {
  constructor(inputId, hiddenInputId) {
    this.input = document.getElementById(inputId);
    this.hiddenInput = document.getElementById(hiddenInputId);
    this.resultadosDiv = null;
    this.resultados = [];
    this.indiceSeleccionado = -1;
    
    this.init();
  }

  init() {
    // Crear el div de resultados
    this.resultadosDiv = document.createElement('div');
    this.resultadosDiv.className = 'autocompletar_resultados';
    this.input.parentNode.insertBefore(this.resultadosDiv, this.input.nextSibling);
    
    // Event listeners
    this.input.addEventListener('input', () => this.buscar());
    this.input.addEventListener('keydown', (e) => this.manejarTeclas(e));
    
    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.resultadosDiv.contains(e.target)) {
        this.cerrarResultados();
      }
    });
  }

  async buscar() {
    const texto = this.input.value.trim();
    
    if (texto.length < 1) {
      this.cerrarResultados();
      this.hiddenInput.value = '';
      return;
    }

    try {
      const response = await fetch(`/admin/buscar-profesional-especialidad?texto=${encodeURIComponent(texto)}`);
      const data = await response.json();
      
      this.resultados = data;
      this.mostrarResultados();
    } catch (error) {
      console.error('Error al buscar profesional-especialidad:', error);
      this.cerrarResultados();
    }
  }

  mostrarResultados() {
    this.resultadosDiv.innerHTML = '';
    this.indiceSeleccionado = -1;

    if (this.resultados.length === 0) {
      this.resultadosDiv.innerHTML = '<div class="autocompletar_sin_resultados">No se encontraron resultados</div>';
      this.resultadosDiv.style.display = 'block';
      return;
    }

    this.resultados.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'autocompletar_item';
      
      div.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 2px;">${item.nombre_completo}</div>
        <div style="font-size: 0.9em; color: #666;">${item.especialidad} - Mat: ${item.matricula}</div>
      `;
      
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.seleccionar(index);
      });
      this.resultadosDiv.appendChild(div);
    });

    this.resultadosDiv.style.display = 'block';
  }

  seleccionar(index) {
    const item = this.resultados[index];
    this.input.value = item.nombre_completo;
    this.hiddenInput.value = item.profesional_especialidad_id;
    this.cerrarResultados();
  }

  manejarTeclas(e) {
    if (!this.resultadosDiv.style.display || this.resultadosDiv.style.display === 'none') {
      return;
    }

    const items = this.resultadosDiv.querySelectorAll('.autocompletar_item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.indiceSeleccionado = Math.min(this.indiceSeleccionado + 1, items.length - 1);
      this.actualizarSeleccion(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.indiceSeleccionado = Math.max(this.indiceSeleccionado - 1, 0);
      this.actualizarSeleccion(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.indiceSeleccionado >= 0) {
        this.seleccionar(this.indiceSeleccionado);
      }
    } else if (e.key === 'Escape') {
      this.cerrarResultados();
    }
  }

  actualizarSeleccion(items) {
    items.forEach((item, index) => {
      if (index === this.indiceSeleccionado) {
        item.classList.add('activo');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('activo');
      }
    });
  }

  cerrarResultados() {
    this.resultadosDiv.style.display = 'none';
    this.resultadosDiv.innerHTML = '';
    this.indiceSeleccionado = -1;
  }
}
