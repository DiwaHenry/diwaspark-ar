const fullscreenBtn = document.getElementById("enter-fullscreen-btn");
const fullscreenPrompt = document.getElementById('fullscreen-prompt');

        // Create floating particles
function createParticles() {
    const container1 = document.getElementById('particles1');

    for (let i = 0; i < 20; i++) {
        const particle1 = document.createElement('div');
       
        particle1.className = 'particle';
        particle1.style.width = Math.random() * 4 + 2 + 'px';
        particle1.style.height = particle1.style.width;
        particle1.style.left = Math.random() * 100 + '%';
        particle1.style.top = Math.random() * 100 + '%';
        particle1.style.animationDelay = Math.random() * 4 + 's';
        particle1.style.animationDuration = Math.random() * 3 + 3 + 's';
        container1.appendChild(particle1);
    }
}

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

// Hide address bar on mobile
function hideAddressBar() {
  window.scrollTo(0, 1);
}

// Setup fullscreen button
function setupFullscreenButton() {
  const btn = document.getElementById('enter-fullscreen-btn');
  const fullscreenPrompt = document.getElementById('fullscreen-prompt');
  
  btn.addEventListener('click', async () => {
    await enterFullscreen();
    hideAddressBar();
    console.log("clicked!");
    
    // Hide fullscreen prompt
    fullscreenPrompt.classList.add('hidden');
    setTimeout(() => {
      fullscreenPrompt.style.display = 'none';
    }, 600);

  }); 
}

function getOrientation() {
    if (screen.orientation?.type) {
        return screen.orientation.type.includes("landscape")
        ? "landscape"
        : "portrait";
    }
    return window.innerWidth > window.innerHeight
        ? "landscape"
        : "portrait";
}

screen.orientation?.addEventListener("change", ()=>{
    if(getOrientation() === "portrait"){
        window.location.replace("index.html");
    }
})

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Show fullscreen prompt after splash screen fades out
    fullscreenPrompt.classList.remove('hidden');

    screen.orientation?.addEventListener("change", ()=>{
      if(getOrientation() === "landscape"){
        fullscreenBtn.removeAttribute("disabled");
      }else{
        fullscreenBtn.setAttribute("disabled", true);
      }
    })

    createParticles();
    setupFullscreenButton();

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

