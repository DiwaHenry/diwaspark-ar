AFRAME.registerComponent('smooth-position', {
  init: function() {
    this.targetPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.smoothing = 0.1;
  },
  tick: function() {
    this.targetPosition.copy(this.el.object3D.position);
    this.currentPosition.lerp(this.targetPosition, this.smoothing);
    this.el.object3D.position.copy(this.currentPosition);
  }
});