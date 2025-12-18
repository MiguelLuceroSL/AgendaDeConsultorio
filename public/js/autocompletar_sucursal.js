class AutocompletarSucursal {
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
        //crear contenedor de resultados
        this.resultsDiv = document.createElement('div');
        this.resultsDiv.className = 'autocompletar_resultados';
        this.input.parentNode.appendChild(this.resultsDiv);
        
        //event listeners
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
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
            this.buscarSucursales(texto);
        }, 300);
    }
    
    async buscarSucursales(texto) {
        try {
            const response = await fetch(`/agendas/buscar-sucursales?texto=${encodeURIComponent(texto)}`);
            const sucursales = await response.json();
            this.results = sucursales;
            this.showResults(sucursales);
        } catch (error) {
            console.error('Error al buscar sucursales:', error);
        }
    }
    
    showResults(sucursales) {
        this.selectedIndex = -1;
        
        if (sucursales.length === 0) {
            this.resultsDiv.innerHTML = '<div class="autocompletar_sin_resultados">No se encontraron sucursales</div>';
            this.resultsDiv.classList.add('mostrar');
            return;
        }
        
        this.resultsDiv.innerHTML = sucursales.map((sucursal, index) => `
            <div class="autocompletar_item" data-index="${index}" data-id="${sucursal.id}">
                <strong>${sucursal.nombre}</strong><br>
                <small>${sucursal.direccion}</small>
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
    }
    
    selectItem(item) {
        const index = parseInt(item.dataset.index);
        const sucursal = this.results[index];
        
        this.input.value = sucursal.nombre;
        this.hiddenInput.value = sucursal.id;
        
        this.hideResults();
    }
    
    handleKeydown(e) {
        const items = this.resultsDiv.querySelectorAll('.autocompletar_item');
        
        if (items.length === 0) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
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
            if (index === this.selectedIndex) {
                item.classList.add('seleccionado');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('seleccionado');
            }
        });
    }
}
