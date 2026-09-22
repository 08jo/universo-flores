/* =========================================================
   UNIVERSO DE FLORES AMARILLAS
   - Núcleo oscuro con anillo dorado tipo Saturno
   - 150 frases flotando en esfera 3D
   - Estrellas de fondo
   - Control: arrastrar, rueda, pellizco
   - Audio: reproducción directa mediante <audio>.play()
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
   AUDIO
   ========================================================= */

const VOLUMEN_FINAL = 0.5;

const audio = document.getElementById('audio');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');

let unlocked = false;
let starting = false;


/* =========================================================
   CONFIGURAR AUDIO HTML
   ========================================================= */

audio.preload = 'auto';
audio.loop = true;
audio.setAttribute('playsinline', '');
audio.setAttribute('webkit-playsinline', '');
audio.volume = VOLUMEN_FINAL;
audio.muted = false;


/* =========================================================
   BOTÓN DE INICIO
   ========================================================= */

/*
 * Ya no se muestra "Cargando música...".
 * El botón queda disponible inmediatamente.
 */

startButton.textContent = "🌻 Toca para entrar";

startButton.classList.remove('loading');

startButton.classList.add('ready');


/* =========================================================
   REPRODUCCIÓN DIRECTA MEDIANTE <audio>.play()
   ========================================================= */

async function playFromElement() {

    try {

        audio.muted = false;

        audio.volume = VOLUMEN_FINAL;

        /*
         * La reproducción comienza directamente
         * como consecuencia de la interacción del usuario.
         */

        const promise = audio.play();

        if (
            promise &&
            typeof promise.then === 'function'
        ) {

            await promise;

        }

        console.log(
            '🎵 Música iniciada mediante <audio>.play()'
        );

        return true;

    } catch (error) {

        console.error(
            '❌ El navegador bloqueó el audio:',
            error
        );

        return false;

    }

}


/* =========================================================
   INICIAR EXPERIENCIA
   ========================================================= */

async function startExperience() {

    /*
     * Evita ejecuciones dobles.
     */

    if (starting || unlocked) {
        return;
    }

    starting = true;


    /*
     * AQUÍ SE EJECUTA DIRECTAMENTE audio.play()
     * después del clic del usuario.
     */

    const reproduced =
        await playFromElement();


    /*
     * Si el navegador bloquea el audio,
     * no continuamos con la experiencia.
     */

    if (!reproduced) {

        starting = false;

        return;

    }


    /*
     * La música comenzó correctamente.
     */

    unlocked = true;


    /* =====================================================
       OCULTAR PANTALLA DE INICIO
       ===================================================== */

    startScreen.classList.add(
        'hidden'
    );


    setTimeout(() => {

        startScreen.style.display = 'none';

    }, 900);


    starting = false;

}


/* =========================================================
   EVENTO CLICK
   ========================================================= */

startScreen.addEventListener(
    'click',
    startExperience
);


/* =========================================================
   EVENTO TOUCH
   ========================================================= */

startScreen.addEventListener(
    'touchend',
    (event) => {

        event.preventDefault();

        startExperience();

    },
    {
        passive: false
    }
);


/* =========================================================
   ESCENA THREE.JS
   ========================================================= */

const canvas =
    document.getElementById('c');


const renderer =
    new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio || 1,
        2
    )
);


renderer.setSize(
    innerWidth,
    innerHeight
);


const scene =
    new THREE.Scene();


const camera =
    new THREE.PerspectiveCamera(
        60,
        innerWidth / innerHeight,
        0.1,
        5000
    );


let targetDist = 300;

let currentDist = 300;

let rotX = 0.2;

let rotY = 0;


/* =========================================================
   ESTRELLAS
   ========================================================= */

