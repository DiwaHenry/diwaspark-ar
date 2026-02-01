
const reminder = document.getElementById("reminder");

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

// Lock orientation to landscape on mobile
function lockOrientation() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(err => {
      console.log('Orientation lock not supported:', err);
    });
  }
}


// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = Math.random() * 3 + 3 + 's';
    container.appendChild(particle);
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


// Initialize
window.addEventListener('DOMContentLoaded', () => {
    if(getOrientation() === "portrait"){
      reminder.style.display = "block";
    }else{
      setTimeout(() => {
        hideSplashScreen();
        window.location.replace("scanner.html");
      }, 2500); 
    }

    screen.orientation?.addEventListener("change", ()=>{
      if(getOrientation() === "landscape"){
         window.location.replace("scanner.html");
      }else{
        reminder.style.display = "block";
      }
    })

  createParticles();

});

