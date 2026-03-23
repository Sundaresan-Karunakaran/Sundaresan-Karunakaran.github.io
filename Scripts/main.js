document.addEventListener('DOMContentLoaded', () => {

    // 1. Reveal Elements on Scroll
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => {
        elementObserver.observe(el);
    });

    // 2. Parallax Background Effect via JS
    const parallaxBg = document.getElementById('parallax-bg');
    let scrollY = window.scrollY;
    let ticking = false;

    function updateParallax() {
        const yOffset = scrollY * 0.3;
        if (parallaxBg) {
            parallaxBg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
            });
            ticking = true;
        }
    });

    // 3. Custom Mouse/Cursor Tracker
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Follow the mouse natively
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorGlow) {
            // Apply immediate transform for smooth following
            // We use clientX directly because it's fixed
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
        }
    });

    // We can also scale up the cursor when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .hover-scale, .hover-scale-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorGlow) {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 0, 0.25) 0%, rgba(255, 0, 0, 0) 70%)';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursorGlow) {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 0, 0.15) 0%, rgba(255, 0, 0, 0) 70%)';
            }
        });
    });

    // 4. Typewriter
    const typeTarget = document.getElementById("typewriter-text");

    if (typeTarget) {
        const fullText = "Welcome.\nI'm Sundaresan Karunakaran";
        let index = 0;

        function typeIntro() {
            if (index < fullText.length) {
                const char = fullText[index] === "\n" ? "<br>" : fullText[index];

                // Wrap only the name part with gradient
                if (index >= fullText.indexOf("I'm")) {
                    typeTarget.innerHTML += `<span class="gradient-text">${char}</span>`;
                } else {
                    typeTarget.innerHTML += char;
                }

                index++;

                let delay = 60 + Math.random() * 60;
                if (char === ".") delay = 400;

                setTimeout(typeIntro, delay);
            }
        }

        setTimeout(typeIntro, 500);
    }
});
