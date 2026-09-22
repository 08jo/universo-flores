/* =========================================================
   UNIVERSO DE FLORES AMARILLAS
   - Núcleo oscuro con anillo dorado tipo Saturno
   - 150 frases flotando en esfera 3D
   - Estrellas de fondo
   - Control: arrastrar, rueda, pellizco
   - Audio con precarga agresiva y robusta (móvil-first)
   ========================================================= */

/* ---------- CONFIGURACIÓN ---------- */
const CONFIG = {
    titulo: "Un universo hecho para ti 🌻",
    frases: [
        "🌻 Eres de esas personas que dejan huella",
        "🌻 Tienes algo especial que se nota",
        "🌻 Brillas sin darte cuenta",
        "🌻 Tu forma de ser es un regalo",
        "🌻 El mundo es mejor contigo en él",
        "🌻 Tienes un corazón enorme",
        "🌻 Eres luz para quien te rodea",
        "🌻 Haces que todo sea más bonito",
        "🌻 Tu presencia cambia los lugares",
        "🌻 Eres de las personas que suman",
        "🌻 Tienes una energía única",
        "🌻 Se nota cuando alguien es buena persona",
        "🌻 Transmites calma y alegría a la vez",
        "🌻 Tu risa contagia a cualquiera",
        "🌻 Eres fuerte sin darte cuenta",
        "🌻 Tienes una forma de querer muy linda",
        "🌻 Eres ejemplo de muchas cosas buenas",
        "🌻 Tu esencia es difícil de encontrar",
        "🌻 Nadie es como tú, y eso es un halago",
        "🌻 Iluminas sin hacer ruido",
        "🌻 Eres de las que hacen bien con solo estar",
        "🌻 Tu manera de ver la vida inspira",
        "🌻 Tienes una sensibilidad hermosa",
        "🌻 Eres admirable en más de una forma",
        "🌻 Haces fácil lo que otros ven difícil",
        "🌻 Tu bondad se nota en los detalles",
        "🌻 Eres de las personas que valen la pena",
        "🌻 Dejas cosas buenas por donde pasas",
        "🌻 Tienes un brillo que no se apaga",
        "🌻 Eres increíble tal como eres",
        "🌻 Lo bueno de ti no cabe en palabras",
        "🌻 Eres de las que uno recuerda siempre",
        "🌻 Tu forma de estar es un abrazo",
        "🌻 Mereces todo lo bonito que das",
        "🌻 Eres una de esas personas que inspiran",
        "🌻 Sabes decir lo que uno necesita oír",
        "🌻 Tus palabras llegan justo cuando hacen falta",
        "🌻 Con tus palabras y tu escucha, haces mucho bien"
    ],
    fotos: [],
    musica: "assets/musica.mp3"
};

/* ---------- TÍTULO ---------- */
document.getElementById('main-title').textContent = CONFIG.titulo;

/* =========================================================
   AUDIO — CARGA PRIORITARIA Y ROBUSTA
   ========================================================= */
const VOLUMEN_FINAL = 0.5;
const audio = document.getElementById('audio');
const startButton = document.getElementById('start-button');

/* 1) Inyectar <link rel=preload> en <head> para que el navegador
      empiece a bajar el mp3 antes de que el JS termine de parsear. */
(function preloadLink() {
    try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'audio';
        link.href = CONFIG.musica;
        link.type = 'audio/mpeg';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    } catch (e) {}
})();

/* 2) Configurar el elemento <audio> de forma agresiva */
audio.querySelector('source').src = CONFIG.musica;
audio.preload = 'auto';
audio.autoplay = false;
audio.setAttribute('playsinline', '');
audio.setAttribute('webkit-playsinline', '');
audio.setAttribute('crossorigin', 'anonymous');
audio.load();

/* 3) Forzar descarga completa en background con cache forzada.
      No bloquea nada, pero llena el buffer del navegador. */
(function warmCache() {
    try {
        fetch(CONFIG.musica, { cache: 'force-cache', mode: 'cors' })
            .then(r => r.blob())
            .catch(() => {});
    } catch (e) {}
})();

