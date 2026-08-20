'use strict';

const SURPRISE_CONFIG = {
    occasionText: "Happy Birthday, ya albee! 🎂",
    partnerName: "sibaa 💖",
    senderName: "amer ✍️",

    message:
        "I love you so much, ya albee. ❤️ You make every day happier and more special just by being you. I'm so lucky to have you in my life. Happy Birthday, ya 3umree! 💕",

    /*
     * Later, put your MP3 filename here.
     * Example:
     *
     * song: "./birthday-song.mp3"
     */
    song: ""
};

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const partnerNameEl =
        document.getElementById('partnerName');

    const senderNameEl =
        document.getElementById('senderName');

    const occasionTextEl =
        document.getElementById('occasionText');

    const customMessageEl =
        document.getElementById('customMessage');

    const giftBox =
        document.getElementById('giftBox');

    const giftBoxContainer =
        document.getElementById('giftBoxContainer');

    const memoryCard =
        document.getElementById('memoryCard');

    const bgParticles =
        document.getElementById('bgParticles');

    const skipTypingBtn =
        document.getElementById('skipTypingBtn');

    const canvas =
        document.getElementById('balloonCanvas');

    const ctx =
        canvas.getContext('2d');

    const musicIndicator =
        document.getElementById('musicIndicator');

    const birthdaySong =
        document.getElementById('birthdaySong');

    const finalSurprise =
        document.getElementById('finalSurprise');

    const finalHeartButton =
        document.getElementById('finalHeartButton');

    const finalMessage =
        document.getElementById('finalMessage');

    const envelopeOverlay =
        document.getElementById('envelopeOverlay');

    const closeOverlayBtn =
        document.getElementById('closeOverlayBtn');

    const openEnvelopeBtn =
        document.getElementById('openEnvelopeBtn');

    const popupEnvelope =
        document.getElementById('popupEnvelope');

    const letterProgress =
        document.getElementById('letterProgress');

    /* =========================================
       CONFIG TEXT
    ========================================= */

    occasionTextEl.innerText =
        SURPRISE_CONFIG.occasionText;

    partnerNameEl.innerText =
        SURPRISE_CONFIG.partnerName;

    senderNameEl.innerText =
        SURPRISE_CONFIG.senderName;

    customMessageEl.innerText =
        SURPRISE_CONFIG.message;

    /* =========================================
       STATE
    ========================================= */

    let closedLetters = 0;
    let finalSequenceStarted = false;
    let isDrawingBalloons = false;
    let audioCtx = null;

    let balloons = [];
    let popParticles = [];
    let trailParticles = [];
    let heartSparks = [];

    let zIndexCounter = 300;

    /* =========================================
       AUDIO
    ========================================= */

    function initAudio() {

        if (!audioCtx) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {
                return;
            }

            audioCtx =
                new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playChime() {

        initAudio();

        if (!audioCtx) {
            return;
        }

        const now =
            audioCtx.currentTime;

        const notes = [
            523.25,
            659.25,
            783.99,
            987.77,
            1046.50,
            1318.51
        ];

        notes.forEach((freq, i) => {

            const osc =
                audioCtx.createOscillator();

            const gain =
                audioCtx.createGain();

            const delay =
                i * 0.08;

            osc.type = 'sine';

            osc.frequency.setValueAtTime(
                freq,
                now + delay
            );

            gain.gain.setValueAtTime(
                0,
                now + delay
            );

            gain.gain.linearRampToValueAtTime(
                0.13,
                now + delay + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + delay + 0.5
            );

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.6);
        });
    }

    function playPop() {

        initAudio();

        if (!audioCtx) {
            return;
        }

        const now =
            audioCtx.currentTime;

        const osc =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        osc.type = 'triangle';

        osc.frequency.setValueAtTime(
            300,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            80,
            now + 0.08
        );

        gain.gain.setValueAtTime(
            0.25,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.08
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /* =========================================
       OPTIONAL SONG
    ========================================= */

    function setupSong() {

        if (!SURPRISE_CONFIG.song) {
            return;
        }

        birthdaySong.src =
            SURPRISE_CONFIG.song;
    }

    async function startSong() {

        if (!birthdaySong.src) {
            return;
        }

        try {

            await birthdaySong.play();

            musicIndicator.classList.add(
                'visible'
            );

        } catch (error) {

            console.warn(
                'Music could not start:',
                error
            );

            musicIndicator.classList.remove(
                'visible'
            );
        }
    }

    setupSong();

    /* =========================================
       BACKGROUND PARTICLES
    ========================================= */

    function initBackground() {

        const particleCount = 22;

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            createParticle(true);
        }

        setInterval(
            () => createParticle(false),
            1400
        );
    }

    function createParticle(initial = false) {

        const p =
            document.createElement('div');

        p.classList.add('particle');

        const size =
            Math.random() * 7 + 3;

        p.style.width =
            `${size}px`;

        p.style.height =
            `${size}px`;

        p.style.left =
            `${Math.random() * 100}%`;

        p.style.bottom =
            initial
                ? `${Math.random() * 100}%`
                : '-20px';

        const duration =
            Math.random() * 7 + 8;

        const delay =
            Math.random() * 4;

        p.style.animationDuration =
            `${duration}s`;

        p.style.animationDelay =
            `${delay}s`;

        const isPink =
            Math.random() > .5;

        p.style.background =
            isPink
                ? 'rgba(255,51,119,.22)'
                : 'rgba(255,183,3,.18)';

        p.style.boxShadow =
            isPink
                ? '0 0 12px rgba(255,51,119,.35)'
                : '0 0 12px rgba(255,183,3,.3)';

        bgParticles.appendChild(p);

        setTimeout(
            () => p.remove(),
            (duration + delay) * 1000
        );
    }

    /* =========================================
       CANVAS
    ========================================= */

    function resizeCanvas() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;

        canvas.style.width =
            `${window.innerWidth}px`;

        canvas.style.height =
            `${window.innerHeight}px`;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }

    window.addEventListener(
        'resize',
        resizeCanvas
    );

    resizeCanvas();

    /* =========================================
       IMAGES
    ========================================= */

    const imageSources = [
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513272795190-0b7c527757ed?w=300&auto=format&fit=crop&q=80"
    ];

    const loadedImages = [];

    imageSources.forEach(src => {

        const img =
            new Image();

        img.crossOrigin =
            "anonymous";

        img.src =
            src;

        loadedImages.push(img);
    });

    /* =========================================
       BALLOON
    ========================================= */

    class Balloon {

        constructor(x, y) {

            this.x = x;
            this.y = y;

            this.type =
                Math.random() > .7
                    ? 'polaroid'
                    : 'balloon';

            this.vy =
                -(Math.random() * 1.5 + 1.2);

            this.swaySpeed =
                Math.random() * .018 + .01;

            this.swayAmount =
                Math.random() * 15 + 10;

            this.swayOffset =
                Math.random() *
                Math.PI *
                2;

            this.time = 0;

            if (
                this.type ===
                'balloon'
            ) {

                this.radiusX =
                    Math.random() * 10 + 22;

                this.radiusY =
                    this.radiusX * 1.25;

                const hues = [
                    340,
                    350,
                    20,
                    200,
                    275,
                    45
                ];

                this.hue =
                    hues[
                        Math.floor(
                            Math.random() *
                            hues.length
                        )
                    ];

                this.color =
                    `hsla(${this.hue},95%,60%,.85)`;

                this.glow =
                    `hsla(${this.hue},95%,60%,.45)`;

                this.stringLength =
                    Math.random() * 40 + 60;

            } else {

                this.width = 66;
                this.height = 78;

                this.rotation =
                    (Math.random() - .5) * .3;

                this.rotSpeed =
                    (Math.random() - .5) * .025;

                this.img =
                    loadedImages[
                        Math.floor(
                            Math.random() *
                            loadedImages.length
                        )
                    ];
            }
        }

        update() {

            this.time +=
                this.swaySpeed;

            this.y +=
                this.vy;

            this.currentX =
                this.x +
                Math.sin(
                    this.time +
                    this.swayOffset
                ) *
                this.swayAmount;

            if (
                this.type ===
                'polaroid'
            ) {

                this.rotation +=
                    this.rotSpeed;
            }
        }

        draw() {

            if (
                this.type ===
                'balloon'
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    this.currentX,
                    this.y + this.radiusY
                );

                ctx.bezierCurveTo(
                    this.currentX - 5,
                    this.y +
                    this.radiusY +
                    this.stringLength / 3,

                    this.currentX + 5,
                    this.y +
                    this.radiusY +
                    (this.stringLength / 3) * 2,

                    this.currentX,
                    this.y +
                    this.radiusY +
                    this.stringLength
                );

                ctx.strokeStyle =
                    'rgba(163,149,190,.35)';

                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.save();

                ctx.shadowColor =
                    this.glow;

                ctx.shadowBlur = 15;

                ctx.fillStyle =
                    this.color;

                ctx.beginPath();

                ctx.ellipse(
                    this.currentX,
                    this.y,
                    this.radiusX,
                    this.radiusY,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.beginPath();

                ctx.ellipse(
                    this.currentX -
                    this.radiusX / 3,

                    this.y -
                    this.radiusY / 3,

                    this.radiusX / 4,

                    this.radiusY / 4,

                    -Math.PI / 6,

                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    'rgba(255,255,255,.35)';

                ctx.fill();

                ctx.beginPath();

                ctx.moveTo(
                    this.currentX,
                    this.y + this.radiusY
                );

                ctx.lineTo(
                    this.currentX - 6,
                    this.y +
                    this.radiusY + 6
                );

                ctx.lineTo(
                    this.currentX + 6,
                    this.y +
                    this.radiusY + 6
                );

                ctx.closePath();

                ctx.fillStyle =
                    this.color;

                ctx.fill();

                ctx.restore();

            } else {

                ctx.save();

                ctx.translate(
                    this.currentX,
                    this.y
                );

                ctx.rotate(
                    this.rotation
                );

                ctx.shadowColor =
                    'rgba(0,0,0,.35)';

                ctx.shadowBlur = 12;
                ctx.shadowOffsetY = 4;

                ctx.fillStyle =
                    '#fff';

                ctx.fillRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );

                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                if (
                    this.img &&
                    this.img.complete &&
                    this.img.naturalWidth !== 0
                ) {

                    ctx.drawImage(
                        this.img,
                        -this.width / 2 + 4,
                        -this.height / 2 + 4,
                        this.width - 8,
                        this.width - 16
                    );

                } else {

                    ctx.fillStyle =
                        '#1b0a2a';

                    ctx.fillRect(
                        -this.width / 2 + 4,
                        -this.height / 2 + 4,
                        this.width - 8,
                        this.width - 16
                    );
                }

                ctx.fillStyle =
                    '#ff3377';

                const hx = 0;

                const hy =
                    this.height / 2 - 6;

                const hs = 3.5;

                ctx.beginPath();

                ctx.moveTo(
                    hx,
                    hy - hs / 4
                );

                ctx.quadraticCurveTo(
                    hx - hs / 2,
                    hy - hs * .8,
                    hx - hs,
                    hy - hs / 4
                );

                ctx.quadraticCurveTo(
                    hx - hs,
                    hy + hs / 3,
                    hx,
                    hy + hs * .95
                );

                ctx.quadraticCurveTo(
                    hx + hs,
                    hy + hs / 3,
                    hx + hs,
                    hy - hs / 4
                );

                ctx.quadraticCurveTo(
                    hx + hs / 2,
                    hy - hs * .8,
                    hx,
                    hy - hs / 4
                );

                ctx.closePath();

                ctx.fill();

                ctx.restore();
            }
        }

        isClicked(mx, my) {

            if (
                this.type ===
                'balloon'
            ) {

                const dx =
                    mx - this.currentX;

                const dy =
                    my - this.y;

                return (
                    (dx * dx) /
                    (this.radiusX *
                     this.radiusX) +

                    (dy * dy) /
                    (this.radiusY *
                     this.radiusY)
                ) <= 1;

            } else {

                const dx =
                    mx - this.currentX;

                const dy =
                    my - this.y;

                return (
                    Math.abs(dx) <=
                    this.width / 2 &&

                    Math.abs(dy) <=
                    this.height / 2
                );
            }
        }
    }

    /* =========================================
       PARTICLES
    ========================================= */

    class PopParticle {

        constructor(x, y, hue) {

            this.x = x;
            this.y = y;

            const angle =
                Math.random() *
                Math.PI * 2;

            const speed =
                Math.random() * 6 + 2;

            this.vx =
                Math.cos(angle) * speed;

            this.vy =
                Math.sin(angle) * speed;

            this.size =
                Math.random() * 3 + 2;

            this.hue =
                hue;

            this.opacity = 1;

            this.gravity = .08;

            this.fadeSpeed =
                Math.random() * .02 + .02;
        }

        update() {

            this.vy +=
                this.gravity;

            this.x +=
                this.vx;

            this.y +=
                this.vy;

            this.opacity -=
                this.fadeSpeed;
        }

        draw() {

            ctx.fillStyle =
                `hsla(${this.hue},95%,60%,${this.opacity})`;

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    class TrailParticle {

        constructor(x, y) {

            this.x = x;
            this.y = y;

            this.vx =
                (Math.random() - .5) * 1.5;

            this.vy =
                -(Math.random() * 1.2 + .6);

            this.size =
                Math.random() * 3 + 2;

            this.opacity = 1;

            this.fade =
                Math.random() * .015 + .015;

            this.hue =
                Math.random() > .5
                    ? 340
                    : 45;
        }

        update() {

            this.x +=
                this.vx;

            this.y +=
                this.vy;

            this.opacity -=
                this.fade;
        }

        draw() {

            ctx.save();

            ctx.fillStyle =
                `hsla(${this.hue},95%,65%,${this.opacity})`;

            ctx.shadowColor =
                `hsla(${this.hue},95%,65%,.45)`;

            ctx.shadowBlur = 6;

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }

    /* =========================================
       ANIMATION LOOP
    ========================================= */

    function animateBalloons() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        /* Heart sparks */

        for (
            let i = heartSparks.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                heartSparks[i];

            p.vx *= .98;
            p.vy *= .98;
            p.vy += .05;

            p.x += p.vx;
            p.y += p.vy;

            p.opacity -= p.fade;

            ctx.save();

            ctx.globalAlpha =
                p.opacity;

            ctx.fillStyle =
                `hsla(${p.hue},95%,65%,${p.opacity})`;

            ctx.shadowColor =
                `hsla(${p.hue},95%,65%,.45)`;

            ctx.shadowBlur = 10;

            drawHeart(
                ctx,
                p.x,
                p.y,
                p.size
            );

            ctx.restore();

            if (p.opacity <= 0) {
                heartSparks.splice(i, 1);
            }
        }

        /* Trail */

        for (
            let i = trailParticles.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                trailParticles[i];

            p.update();
            p.draw();

            if (p.opacity <= 0) {
                trailParticles.splice(i, 1);
            }
        }

        /* Pop */

        for (
            let i = popParticles.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                popParticles[i];

            p.update();
            p.draw();

            if (p.opacity <= 0) {
                popParticles.splice(i, 1);
            }
        }

        /* Balloons */

        for (
            let i = balloons.length - 1;
            i >= 0;
            i--
        ) {

            const b =
                balloons[i];

            b.update();
            b.draw();

            const limit =
                b.type === 'balloon'
                    ? b.radiusY * 2
                    : b.height * 2;

            if (b.y < -limit) {
                balloons.splice(i, 1);
            }
        }

        if (
            balloons.length ||
            popParticles.length ||
            trailParticles.length ||
            heartSparks.length
        ) {

            requestAnimationFrame(
                animateBalloons
            );

        } else {

            isDrawingBalloons =
                false;

            canvas.style.pointerEvents =
                'none';
        }
    }

    function drawHeart(
        context,
        x,
        y,
        size
    ) {

        context.beginPath();

        context.moveTo(
            x,
            y + size * .8
        );

        context.bezierCurveTo(
            x - size * 1.1,
            y + size * .1,
            x - size,
            y - size * .7,
            x - size * .4,
            y - size * .7
        );

        context.bezierCurveTo(
            x,
            y - size * .7,
            x,
            y - size * .2,
            x,
            y - size * .2
        );

        context.bezierCurveTo(
            x,
            y - size * .2,
            x,
            y - size * .7,
            x + size * .4,
            y - size * .7
        );

        context.bezierCurveTo(
            x + size,
            y - size * .7,
            x + size * 1.1,
            y + size * .1,
            x,
            y + size * .8
        );

        context.fill();
    }

    /* =========================================
       SPAWN BALLOONS
    ========================================= */

    function spawnBalloons() {

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            setTimeout(
                () => {

                    if (
                        giftBox.classList.contains(
                            'open'
                        )
                    ) {

                        const spawnX =
                            Math.random() *
                            Math.max(
                                1,
                                window.innerWidth - 100
                            ) + 50;

                        balloons.push(
                            new Balloon(
                                spawnX,
                                window.innerHeight + 80
                            )
                        );
                    }

                },
                i * 135
            );
        }

        if (!isDrawingBalloons) {

            isDrawingBalloons =
                true;

            animateBalloons();
        }
    }

    /* =========================================
       HEART FIREWORKS
    ========================================= */

    function spawnHeartFireworks(
        x,
        y,
        amount = 80
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI * 2;

            const speed =
                Math.random() * 7 + 3;

            heartSparks.push({

                x,
                y,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed -
                    1.5,

                size:
                    Math.random() * 7 + 4,

                opacity: 1,

                fade:
                    Math.random() *
                    .015 + .01,

                hue:
                    Math.random() > .5
                        ? 340
                        : 355
            });
        }

        if (!isDrawingBalloons) {

            isDrawingBalloons =
                true;

            animateBalloons();
        }
    }

    /* =========================================
       BALLOON CLICK
    ========================================= */

    canvas.addEventListener(
        'click',
        e => {

            for (
                let i = balloons.length - 1;
                i >= 0;
                i--
            ) {

                const balloon =
                    balloons[i];

                if (
                    balloon.isClicked(
                        e.clientX,
                        e.clientY
                    )
                ) {

                    playPop();

                    const hue =
                        balloon.hue ||
                        340;

                    for (
                        let k = 0;
                        k < 14;
                        k++
                    ) {

                        popParticles.push(
                            new PopParticle(
                                balloon.currentX,
                                balloon.y,
                                hue
                            )
                        );
                    }

                    balloons.splice(
                        i,
                        1
                    );

                    break;
                }
            }
        }
    );

    /* =========================================
       CURSOR TRAIL
    ========================================= */

    let lastTrailTime = 0;

    function addTrail(x, y) {

        const now =
            performance.now();

        if (
            now - lastTrailTime < 35
        ) {
            return;
        }

        lastTrailTime = now;

        for (
            let i = 0;
            i < 2;
            i++
        ) {

            trailParticles.push(
                new TrailParticle(
                    x,
                    y
                )
            );
        }

        if (!isDrawingBalloons) {

            isDrawingBalloons =
                true;

            animateBalloons();
        }
    }

    document.addEventListener(
        'mousemove',
        e => {

            if (
                window.matchMedia(
                    '(pointer:fine)'
                ).matches
            ) {

                addTrail(
                    e.clientX,
                    e.clientY
                );
            }
        }
    );

    /* =========================================
       DOUBLE CLICK HEARTS
    ========================================= */

    document.addEventListener(
        'dblclick',
        e => {

            if (
                memoryCard.classList.contains(
                    'hidden'
                )
            ) {
                return;
            }

            spawnHeartFireworks(
                e.clientX,
                e.clientY,
                14
            );

            playPop();
        }
    );

    /* =========================================
       CARD TILT
    ========================================= */

    const finePointer =
        window.matchMedia(
            '(pointer:fine)'
        );

    if (finePointer.matches) {

        document.addEventListener(
            'mousemove',
            e => {

                if (
                    memoryCard.classList.contains(
                        'hidden'
                    )
                ) {
                    return;
                }

                const halfWidth =
                    window.innerWidth / 2;

                const halfHeight =
                    window.innerHeight / 2;

                const rotateX =
                    -(e.clientY - halfHeight) /
                    halfHeight *
                    4;

                const rotateY =
                    (e.clientX - halfWidth) /
                    halfWidth *
                    4;

                memoryCard.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        );

        document.addEventListener(
            'mouseleave',
            () => {

                if (
                    !memoryCard.classList.contains(
                        'hidden'
                    )
                ) {

                    memoryCard.style.transform =
                        'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                }
            }
        );
    }

    /* =========================================
       TYPING
    ========================================= */

    function typeMessage() {

        const text =
            SURPRISE_CONFIG.message;

        customMessageEl.innerText =
            "";

        customMessageEl.style.opacity =
            "1";

        customMessageEl.classList.add(
            'fade-in'
        );

        const cursor =
            document.createElement(
                'span'
            );

        cursor.classList.add(
            'typing-cursor'
        );

        cursor.innerText =
            "|";

        customMessageEl.appendChild(
            cursor
        );

        let i = 0;
        let typingActive = true;

        skipTypingBtn.classList.remove(
            'show'
        );

        setTimeout(
            () => {

                skipTypingBtn.classList.add(
                    'show'
                );

            },
            500
        );

        function type() {

            if (!typingActive) {
                return;
            }

            if (i < text.length) {

                cursor.before(
                    document.createTextNode(
                        text.charAt(i)
                    )
                );

                i++;

                const char =
                    text.charAt(i - 1);

                let delay = 45;

                if (
                    char === '.' ||
                    char === '!' ||
                    char === '?'
                ) {
                    delay = 550;
                }

                if (char === ',') {
                    delay = 230;
                }

                setTimeout(
                    type,
                    delay
                );

            } else {

                cursor.remove();
            }
        }

        skipTypingBtn.onclick = () => {

            if (!typingActive) {
                return;
            }

            typingActive =
                false;

            cursor.before(
                document.createTextNode(
                    text.substring(i)
                )
            );

            cursor.remove();

            playPop();

            spawnHeartFireworks(
                window.innerWidth / 2,
                window.innerHeight / 2,
                18
            );

            openEnvelopeOverlay();
        };

        type();
    }

    /* =========================================
       GIFT OPEN
    ========================================= */

    let giftOpened = false;

    function openGift() {

        if (giftOpened) {
            return;
        }

        giftOpened = true;

        initAudio();
        playChime();

        startSong();

        musicIndicator.classList.add(
            'visible'
        );

        giftBox.classList.add(
            'open'
        );

        const boxGlow =
            document.getElementById(
                'boxGlow'
            );

        boxGlow.classList.add(
            'active'
        );

        canvas.style.pointerEvents =
            'auto';

        spawnHeartFireworks(
            window.innerWidth / 2,
            window.innerHeight / 2,
            70
        );

        spawnBalloons();

        setTimeout(
            () => {

                giftBoxContainer.classList.add(
                    'fade-out'
                );

            },
            850
        );

        setTimeout(
            () => {

                giftBoxContainer.style.display =
                    'none';

                memoryCard.style.display =
                    'block';

                void memoryCard.offsetHeight;

                memoryCard.classList.remove(
                    'hidden'
                );

                memoryCard.classList.add(
                    'entering'
                );

                setTimeout(
                    typeMessage,
                    450
                );

            },
            1250
        );
    }

    giftBoxContainer.addEventListener(
        'click',
        openGift
    );

    giftBox.addEventListener(
        'keydown',
        e => {

            if (
                e.key === 'Enter' ||
                e.key === ' '
            ) {

                e.preventDefault();

                openGift();
            }
        }
    );

    /* =========================================
       ENVELOPE
    ========================================= */

    function openEnvelopeOverlay() {

        envelopeOverlay.classList.remove(
            'hidden'
        );

        void envelopeOverlay.offsetHeight;

        envelopeOverlay.classList.add(
            'show'
        );

        popupEnvelope.classList.remove(
            'active'
        );

        openEnvelopeBtn.style.opacity =
            '1';

        openEnvelopeBtn.style.pointerEvents =
            'auto';

        const draggableLetters =
            document.querySelectorAll(
                '.draggable-item'
            );

        draggableLetters.forEach(
            (item, index) => {

                item.dataset.closed =
                    'false';

                item.style.display =
                    'flex';

                item.style.opacity =
                    '0';

                item.style.transform =
                    'translate(-50%, -50%) scale(.1) translateY(120px)';

                item.style.left =
                    '50%';

                item.style.top =
                    '35%';

                item.style.zIndex =
                    '1';

                item.style.pointerEvents =
                    'auto';

                item.dataset.index =
                    index;
            }
        );

        closedLetters = 0;
        finalSequenceStarted = false;

        updateLetterProgress();
    }

    function openEnvelope() {

        popupEnvelope.classList.add(
            'active'
        );

        playChime();

        const letters =
            document.querySelectorAll(
                '.draggable-item'
            );

        const fanOffsets =
            getFanOffsets();

        letters.forEach(
            (item, index) => {

                const offset =
                    fanOffsets[index];

                setTimeout(
                    () => {

                        item.style.opacity =
                            '1';

                        item.style.transform =
                            `translate(calc(-50% + ${offset.dx}px), calc(-50% + ${offset.dy}px)) scale(1) rotate(${offset.rot}deg)`;

                    },
                    350 +
                    index * 220
                );
            }
        );
    }

    function getFanOffsets() {

        if (
            window.innerWidth < 500
        ) {

            return [
                {
                    dx: -45,
                    dy: -105,
                    rot: -7
                },
                {
                    dx: 45,
                    dy: -120,
                    rot: 7
                },
                {
                    dx: -30,
                    dy: -175,
                    rot: -4
                },
                {
                    dx: 35,
                    dy: -65,
                    rot: 9
                }
            ];
        }

        return [
            {
                dx: -80,
                dy: -130,
                rot: -8
            },
            {
                dx: 80,
                dy: -150,
                rot: 8
            },
            {
                dx: -20,
                dy: -200,
                rot: -4
            },
            {
                dx: 50,
                dy: -70,
                rot: 10
            }
        ];
    }

    openEnvelopeBtn.addEventListener(
        'click',
        openEnvelope
    );

    closeOverlayBtn.addEventListener(
        'click',
        () => {

            envelopeOverlay.classList.remove(
                'show'
            );

            setTimeout(
                () => {

                    envelopeOverlay.classList.add(
                        'hidden'
                    );

                },
                500
            );
        }
    );

    /* =========================================
       LETTER PROGRESS
    ========================================= */

    function updateLetterProgress() {

        const remaining =
            document.querySelectorAll(
                '.draggable-item'
            ).length -
            closedLetters;

        if (remaining <= 0) {

            letterProgress.innerText =
                "all opened ❤️";

        } else if (remaining === 1) {

            letterProgress.innerText =
                "one little surprise left";

        } else {

            letterProgress.innerText =
                `${remaining} little surprises left`;
        }
    }

    /* =========================================
       CLOSE LETTERS
    ========================================= */

    const closeButtons =
        document.querySelectorAll(
            '.closeLetter'
        );

    closeButtons.forEach(
        btn => {

            btn.addEventListener(
                'click',
                e => {

                    e.stopPropagation();

                    const letter =
                        e.currentTarget.closest(
                            '.draggable-item'
                        );

                    if (!letter) {
                        return;
                    }

                    if (
                        letter.dataset.closed ===
                        'true'
                    ) {
                        return;
                    }

                    letter.dataset.closed =
                        'true';

                    letter.style.pointerEvents =
                        'none';

                    letter.style.opacity =
                        '0';

                    letter.style.transform =
                        'translate(-50%, -50%) scale(.2) translateY(90px)';

                    playPop();

                    closedLetters++;

                    updateLetterProgress();

                    setTimeout(
                        () => {

                            letter.style.display =
                                'none';

                            const total =
                                document.querySelectorAll(
                                    '.draggable-item'
                                ).length;

                            if (
                                closedLetters >=
                                total
                            ) {

                                startFinalSequence();
                            }

                        },
                        550
                    );
                }
            );
        }
    );

    /* =========================================
       FINAL SEQUENCE
    ========================================= */

    function startFinalSequence() {

        if (finalSequenceStarted) {
            return;
        }

        finalSequenceStarted =
            true;

        envelopeOverlay.classList.remove(
            'show'
        );

        setTimeout(
            () => {

                envelopeOverlay.classList.add(
                    'hidden'
                );

                finalSurprise.classList.remove(
                    'hidden'
                );

                void finalSurprise.offsetHeight;

                finalSurprise.classList.add(
                    'show'
                );

                setTimeout(
                    () => {

                        finalSurprise.classList.add(
                            'ready'
                        );

                    },
                    1300
                );

            },
            750
        );
    }

    /* =========================================
       FINAL HEART
    ========================================= */

    finalHeartButton.addEventListener(
        'click',
        () => {

            playChime();

            spawnHeartFireworks(
                window.innerWidth / 2,
                window.innerHeight / 2,
                110
            );

            finalSurprise.classList.add(
                'message-open'
            );

            setTimeout(
                () => {

                    finalMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                },
                250
            );
        }
    );

    /* =========================================
       DRAGGABLE LETTERS
    ========================================= */

    const draggableLetters =
        document.querySelectorAll(
            '.draggable-item'
        );

    draggableLetters.forEach(
        item => {

            let startX = 0;
            let startY = 0;

            let initialX = 0;
            let initialY = 0;

            let isDragging = false;

            function getTransformValues(
                el
            ) {

                const style =
                    window.getComputedStyle(
                        el
                    );

                const matrix =
                    style.transform ||
                    style.webkitTransform;

                if (
                    !matrix ||
                    matrix === 'none'
                ) {

                    return {
                        x: 0,
                        y: 0,
                        rotate: 0
                    };
                }

                const values =
                    matrix
                        .split('(')[1]
                        .split(')')[0]
                        .split(',');

                const a =
                    parseFloat(
                        values[0]
                    );

                const b =
                    parseFloat(
                        values[1]
                    );

                const angle =
                    Math.round(
                        Math.atan2(
                            b,
                            a
                        ) *
                        180 /
                        Math.PI
                    );

                const tx =
                    parseFloat(
                        values[4]
                    ) || 0;

                const ty =
                    parseFloat(
                        values[5]
                    ) || 0;

                return {
                    x: tx,
                    y: ty,
                    rotate: angle
                };
            }

            function dragStart(e) {

                if (
                    e.target.closest(
                        '.closeLetter'
                    )
                ) {
                    return;
                }

                if (
                    item.style.display ===
                    'none'
                ) {
                    return;
                }

                if (
                    e.type === 'mousedown'
                ) {
                    e.preventDefault();
                }

                isDragging = true;

                item.classList.add(
                    'dragging'
                );

                item.style.cursor =
                    'grabbing';

                item.style.zIndex =
                    zIndexCounter++;

                const clientX =
                    e.type === 'touchstart'
                        ? e.touches[0].clientX
                        : e.clientX;

                const clientY =
                    e.type === 'touchstart'
                        ? e.touches[0].clientY
                        : e.clientY;

                startX =
                    clientX;

                startY =
                    clientY;

                const transform =
                    getTransformValues(
                        item
                    );

                initialX =
                    transform.x;

                initialY =
                    transform.y;

                item.dataset.rotate =
                    transform.rotate;

                if (
                    e.type ===
                    'mousedown'
                ) {

                    document.addEventListener(
                        'mousemove',
                        dragMove
                    );

                    document.addEventListener(
                        'mouseup',
                        dragEnd
                    );

                } else {

                    document.addEventListener(
                        'touchmove',
                        dragMove,
                        {
                            passive: false
                        }
                    );

                    document.addEventListener(
                        'touchend',
                        dragEnd
                    );
                }
            }

            function dragMove(e) {

                if (!isDragging) {
                    return;
                }

                if (e.cancelable) {
                    e.preventDefault();
                }

                const clientX =
                    e.type === 'touchmove'
                        ? e.touches[0].clientX
                        : e.clientX;

                const clientY =
                    e.type === 'touchmove'
                        ? e.touches[0].clientY
                        : e.clientY;

                const dx =
                    clientX - startX;

                const dy =
                    clientY - startY;

                const rot =
                    item.dataset.rotate ||
                    0;

                item.style.transform =
                    `translate(${initialX + dx}px, ${initialY + dy}px) scale(1.035) rotate(${rot}deg)`;
            }

            function dragEnd() {

                if (!isDragging) {
                    return;
                }

                isDragging =
                    false;

                item.classList.remove(
                    'dragging'
                );

                item.style.cursor =
                    'grab';

                const transform =
                    getTransformValues(
                        item
                    );

                const rot =
                    item.dataset.rotate ||
                    0;

                item.style.transform =
                    `translate(${transform.x}px, ${transform.y}px) scale(1) rotate(${rot}deg)`;

                document.removeEventListener(
                    'mousemove',
                    dragMove
                );

                document.removeEventListener(
                    'mouseup',
                    dragEnd
                );

                document.removeEventListener(
                    'touchmove',
                    dragMove
                );

                document.removeEventListener(
                    'touchend',
                    dragEnd
                );
            }

            item.addEventListener(
                'mousedown',
                dragStart
            );

            item.addEventListener(
                'touchstart',
                dragStart,
                {
                    passive: true
                }
            );

            item.addEventListener(
                'dragstart',
                e => {
                    e.preventDefault();
                }
            );
        }
    );

    /* =========================================
       START
    ========================================= */

    initBackground();

});
