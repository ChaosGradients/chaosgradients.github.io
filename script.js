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
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.classList.add('dragging');
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = this.container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const clampedX = Math.max(0, Math.min(100, x));
            
            element.style.left = `${clampedX}%`;
            this.colorStops[index].position = clampedX;
            this.updateGradient();
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.classList.remove('dragging');
        });
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
            
            panel.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = parseInt(panel.style.left || getComputedStyle(panel).left);
                startTop = parseInt(panel.style.top || getComputedStyle(panel).top);
                panel.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                panel.style.left = `${startLeft + deltaX}px`;
                panel.style.top = `${startTop + deltaY}px`;
                panel.style.bottom = 'auto';
                panel.style.right = 'auto';
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                panel.style.cursor = 'move';
            });
        });
    }
    
    bindEvents() {
        // Click to add color stops
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-stop')) return;
            
            const rect = this.container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            
            // Generate a random color for chaos!
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