/* 4) Estado del botón */
let audioReady = false;

function markReady(text) {
    if (audioReady) return;
    audioReady = true;
    startButton.textContent = text || 'Toca para entrar';
    startButton.classList.remove('loading');
    startButton.classList.add('ready');
}

/* 5) Detección temprana: cualquiera de estos eventos habilita el botón */
['loadedmetadata', 'canplay', 'canplaythrough'].forEach(evt => {
    audio.addEventListener(evt, () => markReady(), { once: true });
});

/* 6) Fallback: 2.5s máximo esperando; si no, habilitar igual */
setTimeout(() => markReady(), 2500);

/* 7) Desbloqueo de audio en móvil (iOS/Android) */
let audioUnlocked = false;
let audioCtx = null;

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    try {
        // Truco AudioContext: desbloquea la política de autoplay
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
            audioCtx = new AC();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const buf = audioCtx.createBuffer(1, 1, 22050);
            const src = audioCtx.createBufferSource();
            src.buffer = buf;
            src.connect(audioCtx.destination);
            src.start(0);
        }
    } catch (e) {}

    audio.muted = false;
    audio.volume = VOLUMEN_FINAL;

    const p = audio.play();
    if (p && typeof p.then === 'function') {
        p.catch(() => {
            // Reintento silencioso: a veces hay que esperar al siguiente frame
            setTimeout(() => {
                audio.play().catch(() => {});
            }, 80);
        });
    }
}

document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
document.addEventListener('click',      unlockAudio, { once: true });
document.addEventListener('keydown',    unlockAudio, { once: true });

/* 8) Intento temprano silencioso (algunos móviles lo permiten) */
audio.volume = 0;
audio.muted = true;
audio.play().then(() => {
    // Se pudo pre-reproducir: paramos y dejamos listo para el gesto real
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = VOLUMEN_FINAL;
}).catch(() => {
    audio.muted = false;
    audio.volume = VOLUMEN_FINAL;
});

/* ---------- ESCENA ---------- */
const canvas   = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 5000);

let targetDist  = 300;
let currentDist = 300;
let rotX = 0.2;
let rotY = 0;

/* ---------- ESTRELLAS ---------- */
(function makeStars(count = 2500, spread = 3000) {
    const g   = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r  = spread * (0.3 + Math.random() * 0.7);
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3 + 0] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.cos(ph);
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({
        size: 1.5, color: 0xffffff, depthWrite: false
    })));
})();

/* ---------- NÚCLEO CENTRAL ---------- */
const coreMat = new THREE.MeshPhongMaterial({
    color: 0x030303, transparent: true, opacity: 0.92, shininess: 30
});
const core = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 64), coreMat);
scene.add(core);

/* ---------- LUCES ---------- */
scene.add(new THREE.AmbientLight(0xffe066, 1.2));
const pointLight = new THREE.PointLight(0xffd54a, 2, 800);
pointLight.position.set(120, 100, 120);
scene.add(pointLight);

/* ---------- GLOW EXTERIOR ---------- */
const GLOW_BASE = 360;
function makeGlow(size = 768, c1 = '255,235,130', c2 = '255,180,0') {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size/2, size/2, size*0.05, size/2, size/2, size*0.5);
    grad.addColorStop(0,   `rgba(${c1},0.55)`);
    grad.addColorStop(0.5, `rgba(${c2},0.25)`);
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlow(), transparent: true, depthWrite: false
}));
glow.scale.set(GLOW_BASE, GLOW_BASE, 1);
scene.add(glow);

