/* =========================================================
   UNIVERSO DE FLORES AMARILLAS
   - Núcleo oscuro con anillo dorado tipo Saturno
   - 150 frases flotando en esfera 3D
   - Estrellas de fondo
   - Control: arrastrar, rueda, pellizco
   - Audio: reproducción directa mediante <audio>
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

let audioReady = false;
let unlocked = false;
let starting = false;


/* ---------- ESTADO INICIAL DEL BOTÓN ---------- */

startButton.textContent = "Cargando...";
startButton.classList.add('loading');


/* =========================================================
   CONFIGURAR AUDIO HTML
   ========================================================= */

audio.preload = 'auto';

audio.setAttribute(
    'playsinline',
    ''
);

audio.setAttribute(
    'webkit-playsinline',
    ''
);

audio.volume = VOLUMEN_FINAL;
audio.muted = false;


/*
 * Ya no utilizamos fetch() ni decodeAudioData().
 *
 * El elemento <audio> se encarga directamente de
 * descargar y reproducir el MP3.
 *
 * Esto evita descargar y procesar el mismo archivo
 * dos veces.
 */

audio.addEventListener(
    'canplay',
    () => {

        markReady();

    },
    {
        once: true
    }
);


audio.addEventListener(
    'error',
    () => {

        console.error(
            '❌ Error cargando la música:',
            audio.error
        );

        startButton.textContent =
            'Cargando...';

        startButton.classList.remove(
            'ready'
        );

        startButton.classList.add(
            'loading'
        );

    }
);


audio.load();


/* =========================================================
   MARCAR AUDIO COMO LISTO
   ========================================================= */

function markReady() {

    if (audioReady) {
        return;
    }

    audioReady = true;

    startButton.textContent =
        "🌻 Toca para entrar";

    startButton.classList.remove(
        'loading'
    );

    startButton.classList.add(
        'ready'
    );

    console.log(
        '✅ Música lista para reproducirse'
    );
}


/*
 * Si el navegador ya tiene suficientes datos cargados
 * antes de que se ejecute canplay, lo detectamos.
 */

if (
    audio.readyState >=
    HTMLMediaElement.HAVE_FUTURE_DATA
) {

    markReady();

}


/* =========================================================
   REPRODUCCIÓN MEDIANTE <AUDIO>
   ========================================================= */

async function playFromElement() {

    try {

        audio.muted = false;

        audio.volume =
            VOLUMEN_FINAL;

        /*
         * Comenzar desde el principio.
         */

        audio.currentTime = 0;


        /*
         * Reproducir directamente mediante
         * el elemento HTML <audio>.
         */

        const promise =
            audio.play();


        /*
         * En navegadores modernos play()
         * devuelve una Promise.
         */

        if (
            promise &&
            typeof promise.then === 'function'
        ) {

            await promise;

        }


        console.log(
            '🎵 Música iniciada mediante <audio>'
        );

        return true;

    }

    catch (error) {

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
     * Evitar dobles ejecuciones por
     * touch + click.
     */

    if (starting) {
        return;
    }

    starting = true;


    /*
     * Si todavía no hay suficientes datos
     * para reproducir, esperamos.
     */

    if (!audioReady) {

        console.log(
            '⏳ La música todavía está cargando...'
        );

        starting = false;

        return;

    }


    /*
     * El play() ocurre como consecuencia
     * directa de la interacción del usuario.
     *
     * Esto es importante para las políticas
     * de reproducción automática de los navegadores.
     */

    const reproduced =
        await playFromElement();


    /*
     * Si no se pudo reproducir,
     * mantenemos la pantalla inicial.
     */

    if (!reproduced) {

        console.warn(
            '⚠️ No se pudo iniciar la música.'
        );

        startScreen.style.display =
            'flex';

        startScreen.classList.remove(
            'hidden'
        );

        starting = false;

        return;

    }


    /*
     * La música comenzó correctamente.
     *
     * Ahora ocultamos la pantalla inicial.
     */

    startScreen.classList.add(
        'hidden'
    );


    setTimeout(
        () => {

            startScreen.style.display =
                'none';

        },
        900
    );


    unlocked = true;

}


/* =========================================================
   EVENTOS DEL BOTÓN DE INICIO
   ========================================================= */


/*
 * Computadora.
 */

startScreen.addEventListener(
    'click',
    startExperience
);


/*
 * Teléfonos y tablets.
 */

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
            size * 0.05,
            size / 2,
            size / 2,
            size * 0.5
        );


    grad.addColorStop(
        0,
        `rgba(${c1},0.55)`
    );


    grad.addColorStop(
        0.5,
        `rgba(${c2},0.25)`
    );


    grad.addColorStop(
        1,
        'rgba(0,0,0,0)'
    );


    g.fillStyle = grad;


    g.fillRect(
        0,
        0,
        size,
        size
    );


    return new THREE.CanvasTexture(c);

}


