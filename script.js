// Rubik's Cube Assembly (White & Blue Glass Theme)
(function assembleCube() {
    const colors = ['blue', 'green', 'white', 'yellow', 'orange', 'red'];
    const pieces = document.getElementsByClassName('piece');

    if (pieces.length === 0) {
        document.addEventListener('DOMContentLoaded', assembleCube);
        return;
    }

    function mx(i, j) {
        return ([2, 4, 3, 5][j % 4 | 0] + i % 2 * ((j | 0) % 4 * 2 + 3) + 2 * (i / 2 | 0)) % 6;
    }

    function getAxis(face) {
        return String.fromCharCode('X'.charCodeAt(0) + face / 2);
    }

    function moveto(face, id, piece) {
        id.value = id.value + (1 << face);
        const sticker = document.createElement('div');
        sticker.setAttribute('class', 'sticker ' + colors[face]);
        piece.children[face].appendChild(sticker);
        return 'translate' + getAxis(face) + '(' + (face % 2 * 4 - 2) + 'em)';
    }

    for (var i = 0; i < 26; i++) {
        var id = { value: 0 };
        var x = mx(i, i % 18);
        pieces[i].style.transform = 'rotateX(0deg)' + moveto(i % 6, id, pieces[i]) +
            (i > 5 ? moveto(x, id, pieces[i]) + (i > 17 ? moveto(mx(x, x + 2), id, pieces[i]) : '') : '');
        pieces[i].setAttribute('id', 'piece' + id.value);
    }

    // Mouse Move Effect - Changes rotation direction based on mouse position
    // Only on desktop (no touch devices)
    const scene = document.querySelector('.hero-visual .scene');
    const pivot = document.querySelector('.hero-visual .pivot');
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;

    if (scene && pivot) {
        if (!isMobile) {
            // Desktop: Mouse controls rotation direction
            let currentRotY = 0;
            let rotationSpeed = 0.3;
            let targetSpeed = 0.3;

            document.addEventListener('mousemove', (e) => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const deltaX = (e.clientX - centerX) / centerX;
                const deltaY = (e.clientY - centerY) / centerY;

                targetSpeed = deltaX * 1.5;
                const tiltX = -deltaY * 15;
                pivot.style.setProperty('--mouse-x', `${tiltX}deg`);
            });

            function animate() {
                rotationSpeed += (targetSpeed - rotationSpeed) * 0.02;
                currentRotY += rotationSpeed;
                pivot.style.transform = `rotateX(calc(-25deg + var(--mouse-x, 0deg))) rotateY(${currentRotY}deg)`;
                requestAnimationFrame(animate);
            }

            pivot.style.animation = 'none';
            pivot.style.setProperty('--mouse-x', '0deg');
            animate();
        }
        // Mobile: Use CSS animation (no mouse interaction)
    }
})();

// Config
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Observe existing fade-up elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Mobile Center Reveal Logic (Observer-based for max performance)
    if (window.matchMedia("(max-width: 991px)").matches) {
        const cards = document.querySelectorAll('.bento-card');

        // Center-based Activation for Mobile
        const updateActiveCard = () => {
            if (window.innerWidth > 768) return;

            let closestCard = null;
            let minDistance = Infinity;
            const viewportCenter = window.innerHeight / 2;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            cards.forEach(card => {
                if (card === closestCard) {
                    card.classList.add('mobile-active');
                } else {
                    card.classList.remove('mobile-active');
                }
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveCard);
        }, { passive: true });

        // Initial check
        updateActiveCard();
    }
});