/* ---------- ANILLO estilo Saturno ---------- */
function ringTexture(size = 1024) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    g.translate(size / 2, size / 2);

    const rInner = size * 0.205;
    const rOuter = size * 0.49;

    const grd = g.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
    grd.addColorStop(0.00, 'rgba(255,255,245,1)');
    grd.addColorStop(0.30, 'rgba(255,235,120,1)');
    grd.addColorStop(0.65, 'rgba(255,200,40,0.95)');
    grd.addColorStop(1.00, 'rgba(255,160,0,0.85)');
    g.fillStyle = grd;

    g.beginPath();
    g.arc(0, 0, rOuter, 0, Math.PI * 2);
    g.arc(0, 0, rInner, 0, Math.PI * 2, true);
    g.closePath();
    g.fill();

    const bandCount = 26;
    for (let i = 0; i < bandCount; i++) {
        const r    = rInner + (rOuter - rInner) * (i / (bandCount - 1));
        const dark = i % 3 === 0;
        g.beginPath();
        g.arc(0, 0, r, 0, Math.PI * 2);
        g.lineWidth   = (rOuter - rInner) / bandCount * (0.55 + Math.random() * 0.35);
        g.strokeStyle = dark
            ? 'rgba(110,60,0,0.20)'
            : 'rgba(255,255,225,0.16)';
        g.stroke();
    }
    return new THREE.CanvasTexture(c);
}

const ring = new THREE.Mesh(
    new THREE.RingGeometry(42, 116, 160),
    new THREE.MeshBasicMaterial({
        map: ringTexture(),
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        opacity: 1
    })
);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

/* ---------- FRASES ALREDEDOR ---------- */
const frasesBase = (Array.isArray(CONFIG.frases) && CONFIG.frases.length)
    ? CONFIG.frases
    : ["🌻"];

const WORD_SLOTS = 150;
const WORDS = Array.from({ length: WORD_SLOTS }, (_, i) => frasesBase[i % frasesBase.length]);

function makeTextTexture(text, color) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;

    const maxWidth = c.width - 48;
    let fontSize = 60;
    ctx.font = `${fontSize}px 'Indie Flower', cursive`;
    while (ctx.measureText(text).width > maxWidth && fontSize > 24) {
        fontSize -= 2;
        ctx.font = `${fontSize}px 'Indie Flower', cursive`;
    }
    ctx.fillText(text, c.width / 2, c.height / 2);
    return new THREE.CanvasTexture(c);
}

const COLORS = [
    '#ffd700','#ffe066','#ffcc33','#ffb347','#fff2b0',
    '#ffaa00','#f4c430','#e6b800','#ffdb58','#f0c419'
];

const textGroup = new THREE.Group();
scene.add(textGroup);

document.fonts.load("40px 'Indie Flower'").catch(() => {}).then(() => {
    for (let i = 0; i < WORDS.length; i++) {
        const tex = makeTextTexture(WORDS[i], COLORS[i % COLORS.length]);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sp  = new THREE.Sprite(mat);
        sp.scale.set(68, 21.8, 1);

        const phi   = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r     = 150 + Math.random() * 120;

        sp.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
        sp.userData = {
            phi, theta, radius: r,
            speed: 0.001 + Math.random() * 0.001
        };
        textGroup.add(sp);
    }
});

/* ---------- FOTOS (opcional) ---------- */
const fotosBase = (Array.isArray(CONFIG.fotos) && CONFIG.fotos.length)
    ? CONFIG.fotos
    : [];

function makePhotoSprite(url, size) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp  = new THREE.Sprite(mat);
    sp.scale.set(size, size, 1);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        const s = Math.min(c.width / img.width, c.height / img.height);
        ctx.drawImage(
            img,
            (c.width  - img.width  * s) / 2,
            (c.height - img.height * s) / 2,
            img.width * s, img.height * s
        );
        tex.needsUpdate = true;

        const aspect = img.naturalWidth / img.naturalHeight;
        const aX = Math.min(1, aspect);
        const aY = Math.min(1, 1 / aspect);
        sp.scale.set(size * aX, size * aY, 1);
    };
    img.onerror = () => {};
    img.src = url;
    return sp;
}

const photoGroup = new THREE.Group();
scene.add(photoGroup);

if (fotosBase.length > 0) {
    const PHOTO_COUNT = 26;
    for (let i = 0; i < PHOTO_COUNT; i++) {
        const url  = fotosBase[i % fotosBase.length];
        const size = 28 + Math.random() * 20;
        const sp   = makePhotoSprite(url, size);

        const phi   = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r     = 140 + Math.random() * 170;

        sp.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
        sp.userData = {
            phi, theta, radius: r,
            speed: 0.0006 + Math.random() * 0.0012
        };
        photoGroup.add(sp);
    }
}

