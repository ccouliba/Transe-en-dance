const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 50; // Reduced number of particles

// Define color ratios
const colorRatios = {
    red: 0.45,
    orange: 0.45,
    yellow: 0.1
};

// Color gradients for the fire effect
const colors = [
    'rgba(255, 69, 0, 0.6)', // red-orange
    'rgba(255, 140, 0, 0.4)', // orange
    'rgba(255, 215, 0, 0.2)'  // yellow
];

// Fire glow parameters
let fireGlowGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.95, 0, canvas.width / 2, canvas.height * 0.95, canvas.height * 0.5);
fireGlowGradient.addColorStop(0, 'rgba(255, 69, 0, 0.15)'); // red-orange start
fireGlowGradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.1)'); // orange
fireGlowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)'); // yellow end

class Particle {
    constructor() {
        const colorChance = Math.random();

        if (colorChance < colorRatios.red) {
            this.color = colors[0]; // Red
        } else if (colorChance < colorRatios.red + colorRatios.orange) {
            this.color = colors[1]; // Orange
        } else {
            this.color = colors[2]; // Yellow
        }

        const spawnType = Math.random();

        if (spawnType < 0.33) { // 33% chance from left
            this.x = 0;
            this.y = Math.random() * canvas.height;
            this.speedX = Math.random() * 0.5;
        } else if (spawnType < 0.66) { // 33% chance from right
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = Math.random() * -0.5;
        } else { // 33% chance from bottom
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.speedX = (Math.random() - 0.5) * 2; // Random horizontal speed
        }

        this.size = Math.random() * 5 + 1;
        this.baseSize = this.size; // Store base size for scintillation effect
        this.speedY = Math.random() * -0.4 - 0.05; // Slightly increased vertical speed
        this.opacity = Math.random() * 0.5 + 0.5; // Random opacity between 0.5 and 1

        // Randomly set chaotic behavior (10% chance)
        this.chaotic = Math.random() < 0.1;
        if (this.chaotic) {
            this.speedX = (Math.random() - 0.5) * 4; // Higher random horizontal speed
            this.speedY = Math.random() * -2 - 0.1; // Higher random vertical speed
        }
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Scintillation effect
        if (!this.chaotic) {
            if (this.direction === 'up') {
                this.size += 0.05;
            } else {
                this.size -= 0.05;
            }

            // Reverse direction when size reaches base size or out of bounds
            if (this.size >= this.baseSize + 1 || this.size <= this.baseSize - 1) {
                this.direction = this.direction === 'up' ? 'down' : 'up';
            }
        }

        if (this.size > 0.1) this.size -= 0.005; // Significantly reduced size reduction

        // Ensure some particles have a chance to reach the top
        if (Math.random() < 0.05) { // 5% chance
            this.speedY = Math.random() * -1 - 0.1; // Faster upwards speed
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function drawFireGlow() {
    ctx.fillStyle = fireGlowGradient;
    ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.1) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFireGlow(); // Draw fire glow effect
    handleParticles();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update fire glow gradient
    fireGlowGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.95, 0, canvas.width / 2, canvas.height * 0.95, canvas.height * 0.5);
    fireGlowGradient.addColorStop(0, 'rgba(255, 69, 0, 0.15)'); // red-orange start
    fireGlowGradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.1)'); // orange
    fireGlowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)'); // yellow end
});

///////////////////////////////////////////////////////////////////////////////////////////


//musique
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const audio = new Audio('dotamain.mp3');
    let isPlaying = false; // Variable pour suivre l'état de la lecture audio

    playButton.addEventListener('click', function() {
        if (!isPlaying) {
            audio.play().then(() => {
                console.log('La musique est en train de jouer');
                isPlaying = true; // Met à jour l'état de lecture
                playButton.textContent = '🔇'; // Change le texte du bouton
            }).catch(error => {
                console.error('Erreur de lecture audio :', error);
            });
        } else {
            audio.pause(); // Met en pause la musique
            isPlaying = false; // Met à jour l'état de lecture
            playButton.textContent = '🔈'; // Change le texte du bouton
        }
    });
});





//////////////////////////////////////////////////////////////////////////////////////////

// Récupération des éléments du DOM
const classicButton = document.getElementById('classicButton');
const boostedButton = document.getElementById('boostedButton');
const humanVsComputerButton = document.getElementById('humanVsComputerButton');
const humanVsHumanButton = document.getElementById('humanVsHumanButton');
const levelSelection = document.getElementById('levelSelection');
const easyLevelButton = document.getElementById('easyLevel');
const mediumLevelButton = document.getElementById('mediumLevel');
const hardLevelButton = document.getElementById('hardLevel');

// Ajout des écouteurs d'événements aux boutons principaux
classicButton.addEventListener('click', function() {
    showSelectionOptions('Classic');
});

boostedButton.addEventListener('click', function() {
    showSelectionOptions('Boosted');
});

// Fonction pour afficher les options de sélection
function showSelectionOptions(gameMode) {
    // Masquer tous les boutons principaux
    classicButton.style.display = 'none';
    boostedButton.style.display = 'none';

    // Afficher les boutons d'options de sélection correspondants
    if (gameMode === 'Classic') {
        humanVsComputerButton.style.display = 'inline-block';
        humanVsHumanButton.style.display = 'inline-block';
    } else if (gameMode === 'Boosted') {
        humanVsComputerButton.style.display = 'inline-block';
        humanVsHumanButton.style.display = 'inline-block';
    }
}

// Ajout des écouteurs d'événements aux boutons d'options de sélection
humanVsComputerButton.addEventListener('click', function() {
    showLevelSelection();
});

humanVsHumanButton.addEventListener('click', function() {
    // Ici vous pouvez mettre le code pour l'action de "Human vs Human" si nécessaire
    console.log('Human vs Human mode selected.');
});

// Fonction pour afficher la sélection de niveau
function showLevelSelection() {
    // Masquer les boutons d'options de sélection
    humanVsComputerButton.style.display = 'none';
    humanVsHumanButton.style.display = 'none';

    // Afficher la sélection de niveau
    levelSelection.style.display = 'block';

    // Ajouter les écouteurs d'événements pour chaque niveau
    easyLevelButton.addEventListener('click', function() {
        handleLevelSelection('Easy');
    });

    mediumLevelButton.addEventListener('click', function() {
        handleLevelSelection('Medium');
    });

    hardLevelButton.addEventListener('click', function() {
        handleLevelSelection('Hard');
    });
}

// Fonction pour traiter la sélection de niveau
function handleLevelSelection(level) {
    // Exemple : Vous pouvez ici effectuer des actions en fonction du niveau sélectionné
    console.log(`Selected ${level} level.`);
}
