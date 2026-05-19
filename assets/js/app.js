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


    // --- CAREERS FORM & DRAG-AND-DROP CV INTERACTIVITY ---
    const cvUploadZone = document.getElementById('cv-upload-zone');
    const talentCvInput = document.getElementById('talent-cv');
    const uploaderDefaultContent = document.getElementById('uploader-default-content');
    const uploaderFileInfo = document.getElementById('uploader-file-info');
    const selectedFileName = document.getElementById('selected-file-name');
    const selectedFileSize = document.getElementById('selected-file-size');
    const btnRemoveCv = document.getElementById('btn-remove-cv');
    
    const careersForm = document.getElementById('careers-form');
    const careersCardWrapper = document.getElementById('careers-card-wrapper');

    if (cvUploadZone && talentCvInput) {
        // Drag over states
        ['dragover', 'dragenter'].forEach(eventName => {
            cvUploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                cvUploadZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            cvUploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                cvUploadZone.classList.remove('dragover');
            });
        });

        // Drop event
        cvUploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) {
                talentCvInput.files = files;
                handleCvFile(files[0]);
            }
        });

        // File input change event
        talentCvInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleCvFile(e.target.files[0]);
            }
        });

        // Remove file button
        btnRemoveCv.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetCvUploader();
        });
    }

    function handleCvFile(file) {
        const errorCv = document.getElementById('error-talent-cv');
        const parentGroup = talentCvInput.closest('.form-group');
        
        // Strictly check for PDF files
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
            alert('Error: Chirino & Asociados solo admite currículums en formato PDF por motivos de seguridad y estandarización.');
            resetCvUploader();
            
            if (parentGroup) parentGroup.classList.add('has-error');
            if (errorCv) errorCv.textContent = 'El archivo debe ser un documento PDF.';
            return;
        }

        // Format File Size
        let formattedSize = '';
        if (file.size < 1024 * 1024) {
            formattedSize = (file.size / 1024).toFixed(1) + ' KB';
        } else {
            formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        }

        // Display selection info
        selectedFileName.textContent = file.name;
        selectedFileSize.textContent = formattedSize;

        // Visual switches
        uploaderDefaultContent.style.display = 'none';
        uploaderFileInfo.style.display = 'flex';

        // Clear error states
        if (parentGroup) parentGroup.classList.remove('has-error');
    }

    function resetCvUploader() {
        talentCvInput.value = '';
        uploaderFileInfo.style.display = 'none';
        uploaderDefaultContent.style.display = 'flex';
    }

    // Careers Form validation and simulated submission
    if (careersForm) {
        careersForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get fields
            const talentName = document.getElementById('talent-name');
            const talentPhone = document.getElementById('talent-phone');
            const talentEmail = document.getElementById('talent-email');
            const talentArea = document.getElementById('talent-area');
            const talentMessage = document.getElementById('talent-message');

            let isValid = true;

            // Simple Helper for validation
            const validateField = (element, condition, errorId) => {
                const parent = element.closest('.form-group');
                const errorSpan = document.getElementById(errorId);
                if (!condition) {
                    if (parent) parent.classList.add('has-error');
                    isValid = false;
                } else {
                    if (parent) parent.classList.remove('has-error');
                }
            };

            // 1. Validate Name
            validateField(talentName, talentName.value.trim().length >= 3, 'error-talent-name');

            // 2. Validate Phone
            validateField(talentPhone, talentPhone.value.trim().length >= 7, 'error-talent-phone');

            // 3. Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(talentEmail, emailRegex.test(talentEmail.value.trim()), 'error-talent-email');

            // 4. Validate Area Selection
            validateField(talentArea, talentArea.value !== '', 'error-talent-area');

            // 5. Validate CV PDF file upload
            validateField(talentCvInput, talentCvInput.files.length > 0, 'error-talent-cv');

            if (!isValid) {
                // Focus on the first invalid element
                const firstError = careersForm.querySelector('.form-group.has-error .form-input, .form-group.has-error .file-uploader-input');
                if (firstError) firstError.focus();
                return;
            }

            // If valid, trigger premium simulated submit loader
            const submitBtn = document.getElementById('talent-submit-btn');
            
            // Set Loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `
                <span>Enviando Postulación...</span>
                <svg class="uploader-icon" style="width: 16px; height: 16px; margin: 0; display: inline-block; animation: hoverFloating 1s infinite alternate;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-dasharray="10" stroke-dashoffset="0"/>
                </svg>
            `;

            // Get selected area readable text label
            const areaLabel = talentArea.options[talentArea.selectedIndex].text;
            const file = talentCvInput.files[0];

            // Simulation of mail relay and state rendering
            setTimeout(() => {
                // Log final data structures as required by standard specifications
                console.group('=== SIMULACIÓN DE ENVÍO DE POSTULACIÓN (TALENTO) ===');
                console.log('Firma: Chirino & Asociados');
                console.log('Destinatario Futuro: correo@chirino.cl (a definir por el cliente)');
                console.log('Nombre Candidato:', talentName.value);
                console.log('Email Candidato:', talentEmail.value);
                console.log('Teléfono Candidato:', talentPhone.value);
                console.log('Área de Interés:', areaLabel);
                console.log('Currículum Adjunto (PDF):', file.name, `(${ (file.size / 1024).toFixed(1) } KB)`);
                console.log('Carta de Presentación:', talentMessage.value.trim() || 'No adjunta');
                console.log('Estado de la Solicitud: Encolado para despacho en servidor SMTP');
                console.groupEnd();

                // Swap Careers Card UI to Premium success layout
                careersCardWrapper.innerHTML = `
                    <div class="careers-success-state">
                        <div class="success-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h3 class="success-title">¡Postulación Recibida!</h3>
                        <p class="success-message">
                            Gracias por tu interés en unirte a la firma, <strong>${talentName.value}</strong>. Hemos recibido tu CV en formato PDF de manera exitosa para el área de <strong>${areaLabel}</strong> y simulado el despacho al departamento de selección.
                        </p>
                        <button class="btn btn-secondary" onclick="window.location.reload();">Volver a Postulaciones</button>
                    </div>
                `;
            }, 1800);
        });
    }

    // --- SCROLLSPY ACTIVE LINK NAVIGATION ---
    const spyNavLinks = document.querySelectorAll('.nav-link');
    const spyMobileLinks = document.querySelectorAll('.mobile-link');
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = (activeId) => {
        spyNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}` || (activeId === 'home' && href === '#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        spyMobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}` || (activeId === 'home' && href === '#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveLink(entry.target.id);
            }
        });
    }, {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => spyObserver.observe(section));

    // Reinforce for absolute top scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            updateActiveLink('home');
        }
    });

});
