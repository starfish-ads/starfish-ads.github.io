// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 1500);
});

// 3D Cube Interaction
const cubeWrapper = document.querySelector('.cube-wrapper');
const cube = document.querySelector('.cube');

let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = -20;
let rotationY = -30;
let velocityX = 0;
let velocityY = 0;
let autoRotate = true;
let autoRotateSpeed = 0.2;

// Mouse Events
cubeWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    cube.classList.add('dragging');
    previousX = e.clientX;
    previousY = e.clientY;
    velocityX = 0;
    velocityY = 0;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;

    velocityX = deltaX * 0.5;
    velocityY = deltaY * 0.5;

    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5;

    updateCubeRotation();

    previousX = e.clientX;
    previousY = e.clientY;
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        cube.classList.remove('dragging');
        // Resume auto-rotate after momentum
        setTimeout(() => {
            if (!isDragging) autoRotate = true;
        }, 3000);
    }
});

// Touch Events
cubeWrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    autoRotate = false;
    cube.classList.add('dragging');
    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
    velocityX = 0;
    velocityY = 0;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - previousX;
    const deltaY = e.touches[0].clientY - previousY;

    velocityX = deltaX * 0.5;
    velocityY = deltaY * 0.5;

    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5;

    updateCubeRotation();

    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        cube.classList.remove('dragging');
        setTimeout(() => {
            if (!isDragging) autoRotate = true;
        }, 3000);
    }
});

function updateCubeRotation() {
    // Clamp rotationX to prevent flipping
    rotationX = Math.max(-60, Math.min(60, rotationX));
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

// Animation Loop for momentum and auto-rotate
function animate() {
    if (!isDragging) {
        // Apply momentum
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
            rotationY += velocityX;
            rotationX -= velocityY;
            velocityX *= 0.95;
            velocityY *= 0.95;
            updateCubeRotation();
        }

        // Auto-rotate
        if (autoRotate) {
            rotationY += autoRotateSpeed;
            updateCubeRotation();
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Shooting Stars
function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.cssText = `
        position: fixed;
        width: ${Math.random() * 100 + 50}px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
        top: ${Math.random() * 50}%;
        left: ${Math.random() * 100}%;
        transform: rotate(-45deg);
        pointer-events: none;
        z-index: 0;
        animation: shootingStar ${Math.random() * 1 + 0.5}s linear forwards;
    `;

    document.querySelector('.starfield').appendChild(star);

    setTimeout(() => star.remove(), 2000);
}

// Add shooting star animation to document
const shootingStarStyle = document.createElement('style');
shootingStarStyle.textContent = `
    @keyframes shootingStar {
        0% {
            opacity: 1;
            transform: rotate(-45deg) translateX(0);
        }
        100% {
            opacity: 0;
            transform: rotate(-45deg) translateX(-500px);
        }
    }
`;
document.head.appendChild(shootingStarStyle);

// Randomly create shooting stars
setInterval(() => {
    if (Math.random() > 0.7) {
        createShootingStar();
    }
}, 2000);

// Modal functionality
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const companyInfoBtns = document.querySelectorAll('.company-info-btn');

companyInfoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// Keyboard close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
    }
});

// Performance: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    autoRotate = !document.hidden;
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;

    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    const nebula = document.querySelector('.nebula');
    if (nebula) {
        nebula.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Dynamic cube size based on viewport
function updateCubeFaceTransforms() {
    const wrapper = document.querySelector('.cube-wrapper');
    if (!wrapper) return;

    const size = wrapper.offsetWidth;
    const halfSize = size / 2;

    document.querySelectorAll('.face-front').forEach(el => {
        el.style.transform = `translateZ(${halfSize}px)`;
    });
    document.querySelectorAll('.face-back').forEach(el => {
        el.style.transform = `rotateY(180deg) translateZ(${halfSize}px)`;
    });
    document.querySelectorAll('.face-right').forEach(el => {
        el.style.transform = `rotateY(90deg) translateZ(${halfSize}px)`;
    });
    document.querySelectorAll('.face-left').forEach(el => {
        el.style.transform = `rotateY(-90deg) translateZ(${halfSize}px)`;
    });
    document.querySelectorAll('.face-top').forEach(el => {
        el.style.transform = `rotateX(90deg) translateZ(${halfSize}px)`;
    });
    document.querySelectorAll('.face-bottom').forEach(el => {
        el.style.transform = `rotateX(-90deg) translateZ(${halfSize}px)`;
    });
}

window.addEventListener('resize', updateCubeFaceTransforms);
window.addEventListener('load', updateCubeFaceTransforms);
