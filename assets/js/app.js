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
    // --- NOTICIAS RELACIONADAS AL RUBRO (DATASET DE 12 ARTÍCULOS) ---
    const newsArticles = {
        'flujo-efectivo': {
            category: 'finanzas',
            date: 'Enero 2027',
            readTime: '8 min',
            title: 'Gestión de Flujo de Efectivo en Tiempos de Incertidumbre: Planificación Financiera Estratégica',
            contentHtml: `
                <p>En el dinámico entorno económico chileno, la gestión prudente y anticipada de la liquidez representa la principal salvaguarda de la continuidad y el crecimiento empresarial.</p>
                <h4>El Flujo de Caja como Tablero de Control de Mando</h4>
                <p>Un error sumamente común en las gerencias de administración y finanzas es confundir la rentabilidad reflejada en el estado de resultados con la disponibilidad efectiva de caja. Una empresa puede ser altamente rentable en papel pero enfrentar una cesación de pagos por descalces severos en los ciclos de cobro y pago.</p>
                <blockquote>"La rentabilidad es una opinión, pero la caja es un hecho real." - Felipe Chirino, Socio de Consultoría Financiera</blockquote>
                <h4>Estrategias Indispensables para Optimizar la Liquidez</h4>
                <ul>
                    <li><strong>Proyecciones de Caja Dinámicas:</strong> Diseñe modelos predictivos con escenarios conservadores a 13 semanas (corto plazo) y 12 meses, actualizándolos semanalmente con las cobranzas reales efectivas.</li>
                    <li><strong>Renegociación Preventiva de Cuentas por Pagar:</strong> Establezca alianzas comerciales de largo aliento con proveedores clave para flexibilizar plazos sin interrumpir la cadena de suministro.</li>
                    <li><strong>Optimización de Ratios de Capital de Trabajo:</strong> Reduzca al mínimo los días de inventario inmovilizado y los días de cuentas por cobrar de clientes (DSO), implementando políticas rigurosas y amigables de cobranza activa.</li>
                </ul>
                <p>Nuestra área de consultoría financiera estratégica asiste a directorios y gerencias a implementar tableros de control de tesorería inteligentes, asegurando la resiliencia operativa y la toma de decisiones basada en datos matemáticos fidedignos.</p>
            `
        },
        'ley-karin': {
            category: 'laboral',
            date: 'Diciembre 2026',
            readTime: '7 min',
            title: 'Implementación de la Ley Karin: Protocolos obligatorios contra el acoso en las empresas',
            contentHtml: `
                <p>La entrada en vigencia de la Ley Karin introduce cambios de primer orden en el Código del Trabajo en Chile, estableciendo un marco regulatorio sumamente riguroso para la prevención, investigación y sanción del acoso laboral, sexual y la violencia en los espacios de trabajo.</p>
                <h4>Nuevas Obligaciones Legales Ineludibles para los Empleadores</h4>
                <p>La normativa obliga a todas las empresas a contar con un protocolo formal de prevención del acoso, el cual debe ser difundido activamente a toda la organización. Ya no es optativo; la omisión de estos protocolos expone a las organizaciones a graves contingencias y multas de la Dirección del Trabajo (DT).</p>
                <h4>Elementos Clave que debe Incorporar su Protocolo de Ley Karin</h4>
                <ol>
                    <li><strong>Matriz de Identificación de Riesgos Psicosociales:</strong> Evaluar de forma periódica las condiciones ambientales y relacionales que puedan generar focos de vulnerabilidad o conflicto.</li>
                    <li><strong>Canal de Denuncias Seguro y Confidencial:</strong> Disponer de un canal formal con resguardo estricto del anonimato y la confidencialidad, operado bajo estrictos principios de imparcialidad.</li>
                    <li><strong>Procedimiento de Investigación Rápido:</strong> Establecer plazos perentorios (máximo 30 días) para resolver denuncias internas e informar oportunamente los resultados a la DT.</li>
                </ol>
                <p>Nuestra división de asesoría laboral y legal asiste a las áreas de recursos humanos en el diseño de protocolos personalizados, capacitaciones corporativas y el acompañamiento experto durante investigaciones internas para resguardar la salud organizacional y cumplir cabalmente con la ley.</p>
            `
        },
        'auditoria-inventario': {
            category: 'contabilidad',
            date: 'Noviembre 2026',
            readTime: '6 min',
            title: 'Control de Inventarios: Métodos de auditoría interna para el sector retail y distribución',
            contentHtml: `
                <p>Para las organizaciones con giros dedicados al comercio mayorista, minorista o de distribución logística, las mermas no detectadas y las distorsiones en los balances de inventario representan una pérdida silenciosa y constante de rentabilidad.</p>
                <h4>El Impacto Contable y Financiero de las Discrepancias</h4>
                <p>Una contabilidad de inventarios inexacta distorsiona el margen bruto de explotación y altera de manera directa el cálculo de los impuestos corporativos corporativos, gatillando además serias observaciones por parte de auditores externos y del propio Servicio de Impuestos Internos (SII).</p>
                <blockquote>"Un balance fidedigno nace de la consistencia milimétrica entre las bodegas físicas y los sistemas de registros contables auxiliares." - Ricardo Chirino, Socio Principal</blockquote>
                <h4>Mejores Prácticas Contables y de Control Interno</h4>
                <ul>
                    <li><strong>Conteos Cíclicos Rotativos:</strong> Sustituya los extenuantes inventarios generales anuales por auditorías físicas aleatorias diarias o semanales a productos de alta rotación o alto costo.</li>
                    <li><strong>Conciliación de Sistemas Integrados:</strong> Automatice e integre los registros de su ERP contable con los sistemas de control de bodegas (WMS), eliminando las digitaciones manuales propensas a errores.</li>
                    <li><strong>Provisión por Deterioro u Obsolescencia:</strong> Realice análisis técnicos rigurosos para provisionar en tiempo y forma el desmedro de existencias, acogiéndose a los requerimientos tributarios del SII.</li>
                </ul>
                <p>Nuestro equipo de auditoría y contabilidad apoya a las gerencias de operaciones en el diseño de metodologías de inventario robustas que garantizan estados financieros exactos y protegen el patrimonio de la firma.</p>
            `
        },
        'sii-patrimonio': {
            category: 'tributario',
            date: 'Octubre 2026',
            readTime: '8 min',
            title: 'Declaración de Patrimonio ante el SII: Puntos críticos y fiscalización para altos patrimonios',
            contentHtml: `
                <p>La fiscalización a personas de altos patrimonios y grupos familiares (Family Offices) ha tomado una prioridad estratégica para el Servicio de Impuestos Internos (SII), respaldado por modernas herramientas de analítica de datos e intercambio automático de información internacional.</p>
                <h4>Focos Principales de Revisión del Ente Tributario</h4>
                <p>El SII cruza activamente las compras de bienes raíces, vehículos de alta gama, constitución de sociedades y transacciones de divisas en el extranjero con las rentas declaradas por las personas naturales involucradas en el formulario 22. Cualquier descalce material gatilla procesos inmediatos de citación y rectificación.</p>
                <h4>Aspectos Críticos a Revisar Rigurosamente</h4>
                <ol>
                    <li><strong>Justificación de Inversiones:</strong> Asegurar el origen plenamente justificado y documentado de los fondos utilizados para constituir sociedades de inversión o adquirir activos no operacionales.</li>
                    <li><strong>Bienes y Activos en el Exterior:</strong> Cumplir rigurosamente con las declaraciones juradas anuales obligatorias (ej. F1929) detallando cuentas, depósitos e inversiones fuera de las fronteras de Chile.</li>
                    <li><strong>Transacciones de Relacionados:</strong> Supervisar que las operaciones de mutuo o préstamos de fondos entre sociedades filiales y socios controladores se realicen a tasas y condiciones de mercado razonables.</li>
                </ol>
                <p>Nuestros expertos en ingeniería tributaria estructuran el patrimonio de manera eficiente y transparente, asegurando el estricto cumplimiento del marco legal y mitigando el riesgo de costosos litigios o reparos impositivos.</p>
            `
        },
        'reforma-pensiones': {
            category: 'laboral',
            date: 'Septiembre 2026',
            readTime: '6 min',
            title: 'Reforma Previsional en Chile: Planificación ante los incrementos de cotización del empleador',
            contentHtml: `
                <p>El debate y avance legislativo en materia previsional en Chile anticipa una profunda reestructuración del costo de contratación laboral para los empleadores a mediano plazo, obligando a una planificación presupuestaria rigurosa.</p>
                <h4>El Incremento en las Cotizaciones Patronales</h4>
                <p>El pilar central de la reforma contempla un incremento paulatino en la tasa de cotización previsional obligatorio de cargo exclusivo del empleador. Este incremento progresivo de puntos porcentuales incidirá de forma directa sobre la planilla general de remuneraciones de las compañías chilenas.</p>
                <blockquote>"Anticipar el impacto financiero de las reformas de seguridad social en los presupuestos anuales es clave para mantener la competitividad de costos." - Ricardo Chirino, Socio Principal</blockquote>
                <h4>Estrategias Preventivas y Administrativas aconsejadas</h4>
                <ul>
                    <li><strong>Simulación de Escenarios Presupuestarios:</strong> Modele el impacto de las alzas sobre la nómina en horizontes de 3 a 5 años, evaluando la viabilidad financiera de nuevos planes de contratación.</li>
                    <li><strong>Optimización de Procesos de Nómina:</strong> Elimine ineficiencias administrativas en el cálculo de gratificaciones legales y horas extras para compensar los incrementos obligatorios.</li>
                    <li><strong>Capacitación al Personal de Finanzas y RRHH:</strong> Asegure que el equipo de liquidación domine a cabalidad las futuras modificaciones impositivas y de seguridad social.</li>
                </ul>
                <p>Nuestra firma colabora estrechamente con las gerencias de finanzas de medianas empresas para modelar presupuestos de personal sólidos y estructurar esquemas de compensación eficientes bajo el nuevo marco de seguridad social.</p>
            `
        },
        'tasa-maxima': {
            category: 'finanzas',
            date: 'Agosto 2026',
            readTime: '5 min',
            title: 'Tasa Máxima Convencional: Impacto de las nuevas regulaciones en el financiamiento Pyme',
            contentHtml: `
                <p>El marco regulatorio chileno establece límites estrictos para los intereses máximos que las instituciones financieras y comerciales pueden cobrar por operaciones de crédito en pesos o UF, conocida como la Tasa Máxima Convencional (TMC).</p>
                <h4>¿Cómo afecta la TMC al Acceso al Crédito Corporativo?</h4>
                <p>Si bien la TMC busca proteger a los deudores frente a tasas de usura, variaciones macroeconómicas y ajustes de tasas del Banco Central ejercen presiones constantes en las evaluaciones de riesgo que la banca realiza para otorgar financiamiento a medianas y pequeñas empresas.</p>
                <h4>Estrategias para Negociar Condiciones Financieras Favorables</h4>
                <ol>
                    <li><strong>Diversificación de Fuentes Financieras:</strong> No concentre su endeudamiento corporativo en un solo banco; evalúe alternativas como el factoring institucional, confirming o créditos estructurados de fomento.</li>
                    <li><strong>Fortalecimiento del Perfil de Garantías:</strong> El uso de garantías reales o el respaldo de fondos de garantía (Fogape) reduce significativamente la prima de riesgo exigida, facilitando tasas inferiores a la TMC.</li>
                    <li><strong>Presentación Profesional de Carpetas Tributarias y Contables:</strong> Presentar balances consolidados limpios, firmados por contadores auditores calificados, proyecta confianza técnica y disminuye los ratios de riesgo asignados.</li>
                </ol>
                <p>Nuestra consultoría estratégica actúa como puente de confianza contable entre su empresa y el sistema bancario, preparando la información y diseñando estrategias financieras idóneas para asegurar el menor costo de capital posible.</p>
            `
        },
        'renta-2026': {
            category: 'tributario',
            date: 'Marzo 2026',
            readTime: '6 min',
            title: 'Operación Renta 2026: Estrategias clave de mitigación para medianas empresas',
            contentHtml: `
                <p>La Operación Renta 2026 representa un desafío regulatorio sustancial para las medianas y grandes empresas en Chile, marcado por nuevas directrices del Servicio de Impuestos Internos (SII) destinadas a aumentar la fiscalización y la transparencia financiera corporativa.</p>
                <h4>Foco de Fiscalización del SII para este periodo</h4>
                <p>Este año, el ente tributario ha puesto especial atención en las declaraciones de gastos rechazados y en los créditos tributarios de activos fijos. Es imperativo revisar exhaustivamente el balance general antes de proceder a la declaración definitiva.</p>
                <blockquote>"La prevención y auditoría anticipada de saldos es la mejor defensa frente a futuras revisiones y rectificaciones del SII." - Ricardo Chirino, Socio Principal</blockquote>
                <h4>Estrategias recomendadas para Mitigar Riesgos</h4>
                <ul>
                    <li><strong>Depreciación Instantánea y Acelerada:</strong> Maximice el uso de incentivos vigentes de depreciación para reducir la renta líquida imponible de manera legal y estructurada.</li>
                    <li><strong>Revisión de Gastos Aceptados:</strong> Asegure la correspondencia directa del gasto con el giro de la empresa según el reformado Artículo 31 de la Ley sobre Impuesto a la Renta (LIR).</li>
                    <li><strong>Monitoreo de Pérdidas Tributarias:</strong> Lleve un registro impecable de las pérdidas de arrastre acumuladas de periodos anteriores para optimizar el saldo final.</li>
                </ul>
                <p>Una planificación tributaria adecuada no busca eludir obligaciones, sino acogerse legalmente a los beneficios fiscales que el marco regulatorio provee a los contribuyentes que mantienen una contabilidad ordenada y rigurosa.</p>
            `
        },
        'ley-40-horas': {
            category: 'laboral',
            date: 'Abril 2026',
            readTime: '5 min',
            title: 'Implementación de la Ley 40 Horas: Auditoría preventiva en procesos de nómina',
            contentHtml: `
                <p>Con la entrada en vigencia gradual de la Ley 40 Horas en Chile, las empresas se enfrentan a la urgente necesidad de adaptar sus jornadas laborales sin descuidar la productividad ni infringir la nueva normativa legal.</p>
                <h4>Puntos críticos en el Control de Asistencia</h4>
                <p>La Dirección del Trabajo (DT) ha intensificado las inspecciones sobre los sistemas de registro de asistencia digital. Ya no basta con planillas manuales de firma; el sistema debe garantizar la trazabilidad e inviolabilidad completa de los datos de ingreso y egreso de cada colaborador.</p>
                <h4>Pasos para una Transición de Nómina Exitosa</h4>
                <ol>
                    <li><strong>Revisión de Contratos de Trabajo:</strong> Actualizar los anexos contractuales especificando detalladamente la nueva distribución horaria semanal acordada.</li>
                    <li><strong>Exclusión del Artículo 22:</strong> Redefinir claramente qué cargos se mantendrán bajo la exclusión del inciso segundo del Art. 22 del Código del Trabajo, limitándolo estrictamente a gerentes y subgerentes con facultades de administración.</li>
                    <li><strong>Automatización del Cálculo de Horas Extras:</strong> Integrar en su software de remuneraciones el recargo legal correspondiente sobre la nueva base horaria reducida para evitar errores de cálculo en liquidaciones mensuales.</li>
                </ol>
                <p>Nuestra firma ayuda a las gerencias de recursos humanos y finanzas a realizar auditorías preventivas integrales para transitar fluidamente hacia el estándar de las 40 horas, minimizando riesgos de demandas y multas administrativas.</p>
            `
        },
        'gobierno-corporativo': {
            category: 'finanzas',
            date: 'Mayo 2026',
            readTime: '8 min',
            title: 'Gobierno Corporativo y control de gestión en empresas familiares',
            contentHtml: `
                <p>El traspaso generacional y la profesionalización del control administrativo son los hitos más delicados para la supervivencia y expansión de las empresas familiares en el mercado chileno.</p>
                <h4>El Protocolo Familiar Contable</h4>
                <p>Un error sumamente recurrente es mezclar las finanzas personales de los socios fundadores con el patrimonio neto de la sociedad operativa. Esto no solo genera distorsiones contables graves, sino que representa un riesgo tributario de primer orden ante fiscalizaciones del SII.</p>
                <blockquote>"Separar la tesorería corporativa del patrimonio familiar es el primer paso indispensable hacia una corporación institucional sólida y confiable." - Felipe Chirino, Socio de Consultoría</blockquote>
                <h4>Herramientas de Control Financiero sugeridas</h4>
                <ul>
                    <li><strong>Protocolo de Junta de Socios Obligatoria:</strong> Definir una frecuencia formal de comités de gestión para evaluar balances de manera institucional, aislando el debate de los almuerzos familiares.</li>
                    <li><strong>Auditoría Contable de Terceros:</strong> Someter los balances a la revisión anual de auditores independientes, facilitando la objetividad técnica.</li>
                    <li><strong>Plan de Sucesión de Liderazgo:</strong> Diseñar la estructura jurídica de traspaso accionario con anticipación, definiendo roles basados en mérito técnico.</li>
                </ul>
                <p>El desarrollo de un gobierno corporativo robusto no diluye la esencia familiar de la empresa, sino que la dota del rigor institucional requerido para perdurar por generaciones.</p>
            `
        },
        'modernizacion-sii': {
            category: 'tributario',
            date: 'Mayo 2026',
            readTime: '7 min',
            title: 'Modernización SII 2026: Facturación Electrónica y Fiscalización Digital Activa',
            contentHtml: `
                <p>El Servicio de Impuestos Internos de Chile continúa liderando la transformación tecnológica fiscal en la región con la incorporación de algoritmos avanzados de inteligencia artificial aplicados al control de transacciones en tiempo real.</p>
                <h4>El fin del desfase en la detección de inconsistencias</h4>
                <p>Los sistemas automatizados del SII hoy cruzan las compras con facturación electrónica de forma diaria. Cualquier disparidad entre el IVA crédito reclamado por una empresa y los reportes emitidos por el proveedor emisor activa una pre-alerta de inconsistencia antes del envío mensual del Formulario 29.</p>
                <h4>Acciones de Control Preventivo Indispensables</h4>
                <ul>
                    <li><strong>Conciliación Diaria Automatizada:</strong> Implementar conciliaciones diarias entre el portal del SII y la contabilidad interna de la empresa para detectar discrepancies inmediatamente antes de los cierres mensuales.</li>
                    <li><strong>Capacitación de Adquisiciones:</strong> Entrenar al equipo de compras para evitar la recepción de documentos tributarios con glosas genéricas o descripciones de producto ambiguas.</li>
                </ul>
                <p>La modernización digital exige un control preventivo constante por parte de asesores expertos. Mantenerse reactivo ante el SII es hoy un riesgo financiero y operativo inaceptable.</p>
            `
        },
        'errores-ifrs': {
            category: 'contabilidad',
            date: 'Junio 2026',
            readTime: '6 min',
            title: 'Transición a IFRS Pyme: Errores Contables Frecuentes en Balances Corporativos',
            contentHtml: `
                <p>A pesar de que las normas IFRS para Pymes llevan años implementadas de forma oficial en Chile, un alto porcentaje de balances de medianas empresas sigue reportando prácticas tributaristas en lugar de estándares contables de representación fiel.</p>
                <h4>El peligro de mezclar Contabilidad Tributaria y Financiera</h4>
                <p>Declarar el valor de los activos basándose únicamente en la depreciación tributaria lineal, en vez del valor de recuperación o valor razonable exigido por la norma contable IFRS, distorsiona gravemente los estados financieros frente a comités de riesgo de bancos e inversionistas internacionales.</p>
                <h4>Errores comunes a auditar urgentemente</h4>
                <ol>
                    <li><strong>Valoración de Inventarios:</strong> No aplicar las pruebas de deterioro de inventarios obsoletos o de lento movimiento, inflando de manera artificial el activo realizable en el balance.</li>
                    <li><strong>Provisión de Vacaciones y Años de Servicio:</strong> Omitir provisionar mensualmente el pasivo devengado por concepto de vacaciones acumuladas de los trabajadores, afectando la liquidez real expuesta.</li>
                    <li><strong>Clasificación de Arrendamientos (Leasing):</strong> Falta de registro de contratos de leasing bajo la norma correspondiente, omitiendo pasivos financieros sustanciales que alteran los ratios de endeudamiento.</li>
                </ol>
                <p>Una contabilidad bajo estándares internacionales (IFRS) no solo robustece el gobierno corporativo interno, sino que abre las puertas a mejores condiciones de financiamiento y valoraciones corporativas.</p>
            `
        },
        'financiamiento-tasa': {
            category: 'finanzas',
            date: 'Julio 2026',
            readTime: '9 min',
            title: 'Financiamiento Corporativo: Cómo preparar Balances para Negociar Tasas ante la Banca',
            contentHtml: `
                <p>En un entorno macroeconómico dinámico y competitivo, el acceso a líneas de financiamiento a tasas preferenciales es crucial para sostener los proyectos de expansión y la continuidad de las empresas.</p>
                <h4>La mirada de los Analistas de Riesgo Bancario</h4>
                <p>Los bancos no analizan únicamente el saldo de su cuenta corriente o su volumen de facturación. Su foco principal de evaluación está en los ratios de cobertura de intereses, rentabilidad sobre activos (ROA), apalancamiento general y el flujo de caja operativo neto (EBITDA).</p>
                <h4>Preparación para el Comité de Crédito Bancario</h4>
                <ul>
                    <li><strong>Optimización del Capital de Trabajo:</strong> Reduzca el ciclo de conversión de efectivo cobrando de manera más eficiente a sus clientes y negociando mejores plazos estratégicos con proveedores.</li>
                    <li><strong>Presentación de Estados Financieros Auditados:</strong> Presentar balances con el sello y la firma de una firma auditora externa de prestigio aumenta radicalmente la confianza de los analistas de crédito.</li>
                    <li><strong>Proyecciones de Flujo de Caja Sustentables:</strong> Adjuntar flujos proyectados realistas basados en modelos técnicos e históricos claros, justificando con precisión matemática el destino y retorno de los fondos solicitados.</li>
                </ul>
                <p>Llegar al banco con un balance desordenado o mal consolidado destruye el poder de negociación de la gerencia, resultando en tasas de interés sumamente punitivas o directamente en el rechazo de la solicitud de crédito.</p>
            `
        }
    };

    // --- FILTRADO Y PAGINACIÓN INTEGRADA DE NOTICIAS DE A 6 ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.blog-card');
    const loadMoreBtn = document.getElementById('blog-load-more-btn');
    const showLessBtn = document.getElementById('blog-show-less-btn');

    let currentFilter = 'all';
    let maxVisibleCount = 6;

    const updateNewsDisplay = () => {
        const matchingCards = [];

        // 1. Filtrar las tarjetas que corresponden a la categoría activa
        newsCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (currentFilter === 'all' || cardCategory === currentFilter) {
                matchingCards.push(card);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // 2. Aplicar paginación (bloques de maxVisibleCount)
        matchingCards.forEach((card, index) => {
            if (index < maxVisibleCount) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // 3. Gestionar visibilidad de botones "Ver más" y "Ver menos"
        const totalMatching = matchingCards.length;
        
        if (totalMatching > maxVisibleCount) {
            // Quedan más tarjetas por revelar
            if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
            if (showLessBtn) showLessBtn.style.display = 'none';
        } else {
            // Ya se muestran todas las tarjetas filtradas
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            
            // Mostrar "Ver menos" solo si mostramos más del primer bloque inicial de 6
            if (totalMatching > 6 && maxVisibleCount > 6) {
                if (showLessBtn) showLessBtn.style.display = 'inline-flex';
            } else {
                if (showLessBtn) showLessBtn.style.display = 'none';
            }
        }
    };

    // Inicializar visualización en carga de página
    if (newsCards.length) {
        updateNewsDisplay();
    }

    // Eventos de botones de filtrado
    if (filterButtons.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.getAttribute('data-filter');

                // Intercambiar clase activa
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Reiniciar contador de paginación al cambiar de filtro
                maxVisibleCount = 6;
                updateNewsDisplay();
            });
        });
    }

    // Evento botón "Ver más"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            maxVisibleCount += 6; // Desplegar lote de siguientes 6
            updateNewsDisplay();
        });
    }

    // Evento botón "Ver menos"
    if (showLessBtn) {
        showLessBtn.addEventListener('click', () => {
            maxVisibleCount = 6; // Restablecer a las 6 iniciales
            updateNewsDisplay();

            // Desplazamiento suave al inicio de la sección de blog
            const blogSection = document.getElementById('blog');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // --- MODAL PREMIUM DE LECTURA DINÁMICA ---
    const modalOverlay = document.getElementById('news-modal-overlay');
    const modalClose = document.getElementById('news-modal-close');
    const modalMeta = document.getElementById('news-modal-meta');
    const modalTitle = document.getElementById('news-modal-title');
    const modalBannerImg = document.getElementById('news-modal-banner-img');
    const modalBody = document.getElementById('news-modal-body');

    const openNewsModal = (articleId) => {
        const article = newsArticles[articleId];
        if (!article) return;

        // Cargar contenidos
        modalMeta.textContent = `${article.category.toUpperCase()} • ${article.date} • LECTURA: ${article.readTime}`;
        modalTitle.textContent = article.title;
        modalBody.innerHTML = article.contentHtml;
        
        // Asignar fondo degradado premium al banner según la categoría
        let gradient = 'linear-gradient(135deg, var(--color-primary-deep-light), var(--color-primary))';
        if (article.category === 'laboral' || article.category === 'contabilidad') {
            gradient = 'linear-gradient(135deg, var(--color-primary-deep), var(--color-accent))';
        } else if (article.category === 'finanzas') {
            gradient = 'linear-gradient(135deg, #1f2937, var(--color-primary))';
        }
        modalBannerImg.style.background = gradient;

        // Mostrar overlay
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
    };

    const closeNewsModal = () => {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaurar scroll
    };

    // Añadir escuchador de clics a todas las tarjetas de noticias
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            openNewsModal(id);
        });
    });

    // Escuchadores de cierre
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeNewsModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeNewsModal();
            }
        });
    }

    // Tecla ESC para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeNewsModal();
        }
    });

});
