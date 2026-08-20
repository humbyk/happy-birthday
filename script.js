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

    const giftBox = document.getElementById('giftBox');
    const giftBoxContainer = document.getElementById('giftBoxContainer');
    const boxGlow = document.getElementById('boxGlow');

    const memoryCard = document.getElementById('memoryCard');
    const customMessage = document.getElementById('customMessage');
    const skipTypingBtn = document.getElementById('skipTypingBtn');

    const partnerName = document.getElementById('partnerName');
    const senderName = document.getElementById('senderName');
    const occasionText = document.getElementById('occasionText');

    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
    const popupEnvelope = document.getElementById('popupEnvelope');

    const finalSurprise = document.getElementById('finalSurprise');
    const finalHeartButton = document.getElementById('finalHeartButton');
    const finalMessage = document.getElementById('finalMessage');

    const bgParticles = document.getElementById('bgParticles');
    const canvas = document.getElementById('balloonCanvas');

    /* =========================
       SAFETY CHECK
    ========================= */

    if (!giftBoxContainer) {
        console.error('giftBoxContainer not found');
        return;
    }

    if (!giftBox) {
        console.error('giftBox not found');
        return;
    }

    if (!memoryCard) {
        console.error('memoryCard not found');
        return;
    }

    /* =========================
       TEXT
    ========================= */

    occasionText.textContent = SURPRISE_CONFIG.occasionText;
    partnerName.textContent = SURPRISE_CONFIG.partnerName;
    senderName.textContent = SURPRISE_CONFIG.senderName;
    customMessage.textContent = '';

    /* =========================
       BACKGROUND PARTICLES
    ========================= */

    function createParticle(initial = false) {

        if (!bgParticles) return;

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
            ? 'rgba(255,51,119,.25)'
            : 'rgba(255,183,3,.25)';

        p.style.boxShadow = pink
            ? '0 0 10px rgba(255,51,119,.4)'
            : '0 0 10px rgba(255,183,3,.4)';

        bgParticles.appendChild(p);

        setTimeout(() => {
            p.remove();
        }, (duration + delay) * 1000);
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

    let ctx = null;

    if (canvas) {
        ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);
    }

    /* =========================
       SIMPLE HEART PARTICLES
    ========================= */

    let heartParticles = [];
    let animationRunning = false;

    function createHeartParticle(x, y) {

        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7 - 1,
            size: Math.random() * 5 + 4,
            opacity: 1,
            life: Math.random() * 0.02 + 0.015
        };
    }

    function drawHeart(x, y, size, opacity) {

        if (!ctx) return;

        ctx.save();

        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ff3377';

        ctx.beginPath();

        ctx.moveTo(x, y + size);

        ctx.bezierCurveTo(
            x - size * 1.5,
            y - size * 0.2,
            x - size,
            y - size * 1.4,
            x,
            y - size * 0.5
        );

        ctx.bezierCurveTo(
            x + size,
            y - size * 1.4,
            x + size * 1.5,
            y - size * 0.2,
            x,
            y + size
        );

        ctx.fill();

        ctx.restore();
    }

    function animateHearts() {

        if (!ctx) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        for (let i = heartParticles.length - 1; i >= 0; i--) {

            const p = heartParticles[i];

            p.x += p.vx;
            p.y += p.vy;

            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vy += 0.04;

            p.opacity -= p.life;

            drawHeart(
                p.x,
                p.y,
                p.size,
                p.opacity
            );

            if (p.opacity <= 0) {
                heartParticles.splice(i, 1);
            }
        }

        if (heartParticles.length > 0) {
            requestAnimationFrame(animateHearts);
        } else {
            animationRunning = false;
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }

    function spawnHearts(x, y, amount = 30) {

        if (!ctx) return;

        for (let i = 0; i < amount; i++) {
            heartParticles.push(
                createHeartParticle(x, y)
            );
        }

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(animateHearts);
        }
    }

    /* =========================
       GIFT BOX
    ========================= */

    let giftOpened = false;

    giftBoxContainer.addEventListener('click', () => {

        if (giftOpened) return;

        giftOpened = true;

        console.log('Gift box clicked');

        giftBox.classList.add('open');

        if (boxGlow) {
            boxGlow.classList.add('active');
        }

        spawnHearts(
            window.innerWidth / 2,
            window.innerHeight / 2,
            70
        );

        setTimeout(() => {

            giftBoxContainer.classList.add('fade-out');

        }, 500);

        setTimeout(() => {

            giftBoxContainer.style.display = 'none';

            memoryCard.classList.remove('hidden');

            memoryCard.classList.add('entering');

            typeMessage();

        }, 1000);
    });

    /* =========================
       TYPING
    ========================= */

    let typingFinished = false;
    let typingTimer = null;

    function typeMessage() {

        const text = SURPRISE_CONFIG.message;

        customMessage.textContent = '';

        skipTypingBtn.classList.add('show');

        let index = 0;

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

            const character = text[index];

            cursor.before(character);

            index++;

            let delay = 45;

            if (
                character === '.' ||
                character === '!' ||
                character === '?'
            ) {
                delay = 500;
            }

            if (character === ',') {
                delay = 250;
            }

            typingTimer = setTimeout(
                typeNext,
                delay
            );
        }

        typeNext();

        skipTypingBtn.onclick = () => {

            if (!typingFinished) {

                clearTimeout(typingTimer);

                customMessage.textContent =
                    SURPRISE_CONFIG.message;

                typingFinished = true;
            }

            skipTypingBtn.classList.remove('show');

            spawnHearts(
                window.innerWidth / 2,
                window.innerHeight / 2,
                30
            );

            openEnvelopeOverlay();
        };
    }

    /* =========================
       ENVELOPE
    ========================= */

    let envelopeOpened = false;

    function openEnvelopeOverlay() {

        if (!envelopeOverlay) return;

        envelopeOverlay.classList.remove('hidden');

        requestAnimationFrame(() => {
            envelopeOverlay.classList.add('show');
        });

        if (popupEnvelope) {
            popupEnvelope.classList.remove('active');
        }

        envelopeOpened = false;

        const letters =
            document.querySelectorAll('.draggable-item');

        letters.forEach(letter => {

            letter.dataset.closed = 'false';

            letter.style.display = 'flex';
            letter.style.opacity = '0';
            letter.style.left = '50%';
            letter.style.top = '35%';

            letter.style.transform =
                'translate(-50%, -50%) scale(.1) translateY(120px)';

            letter.style.zIndex = '1';
        });

        closedLetters = 0;
    }

    if (openEnvelopeBtn) {

        openEnvelopeBtn.addEventListener('click', (e) => {

            e.stopPropagation();

            if (envelopeOpened) return;

            envelopeOpened = true;

            popupEnvelope.classList.add('active');

            const letters =
                document.querySelectorAll('.draggable-item');

            const positions = [
                [-80, -130, -8],
                [80, -150, 8],
                [-20, -200, -4],
                [50, -70, 10]
            ];

            letters.forEach((letter, index) => {

                const pos =
                    positions[index] || [0, -100, 0];

                setTimeout(() => {

                    letter.style.opacity = '1';

                    letter.style.transform =
                        `translate(calc(-50% + ${pos[0]}px), calc(-50% + ${pos[1]}px)) scale(1) rotate(${pos[2]}deg)`;

                }, 300 + index * 200);
            });
        });
    }

    /* =========================
       CLOSE ENVELOPE
    ========================= */

    if (closeOverlayBtn) {

        closeOverlayBtn.addEventListener('click', () => {

            envelopeOverlay.classList.remove('show');

            setTimeout(() => {
                envelopeOverlay.classList.add('hidden');
            }, 400);
        });
    }

    /* =========================
       LETTERS
    ========================= */

    let closedLetters = 0;
    let finalStarted = false;

    const closeButtons =
        document.querySelectorAll('.closeLetter');

    closeButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.stopPropagation();

            const letter =
                button.closest('.draggable-item');

            if (!letter) return;

            if (letter.dataset.closed === 'true') {
                return;
            }

            letter.dataset.closed = 'true';

            letter.style.opacity = '0';

            letter.style.transform =
                'translate(-50%, -50%) scale(.1) translateY(100px)';

            closedLetters++;

            setTimeout(() => {

                letter.style.display = 'none';

                const total =
                    document.querySelectorAll(
                        '.draggable-item'
                    ).length;

                if (
                    closedLetters >= total &&
                    !finalStarted
                ) {
                    startFinalSequence();
                }

            }, 400);
        });
    });

    /* =========================
       FINAL SURPRISE
    ========================= */

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

            setTimeout(() => {
                finalSurprise.classList.add('ready');
            }, 1000);

        }, 500);
    }

    /* =========================
       FINAL HEART
    ========================= */

    if (finalHeartButton) {

        finalHeartButton.addEventListener('click', () => {

            spawnHearts(
                window.innerWidth / 2,
                window.innerHeight / 2,
                100
            );

            finalSurprise.classList.add(
                'message-open'
            );

            setTimeout(() => {

                if (finalMessage) {

                    finalMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                }

            }, 150);
        });
    }

    /* =========================
       DRAG LETTERS
    ========================= */

    document
        .querySelectorAll('.draggable-item')
        .forEach(item => {

            let dragging = false;
            let startX = 0;
            let startY = 0;

            let originalX = 0;
            let originalY = 0;

            let rotation = 0;

            function getPosition() {

                const transform =
                    getComputedStyle(item).transform;

                if (
                    !transform ||
                    transform === 'none'
                ) {
                    return {
                        x: 0,
                        y: 0
                    };
                }

                const values =
                    transform
                        .replace('matrix(', '')
                        .replace(')', '')
                        .split(',')
                        .map(Number);

                return {
                    x: values[4] || 0,
                    y: values[5] || 0
                };
            }

            function startDrag(e) {

                if (
                    e.target.closest('.closeLetter')
                ) {
                    return;
                }

                dragging = true;

                item.classList.add('dragging');

                const point =
                    e.type === 'touchstart'
                        ? e.touches[0]
                        : e;

                startX = point.clientX;
                startY = point.clientY;

                const position =
                    getPosition();

                originalX = position.x;
                originalY = position.y;

                item.style.zIndex =
                    String(
                        1000 +
                        Date.now()
                    );
            }

            function moveDrag(e) {

                if (!dragging) return;

                if (e.cancelable) {
                    e.preventDefault();
                }

                const point =
                    e.type === 'touchmove'
                        ? e.touches[0]
                        : e;

                const dx =
                    point.clientX - startX;

                const dy =
                    point.clientY - startY;

                item.style.transform =
                    `translate(${originalX + dx}px, ${originalY + dy}px) scale(1.03) rotate(${rotation}deg)`;
            }

            function endDrag() {

                if (!dragging) return;

                dragging = false;

                item.classList.remove('dragging');

                const position =
                    getPosition();

                item.style.transform =
                    `translate(${position.x}px, ${position.y}px) scale(1) rotate(${rotation}deg)`;
            }

            item.addEventListener(
                'mousedown',
                startDrag
            );

            document.addEventListener(
                'mousemove',
                moveDrag
            );

            document.addEventListener(
                'mouseup',
                endDrag
            );

            item.addEventListener(
                'touchstart',
                startDrag,
                { passive: true }
            );

            document.addEventListener(
                'touchmove',
                moveDrag,
                { passive: false }
            );

            document.addEventListener(
                'touchend',
                endDrag
            );

            item.addEventListener(
                'dragstart',
                e => e.preventDefault()
            );
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

        spawnHearts(
            e.clientX,
            e.clientY,
            20
        );
    });

    console.log('Birthday surprise loaded successfully');
});
