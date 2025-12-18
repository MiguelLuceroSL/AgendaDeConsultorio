class AutocompletarProfesional {
    constructor(inputId, hiddenInputId, especialidadSelectId = null, sucursalSelectId = null, especialidadFiltroId = null) {
        this.input = document.getElementById(inputId);
        this.hiddenInput = document.getElementById(hiddenInputId);
        this.especialidadSelect = especialidadSelectId ? document.getElementById(especialidadSelectId) : null;
        this.sucursalSelect = sucursalSelectId ? document.getElementById(sucursalSelectId) : null;
        this.especialidadFiltro = especialidadFiltroId ? document.getElementById(especialidadFiltroId) : null;
        this.resultsDiv = null;
        this.selectedIndex = -1;
        this.results = [];
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        //creamos contenedor de resultados
        this.resultsDiv = document.createElement('div');
        this.resultsDiv.className = 'autocompletar_resultados';
        this.input.parentNode.appendChild(this.resultsDiv);
        
        //event listeners
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        //si hay select de especialidad, escuchamos cambios
        if (this.especialidadSelect) {
            this.especialidadSelect.addEventListener('change', () => {
                if (this.input.value.trim()) {
                    this.buscarProfesionales(this.input.value.trim());
                }
            });
        }
        
        //escuchamos cambios en filtros de sucursal y especialidad
        if (this.sucursalSelect) {
            this.sucursalSelect.addEventListener('change', () => {
                if (this.input.value.trim()) {
                    this.buscarProfesionales(this.input.value.trim());
                }
            });
        }
        
        if (this.especialidadFiltro) {
            this.especialidadFiltro.addEventListener('change', () => {
                if (this.input.value.trim()) {
                    this.buscarProfesionales(this.input.value.trim());
                }
            });
        }
        
        //cerramos resultados al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.input.parentNode.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    handleInput(e) {
        const texto = e.target.value.trim();
        
        //limpiamos el input oculto si se borra el texto
        if (!texto) {
            this.hiddenInput.value = '';
            this.hideResults();
            return;
        }
        
        //debounce
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.buscarProfesionales(texto);
        }, 300);
    }
    
    async buscarProfesionales(texto) {
        try {
            let url = `/profesional/buscar?texto=${encodeURIComponent(texto)}`;
            
            //agregamos filtro de especialidad si existe para secretaria en crear agenda
            if (this.especialidadSelect && this.especialidadSelect.value) {
                url += `&especialidadId=${this.especialidadSelect.value}`;
            }
            
            //agregamos filtro de sucursal si existe para pacientes
            if (this.sucursalSelect && this.sucursalSelect.value) {
                url += `&sucursalId=${this.sucursalSelect.value}`;
            }
            
            //agregamos filtro de especialidad si existe para pacientes
            if (this.especialidadFiltro && this.especialidadFiltro.value) {
                url += `&especialidadId=${this.especialidadFiltro.value}`;
            }
            
            const response = await fetch(url);
            const profesionales = await response.json();
            this.results = profesionales;
            this.showResults(profesionales);
        } catch (error) {
            console.error('Error al buscar profesionales:', error);
        }
    }
    
    showResults(profesionales) {
        this.selectedIndex = -1;
        
        if (profesionales.length === 0) {
            this.resultsDiv.innerHTML = '<div class="autocompletar_sin_resultados">No se encontraron profesionales</div>';
            this.resultsDiv.classList.add('mostrar');
            return;
        }
        
        this.resultsDiv.innerHTML = profesionales.map((profesional, index) => `
            <div class="autocompletar_item" data-index="${index}" data-id="${profesional.id}">
                <strong>${profesional.nombre_completo}</strong><br>
                <small>${profesional.especialidad} - Mat: ${profesional.matricula}</small>
            </div>
        `).join('');
        
        //agregamos event listeners a cada item
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
        
        //scroll al item seleccionado
        if (items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
}
