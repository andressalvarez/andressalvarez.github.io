/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cdot');
const ring = document.getElementById('cring');
let mx = -100, my = -100, rx = -100, ry = -100;

window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

(function animCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a,button,.tilt-wrap,.proj-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ── NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 24);
}, { passive: true });

const toggle     = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
toggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden');
  toggle.classList.toggle('nav-open', !open);
});
document.querySelectorAll('#mobile-menu a').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    toggle.classList.remove('nav-open');
  })
);

/* ── TYPED ROLE ── */
const roles = [
  'Full Stack Developer Semi-Senior',
  'Backend Engineer · Django & Laravel',
  'Builder de Soluciones con IA',
  'Ing. Software en Formación',
  'Arquitecto de Flujos Automatizados',
];
const typed = document.getElementById('typed-role');
let ri = 0, ci = 0, del = false;
function typeRole() {
  const cur = roles[ri];
  if (!del) {
    typed.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(typeRole, 2400); return; }
    setTimeout(typeRole, 52);
  } else {
    typed.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(typeRole, 350); return; }
    setTimeout(typeRole, 26);
  }
}
setTimeout(typeRole, 1400);

/* ── THREE.JS PARTICLE BACKGROUND ── */
(function initThree() {
  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1200);
  camera.position.z = 320;

  const N   = 110;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - .5) * 700;
    pos[i*3+1] = (Math.random() - .5) * 700;
    pos[i*3+2] = (Math.random() - .5) * 280;
    vel[i*3]   = (Math.random() - .5) * .25;
    vel[i*3+1] = (Math.random() - .5) * .25;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const pMat = new THREE.PointsMaterial({ color: 0xe8a030, size: 2.2, transparent: true, opacity: .55, sizeAttenuation: true });
  const points = new THREE.Points(geo, pMat);
  scene.add(points);

  const lMat = new THREE.LineBasicMaterial({ color: 0xe8a030, transparent: true, opacity: .06 });
  let lines = null;
  const MAXDIST = 110;

  function buildLines() {
    if (lines) scene.remove(lines);
    const lp = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pos[i*3]   - pos[j*3];
        const dy = pos[i*3+1] - pos[j*3+1];
        const dz = pos[i*3+2] - pos[j*3+2];
        if (dx*dx + dy*dy + dz*dz < MAXDIST*MAXDIST) {
          lp.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2]);
        }
      }
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
    lines = new THREE.LineSegments(lg, lMat);
    scene.add(lines);
  }

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - .5) * 2;
    mouseY = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    for (let i = 0; i < N; i++) {
      pos[i*3]   += vel[i*3];
      pos[i*3+1] += vel[i*3+1];
      if (Math.abs(pos[i*3])   > 350) vel[i*3]   *= -1;
      if (Math.abs(pos[i*3+1]) > 350) vel[i*3+1] *= -1;
    }
    geo.attributes.position.needsUpdate = true;

    if (frame % 3 === 0) buildLines();

    camera.position.x += (mouseX * 40 - camera.position.x) * .04;
    camera.position.y += (-mouseY * 40 - camera.position.y) * .04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* fade out canvas when user scrolls past hero */
  window.addEventListener('scroll', () => {
    const t = Math.min(window.scrollY / window.innerHeight, 1);
    canvas.style.opacity = (1 - t) * 0.8;
  }, { passive: true });
})();

/* ── GSAP + SCROLL TRIGGER ── */
gsap.registerPlugin(ScrollTrigger);

/* Hero words slide up */
gsap.from('#word-andres', { y: 100, opacity: 0, duration: .9, ease: 'power3.out', delay: .3 });
gsap.from('#word-alvarez', { y: 100, opacity: 0, duration: .9, ease: 'power3.out', delay: .5 });
gsap.from('.reveal-item', { y: 30, opacity: 0, duration: .8, ease: 'power3.out', stagger: .12, delay: .7 });

/* Section reveals */
document.querySelectorAll('.gsap-reveal').forEach((el, i) => {
  gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: .85,
    ease: 'power3.out',
    delay: i * 0.04,
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
    }
  });
});

/* ── 3D CARD TILT ── */
document.querySelectorAll('.tilt-wrap').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rX = ((y - cy) / cy) * -10;
    const rY = ((x - cx) / cx) *  10;
    card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`;
    card.style.boxShadow = `${-rY * 1.5}px ${rX * 1.5}px 40px rgba(0,0,0,.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.boxShadow = '';
  });
});

/* ── PROJECT CARDS — diagonal directional reveal, se revierte al subir ── */
(function initProjAnims() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animProj(sel, fromX, fromY, rot) {
    document.querySelectorAll(sel).forEach(el => {
      if (reduced) return; // accesibilidad: sin animación si el usuario lo prefiere

      // estado inicial: oculto y desplazado diagonalmente
      gsap.set(el, { x: fromX, y: fromY, rotation: rot, opacity: 0 });

      gsap.to(el, {
        x: 0, y: 0, rotation: 0, opacity: 1,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          // play al bajar, reverse al volver a subir
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  animProj('.proj-from-left',  -88, -44,  2);
  animProj('.proj-from-right',  88, -44, -2);
  animProj('.proj-from-top',    0,  -60,  0);
})();

/* ── EXPERIENCE TIMELINE — slide from left / right ── */
document.querySelectorAll('.exp-from-left, .exp-from-right').forEach(el => {
  const fromX = el.classList.contains('exp-from-left') ? -72 : 72;
  gsap.fromTo(el,
    { x: fromX, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 0.78,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    }
  );
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform = `translate(${dx * .22}px, ${dy * .22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── EXPERIENCE ACCORDION ── */
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    const btn = card.querySelector('.exp-toggle');
    if (btn) {
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.setAttribute('aria-label', isOpen ? 'Colapsar' : 'Expandir');
    }
  });
});

/* ── STACK — stagger per group ── */
(function() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.stack-group').forEach(function(group) {
    var cards = group.querySelectorAll('.stack-card');
    if (!cards.length) return;
    gsap.from(cards, {
      y: 22,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.out',
      stagger: { each: 0.055 },
      scrollTrigger: {
        trigger: group,
        start: 'top 88%',
        once: true,
      }
    });
  });
  /* pill tags fade-up as a batch */
  var pillGroup = document.getElementById('stack-pills');
  if (pillGroup) {
    var pills = pillGroup.querySelectorAll('.stag');
    if (pills.length) {
      gsap.from(pills, {
        y: 14,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: { each: 0.03 },
        scrollTrigger: {
          trigger: pillGroup,
          start: 'top 88%',
          once: true,
        }
      });
    }
  }
})();
