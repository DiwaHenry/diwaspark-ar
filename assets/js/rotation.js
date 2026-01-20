// Register touch rotation component for 3D models
AFRAME.registerComponent('touch-rotate', {
    schema: {
      enabled: {type: 'boolean', default: true}
    },
    init: function() {
        this.isDragging = false;
        this.previousTouchX = 0;
        this.previousTouchY = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.sensitivity = 0.5;

        // Store initial rotation
        const currentRotation = this.el.getAttribute('rotation');
        this.initialRotation = {
          x: currentRotation.x,
          y: currentRotation.y,
          z: currentRotation.z
        };

        // Bind methods
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTargetFound = this.onTargetFound.bind(this);
        this.onTargetLost = this.onTargetLost.bind(this);

        // Listen for target found/lost events
        const target = this.el.parentEl;
        if (target) {
          target.addEventListener('targetFound', this.onTargetFound);
          target.addEventListener('targetLost', this.onTargetLost);
        }

        // Add event listeners
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);
        window.addEventListener('mousedown', this.onTouchStart);
        window.addEventListener('mousemove', this.onTouchMove);
        window.addEventListener('mouseup', this.onTouchEnd);
    },

    onTargetFound: function() {
      // Reset rotation when target is found again
      this.rotationX = 0;
      this.rotationY = 0;
      this.el.setAttribute('rotation', this.initialRotation);
    },

    onTargetLost: function() {
      // Optional: You can add any cleanup here if needed
    },

    onTouchStart: function(event) {
      if (!this.data.enabled) return;
      
      this.isDragging = true;
      const touch = event.touches ? event.touches[0] : event;
      this.previousTouchX = touch.clientX;
      this.previousTouchY = touch.clientY;
    },
    onTouchMove: function(event) {
      if (!this.isDragging || !this.data.enabled) return;
      
      event.preventDefault();
      const touch = event.touches ? event.touches[0] : event;
      
      const deltaX = touch.clientX - this.previousTouchX;
      const deltaY = touch.clientY - this.previousTouchY;
      
      this.rotationY += deltaX * this.sensitivity;
      this.rotationX -= deltaY * this.sensitivity;
      
      // Clamp X rotation to prevent flipping
      this.rotationX = Math.max(-90, Math.min(90, this.rotationX));
      
      this.el.setAttribute('rotation', {
        x: this.rotationX,
        y: this.rotationY,
        z: 0
      });
      
      this.previousTouchX = touch.clientX;
      this.previousTouchY = touch.clientY;
    },
    onTouchEnd: function() {
      this.isDragging = false;
    },
    remove: function() {
      window.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('mousedown', this.onTouchStart);
      window.removeEventListener('mousemove', this.onTouchMove);
      window.removeEventListener('mouseup', this.onTouchEnd);
    }
});