(function makeStars(
    count = 2500,
    spread = 3000
) {

    const g =
        new THREE.BufferGeometry();


    const pos =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const r =
            spread *
            (
                0.3 +
                Math.random() * 0.7
            );


        const th =
            Math.random() *
            Math.PI *
            2;


        const ph =
            Math.acos(
                2 * Math.random() - 1
            );


        pos[i * 3 + 0] =
            r *
            Math.sin(ph) *
            Math.cos(th);


        pos[i * 3 + 1] =
            r *
            Math.cos(ph);


        pos[i * 3 + 2] =
            r *
            Math.sin(ph) *
            Math.sin(th);

    }


    g.setAttribute(
        'position',
        new THREE.BufferAttribute(
            pos,
            3
        )
    );


    scene.add(
        new THREE.Points(
            g,
            new THREE.PointsMaterial({
                size: 1.5,
                color: 0xffffff,
                depthWrite: false
            })
        )
    );

})();


/* =========================================================
   NÚCLEO
   ========================================================= */

const coreMat =
    new THREE.MeshPhongMaterial({

        color: 0x030303,

        transparent: true,

        opacity: 0.92,

        shininess: 30

    });


const core =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            40,
            64,
            64
        ),
        coreMat
    );


scene.add(core);


/* =========================================================
   LUCES
   ========================================================= */

scene.add(
    new THREE.AmbientLight(
        0xffe066,
        1.2
    )
);


const pointLight =
    new THREE.PointLight(
        0xffd54a,
        2,
        800
    );


pointLight.position.set(
    120,
    100,
    120
);


scene.add(pointLight);


/* =========================================================
   GLOW
   ========================================================= */

const GLOW_BASE = 360;


function makeGlow(
    size = 768,
    c1 = '255,235,130',
    c2 = '255,180,0'
) {

    const c =
        document.createElement('canvas');


    c.width =
        c.height =
        size;


    const g =
        c.getContext('2d');


    const grad =
        g.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
        );


    grad.addColorStop(
        0,
        `rgba(${c1},0.95)`
    );


    grad.addColorStop(
        0.35,
        `rgba(${c2},0.55)`
    );


    grad.addColorStop(
        1,
        `rgba(${c2},0)`
    );


    g.fillStyle = grad;


    g.fillRect(
        0,
        0,
        size,
        size
    );


    const tex =
        new THREE.CanvasTexture(c);


    const mat =
        new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });


    const sp =
        new THREE.Sprite(mat);


    sp.scale.set(
        size,
        size,
        1
    );


    return sp;

}


const glow =
    makeGlow();


scene.add(glow);


/* =========================================================
   ANILLO
   ========================================================= */

const ringGroup =
    new THREE.Group();


scene.add(ringGroup);


const ringGeometry =
    new THREE.RingGeometry(
        75,
        125,
        128
    );


const ringMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffd84d,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
    });


const ring =
    new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );


ring.rotation.x =
    Math.PI / 2;


ringGroup.add(ring);


/* =========================================================
   FRASES
   ========================================================= */

const textGroup =
    new THREE.Group();


scene.add(textGroup);


function makeTextSprite(
    message
) {

    const canvas =
        document.createElement('canvas');


    const ctx =
        canvas.getContext('2d');


    const fontSize = 38;


    ctx.font =
        `${fontSize}px Arial`;


    const width =
        ctx.measureText(message).width +
        40;


    canvas.width =
        width;


    canvas.height =
        70;


    ctx.font =
        `${fontSize}px Arial`;


    ctx.textAlign =
        'center';


    ctx.textBaseline =
        'middle';


    ctx.fillStyle =
        'rgba(255,245,190,0.95)';


    ctx.shadowColor =
        'rgba(255,190,0,0.8)';


    ctx.shadowBlur =
        10;


    ctx.fillText(
        message,
        width / 2,
        35
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate = true;


    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });


    const sprite =
        new THREE.Sprite(material);


    sprite.scale.set(
        width * 0.12,
        8,
        1
    );


    return sprite;

}


CONFIG.frases.forEach(
    (frase) => {

        const sp =
            makeTextSprite(frase);


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        const theta =
            Math.random() *
            Math.PI *
            2;


        const r =
            150 +
            Math.random() * 180;


        sp.position.set(

            r *
            Math.sin(phi) *
            Math.cos(theta),

            r *
            Math.cos(phi),

            r *
            Math.sin(phi) *
            Math.sin(theta)

        );


        sp.userData = {

            phi,

            theta,

            radius: r,

            speed:
                0.001 +
                Math.random() * 0.001

        };


        textGroup.add(sp);

    }
);