const glow =
    new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: makeGlow(),
            transparent: true,
            depthWrite: false
        })
    );


glow.scale.set(
    GLOW_BASE,
    GLOW_BASE,
    1
);


scene.add(glow);


/* =========================================================
   ANILLO
   ========================================================= */

function ringTexture(
    size = 1024
) {

    const c =
        document.createElement('canvas');


    c.width =
        c.height =
        size;


    const g =
        c.getContext('2d');


    g.translate(
        size / 2,
        size / 2
    );


    const rInner =
        size * 0.205;


    const rOuter =
        size * 0.49;


    const grd =
        g.createRadialGradient(
            0,
            0,
            rInner,
            0,
            0,
            rOuter
        );


    grd.addColorStop(
        0.00,
        'rgba(255,255,245,1)'
    );


    grd.addColorStop(
        0.30,
        'rgba(255,235,120,1)'
    );


    grd.addColorStop(
        0.65,
        'rgba(255,200,40,0.95)'
    );


    grd.addColorStop(
        1.00,
        'rgba(255,160,0,0.85)'
    );


    g.fillStyle = grd;


    g.beginPath();


    g.arc(
        0,
        0,
        rOuter,
        0,
        Math.PI * 2
    );


    g.arc(
        0,
        0,
        rInner,
        0,
        Math.PI * 2,
        true
    );


    g.closePath();


    g.fill();


    const bandCount = 26;


    for (
        let i = 0;
        i < bandCount;
        i++
    ) {

        const r =
            rInner +
            (
                rOuter -
                rInner
            ) *
            (
                i /
                (bandCount - 1)
            );


        const dark =
            i % 3 === 0;


        g.beginPath();


        g.arc(
            0,
            0,
            r,
            0,
            Math.PI * 2
        );


        g.strokeStyle =
            dark
                ? 'rgba(255,190,30,0.18)'
                : 'rgba(255,255,220,0.12)';


        g.lineWidth =
            size * 0.008;


        g.stroke();

    }


    return new THREE.CanvasTexture(c);

}


const ring =
    new THREE.Mesh(

        new THREE.RingGeometry(
            58,
            140,
            256
        ),

        new THREE.MeshBasicMaterial({
            map: ringTexture(),
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })

    );


ring.rotation.x =
    Math.PI * 0.35;


ring.rotation.z =
    Math.PI * 0.08;


scene.add(ring);


/* =========================================================
   FLORES
   ========================================================= */