// Fetch Projects
async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Richer MOCK Data
    if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        const mockProjects = [
            {
                title: 'Project "Web-Core"',
                desc: 'A high-performance web application demonstrating clean software architecture.',
                tags: ['Web App', 'Architecture', 'Clean Code'],
                category: 'Development',
                image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Visual Dynamics',
                desc: 'A showcase of premium logo designs and brand identity mockups.',
                tags: ['Branding', 'Identity', 'UI/UX'],
                category: 'Design',
                image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Frame-Perfect',
                desc: 'A reel of cinematic video editing and motion graphics samples.',
                tags: ['Video Editing', 'Motion Graphics', 'Cinematic'],
                category: 'Video',
                image: 'https://images.unsplash.com/photo-1574717436401-063d29b30a91?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Synth-Labs',
                desc: 'An experimental collection of original music tracks and sound design.',
                tags: ['Music', 'Sound Design', 'Synthwave'],
                category: 'Audio',
                image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
            }
        ];
        renderProjects(mockProjects);
        return;
    }

    try {
        const response = await fetch(`${API_URL}?action=getProjects`);
        const data = await response.json();
        renderProjects(data);
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'glass-card project-card fade-up';
        card.setAttribute('data-category', project.category || 'Other');

        const tagsHtml = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="${project.image}" alt="${project.title}" class="project-img">
            </div>
            <div class="project-info">
                <span class="project-category">${project.category}</span>
                <div class="project-title">${project.title}</div>
                <p class="project-desc" style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">${project.desc}</p>
                <div class="tech-tags">${tagsHtml}</div>
            </div>
        `;

        grid.appendChild(card);
        observer.observe(card);
    });
}

// Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', fetchProjects);

document.addEventListener('DOMContentLoaded', initTypewriter);

function initTypewriter() {
    const roles = [
        "Web & Software Engineer",
        "Film Maker",
        "Graphic Designer",
        "Video Editor",
        "Music Composer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDelay = 2000;

    // Select the span
    const textElement = document.querySelector('.typewriter-text');
    if (!textElement) return;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = pauseDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/**
 * Handle Contact Form Submission
 * Sends data to Google Sheets via Web App URL
 */
const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4SvWFEgyGYMWE3T6sNYz5LG7_psxfpq7S129LoM6yvGUayKKa6pGn5nKiVqECQ4WK/exec';

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Config check removed

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        // set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'status-message';

        const formData = new FormData(contactForm);

        // Fetch IP and Device Info
        try {
            const ipResponse = await fetch('https://ipapi.co/json/');
            const ipData = await ipResponse.json();
            formData.append('ip', ipData.ip || 'Unknown');
            formData.append('isp', ipData.org || 'Unknown');
            formData.append('city', ipData.city || 'Unknown');
            formData.append('country', ipData.country_name || 'Unknown');
        } catch (e) {
            console.warn('Could not fetch IP info', e);
            formData.append('ip', 'Error');
            formData.append('isp', 'Error');
            formData.append('city', 'Error');
            formData.append('country', 'Error');
        }

        // Add Device Info
        formData.append('device', navigator.userAgent);

        const data = new URLSearchParams(formData);

        try {
            const response = await fetch(CONTACT_SCRIPT_URL, {
                method: 'POST',
                body: data
            });

            const result = await response.json();
            console.log('API Result:', result);

            if (result.status === 'success') {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error('Script returned error');
            }
        } catch (error) {
            console.error('Form Error:', error);
            formStatus.textContent = 'Failed to send message. Please try again.';
            formStatus.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (closeBtn) closeBtn.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu);

        if (closeBtn) {
            closeBtn.addEventListener('click', toggleMenu);
        }

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                if (closeBtn) closeBtn.classList.remove('active');
            });
        });
    }
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only run on desktop
    if (window.matchMedia("(min-width: 992px)").matches && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with lag (animate)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect
        const interactiveElements = document.querySelectorAll('a, button, .bento-card, input, textarea, .logo, .hamburger');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
});

// Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// Magnetic Buttons Effect
if (window.matchMedia("(min-width: 992px)").matches) {
    const magnets = document.querySelectorAll('.logo, .hamburger, .social-links a, .cta-button, .nav-links a');

    magnets.forEach((magnet) => {
        let boundingRect = null;

        // Calculate bounds ONLY on enter to avoid layout thrashing during move
        magnet.addEventListener('mouseenter', () => {
            boundingRect = magnet.getBoundingClientRect();
            magnet.classList.add('magnetizing');
        });

        magnet.addEventListener('mousemove', (e) => {
            if (!boundingRect) return; // Safety check

            const x = e.clientX - boundingRect.left - boundingRect.width / 2;
            const y = e.clientY - boundingRect.top - boundingRect.height / 2;

            // Instant follow (no transition)
            magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        magnet.addEventListener('mouseleave', () => {
            magnet.classList.remove('magnetizing');
            // Smooth return (transition applies)
            magnet.style.transform = 'translate(0px, 0px)';
            boundingRect = null; // Clear cache
        });
    });
}

// Optimized Spotlight Effect (Throttled with rAF)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        let bounds;

        // Cache bounds on mouseenter to avoid thrashing
        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.addEventListener('mousemove', onMouseMove);
        });

        card.addEventListener('mouseleave', () => {
            card.removeEventListener('mousemove', onMouseMove);
            // Optional: Reset position or fade out is handled by CSS
        });

        function onMouseMove(e) {
            // Use rAF to decouple event rate from repaint rate
            requestAnimationFrame(() => {
                const x = e.clientX - bounds.left;
                const y = e.clientY - bounds.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    });
});

// Header Scroll Effect - Dynamic Transparency
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Vanilla Tilt Init - DESKTOP ONLY for performance
document.addEventListener('DOMContentLoaded', () => {
    // Only enable on desktop - mobile GPUs struggle with this
    if (typeof VanillaTilt !== 'undefined' && window.matchMedia("(min-width: 992px)").matches) {
        VanillaTilt.init(document.querySelectorAll(".bento-card"), {
            max: 3,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.01
        });
    }
});

// Lenis already initialized above

// Loading Screen Logic (Min 3s)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Allow scroll after load (optional if overflow hidden was applied to body)
            document.body.style.overflow = 'auto';
        }, 4200); // 4.2s for Write-Glow-Erase completion
    }
});

// Theme Switcher Logic - SMOOTH 2 SECOND FADE (60 FPS)
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');
    const html = document.documentElement;

    // Create fade overlay - append to HTML element (outside body's no-transition scope)
    const overlay = document.createElement('div');
    overlay.id = 'theme-transition-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;opacity:0;';
    document.documentElement.appendChild(overlay);

    // Check saved preference (instant on load)
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        html.setAttribute('data-theme', 'light');
        icon.classList.replace('bx-sun', 'bx-moon');
    }

    let isAnimating = false;

    // Toggle Event - SMOOTH 2 SECOND FADE
    toggleBtn.addEventListener('click', () => {
        if (isAnimating) return; // Prevent double-click
        isAnimating = true;

        const currentTheme = html.getAttribute('data-theme');
        const targetIsDark = currentTheme === 'light';

        // Set overlay color to target theme background
        overlay.style.background = targetIsDark ? '#02040a' : '#F3F4F6';

        // Phase 1: ATTACK - Fast fade IN (0.5 second)
        overlay.style.setProperty('transition', 'opacity 0.5s ease', 'important');
        overlay.style.opacity = '1';

        setTimeout(() => {
            // At peak opacity, switch theme instantly (hidden behind overlay)
            document.body.classList.add('no-transition');

            if (targetIsDark) {
                html.removeAttribute('data-theme');
                icon.classList.replace('bx-moon', 'bx-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('data-theme', 'light');
                icon.classList.replace('bx-sun', 'bx-moon');
                localStorage.setItem('theme', 'light');
            }

            // Force repaint to apply theme
            html.offsetHeight;

            // IMPORTANT: Remove no-transition FIRST
            document.body.classList.remove('no-transition');

            // Wait for browser, then RELEASE
            setTimeout(() => {
                // Phase 2: RELEASE - Slow fade OUT (2.5 seconds)
                overlay.style.setProperty('transition', 'opacity 2.5s ease', 'important');

                // Wait for browser to register new transition
                requestAnimationFrame(() => {
                    overlay.style.opacity = '0';

                    setTimeout(() => {
                        isAnimating = false;
                    }, 2500);
                });
            }, 50);
        }, 500); // Match attack duration
    });
});

