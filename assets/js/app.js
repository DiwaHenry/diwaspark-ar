// Fullscreen functionality
function enterFullscreen() {
  const elem = document.documentElement;
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  }
}

// Lock orientation to landscape on mobile
function lockOrientation() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(err => {
      console.log('Orientation lock not supported:', err);
    });
  }
}

// Hide address bar on mobile
function hideAddressBar() {
  window.scrollTo(0, 1);
}

// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  const container1 = document.getElementById('particles1');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const particle1 = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = Math.random() * 3 + 3 + 's';
    particle1.className = 'particle';
    particle1.style.width = Math.random() * 4 + 2 + 'px';
    particle1.style.height = particle.style.width;
    particle1.style.left = Math.random() * 100 + '%';
    particle1.style.top = Math.random() * 100 + '%';
    particle1.style.animationDelay = Math.random() * 4 + 's';
    particle1.style.animationDuration = Math.random() * 3 + 3 + 's';
    container.appendChild(particle);
    container1.appendChild(particle1);
  }
}

// Hide splash screen after loading
function hideSplashScreen() {
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }, 2500); 
}

// Hide splash screen after loading
function hideSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const fullscreenPrompt = document.getElementById('fullscreen-prompt');
  
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      // Show fullscreen prompt after splash screen fades out
      fullscreenPrompt.classList.remove('hidden');
    }, 600);
  }, 2500); 
}

// Setup fullscreen button
function setupFullscreenButton() {
  const btn = document.getElementById('enter-fullscreen-btn');
  const fullscreenPrompt = document.getElementById('fullscreen-prompt');
  
  btn.addEventListener('click', async () => {
    await enterFullscreen();
    hideAddressBar();
    
    // Hide fullscreen prompt
    fullscreenPrompt.classList.add('hidden');
    setTimeout(() => {
      fullscreenPrompt.style.display = 'none';
    }, 600);
  });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  createParticles();
  hideSplashScreen();
  setupFullscreenButton();
  storeGLBOnce();
  
  // Hide address bar on mobile
  setTimeout(hideAddressBar, 0);
  window.addEventListener('orientationchange', hideAddressBar);
  window.addEventListener('resize', hideAddressBar);

});

// Prevent pull-to-refresh
document.body.addEventListener('touchmove', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Prevent zoom
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Original GLB caching function
async function storeGLBOnce() {
    const openRequest = indexedDB.open('GLBCache', 1);

    openRequest.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('models')) {
        db.createObjectStore('models');
      }
    };

    openRequest.onsuccess = async event => {
        const db = event.target.result;
        const tx = db.transaction('models', 'readonly');
        const store = tx.objectStore('models');
        const getRequest = store.get('everest');

        getRequest.onsuccess = async () => {
          if (getRequest.result) {
            console.log('Model already cached. Skipping download.');
          } else {
            try {
              // Model caching logic here if needed
            } catch (err) {
              console.error('Failed to fetch model:', err);
            }
          }
        };
    };
}