class AutocompletarPaciente {
    constructor(inputId, hiddenInputId) {
        this.input = document.getElementById(inputId);
        this.hiddenInput = document.getElementById(hiddenInputId);
        this.resultsDiv = null;
        this.selectedIndex = -1;
        this.results = [];
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        // Crear contenedor de resultados
        this.resultsDiv = document.createElement('div');
        this.resultsDiv.className = 'autocompletar_resultados';
        this.input.parentNode.appendChild(this.resultsDiv);
        
        // Event listeners
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Cerrar resultados al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.input.parentNode.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    handleInput(e) {
        const texto = e.target.value.trim();
        
        // Limpiar el input oculto si se borra el texto
        if (!texto) {
            this.hiddenInput.value = '';
            this.hideResults();
            return;
        }
        
        // Debounce
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.buscarPacientes(texto);
        }, 300);
    }
    
    async buscarPacientes(texto) {
        try {
            const response = await fetch(`/pacientes/buscar?texto=${encodeURIComponent(texto)}`);
            const pacientes = await response.json();
            this.results = pacientes;
            this.showResults(pacientes);
        } catch (error) {
            console.error('Error al buscar pacientes:', error);
        }
    }
    
    showResults(pacientes) {
        this.selectedIndex = -1;
        
        if (pacientes.length === 0) {
            this.resultsDiv.innerHTML = '<div class="autocompletar_sin_resultados">No se encontraron pacientes</div>';
            this.resultsDiv.classList.add('mostrar');
            return;
        }
        
        this.resultsDiv.innerHTML = pacientes.map((paciente, index) => `
            <div class="autocompletar_item" data-index="${index}" data-id="${paciente.id}">
                <strong>${paciente.nombre_completo}</strong><br>
                <small>DNI: ${paciente.dni} - ${paciente.obra_social || 'Sin obra social'}</small>
            </div>
        `).join('');
        
        // Agregar event listeners a cada item
        this.resultsDiv.querySelectorAll('.autocompletar_item').forEach(item => {
            item.addEventListener('click', () => this.selectItem(item));
        });
        
        this.resultsDiv.classList.add('mostrar');
    }
    
    hideResults() {
        this.resultsDiv.classList.remove('mostrar');
        this.selectedIndex = -1;
    }
    
    selectItem(item) {
        const id = item.dataset.id;
        const text = item.querySelector('strong').textContent;
        
        this.input.value = text;
        this.hiddenInput.value = id;
        this.hideResults();
    }
    
    handleKeydown(e) {
        if (!this.resultsDiv.classList.contains('mostrar')) return;
        
        const items = this.resultsDiv.querySelectorAll('.autocompletar_item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    this.selectItem(items[this.selectedIndex]);
                }
                break;
                
            case 'Escape':
                this.hideResults();
                break;
        }
    }
    
    updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('activo', index === this.selectedIndex);
        });
        
        // Scroll al item seleccionado
        if (items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
}
