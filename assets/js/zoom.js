// Zoom functionality for MindAR 3D models
document.addEventListener('DOMContentLoaded', function() {
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomControls = document.getElementById('zoom-controls');
  
  // Hide zoom controls initially
  if (zoomControls) {
    zoomControls.style.display = 'none';
  }
  
  let currentScale = 0.45; // Initial scale from your models
  const minScale = 0.2;
  const maxScale = 1.0;
  const zoomStep = 0.05;
  let isAnyTargetVisible = false;
  
  // Store all models with their initial positions
  const models = [];
  
  // Wait for A-Frame scene to load
  const scene = document.querySelector('a-scene');
  
  scene.addEventListener('loaded', function() {
    // Get all target entities
    const targets = document.querySelectorAll('[mindar-image-target]');
    
    targets.forEach(target => {
      const model = target.querySelector('a-gltf-model');
      const plane = target.querySelector('a-plane');
      
      if (model && plane) {
        // Store initial positions
        const modelPos = model.getAttribute('position');
        const planePos = plane.getAttribute('position');
        
        const itemData = { 
          model: model,
          plane: plane,
          target: target,
          initialModelScale: 0.45,
          initialPlaneWidth: 1.1,
          initialPlaneHeight: 0.7,
          initialModelX: modelPos.x,
          initialPlaneX: planePos.x,
          modelY: modelPos.y,
          modelZ: modelPos.z,
          planeY: planePos.y,
          planeZ: planePos.z
        };
        
        models.push(itemData);
        
        // Reset scale when target is found
        target.addEventListener('targetFound', function() {
          currentScale = 0.45;
          resetScale(itemData);
          // Show zoom controls when any target is found
          if (zoomControls) {
            zoomControls.style.display = 'block';
          }
          isAnyTargetVisible = true;
        });
        
        // Hide zoom controls when target is lost
        target.addEventListener('targetLost', function() {
          // Check if any other target is still visible
          setTimeout(() => {
            const anyVisible = models.some(m => m.target.object3D.visible);
            if (!anyVisible && zoomControls) {
              zoomControls.style.display = 'none';
            }
            isAnyTargetVisible = anyVisible;
          }, 100);
        });
      }
    });
  });
  
  // Reset scale for a specific item
  function resetScale(item) {
    const scaleFactor = 1.0; // Reset to initial scale
    
    // Reset model
    item.model.setAttribute('scale', `${item.initialModelScale} ${item.initialModelScale} ${item.initialModelScale}`);
    item.model.setAttribute('position', `${item.initialModelX} ${item.modelY} ${item.modelZ}`);
    
    // Reset plane
    item.plane.setAttribute('width', item.initialPlaneWidth);
    item.plane.setAttribute('height', item.initialPlaneHeight);
    item.plane.setAttribute('position', `${item.initialPlaneX} ${item.planeY} ${item.planeZ}`);
    
    // Reset text
    const texts = item.plane.querySelectorAll('a-text');
    texts.forEach((text, index) => {
      const baseWidth = 1;
      text.setAttribute('width', baseWidth);
      const originalY = index === 0 ? 0.25 : -0.08;
      text.setAttribute('position', `0 ${originalY} 0.01`);
    });
    
    // Update button states
    updateButtonStates();
  }
  
  // Update button states (separated for reuse)
  function updateButtonStates() {
    zoomInBtn.disabled = currentScale >= maxScale;
    zoomOutBtn.disabled = currentScale <= minScale;
    
    if (currentScale >= maxScale) {
      zoomInBtn.style.opacity = '0.5';
    } else {
      zoomInBtn.style.opacity = '1';
    }
    
    if (currentScale <= minScale) {
      zoomOutBtn.style.opacity = '0.5';
    } else {
      zoomOutBtn.style.opacity = '1';
    }
  }
  
  // Zoom In function
  zoomInBtn.addEventListener('click', function() {
    currentScale = Math.min(currentScale + zoomStep, maxScale);
    updateScale();
  });
  
  // Zoom Out function
  zoomOutBtn.addEventListener('click', function() {
    currentScale = Math.max(currentScale - zoomStep, minScale);
    updateScale();
  });
  
  // Update scale for all visible models
  function updateScale() {
    const scaleFactor = currentScale / 0.45; // Calculate relative to initial scale
    
    models.forEach(item => {
      if (item.model && item.plane && item.target) {
        // Check if this target is currently visible
        const isVisible = item.target.object3D.visible;
        
        if (isVisible) {
          // Scale the 3D model
          const newModelScale = item.initialModelScale * scaleFactor;
          item.model.setAttribute('scale', `${newModelScale} ${newModelScale} ${newModelScale}`);
          
          // Adjust model position to maintain spacing
          const newModelX = item.initialModelX * scaleFactor;
          item.model.setAttribute('position', `${newModelX} ${item.modelY} ${item.modelZ}`);
          
          // Scale the text plane
          const newPlaneWidth = item.initialPlaneWidth * scaleFactor;
          const newPlaneHeight = item.initialPlaneHeight * scaleFactor;
          item.plane.setAttribute('width', newPlaneWidth);
          item.plane.setAttribute('height', newPlaneHeight);
          
          // Adjust plane position to maintain spacing
          const newPlaneX = item.initialPlaneX * scaleFactor;
          item.plane.setAttribute('position', `${newPlaneX} ${item.planeY} ${item.planeZ}`);
          
          // Adjust text sizes proportionally
          const texts = item.plane.querySelectorAll('a-text');
          texts.forEach((text, index) => {
            const baseWidth = index === 0 ? 1 : 1; // Title and body text
            const newWidth = baseWidth * scaleFactor;
            text.setAttribute('width', newWidth);
            
            // Adjust text positions to maintain layout
            const currentPos = text.getAttribute('position');
            const newY = (index === 0 ? 0.25 : -0.08) * scaleFactor;
            text.setAttribute('position', `0 ${newY} 0.01`);
          });
        }
      }
    });
    
    // Update button states
    updateButtonStates();
  }
  
  // Optional: Pinch zoom for mobile devices
  let initialDistance = 0;
  let initialScale = currentScale;
  
  scene.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialScale = currentScale;
    }
  });
  
  scene.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleDelta = (currentDistance - initialDistance) * 0.001;
      currentScale = Math.max(minScale, Math.min(maxScale, initialScale + scaleDelta));
      updateScale();
    }
  });
});