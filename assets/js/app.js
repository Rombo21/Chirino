document.addEventListener('DOMContentLoaded', () => {
    
    // --- SMART STICKY HEADER ---
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Glassmorphic background when scrolled down
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/Show navbar based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Scrolling down - hide menu
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up - show menu
            header.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // --- MOBILE NAVIGATION DRAWER ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const menuBars = menuToggle.querySelectorAll('span');

    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        
        // Animated hamburger icon to 'X' close state
        if (mobileNav.classList.contains('open')) {
            menuBars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            menuBars[1].style.opacity = '0';
            menuBars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            menuBars[0].style.backgroundColor = '#ffffff';
            menuBars[2].style.backgroundColor = '#ffffff';
        } else {
            menuBars[0].style.transform = 'none';
            menuBars[1].style.opacity = '1';
            menuBars[2].style.transform = 'none';
            menuBars[0].style.backgroundColor = 'var(--color-primary-deep)';
            menuBars[2].style.backgroundColor = 'var(--color-primary-deep)';
        }
    });

    // Close mobile nav when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuBars[0].style.transform = 'none';
            menuBars[1].style.opacity = '1';
            menuBars[2].style.transform = 'none';
            menuBars[0].style.backgroundColor = 'var(--color-primary-deep)';
            menuBars[2].style.backgroundColor = 'var(--color-primary-deep)';
        });
    });


    // --- SERVICES TAB SYSTEM ---
    const serviceButtons = document.querySelectorAll('.service-btn');
    const servicePanels = document.querySelectorAll('.service-panel');

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetService = btn.getAttribute('data-service');

            // Remove active classes
            serviceButtons.forEach(b => b.classList.remove('active'));
            servicePanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find and show corresponding panel
            const activePanel = document.getElementById(`panel-${targetService}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });


    // --- INTERACTIVE STATISTICS (COUNT-UP ANIMATION) ---
    const statsSection = document.querySelector('.trajectoria');
    const metricBoxes = document.querySelectorAll('.metric-number');
    let animated = false;

    const startCounting = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const isPercentage = el.getAttribute('data-format') === 'percent';
        let count = 0;
        const speed = target > 500 ? 15 : 40; // Speed adjustment for large integers
        const increment = Math.ceil(target / speed);

        const updateCount = () => {
            count += increment;
            if (count >= target) {
                el.innerHTML = target + (isPercentage ? '<span>%</span>' : '<span>+</span>');
            } else {
                el.innerHTML = count + (isPercentage ? '<span>%</span>' : '<span>+</span>');
                setTimeout(updateCount, 30);
            }
        };
        updateCount();
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                metricBoxes.forEach(box => startCounting(box));
                animated = true; // Run only once
            }
        });
    }, { threshold: 0.2 });

    if (statsSection) {
        countObserver.observe(statsSection);
    }


    // --- SCROLL REVEAL (FADE-IN ANIMATIONS ON SCROLL) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animating once to save memory and process cycles
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});
