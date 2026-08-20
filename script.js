'use strict';

const SURPRISE_CONFIG = {
    occasionText: "Happy Birthday, ya albee! 🎂",
    partnerName: "sibaa 💖",
    senderName: "amer ✍️",
    message:
        "I love you so much, ya albee. ❤️ You make every day happier and more special just by being you. I'm so lucky to have you in my life. Happy Birthday, ya 3umree! 💕"
};

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       ELEMENTS
    ========================= */

    const $ = id => document.getElementById(id);

    const giftBox = $('giftBox');
    const giftBoxContainer = $('giftBoxContainer');
    const memoryCard = $('memoryCard');
    const boxGlow = $('boxGlow');

    const occasionText = $('occasionText');
    const partnerName = $('partnerName');
    const senderName = $('senderName');
    const customMessage = $('customMessage');

    const skipTypingBtn = $('skipTypingBtn');

    const canvas = $('balloonCanvas');
    const ctx = canvas.getContext('2d');

    const bgParticles = $('bgParticles');

    const envelopeOverlay = $('envelopeOverlay');
    const closeOverlayBtn = $('closeOverlayBtn');
    const openEnvelopeBtn = $('openEnvelopeBtn');
    const popupEnvelope = $('popupEnvelope');

    const finalSurprise = $('finalSurprise');
    const finalHeartButton = $('finalHeartButton');
    const finalMessage = $('finalMessage');

    /* =========================
       TEXT
    ========================= */

    occasionText.textContent = SURPRISE_CONFIG.occasionText;
    partnerName.textContent = SURPRISE_CONFIG.partnerName;
    senderName.textContent = SURPRISE_CONFIG.senderName;
    customMessage.textContent = SURPRISE_CONFIG.message;

    /* =========================
       AUDIO
    ========================= */

    const music = new Audio('./song.mp3');

    music.loop = true;
    music.volume = 0.65;
    music.preload = 'auto';

    function startMusic() {
        music.play().catch(() => {
            console.log('Music waiting for user interaction');
        });
    }

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

        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.001, now);

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

    function playPop() {
        playTone(260, 0.1, 0.2, 'triangle');
    }

    function playChime() {
        const notes = [
            523.25,
            659.25,
            783.99,
            987.77,
            1046.5
        ];

        notes.forEach((note, i) => {
            setTimeout(() => {
                playTone(note, 0.5, 0.1);
            }, i * 100);
        });
    }

    /* =========================
       BACKGROUND PARTICLES
    ========================= */

    function createParticle(initial = false) {

        const p = document.createElement('div');

        p.className = 'particle';

        const size = Math.random() * 8 + 4;

        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;

        p.style.bottom = initial
            ? `${Math.random() * 100}%`
            : '-20px';

        const duration = Math.random() * 6 + 8;
        const delay = Math.random() * 4;

        p.style.animationDuration = `${duration}s`;
        p.style.animationDelay = `${delay}s`;

        const pink = Math.random() > 0.5;

        p.style.background = pink
            ? 'rgba(255, 51, 119, 0.25)'
            : 'rgba(255, 183, 3, 0.25)';

        p.style.boxShadow = pink
            ? '0 0 10px rgba(255, 51, 119, 0.4)'
            : '0 0 10px rgba(255, 183, 3, 0.4)';

        bgParticles.appendChild(p);

        setTimeout(() => p.remove(), (duration + delay) * 1000);
    }

    for (let i = 0; i < 25; i++) {
        createParticle(true);
    }

    setInterval(() => {
        createParticle(false);
    }, 1200);

    /* =========================
       CANVAS
    ========================= */

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    let balloons = [];
    let particles = [];
    let animationRunning = false;

    /* =========================
       HEART PARTICLE
    ========================= */

    function heartParticle(x, y) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;

        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: Math.random() * 6 + 4,
            opacity: 1,
            life: 1
        };
    }

    function drawHeart(p) {

        ctx.save();

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#ff3377';

        ctx.beginPath();

        ctx.moveTo(p.x, p.y + p.size);

        ctx.bezierCurveTo(
            p.x - p.size * 1.4,
            p.y,
            p.x - p.size,
            p.y - p.size,
            p.x,
            p.y - p.size / 3
        );

        ctx.bezierCurveTo(
            p.x + p.size,
            p.y - p.size,
            p.x + p.size * 1.4,
            p.y,
            p.x,
            p.y + p.size
        );

        ctx.fill();

        ctx.restore();
    }

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles.forEach((p, index) => {

            p.x += p.vx;
            p.y += p.vy;

            p.vy += 0.06;

            p.life -= 0.018;
            p.opacity = p.life;

            drawHeart(p);

            if (p.life <= 0) {
                particles.splice(index, 1);
            }
        });

        balloons.forEach((b, index) => {

            b.y -= b.speed;

            b.x += Math.sin(b.y * 0.01) * 0.7;

            ctx.save();

            ctx.fillStyle = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 15;

            ctx.beginPath();

            ctx.ellipse(
                b.x,
                b.y,
                25,
                32,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();

            if (b.y < -100) {
                balloons.splice(index, 1);
            }
        });

        if (
            particles.length > 0 ||
            balloons.length > 0
        ) {
            requestAnimationFrame(animate);
        } else {
            animationRunning = false;
        }
    }

    function startAnimation() {

        if (animationRunning) return;

        animationRunning = true;

        requestAnimationFrame(animate);
    }

    function fireworks(x, y) {

        for (let i = 0; i < 80; i++) {
            particles.push(
                heartParticle(x, y)
            );
        }

        startAnimation();
    }

    /* =========================
       BALLOONS
    ========================= */

    function spawnBalloons() {

        const colors = [
            '#ff3377',
            '#ff6b9d',
            '#ffb703',
            '#9d4edd',
            '#4cc9f0'
        ];

        for (let i = 0; i < 25; i++) {

            setTimeout(() => {

                balloons.push({
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 80,
                    speed: Math.random() * 1.5 + 1,
                    color:
                        colors[
                            Math.floor(
                                Math.random() *
                                colors.length
                            )
                        ]
                });

                startAnimation();

            }, i * 120);
        }
    }

    /* =========================
       GIFT BOX
    ========================= */

    let giftOpened = false;

    giftBoxContainer.addEventListener('click', () => {

        if (giftOpened) return;

        giftOpened = true;

        initAudio();

        startMusic();

        playChime();

        giftBox.classList.add('open');

        if (boxGlow) {
            boxGlow.classList.add('active');
        }

        fireworks(
            window.innerWidth / 2,
            window.innerHeight / 2
        );

        spawnBalloons();

        giftBoxContainer.classList.add('fade-out');

        setTimeout(() => {

            giftBoxContainer.style.display = 'none';

            memoryCard.style.display = 'block';

            requestAnimationFrame(() => {
                memoryCard.classList.remove('hidden');
                memoryCard.classList.add('entering');
            });

            typeMessage();

        }, 1400);

    });

    /* =========================
       TYPING
    ========================= */

    let typingFinished = false;
    let typingTimer = null;

    function typeMessage() {

        clearTimeout(typingTimer);

        const text = SURPRISE_CONFIG.message;

        customMessage.textContent = '';

        skipTypingBtn.classList.add('show');

        let index = 0;

        typingFinished = false;

        const cursor = document.createElement('span');

        cursor.className = 'typing-cursor';
        cursor.textContent = '|';

        customMessage.appendChild(cursor);

        function typeNext() {

            if (index >= text.length) {

                typingFinished = true;

                cursor.remove();

                return;
            }

            const char = text[index];

            cursor.before(
                document.createTextNode(char)
            );

            index++;

            let delay = 45;

            if (
                char === '.' ||
                char === '!' ||
                char === '?'
            ) {
                delay = 500;
            }

            typingTimer = setTimeout(
                typeNext,
                delay
            );
        }

        typeNext();
    }

    /* =========================
       ⭐ FIXED OPEN ME BUTTON
    ========================= */

    skipTypingBtn.addEventListener('click', e => {

        e.preventDefault();
        e.stopPropagation();

        console.log('OPEN ME CLICKED');

        /* Finish typing immediately */

        if (!typingFinished) {

            clearTimeout(typingTimer);

            customMessage.textContent =
                SURPRISE_CONFIG.message;

            typingFinished = true;
        }

        playPop();

        /* Heart burst */

        const rect =
            skipTypingBtn.getBoundingClientRect();

        fireworks(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );

        /* OPEN ENVELOPE */

        openEnvelopeOverlay();

    });

    /* =========================
       ENVELOPE
    ========================= */

    let envelopeOpened = false;

    function openEnvelopeOverlay() {

        console.log('OPENING ENVELOPE');

        envelopeOverlay.classList.remove('hidden');

        requestAnimationFrame(() => {
            envelopeOverlay.classList.add('show');
        });

        envelopeOpened = false;

        popupEnvelope.classList.remove('active');

        openEnvelopeBtn.style.opacity = '1';
        openEnvelopeBtn.style.pointerEvents = 'auto';

        const letters =
            document.querySelectorAll('.draggable-item');

        letters.forEach(letter => {

            letter.dataset.closed = 'false';

            letter.style.display = 'flex';
            letter.style.opacity = '0';

            letter.style.left = '50%';
            letter.style.top = '35%';

            letter.style.zIndex = '1';

            letter.style.transform =
                'translate(-50%, -50%) scale(0.1)';

        });
    }

    /* =========================
       ENVELOPE OPEN BUTTON
    ========================= */

    openEnvelopeBtn.addEventListener('click', e => {

        e.preventDefault();
        e.stopPropagation();

        if (envelopeOpened) return;

        envelopeOpened = true;

        playChime();

        popupEnvelope.classList.add('active');

        const letters =
            document.querySelectorAll('.draggable-item');

        const offsets = [
            [-80, -130, -8],
            [80, -150, 8],
            [-20, -200, -4],
            [50, -70, 10]
        ];

        letters.forEach((letter, index) => {

            const offset =
                offsets[index] ||
                [0, -100, 0];

            setTimeout(() => {

                letter.style.opacity = '1';

                letter.style.transform =
                    `translate(
                        calc(-50% + ${offset[0]}px),
                        calc(-50% + ${offset[1]}px)
                    )
                    scale(1)
                    rotate(${offset[2]}deg)`;

            }, 300 + index * 200);

        });

    });

    /* =========================
       CLOSE ENVELOPE
    ========================= */

    closeOverlayBtn.addEventListener('click', e => {

        e.preventDefault();

        envelopeOverlay.classList.remove('show');

        setTimeout(() => {
            envelopeOverlay.classList.add('hidden');
        }, 400);

    });

    /* =========================
       LETTERS
    ========================= */

    let closedLetters = 0;

    const letters =
        document.querySelectorAll('.draggable-item');

    letters.forEach(letter => {

        const closeButton =
            letter.querySelector('.closeLetter');

        closeButton.addEventListener('click', e => {

            e.preventDefault();
            e.stopPropagation();

            if (letter.dataset.closed === 'true') {
                return;
            }

            letter.dataset.closed = 'true';

            letter.style.opacity = '0';

            letter.style.transform =
                'translate(-50%, -50%) scale(0.1)';

            playPop();

            closedLetters++;

            setTimeout(() => {

                letter.style.display = 'none';

                if (
                    closedLetters >=
                    letters.length
                ) {
                    startFinalSequence();
                }

            }, 400);

        });

    });

    /* =========================
       FINAL SEQUENCE
    ========================= */

    let finalStarted = false;

    function startFinalSequence() {

        if (finalStarted) return;

        finalStarted = true;

        envelopeOverlay.classList.remove('show');

        setTimeout(() => {

            envelopeOverlay.classList.add('hidden');

            finalSurprise.classList.remove('hidden');

            requestAnimationFrame(() => {
                finalSurprise.classList.add('show');
            });

        }, 700);

    }

    /* =========================
       FINAL HEART
    ========================= */

    finalHeartButton.addEventListener('click', e => {

        e.preventDefault();

        playChime();

        fireworks(
            window.innerWidth / 2,
            window.innerHeight / 2
        );

        finalSurprise.classList.add('message-open');

        setTimeout(() => {

            finalMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

        }, 200);

    });

    /* =========================
       DOUBLE CLICK HEARTS
    ========================= */

    document.addEventListener('dblclick', e => {

        if (
            memoryCard.classList.contains('hidden')
        ) {
            return;
        }

        fireworks(
            e.clientX,
            e.clientY
        );

    });

});
