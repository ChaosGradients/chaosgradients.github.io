class ChaosGradientGenerator {
    constructor() {
        this.container = document.getElementById('gradient-container');
        this.stopsContainer = document.getElementById('gradient-stops');
        this.colorStops = [
            { position: 20, color: '#4a154b' },
            { position: 40, color: '#2d1b69' },
            { position: 60, color: '#3282b8' },
            { position: 80, color: '#bbe1fa' }
        ];
        
        this.init();
    }
    
    init() {
        this.renderColorStops();
        this.updateGradient();
        this.makePanelsDraggable();
        this.bindEvents();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    renderColorStops() {
        this.stopsContainer.innerHTML = '';
        
        this.colorStops.forEach((stop, index) => {
            const stopElement = document.createElement('div');
            stopElement.className = 'color-stop';
            stopElement.style.left = `${stop.position}%`;
            stopElement.style.top = '50%';
            stopElement.dataset.index = index;
            
            this.stopsContainer.appendChild(stopElement);
            this.makeStopDraggable(stopElement, index);
        });
    }
    
    makeStopDraggable(element, index) {
        let isDragging = false;
        
        // Mouse events
        element.addEventListener('mousedown', this.startDrag.bind(this, element, index));
        
        // Touch events for mobile
        element.addEventListener('touchstart', this.startDrag.bind(this, element, index), { passive: false });
        
        document.addEventListener('mousemove', this.drag.bind(this, element, index));
        document.addEventListener('touchmove', this.drag.bind(this, element, index), { passive: false });
        
        document.addEventListener('mouseup', this.endDrag.bind(this, element));
        document.addEventListener('touchend', this.endDrag.bind(this, element));
    }
    
    startDrag(element, index, e) {
        this.isDragging = true;
        this.currentElement = element;
        this.currentIndex = index;
        element.classList.add('dragging');
        e.preventDefault();
    }
    
    drag(element, index, e) {
        if (!this.isDragging || this.currentElement !== element) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const rect = this.container.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const clampedX = Math.max(0, Math.min(100, x));
        
        element.style.left = `${clampedX}%`;
        this.colorStops[index].position = clampedX;
        this.updateGradient();
        
        e.preventDefault();
    }
    
    endDrag(element) {
        this.isDragging = false;
        if (this.currentElement) {
            this.currentElement.classList.remove('dragging');
            this.currentElement = null;
        }
    }
    
    updateGradient() {
        const sortedStops = [...this.colorStops].sort((a, b) => a.position - b.position);
        const gradientString = sortedStops
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(', ');
        
        this.container.style.background = `linear-gradient(45deg, ${gradientString})`;
    }
    
    makePanelsDraggable() {
        const panels = document.querySelectorAll('.floating-panel');
        
        panels.forEach(panel => {
            let isDragging = false;
            let startX, startY, startLeft, startTop;
            
            const startDrag = (e) => {
                // Only drag if clicking on the panel itself, not the buttons
                if (e.target.closest('.panel-item')) return;
                
                isDragging = true;
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                
                startX = clientX;
                startY = clientY;
                
                const rect = panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                
                panel.style.cursor = 'grabbing';
                e.preventDefault();
            };
            
            const drag = (e) => {
                if (!isDragging) return;
                
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                
                const deltaX = clientX - startX;
                const deltaY = clientY - startY;
                
                panel.style.left = `${startLeft + deltaX}px`;
                panel.style.top = `${startTop + deltaY}px`;
                panel.style.bottom = 'auto';
                panel.style.right = 'auto';
                
                e.preventDefault();
            };
            
            const endDrag = () => {
                isDragging = false;
                panel.style.cursor = 'move';
            };
            
            // Mouse events
            panel.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
            
            // Touch events
            panel.addEventListener('touchstart', startDrag, { passive: false });
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', endDrag);
        });
    }
    
    bindEvents() {
        // Click to add color stops
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-stop') || e.target.closest('.floating-panel')) return;
            
            const rect = this.container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            
            const randomColor = this.generateRandomColor();
            
            this.colorStops.push({
                position: x,
                color: randomColor
            });
            
            this.renderColorStops();
            this.updateGradient();
        });
        
        // Touch support for adding stops
        this.container.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('color-stop') || e.target.closest('.floating-panel')) return;
            
            const rect = this.container.getBoundingClientRect();
            const touch = e.changedTouches[0];
            const x = ((touch.clientX - rect.left) / rect.width) * 100;
            
            const randomColor = this.generateRandomColor();
            
            this.colorStops.push({
                position: x,
                color: randomColor
            });
            
            this.renderColorStops();
            this.updateGradient();
        });
    }
    
    generateRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new ChaosGradientGenerator();
});
