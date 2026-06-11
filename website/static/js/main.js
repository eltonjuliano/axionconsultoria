document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVBAR SCROLL EFFECT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. REVEAL ON SCROLL (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it contains counter, trigger count up
                const counter = entry.target.querySelector('.counter-trigger');
                if (counter) {
                    triggerCounter(counter);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       3. METRIC COUNTERS ANIMATION
       ========================================================================== */
    function triggerCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
                el.innerText = target.toLocaleString('pt-BR') + suffix;
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current).toLocaleString('pt-BR') + suffix;
            }
        }, stepTime);
    }

    // Auto-trigger counters if they enter viewport
    const counters = document.querySelectorAll('.counter-num');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => counterObserver.observe(c));

    /* ==========================================================================
       4. INTERACTIVE RAIO-X EMPRESARIAL
       ========================================================================== */
    const nodes = document.querySelectorAll('.raiox-node');
    const infoTitle = document.getElementById('raiox-info-title');
    const infoText = document.getElementById('raiox-info-text');

    const raioxData = {
        financeiro: {
            title: '<i class="fas fa-coins me-2 text-primary"></i> Gestão Financeira',
            text: 'Avaliamos a eficiência do fluxo de caixa, estrutura de custos, DRE, formação de preço, margens de lucro por produto/serviço e necessidade de capital de giro. Identificamos vazamentos financeiros e oportunidades de otimizar a lucratividade.'
        },
        operacao: {
            title: '<i class="fas fa-cogs me-2 text-primary"></i> Eficiência Operacional',
            text: 'Analisamos seus processos de ponta a ponta para mapear gargalos, desperdícios, nível de automação e dependência de mão de obra. Otimizar a operação reduz custos e torna a empresa escalável para expansão.'
        },
        atendimento: {
            title: '<i class="fas fa-users-cog me-2 text-primary"></i> Qualidade no Atendimento',
            text: 'Avaliamos a jornada de compra do seu cliente, canais de suporte, tempo de resposta e níveis de satisfação (NPS). Clientes fiéis reduzem o custo de aquisição (CAC) e aumentam a receita recorrente (LTV).'
        },
        gestao: {
            title: '<i class="fas fa-briefcase me-2 text-primary"></i> Liderança e Organização',
            text: 'Analisamos o organograma, definição de metas, relatórios gerenciais e a cultura organizacional. Uma gestão profissionalizada permite tomar decisões rápidas baseadas em fatos, não em intuição.'
        },
        marketing: {
            title: '<i class="fas fa-bullhorn me-2 text-primary"></i> Marketing e Captação',
            text: 'Avaliamos os canais de marketing (offline e digital), custo de aquisição de clientes (CAC), consistência da marca e eficácia das campanhas. Garantimos que sua empresa atraia clientes qualificados constantemente.'
        },
        digital: {
            title: '<i class="fas fa-globe me-2 text-primary"></i> Presença Digital e TI',
            text: 'Verificamos canais digitais, sistemas ERP/CRM utilizados, SEO e funis de conversão online. A tecnologia é um dos principais multiplicadores de valor para empresas no mercado atual.'
        },
        dependencia: {
            title: '<i class="fas fa-user-shield me-2 text-primary"></i> Dependência do Proprietário',
            text: 'Avaliamos o nível de centralização da empresa no fundador. Empresas altamente dependentes do dono para operar possuem alto risco e sofrem severos descontos no Valuation. Ajudamos a descentralizar processos.'
        }
    };

    function updateRaioxInfo(nodeKey) {
        const data = raioxData[nodeKey];
        if (data) {
            // Fade effect
            infoTitle.parentElement.style.opacity = 0;
            infoTitle.parentElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                infoTitle.innerHTML = data.title;
                infoText.innerText = data.text;
                infoTitle.parentElement.style.opacity = 1;
                infoTitle.parentElement.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    nodes.forEach(node => {
        // Node hover/click handlers
        const key = node.getAttribute('data-node');
        
        // Setup JS properties for translation in desktop scaling
        let x = 0, y = 0;
        if (node.classList.contains('node-financeiro')) { y = -180; }
        else if (node.classList.contains('node-operacao')) { x = 156; y = -90; }
        else if (node.classList.contains('node-atendimento')) { x = 156; y = 90; }
        else if (node.classList.contains('node-gestao')) { y = 180; }
        else if (node.classList.contains('node-marketing')) { x = -156; y = 90; }
        else if (node.classList.contains('node-digital')) { x = -156; y = -90; }
        else if (node.classList.contains('node-dependencia')) { x = -90; y = -156; }
        
        node.style.setProperty('--x', `${x}px`);
        node.style.setProperty('--y', `${y}px`);

        node.addEventListener('mouseenter', () => {
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            updateRaioxInfo(key);
        });

        node.addEventListener('click', () => {
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            updateRaioxInfo(key);
            
            // On mobile, scroll down to the detail box smoothly
            if (window.innerWidth < 992) {
                document.getElementById('raiox-info-box-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================================
       5. INTERACTIVE VALUATION SIMULATOR
       ========================================================================== */
    const slider = document.getElementById('valuation-slider');
    const valPercebido = document.getElementById('val-percebido');
    const valMelhorado = document.getElementById('val-melhorado');
    const valAumento = document.getElementById('val-aumento');

    if (slider) {
        const updateSimulator = () => {
            const rawValue = parseFloat(slider.value);
            
            // Calculations
            const valorPercebido = rawValue;
            const valorMelhorado = rawValue * 1.5; // +50%
            const diferenca = valorMelhorado - valorPercebido;
            
            // Format BRL Currency
            const formatCurrency = (val) => {
                return val.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            };

            // Update UI elements
            valPercebido.innerText = formatCurrency(valorPercebido);
            valMelhorado.innerText = formatCurrency(valorMelhorado);
            valAumento.innerText = `+50% (${formatCurrency(diferenca)})`;
        };

        slider.addEventListener('input', updateSimulator);
        // Initial run
        updateSimulator();
    }

    /* ==========================================================================
       6. LGPD COOKIE CONSENT BANNER
       ========================================================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Show banner if not accepted previously
        if (!localStorage.getItem('axion_cookies_accepted')) {
            setTimeout(() => {
                cookieBanner.classList.remove('d-none');
                cookieBanner.classList.add('animate-slide-up');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('axion_cookies_accepted', 'true');
            cookieBanner.classList.add('d-none');
        });
    }

    /* ==========================================================================
       7. LEAD FORM AJAX SUBMISSION
       ========================================================================== */
    const leadForm = document.getElementById('lead-form');
    const submitBtn = document.getElementById('btn-submit-lead');
    const formSuccessMessage = document.getElementById('form-success-message');
    const formErrorMessage = document.getElementById('form-error-message');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.invalid-feedback-custom').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));
            formSuccessMessage.classList.add('d-none');
            formErrorMessage.classList.add('d-none');

            // Client-side validations
            const nome = document.getElementById('nome').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            const segmento = document.getElementById('segmento').value;
            const faturamento = document.getElementById('faturamento').value;
            const lgpd = document.getElementById('lgpd_consentimento').checked;

            let hasErrors = false;

            const showError = (fieldId, message) => {
                const field = document.getElementById(fieldId);
                field.classList.add('is-invalid');
                const feedback = document.getElementById(`err-${fieldId}`);
                if (feedback) {
                    feedback.innerText = message;
                    feedback.style.display = 'block';
                }
                hasErrors = true;
            };

            if (!nome) showError('nome', 'O nome completo é obrigatório.');
            if (!empresa) showError('empresa', 'O nome da empresa é obrigatório.');
            if (!telefone) showError('telefone', 'O telefone / WhatsApp é obrigatório.');
            if (!email) {
                showError('email', 'O e-mail é obrigatório.');
            } else if (!email.includes('@')) {
                showError('email', 'Insira um e-mail corporativo válido.');
            }
            if (!segmento) showError('segmento', 'Selecione o segmento.');
            if (!faturamento) showError('faturamento', 'Selecione o faturamento.');
            if (!lgpd) {
                showError('lgpd_consentimento', 'Você deve aceitar a Política de Privacidade para prosseguir.');
            }

            if (hasErrors) {
                // Focus first error field
                const firstErr = document.querySelector('.is-invalid');
                if (firstErr) firstErr.focus();
                return;
            }

            // Prepare Request Data
            const formData = {
                nome,
                empresa,
                telefone,
                email,
                segmento,
                faturamento,
                mensagem: document.getElementById('mensagem').value.trim(),
                lgpd_consentimento: lgpd
            };

            // Enable loading state
            const origBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="form-spinner"></span>Enviando...';

            try {
                // Get CSRF Token
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                const response = await fetch('/submit-lead/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Show success
                    leadForm.reset();
                    formSuccessMessage.classList.remove('d-none');
                    formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Optionally hide form container or display nice card
                    document.getElementById('lead-form-container').style.opacity = 0;
                    setTimeout(() => {
                        document.getElementById('lead-form-container').classList.add('d-none');
                        const successCard = document.getElementById('lead-success-card');
                        successCard.classList.remove('d-none');
                        successCard.classList.add('animate-fade-in');
                    }, 300);
                } else {
                    // Show errors from server
                    if (result.errors) {
                        Object.keys(result.errors).forEach(fieldId => {
                            showError(fieldId, result.errors[fieldId]);
                        });
                    } else {
                        formErrorMessage.innerText = result.message || 'Erro ao enviar dados. Tente novamente.';
                        formErrorMessage.classList.remove('d-none');
                    }
                }
            } catch (err) {
                console.error(err);
                formErrorMessage.innerText = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
                formErrorMessage.classList.remove('d-none');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }
        });
    }
});
