'use strict';

/* =========================================================
   BIRTHDAY SURPRISE — COMPLETE SCRIPT
========================================================= */

const SURPRISE_CONFIG = {
    occasionText: "Happy Birthday, ya albee! 🎂",
    partnerName: "sibaa 💖",
    senderName: "amer ✍️",

    message:
        "I love you so much, ya albee. ❤️ You make every day happier and more special just by being you. I'm so lucky to have you in my life. Happy Birthday, ya 3umree! 💕"
};

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

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

    /* =====================================================
       TEXT
    ===================================================== */

    occasionTextEl.innerText =
        SURPRISE_CONFIG.occasionText;

    partnerNameEl.innerText =
        SURPRISE_CONFIG.partnerName;

    senderNameEl.innerText =
        SURPRISE_CONFIG.senderName;

    customMessageEl.innerText =
        SURPRISE_CONFIG.message;

    /* =====================================================
       AUDIO
    ===================================================== */

    let audioCtx = null;

    function initAudio() {

        if (!audioCtx) {

            audioCtx = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(
        frequency,
        duration = 0.2,
        volume = 0.12,
        type = 'sine'
    ) {

        initAudio();

        const now =
            audioCtx.currentTime;

        const osc =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        osc.type = type;

        osc.frequency.setValueAtTime(
            frequency,
            now
        );

        gain.gain.setValueAtTime(
            0,
            now
        );

        gain.gain.linearRampToValueAtTime(
            volume,
            now + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    }

    function playChime() {

        initAudio();

        const notes = [
            523.25,
            659.25,
            783.99,
            987.77,
            1046.50,
            1318.51
        ];

        notes.forEach((freq, i) => {

            setTimeout(() => {
                playTone(
                    freq,
                    0.55,
                    0.12,
                    'sine'
                );
            }, i * 80);

        });
    }

    function playPop() {
        playTone(
            260,
            0.09,
            0.22,
            'triangle'
        );
    }

    /* =====================================================
       BACKGROUND PARTICLES
    ===================================================== */

    function initBackground() {

        for (let i = 0; i < 25; i++) {
            createParticle(true);
        }

        setInterval(() => {
            createParticle(false);
        }, 1200);
    }

    function createParticle(initial = false) {

        const p =
            document.createElement('div');

        p.classList.add('particle');

        const size =
            Math.random() * 8 + 4;

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
            Math.random() * 6 + 8;

        const delay =
            Math.random() * 4;

        p.style.animationDuration =
            `${duration}s`;

        p.style.animationDelay =
            `${delay}s`;

        const pink =
            Math.random() > 0.5;

        p.style.background =
            pink
                ? 'rgba(255, 51, 119, 0.25)'
                : 'rgba(255, 183, 3, 0.25)';

        p.style.boxShadow =
            pink
                ? '0 0 10px rgba(255, 51, 119, 0.4)'
                : '0 0 10px rgba(255, 183, 3, 0.4)';

        bgParticles.appendChild(p);

        setTimeout(() => {
            p.remove();
        }, (duration + delay) * 1000);
    }

    /* =====================================================
       CANVAS
    ===================================================== */

    function resizeCanvas() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;
    }

    window.addEventListener(
        'resize',
        resizeCanvas
    );

    resizeCanvas();

    /* =====================================================
       PHOTOS
    ===================================================== */

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

    /* =====================================================
       PARTICLE ARRAYS
    ===================================================== */

    let balloons = [];
    let popParticles = [];
    let trailParticles = [];
    let heartSparks = [];

    let isDrawingBalloons = false;

    /* =====================================================
       BALLOON
    ===================================================== */

    class Balloon {

        constructor(x, y) {

            this.x = x;
            this.y = y;

            this.type =
                Math.random() > 0.7
                    ? 'polaroid'
                    : 'balloon';

            this.vy =
                -(Math.random() * 1.5 + 1.2);

            this.swaySpeed =
                Math.random() * 0.02 + 0.01;

            this.swayAmount =
                Math.random() * 15 + 10;

            this.swayOffset =
                Math.random() * Math.PI * 2;

            this.time = 0;

            if (this.type === 'balloon') {

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
                    `hsla(${this.hue},95%,60%,0.85)`;

                this.glow =
                    `hsla(${this.hue},95%,60%,0.45)`;

                this.stringLength =
                    Math.random() * 40 + 60;

            } else {

                this.width = 66;
                this.height = 78;

                this.rotation =
                    (Math.random() - 0.5) * 0.3;

                this.rotSpeed =
                    (Math.random() - 0.5) * 0.025;

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

            if (this.type === 'polaroid') {

                this.rotation +=
                    this.rotSpeed;
            }
        }

        draw() {

            if (this.type === 'balloon') {

                /* STRING */

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
                    'rgba(163,149,190,0.4)';

                ctx.lineWidth = 1.5;

                ctx.stroke();

                /* BALLOON */

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

                /* HIGHLIGHT */

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
                    'rgba(255,255,255,0.35)';

                ctx.fill();

                /* KNOT */

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
                    'rgba(0,0,0,0.35)';

                ctx.shadowBlur = 12;
                ctx.shadowOffsetY = 4;

                ctx.fillStyle =
                    '#ffffff';

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

                /* HEART */

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
                    hy - hs * 0.8,
                    hx - hs,
                    hy - hs / 4
                );

                ctx.quadraticCurveTo(
                    hx - hs,
                    hy + hs / 3,
                    hx,
                    hy + hs * 0.95
                );

                ctx.quadraticCurveTo(
                    hx + hs,
                    hy + hs / 3,
                    hx + hs,
                    hy - hs / 4
                );

                ctx.quadraticCurveTo(
                    hx + hs / 2,
                    hy - hs * 0.8,
                    hx,
                    hy - hs / 4
                );

                ctx.closePath();

                ctx.fill();

                ctx.restore();
            }
        }

        isClicked(mx, my) {

            if (this.type === 'balloon') {

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

            }

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

    /* =====================================================
       POP PARTICLE
    ===================================================== */

    class PopParticle {

        constructor(x, y, hue = 340) {

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

            this.gravity =
                0.08;

            this.fadeSpeed =
                Math.random() * 0.02 + 0.02;
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

    /* =====================================================
       TRAIL PARTICLES
    ===================================================== */

    class TrailParticle {

        constructor(x, y) {

            this.x = x;
            this.y = y;

            this.vx =
                (Math.random() - 0.5) * 1.5;

            this.vy =
                -(Math.random() * 1.2 + 0.6);

            this.size =
                Math.random() * 3 + 2;

            this.opacity = 1;

            this.fade =
                Math.random() * 0.015 + 0.015;

            this.hue =
                Math.random() > 0.5
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
                `hsla(${this.hue},95%,65%,0.45)`;

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

    /* =====================================================
       HEART SPARK
    ===================================================== */

    function createHeartSpark(
        x,
        y,
        big = false
    ) {

        return {

            x,
            y,

            vx:
                (Math.random() - 0.5) *
                (big ? 8 : 5),

            vy:
                (Math.random() - 0.5) *
                (big ? 8 : 5) -
                (big ? 1.5 : 0),

            size:
                Math.random() *
                (big ? 8 : 6) +
                (big ? 5 : 4),

            opacity: 1,

            fade:
                Math.random() *
                0.015 +
                0.01,

            hue:
                Math.random() > 0.5
                    ? 340
                    : 355
        };
    }

    function drawHeart(
        x,
        y,
        size,
        opacity,
        hue
    ) {

        ctx.save();

        ctx.globalAlpha =
            opacity;

        ctx.fillStyle =
            `hsla(${hue},95%,65%,${opacity})`;

        ctx.shadowColor =
            `hsla(${hue},95%,65%,0.5)`;

        ctx.shadowBlur = 10;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y - size / 4
        );

        ctx.bezierCurveTo(
            x - size,
            y - size,
            x - size * 1.4,
            y + size / 3,
            x,
            y + size
        );

        ctx.bezierCurveTo(
            x + size * 1.4,
            y + size / 3,
            x + size,
            y - size,
            x,
            y - size / 4
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }

    /* =====================================================
       ANIMATION LOOP
    ===================================================== */

    function animateBalloons() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        /* HEART SPARKS */

        for (
            let i = heartSparks.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                heartSparks[i];

            p.vx *= 0.98;
            p.vy *= 0.98;

            p.vy += 0.05;

            p.x += p.vx;
            p.y += p.vy;

            p.opacity -= p.fade;

            drawHeart(
                p.x,
                p.y,
                p.size,
                p.opacity,
                p.hue
            );

            if (p.opacity <= 0) {
                heartSparks.splice(i, 1);
            }
        }

        /* TRAIL */

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

        /* POPS */

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

        /* BALLOONS */

        for (
            let i = balloons.length - 1;
            i >= 0;
            i--
        ) {

            const b =
                balloons[i];

            b.update();
            b.draw();

            if (
                b.y <
                -b.radiusY * 2
            ) {

                balloons.splice(
                    i,
                    1
                );
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

    /* =====================================================
       START CANVAS ANIMATION
    ===================================================== */

    function startCanvasAnimation() {

        if (!isDrawingBalloons) {

            isDrawingBalloons =
                true;

            animateBalloons();
        }
    }

    /* =====================================================
       BALLOON CLICK
    ===================================================== */

    canvas.addEventListener(
        'click',
        (e) => {

            for (
                let i = balloons.length - 1;
                i >= 0;
                i--
            ) {

                const b =
                    balloons[i];

                if (
                    b.isClicked(
                        e.clientX,
                        e.clientY
                    )
                ) {

                    playPop();

                    for (
                        let k = 0;
                        k < 14;
                        k++
                    ) {

                        popParticles.push(
                            new PopParticle(
                                b.currentX,
                                b.y,
                                b.hue || 340
                            )
                        );
                    }

                    balloons.splice(
                        i,
                        1
                    );

                    startCanvasAnimation();

                    break;
                }
            }
        }
    );

    /* =====================================================
       TRAIL
    ===================================================== */

    function addTrail(x, y) {

        for (let i = 0; i < 2; i++) {

            trailParticles.push(
                new TrailParticle(
                    x,
                    y
                )
            );
        }

        startCanvasAnimation();
    }

    document.addEventListener(
        'mousemove',
        e => {

            addTrail(
                e.clientX,
                e.clientY
            );
        }
    );

    document.addEventListener(
        'touchmove',
        e => {

            if (e.touches.length) {

                addTrail(
                    e.touches[0].clientX,
                    e.touches[0].clientY
                );
            }
        },
        {
            passive: true
        }
    );

    /* =====================================================
       DOUBLE CLICK HEARTS
    ===================================================== */

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

            for (
                let i = 0;
                i < 14;
                i++
            ) {

                heartSparks.push(
                    createHeartSpark(
                        e.clientX,
                        e.clientY,
                        false
                    )
                );
            }

            playPop();

            startCanvasAnimation();
        }
    );

    /* =====================================================
       CARD TILT
    ===================================================== */

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
                5;

            const rotateY =
                (e.clientX - halfWidth) /
                halfWidth *
                5;

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

    /* =====================================================
       TYPING
    ===================================================== */

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

        skipTypingBtn.classList.add(
            'show'
        );

        function type() {

            if (!typingActive) {
                return;
            }

            if (i < text.length) {

                cursor.before(
                    text.charAt(i)
                );

                const char =
                    text.charAt(i);

                i++;

                let delay = 55;

                if (
                    char === '.' ||
                    char === '!' ||
                    char === '?'
                ) {

                    delay = 700;

                } else if (
                    char === ','
                ) {

                    delay = 300;
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

            if (typingActive) {

                typingActive =
                    false;

                cursor.before(
                    text.substring(i)
                );

                cursor.remove();
            }

            const rect =
                skipTypingBtn.getBoundingClientRect();

            for (
                let k = 0;
                k < 15;
                k++
            ) {

                heartSparks.push(
                    createHeartSpark(
                        rect.left +
                        rect.width / 2,

                        rect.top +
                        rect.height / 2,

                        true
                    )
                );
            }

            playPop();

            startCanvasAnimation();

            openEnvelopeOverlay();
        };

        type();
    }

    /* =====================================================
       HEART FIREWORKS
    ===================================================== */

    function spawnHeartFireworks(
        x,
        y
    ) {

        for (
            let i = 0;
            i < 90;
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
                    Math.random() * 8 + 5,

                opacity: 1,

                fade:
                    Math.random() *
                    0.015 +
                    0.01,

                hue:
                    Math.random() > 0.5
                        ? 340
                        : 355
            });
        }

        startCanvasAnimation();
    }

    /* =====================================================
       SPAWN BALLOONS
    ===================================================== */

    function spawnBalloons() {

        for (
            let i = 0;
            i < 30;
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
                            (
                                window.innerWidth -
                                100
                            ) + 50;

                        const spawnY =
                            window.innerHeight +
                            100;

                        balloons.push(
                            new Balloon(
                                spawnX,
                                spawnY
                            )
                        );

                        startCanvasAnimation();
                    }

                },
                i * 120
            );
        }
    }

    /* =====================================================
       GIFT BOX
    ===================================================== */

    giftBoxContainer.addEventListener(
        'click',
        () => {

            if (
                giftBox.classList.contains(
                    'open'
                )
            ) {
                return;
            }

            initAudio();

            playChime();

            giftBox.classList.add(
                'open'
            );

            const boxGlow =
                document.getElementById(
                    'boxGlow'
                );

            if (boxGlow) {

                boxGlow.classList.add(
                    'active'
                );
            }

            canvas.style.pointerEvents =
                'auto';

            spawnHeartFireworks(
                window.innerWidth / 2,
                window.innerHeight / 2
            );

            spawnBalloons();

            setTimeout(
                () => {

                    giftBoxContainer.classList.add(
                        'fade-out'
                    );

                },
                900
            );

            setTimeout(
                () => {

                    giftBoxContainer.style.display =
                        'none';

                    memoryCard.style.display =
                        'block';

                    memoryCard.offsetHeight;

                    memoryCard.classList.remove(
                        'hidden'
                    );

                    memoryCard.classList.add(
                        'entering'
                    );

                    typeMessage();

                },
                1400
            );
        }
    );

    /* =====================================================
       ENVELOPE
    ===================================================== */

    let closedLetters = 0;
    let finalSequenceStarted = false;

    let zIndexCounter = 300;

    function openEnvelopeOverlay() {

        envelopeOverlay.classList.remove(
            'hidden'
        );

        envelopeOverlay.offsetHeight;

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

        const letters =
            document.querySelectorAll(
                '.draggable-item'
            );

        closedLetters = 0;
        finalSequenceStarted = false;

        letters.forEach(letter => {

            letter.dataset.closed =
                'false';

            letter.style.display =
                'flex';

            letter.style.opacity =
                '0';

            letter.style.transform =
                'translate(-50%, -50%) scale(0.1) translateY(120px)';

            letter.style.left =
                '50%';

            letter.style.top =
                '35%';

            letter.style.zIndex =
                '1';
        });
    }

    openEnvelopeBtn.addEventListener(
        'click',
        () => {

            popupEnvelope.classList.add(
                'active'
            );

            playChime();

            const letters =
                document.querySelectorAll(
                    '.draggable-item'
                );

            const fanOffsets = [
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

            letters.forEach(
                (item, index) => {

                    const offset =
                        fanOffsets[index] || {
                            dx: 0,
                            dy: -100,
                            rot: 0
                        };

                    setTimeout(
                        () => {

                            item.style.opacity =
                                '1';

                            item.style.transform =
                                `translate(calc(-50% + ${offset.dx}px), calc(-50% + ${offset.dy}px)) scale(1) rotate(${offset.rot}deg)`;

                        },
                        300 +
                        index * 220
                    );
                }
            );
        }
    );

    /* =====================================================
       CLOSE ENVELOPE
    ===================================================== */

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
                400
            );
        }
    );

    /* =====================================================
       FINAL SURPRISE
    ===================================================== */

    function startFinalSequence() {

        if (finalSequenceStarted) {
            return;
        }

        finalSequenceStarted =
            true;

        setTimeout(
            () => {

                envelopeOverlay.classList.remove(
                    'show'
                );

            },
            300
        );

        setTimeout(
            () => {

                envelopeOverlay.classList.add(
                    'hidden'
                );

                finalSurprise.classList.remove(
                    'hidden'
                );

                finalSurprise.offsetHeight;

                finalSurprise.classList.add(
                    'show'
                );

                setTimeout(
                    () => {

                        finalSurprise.classList.add(
                            'ready'
                        );

                    },
                    1100
                );

            },
            850
        );
    }

    /* =====================================================
       CLOSE LETTERS
    ===================================================== */

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
                        e.target.closest(
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

                    letter.style.opacity =
                        '0';

                    letter.style.transform =
                        'translate(-50%, -50%) scale(0.1) translateY(100px)';

                    playPop();

                    closedLetters++;

                    setTimeout(
                        () => {

                            letter.style.display =
                                'none';

                            const totalLetters =
                                document.querySelectorAll(
                                    '.draggable-item'
                                ).length;

                            if (
                                closedLetters >=
                                totalLetters
                            ) {

                                startFinalSequence();
                            }

                        },
                        400
                    );
                }
            );
        }
    );

    /* =====================================================
       DRAGGABLE LETTERS
    ===================================================== */

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

            const getTransformValues =
                el => {

                    const style =
                        window.getComputedStyle(
                            el
                        );

                    const matrix =
                        style.transform;

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

                    const match =
                        matrix.match(
                            /matrix.*\((.+)\)/
                        );

                    if (!match) {

                        return {
                            x: 0,
                            y: 0,
                            rotate: 0
                        };
                    }

                    const values =
                        match[1]
                            .split(',')
                            .map(Number);

                    const a =
                        values[0];

                    const b =
                        values[1];

                    const rotate =
                        Math.round(
                            Math.atan2(
                                b,
                                a
                            ) *
                            180 /
                            Math.PI
                        );

                    return {
                        x:
                            values[4] || 0,

                        y:
                            values[5] || 0,

                        rotate
                    };
                };

            const dragStart =
                e => {

                    if (
                        e.target.closest(
                            '.closeLetter'
                        )
                    ) {
                        return;
                    }

                    if (
                        e.type ===
                        'mousedown'
                    ) {
                        e.preventDefault();
                    }

                    isDragging =
                        true;

                    item.classList.add(
                        'dragging'
                    );

                    item.style.cursor =
                        'grabbing';

                    item.style.zIndex =
                        zIndexCounter++;

                    const clientX =
                        e.type ===
                        'touchstart'
                            ? e.touches[0].clientX
                            : e.clientX;

                    const clientY =
                        e.type ===
                        'touchstart'
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
                };

            const dragMove =
                e => {

                    if (!isDragging) {
                        return;
                    }

                    if (e.cancelable) {
                        e.preventDefault();
                    }

                    const clientX =
                        e.type ===
                        'touchmove'
                            ? e.touches[0].clientX
                            : e.clientX;

                    const clientY =
                        e.type ===
                        'touchmove'
                            ? e.touches[0].clientY
                            : e.clientY;

                    const dx =
                        clientX -
                        startX;

                    const dy =
                        clientY -
                        startY;

                    const rot =
                        item.dataset.rotate ||
                        0;

                    item.style.transform =
                        `translate(${initialX + dx}px, ${initialY + dy}px) scale(1.03) rotate(${rot}deg)`;
                };

            const dragEnd =
                () => {

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
                };

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

    /* =====================================================
       FINAL HEART
    ===================================================== */

    finalHeartButton.addEventListener(
        'click',
        () => {

            playChime();

            spawnHeartFireworks(
                window.innerWidth / 2,
                window.innerHeight / 2
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
                150
            );
        }
    );

    /* =====================================================
       EXTRA TOUCH INTERACTIONS
    ===================================================== */

    document.addEventListener(
        'click',
        e => {

            if (
                e.target.closest(
                    '.gift-box-container'
                ) ||
                e.target.closest(
                    '.closeLetter'
                ) ||
                e.target.closest(
                    '.final-heart-button'
                )
            ) {
                return;
            }

            /* Tiny click hearts */

            if (
                !memoryCard.classList.contains(
                    'hidden'
                )
            ) {

                for (
                    let i = 0;
                    i < 3;
                    i++
                ) {

                    heartSparks.push(
                        createHeartSpark(
                            e.clientX +
                            (Math.random() - 0.5) *
                            20,

                            e.clientY +
                            (Math.random() - 0.5) *
                            20
                        )
                    );
                }

                startCanvasAnimation();
            }
        }
    );

    /* =====================================================
       START
    ===================================================== */

    initBackground();

});
