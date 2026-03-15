/* ============================================================
   ROHITH VEMPRALA – PORTFOLIO JAVASCRIPT
   Three.js 3D background + typed text + scroll animations
   ============================================================ */

// ---- Loader ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 700);
    initAll();
  }, 1200);
});

function initAll() {
  initThreeBackground();
  initTypedText();
  initScrollAnimations();
  initNavbar();
  initHamburger();
  initSkillBars();
  initCursorGlow();
}

// ========================================================
// THREE.JS 3D BACKGROUND
// ========================================================
function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particle system
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const color1 = new THREE.Color(0x7c3aed);
  const color2 = new THREE.Color(0x06b6d4);
  const color3 = new THREE.Color(0xa855f7);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    const t = Math.random();
    let c;
    if (t < 0.33) c = color1;
    else if (t < 0.66) c = color2;
    else c = color3;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Floating wireframe geometries
  const geometries = [
    new THREE.OctahedronGeometry(4, 0),
    new THREE.TetrahedronGeometry(3.5, 0),
    new THREE.IcosahedronGeometry(3, 0),
  ];
  const wireMeshes = [];
  geometries.forEach((geo, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x7c3aed : 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (i - 1) * 20 + (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 20,
      -10 + Math.random() * 10
    );
    scene.add(mesh);
    wireMeshes.push(mesh);
  });

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll factor
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.008;

    camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.04;
    camera.position.z = 30 - scrollY * 0.01;

    wireMeshes.forEach((m, i) => {
      m.rotation.x = t * (0.2 + i * 0.05);
      m.rotation.y = t * (0.3 + i * 0.04);
      m.position.y = Math.sin(t * 0.5 + i) * 5;
    });

    renderer.render(scene, camera);
  }
  animate();
}

// ========================================================
// TYPED TEXT ANIMATION
// ========================================================
function initTypedText() {
  const el = document.getElementById('typed-title');
  if (!el) return;

  const phrases = [
    'Data Analyst',
    'Software Engineer Intern',
    'Power BI Expert',
    'Python Developer',
    'Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.innerHTML = current.slice(0, charIdx) + '<span class="cursor">|</span>';

    let delay = deleting ? 60 : 100;

    if (!deleting && charIdx === current.length) {
      pause = true;
      delay = 1800;
      deleting = true;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }
  tick();
}

// ========================================================
// SCROLL ANIMATIONS
// ========================================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // animate skill bars
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(f => f.classList.add('animated'));
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.timeline-item, .cert-card, .project-card, .skill-card, .about-card-3d, .contact-card, .skills-category').forEach(el => {
    observer.observe(el);
  });

  // Fade-in-up for section headers
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    fadeObserver.observe(el);
  });
}

// ========================================================
// SKILL BARS ANIMATION
// ========================================================
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('animated'));
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-category').forEach(el => observer.observe(el));
}

// ========================================================
// NAVBAR
// ========================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveLink();
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // close mobile menu
        document.getElementById('mobile-menu').classList.remove('open');
      }
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent-light)' : '';
    });
  }
}

// ========================================================
// HAMBURGER
// ========================================================
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
    const bars = hamburger.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    });
  });
}

// ========================================================
// CURSOR GLOW
// ========================================================
function initCursorGlow() {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9998',
    width: '300px', height: '300px',
    background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.15s ease, top 0.15s ease',
    left: '-300px', top: '-300px',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ========================================================
// CONTACT FORM
// ========================================================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  btn.style.opacity = '0.7';
  btn.querySelector('span').textContent = 'Sending...';

  setTimeout(() => {
    btn.style.opacity = '1';
    btn.querySelector('span').textContent = 'Send Message';
    successMsg.style.display = 'block';
    document.getElementById('contact-form').reset();
    setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
  }, 1200);
}

// ========================================================
// FLOATING CARDS PARALLAX
// ========================================================
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.floating-card');
  const rx = (e.clientX / window.innerWidth  - 0.5);
  const ry = (e.clientY / window.innerHeight - 0.5);

  cards.forEach((card, i) => {
    const factor = (i + 1) * 8;
    card.style.transform = `translateX(${rx * factor}px) translateY(${ry * factor}px)`;
  });
});

// ========================================================
// ABOUT CARD 3D TILT
// ========================================================
const aboutCard = document.querySelector('.about-card-3d');
if (aboutCard) {
  aboutCard.addEventListener('mousemove', (e) => {
    const rect = aboutCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    aboutCard.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.02)`;
  });
  aboutCard.addEventListener('mouseleave', () => {
    aboutCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  });
  aboutCard.style.transition = 'transform 0.15s ease';
}

// ========================================================
// PROJECT CARD TILT
// ========================================================
const projectCard = document.querySelector('.project-card');
if (projectCard) {
  projectCard.addEventListener('mousemove', (e) => {
    const rect = projectCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    projectCard.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  projectCard.addEventListener('mouseleave', () => {
    projectCard.style.transform = '';
  });
}
