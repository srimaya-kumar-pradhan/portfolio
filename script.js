document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Burger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    // Scroll Animations
    const revealElements = document.querySelectorAll('.section-title, .about-content, .skills-grid, .project-card, .timeline-item');

    // Add 'reveal' class initially to elements we want to animate
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load to show elements already in view
    revealOnScroll();

    // Smooth Scrolling for anchor links (Polyfill-like behavior for header offset if needed, 
    // though CSS scroll-behavior usually handles it. Adding this just in case for precision)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Header offset
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Contact Form Handling (Real Backend)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-send span');
            const originalText = btn ? btn.innerText : 'Send';

            if (btn) btn.innerText = 'Sending...';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    if (btn) btn.innerText = 'Sent!';
                    contactForm.reset();
                    console.log('Message sent successfully');
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                if (btn) btn.innerText = 'Error!';
            }

            setTimeout(() => {
                if (btn) btn.innerText = originalText;
            }, 3000);
        });
    }

    // Monitor User Visit
    const logVisit = async () => {
        try {
            await fetch('http://localhost:5000/api/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: window.location.pathname })
            });
        } catch (e) {
            console.log('Backend not reachable for monitoring');
        }
    };
    logVisit();
});

/* Loader Initialization */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Minimum load time of 1.5s to show off the animation
        setTimeout(() => {
            loader.classList.add('fade-out');
            // Remove from DOM after transition to free up resources (optional, but good for accessibility)
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 1500);
    }
});