/* =========================================================
   FOTOS
   ========================================================= */

const fotosBase =
    (
        Array.isArray(CONFIG.fotos) &&
        CONFIG.fotos.length
    )
        ? CONFIG.fotos
        : [];


function makePhotoSprite(
    url,
    size
) {

    const c =
        document.createElement('canvas');


    c.width =
        c.height =
        256;


    const tex =
        new THREE.CanvasTexture(c);


    const mat =
        new THREE.SpriteMaterial({
            map: tex,
            transparent: true
        });


    const sp =
        new THREE.Sprite(mat);


    sp.scale.set(
        size,
        size,
        1
    );


    const img =
        new Image();


    img.crossOrigin =
        'anonymous';


    img.onload = () => {

        const ctx =
            c.getContext('2d');


        ctx.clearRect(
            0,
            0,
            c.width,
            c.height
        );


        const s =
            Math.min(
                c.width / img.width,
                c.height / img.height
            );


        ctx.drawImage(

            img,

            (
                c.width -
                img.width * s
            ) / 2,

            (
                c.height -
                img.height * s
            ) / 2,

            img.width * s,

            img.height * s

        );


        tex.needsUpdate = true;


        const aspect =
            img.naturalWidth /
            img.naturalHeight;


        const aX =
            Math.min(
                1,
                aspect
            );


        const aY =
            Math.min(
                1,
                1 / aspect
            );


        sp.scale.set(
            size * aX,
            size * aY,
            1
        );

    };


    img.onerror = () => {

        console.warn(
            "No se pudo cargar la foto:",
            url
        );

    };


    img.src = url;


    return sp;

}


const photoGroup =
    new THREE.Group();


scene.add(photoGroup);


if (fotosBase.length > 0) {

    const PHOTO_COUNT = 26;


    for (
        let i = 0;
        i < PHOTO_COUNT;
        i++
    ) {

        const url =
            fotosBase[
                i % fotosBase.length
            ];


        const size =
            28 +
            Math.random() * 20;


        const sp =
            makePhotoSprite(
                url,
                size
            );


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        const theta =
            Math.random() *
            Math.PI *
            2;


        const r =
            140 +
            Math.random() * 170;


        sp.position.set(

            r *
            Math.sin(phi) *
            Math.cos(theta),

            r *
            Math.cos(phi),

            r *
            Math.sin(phi) *
            Math.sin(theta)

        );


        sp.userData = {

            phi,

            theta,

            radius: r,

            speed:
                0.0006 +
                Math.random() * 0.0012

        };


        photoGroup.add(sp);

    }

}


/* =========================================================
   CONTROLES
   ========================================================= */

let dragging = false;

let lastX = 0;

let lastY = 0;


function onDown(e) {

    dragging = true;


    const t =
        e.touches
            ? e.touches[0]
            : e;


    lastX =
        t.clientX;


    lastY =
        t.clientY;

}


function onMove(e) {

    if (!dragging) {
        return;
    }


    const t =
        e.touches
            ? e.touches[0]
            : e;


    const dx =
        (
            t.clientX -
            lastX
        ) /
        innerWidth;


    const dy =
        (
            t.clientY -
            lastY
        ) /
        innerHeight;


    rotY -=
        dx * 5;


    rotX =
        Math.max(
            -1.2,
            Math.min(
                1.2,
                rotX +
                dy * 3.5
            )
        );


    lastX =
        t.clientX;


    lastY =
        t.clientY;

}


function onUp() {

    dragging = false;

}


addEventListener(
    'mousedown',
    onDown
);


addEventListener(
    'mousemove',
    onMove
);


addEventListener(
    'mouseup',
    onUp
);


addEventListener(
    'touchstart',
    onDown,
    {
        passive: true
    }
);