function makeFlower(
    radius = 3,
    petals = 12
) {

    const group =
        new THREE.Group();


    const petalMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffd83d,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });


    const centerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x6b3d00
        });


    for (
        let i = 0;
        i < petals;
        i++
    ) {

        const angle =
            (
                i /
                petals
            ) *
            Math.PI *
            2;


        const petal =
            new THREE.Mesh(

                new THREE.CircleGeometry(
                    radius * 0.45,
                    16
                ),

                petalMaterial

            );


        petal.position.x =
            Math.cos(angle) *
            radius *
            0.4;


        petal.position.y =
            Math.sin(angle) *
            radius *
            0.4;


        petal.rotation.z =
            angle;


        group.add(petal);

    }


    const center =
        new THREE.Mesh(
            new THREE.CircleGeometry(
                radius * 0.3,
                24
            ),
            centerMaterial
        );


    center.position.z =
        0.02;


    group.add(center);


    return group;

}


/* =========================================================
   FLORES ALREDEDOR DEL NÚCLEO
   ========================================================= */

const flowerGroup =
    new THREE.Group();


const flowerCount = 40;


for (
    let i = 0;
    i < flowerCount;
    i++
) {

    const flower =
        makeFlower(
            4 +
            Math.random() * 3
        );


    const theta =
        Math.random() *
        Math.PI *
        2;


    const phi =
        Math.acos(
            2 * Math.random() - 1
        );


    const radius =
        65 +
        Math.random() * 45;


    flower.position.set(

        radius *
        Math.sin(phi) *
        Math.cos(theta),

        radius *
        Math.cos(phi),

        radius *
        Math.sin(phi) *
        Math.sin(theta)

    );


    flower.scale.setScalar(
        0.5 +
        Math.random() * 0.9
    );


    flower.rotation.x =
        Math.random() *
        Math.PI;


    flower.rotation.y =
        Math.random() *
        Math.PI;


    flower.rotation.z =
        Math.random() *
        Math.PI;


    flowerGroup.add(flower);

}


scene.add(flowerGroup);


/* =========================================================
   FRASES
   ========================================================= */

function createTextSprite(
    text
) {

    const canvas =
        document.createElement('canvas');


    const context =
        canvas.getContext('2d');


    const fontSize = 42;


    context.font =
        `${fontSize}px "Cormorant Garamond", serif`;


    const metrics =
        context.measureText(text);


    canvas.width =
        Math.ceil(
            metrics.width + 60
        );


    canvas.height = 80;


    context.font =
        `${fontSize}px "Cormorant Garamond", serif`;


    context.fillStyle =
        'rgba(255,245,180,0.95)';


    context.textAlign =
        'center';


    context.textBaseline =
        'middle';


    context.shadowColor =
        'rgba(255,190,40,0.8)';


    context.shadowBlur = 10;


    context.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.minFilter =
        THREE.LinearFilter;


    texture.magFilter =
        THREE.LinearFilter;


    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });


    const sprite =
        new THREE.Sprite(material);


    const scale =
        0.18;


    sprite.scale.set(
        canvas.width * scale,
        canvas.height * scale,
        1
    );


    return sprite;

}


/* =========================================================
   DISTRIBUIR FRASES EN ESFERA
   ========================================================= */

const phraseGroup =
    new THREE.Group();


const PHRASE_RADIUS = 180;


CONFIG.frases.forEach(
    (text, index) => {

        const sprite =
            createTextSprite(text);


        const phi =
            Math.acos(
                1 -
                2 *
                (
                    index + 0.5
                ) /
                CONFIG.frases.length
            );


        const theta =
            Math.PI *
            (
                1 +
                Math.sqrt(5)
            ) *
            index;


        sprite.position.set(

            PHRASE_RADIUS *
            Math.sin(phi) *
            Math.cos(theta),

            PHRASE_RADIUS *
            Math.cos(phi),

            PHRASE_RADIUS *
            Math.sin(phi) *
            Math.sin(theta)

        );


        sprite.userData = {

            radius:
                PHRASE_RADIUS,

            phi,
            theta

        };


        phraseGroup.add(sprite);

    }
);


scene.add(phraseGroup);


/* =========================================================
   CONTROLES
   ========================================================= */

let dragging = false;

let previousX = 0;

let previousY = 0;

let pinchDistance = null;


/* ---------- RATÓN ---------- */