/* ---------- CONTROLES ---------- */
let dragging = false, lastX = 0, lastY = 0;

function onDown(e) {
    dragging = true;
    const t = e.touches ? e.touches[0] : e;
    lastX = t.clientX;
    lastY = t.clientY;
}
function onMove(e) {
    if (!dragging) return;
    const t  = e.touches ? e.touches[0] : e;
    const dx = (t.clientX - lastX) / innerWidth;
    const dy = (t.clientY - lastY) / innerHeight;
    rotY -= dx * 5;
    rotX  = Math.max(-1.2, Math.min(1.2, rotX + dy * 3.5));
    lastX = t.clientX;
    lastY = t.clientY;
}
function onUp() { dragging = false; }

addEventListener('mousedown',  onDown);
addEventListener('mousemove',  onMove);
addEventListener('mouseup',    onUp);
addEventListener('touchstart', onDown, { passive: true });
addEventListener('touchmove',  onMove, { passive: true });
addEventListener('touchend',   onUp,   { passive: true });

addEventListener('wheel', (e) => {
    targetDist += e.deltaY * 0.25;
    targetDist  = Math.max(160, Math.min(600, targetDist));
}, { passive: true });

/* Zoom con pellizco */
let pinch = 0;
addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d  = Math.hypot(dx, dy);
        if (pinch) {
            targetDist += (pinch - d) * 0.5;
            targetDist  = Math.max(160, Math.min(600, targetDist));
        }
        pinch = d;
    }
}, { passive: false });
addEventListener('touchend', () => { pinch = 0; }, { passive: true });

/* ---------- ANIMACIÓN ---------- */
let t = 0;
function tick() {
    requestAnimationFrame(tick);
    t += 0.01;

    ring.rotation.z += 0.003;

    const glowScale = 1 + Math.sin(t * 0.4) * 0.03;
    glow.scale.set(GLOW_BASE * glowScale, GLOW_BASE * glowScale, 1);

    const s = 1.0 + 0.05 * Math.sin(t * 3);
    core.scale.set(s, s, s);

    textGroup.children.forEach((sp) => {
        sp.material.opacity = 0.8 + 0.2 * Math.sin(t * 2);
        sp.userData.theta += sp.userData.speed;
        sp.position.x = sp.userData.radius * Math.sin(sp.userData.phi) * Math.cos(sp.userData.theta);
        sp.position.z = sp.userData.radius * Math.sin(sp.userData.phi) * Math.sin(sp.userData.theta);
    });

    photoGroup.children.forEach((sp) => {
        sp.material.opacity = 0.85 + 0.15 * Math.sin(t * 2 + sp.userData.radius);
        sp.userData.theta += sp.userData.speed;
        sp.position.x = sp.userData.radius * Math.sin(sp.userData.phi) * Math.cos(sp.userData.theta);
        sp.position.z = sp.userData.radius * Math.sin(sp.userData.phi) * Math.sin(sp.userData.theta);
    });

    currentDist += (targetDist - currentDist) * 0.06;

    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    camera.position.set(currentDist * sy * cx, currentDist * sx, currentDist * cy * cx);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
tick();

/* ---------- PANTALLA DE INICIO ---------- */
const startScreen = document.getElementById('start-screen');

function startExperience() {
    if (!audioReady) return;

    startScreen.classList.add('hidden');
    setTimeout(() => { startScreen.style.display = 'none'; }, 900);

    // Asegurar desbloqueo y reproducción inmediata
    unlockAudio();

    // Reintento por si el buffer no estaba listo
    const tryPlay = () => {
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.catch(() => setTimeout(tryPlay, 120));
        }
    };
    tryPlay();
}

startScreen.addEventListener('click', startExperience);
startScreen.addEventListener('touchstart', startExperience, { passive: true, once: true });

/* ---------- RESIZE ---------- */
addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
});