addEventListener(
    'touchmove',
    onMove,
    {
        passive: true
    }
);


addEventListener(
    'touchend',
    onUp,
    {
        passive: true
    }
);


/* =========================================================
   ZOOM
   ========================================================= */

addEventListener(
    'wheel',
    (e) => {

        targetDist +=
            e.deltaY * 0.25;


        targetDist =
            Math.max(
                160,
                Math.min(
                    600,
                    targetDist
                )
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   ZOOM PELLIZCO
   ========================================================= */

let pinch = 0;


addEventListener(
    'touchmove',
    (e) => {

        if (
            e.touches &&
            e.touches.length === 2
        ) {

            e.preventDefault();


            const dx =
                e.touches[0].clientX -
                e.touches[1].clientX;


            const dy =
                e.touches[0].clientY -
                e.touches[1].clientY;


            const d =
                Math.hypot(
                    dx,
                    dy
                );


            if (pinch) {

                targetDist +=
                    (
                        pinch - d
                    ) * 0.5;


                targetDist =
                    Math.max(
                        160,
                        Math.min(
                            600,
                            targetDist
                        )
                    );

            }


            pinch = d;

        }

    },
    {
        passive: false
    }
);


addEventListener(
    'touchend',
    () => {

        pinch = 0;

    },
    {
        passive: true
    }
);


/* =========================================================
   ANIMACIÓN
   ========================================================= */

let t = 0;


function tick() {

    requestAnimationFrame(tick);


    t += 0.01;


    /*
     * Rotación del anillo.
     */

    ring.rotation.z += 0.003;


    /*
     * Animación del glow.
     */

    const glowScale =
        1 +
        Math.sin(t * 0.4) *
        0.03;


    glow.scale.set(

        GLOW_BASE *
            glowScale,

        GLOW_BASE *
            glowScale,

        1

    );


    /*
     * Respiración del núcleo.
     */

    const s =
        1.0 +
        0.05 *
        Math.sin(t * 3);


    core.scale.set(
        s,
        s,
        s
    );


    /*
     * Animar frases.
     */

    textGroup.children.forEach(
        (sp) => {

            sp.material.opacity =
                0.8 +
                0.2 *
                Math.sin(t * 2);


            sp.userData.theta +=
                sp.userData.speed;


            sp.position.x =
                sp.userData.radius *
                Math.sin(
                    sp.userData.phi
                ) *
                Math.cos(
                    sp.userData.theta
                );


            sp.position.z =
                sp.userData.radius *
                Math.sin(
                    sp.userData.phi
                ) *
                Math.sin(
                    sp.userData.theta
                );

        }
    );


    /*
     * Animar fotos.
     */

    photoGroup.children.forEach(
        (sp) => {

            sp.material.opacity =
                0.85 +
                0.15 *
                Math.sin(
                    t * 2 +
                    sp.userData.radius
                );


            sp.userData.theta +=
                sp.userData.speed;


            sp.position.x =
                sp.userData.radius *
                Math.sin(
                    sp.userData.phi
                ) *
                Math.cos(
                    sp.userData.theta
                );


            sp.position.z =
                sp.userData.radius *
                Math.sin(
                    sp.userData.phi
                ) *
                Math.sin(
                    sp.userData.theta
                );

        }
    );


    /*
     * Movimiento suave de cámara.
     */

    currentDist +=
        (
            targetDist -
            currentDist
        ) * 0.06;


    const cx =
        Math.cos(rotX);


    const sx =
        Math.sin(rotX);


    const cy =
        Math.cos(rotY);


    const sy =
        Math.sin(rotY);


    camera.position.set(

        currentDist *
        sy *
        cx,

        currentDist *
        sx,

        currentDist *
        cy *
        cx

    );


    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );

}


tick();


/* =========================================================
   RESIZE
   ========================================================= */

addEventListener(
    'resize',
    () => {

        renderer.setSize(
            innerWidth,
            innerHeight
        );


        camera.aspect =
            innerWidth /
            innerHeight;


        camera.updateProjectionMatrix();

    }
);