canvas.addEventListener(
    'pointerdown',
    (event) => {

        dragging = true;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

        canvas.setPointerCapture(
            event.pointerId
        );

    }
);


canvas.addEventListener(
    'pointermove',
    (event) => {

        if (!dragging) {
            return;
        }


        const dx =
            event.clientX -
            previousX;


        const dy =
            event.clientY -
            previousY;


        previousX =
            event.clientX;

        previousY =
            event.clientY;


        rotY +=
            dx * 0.005;


        rotX +=
            dy * 0.005;


        rotX =
            Math.max(
                -1.4,
                Math.min(
                    1.4,
                    rotX
                )
            );

    }
);


canvas.addEventListener(
    'pointerup',
    (event) => {

        dragging = false;

        try {

            canvas.releasePointerCapture(
                event.pointerId
            );

        } catch (e) {
            // Sin acción.
        }

    }
);


canvas.addEventListener(
    'pointercancel',
    () => {

        dragging = false;

    }
);


/* ---------- RUEDA ---------- */

canvas.addEventListener(
    'wheel',
    (event) => {

        event.preventDefault();


        targetDist +=
            event.deltaY *
            0.35;


        targetDist =
            Math.max(
                150,
                Math.min(
                    600,
                    targetDist
                )
            );

    },
    {
        passive: false
    }
);


/* =========================================================
   PELLIZCO
   ========================================================= */

canvas.addEventListener(
    'touchstart',
    (event) => {

        if (
            event.touches.length === 2
        ) {

            pinchDistance =
                getPinchDistance(
                    event.touches
                );

        }

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    'touchmove',
    (event) => {

        if (
            event.touches.length !== 2
        ) {

            return;

        }


        event.preventDefault();


        const current =
            getPinchDistance(
                event.touches
            );


        if (
            pinchDistance !== null
        ) {

            const delta =
                pinchDistance -
                current;


            targetDist +=
                delta *
                0.8;


            targetDist =
                Math.max(
                    150,
                    Math.min(
                        600,
                        targetDist
                    )
                );

        }


        pinchDistance =
            current;

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    'touchend',
    () => {

        pinchDistance = null;

    }
);


function getPinchDistance(
    touches
) {

    const dx =
        touches[0].clientX -
        touches[1].clientX;


    const dy =
        touches[0].clientY -
        touches[1].clientY;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================================================
   ANIMACIÓN
   ========================================================= */

const clock =
    new THREE.Clock();


function tick() {

    requestAnimationFrame(
        tick
    );


    const elapsed =
        clock.getElapsedTime();


    /*
     * Rotación suave del universo.
     */

    phraseGroup.rotation.y =
        elapsed * 0.025;


    flowerGroup.rotation.y =
        elapsed * 0.015;


    ring.rotation.z =
        Math.PI * 0.08 +
        Math.sin(
            elapsed * 0.2
        ) * 0.015;


    /*
     * Movimiento suave de las flores.
     */

    flowerGroup.children.forEach(
        (flower, index) => {

            flower.position.y +=
                Math.sin(
                    elapsed * 0.8 +
                    index
                ) *
                0.01;

        }
    );


    /*
     * Movimiento de las frases.
     */

    phraseGroup.children.forEach(
        (sp, index) => {

            const t =
                elapsed *
                0.3 +
                index *
                0.15;


            const basePhi =
                sp.userData.phi;


            const baseTheta =
                sp.userData.theta;


            const radius =
                sp.userData.radius;


            const phi =
                basePhi +
                Math.sin(t) *
                0.02;


            const theta =
                baseTheta +
                Math.sin(
                    t * 0.7
                ) *
                0.02;


            sp.position.x =
                radius *
                Math.sin(phi) *
                Math.cos(theta);


            sp.position.y =
                radius *
                Math.cos(phi);


            sp.position.z =
                radius *
                Math.sin(phi) *
                Math.sin(theta);

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
