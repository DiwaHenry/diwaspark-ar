AFRAME.registerComponent('pinch-scale', {
  schema: {
    min: { default: 0.2 },
    max: { default: 2 }
  },

  init() {
    this.initialScale = this.el.object3D.scale.clone();
    this.startDistance = null;

    this.el.sceneEl.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.el.sceneEl.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.el.sceneEl.addEventListener('touchend', this.onTouchEnd.bind(this));
  },

  getDistance(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  },

  onTouchStart(e) {
    if (e.touches.length === 2) {
      this.startDistance = this.getDistance(e.touches);
      this.initialScale = this.el.object3D.scale.clone();
    }
  },

  onTouchMove(e) {
    if (e.touches.length === 2 && this.startDistance) {
      const currentDistance = this.getDistance(e.touches);
      let scaleFactor = currentDistance / this.startDistance;

      let newScale = this.initialScale.x * scaleFactor;
      newScale = Math.min(this.data.max, Math.max(this.data.min, newScale));

      this.el.object3D.scale.set(newScale, newScale, newScale);
    }
  },

  onTouchEnd() {
    this.startDistance = null;
  }
});