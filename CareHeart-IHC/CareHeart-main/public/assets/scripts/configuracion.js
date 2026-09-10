document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS ---
    const checkAlertas = document.getElementById('check-alertas');
    const checkRecordatorios = document.getElementById('check-recordatorios');
    const checkResumen = document.getElementById('check-resumen');
    const inputEmail = document.getElementById('input-email');
    const formConfig = document.getElementById('form-config');
    const contenedorDispositivo = document.getElementById('contenedor-dispositivo');

    // --- 1. INICIALIZAR TODO ---
    cargarPreferencias();
    verificarEstadoDispositivo();

    // --- 2. LÓGICA DISPOSITIVO (VINCULAR / DESVINCULAR) ---

    function verificarEstadoDispositivo() {
        // Leemos si hay dispositivo guardado. Si no existe la key, asumimos que SÍ hay uno por defecto (simulación inicial)
        const dispositivoGuardado = localStorage.getItem('careheart_device_status');
        
        if (dispositivoGuardado === 'unlinked') {
            renderizarSinDispositivo();
        } else {
            renderizarConDispositivo();
        }
    }

    // VISTA 1: Dispositivo Conectado
    function renderizarConDispositivo() {
        contenedorDispositivo.innerHTML = `
            <div class="icono-reloj">
                <span class="material-symbols-outlined">watch</span>
            </div>
            <div class="texto-disp">
                <h4>CareBand Pro v2</h4>
                <p class="estado-ok">● Conectado - Batería 87%</p>
                <p class="serial">S/N: CB-2024-XP99</p>
            </div>
            <button class="btn-desvincular" id="btn-accion-desvincular">Desvincular</button>
        `;

        // Asignar evento al botón recién creado
        document.getElementById('btn-accion-desvincular').addEventListener('click', desvincularDispositivo);
    }

    // VISTA 2: Sin Dispositivo
    function renderizarSinDispositivo() {
        contenedorDispositivo.innerHTML = `
            <div class="icono-reloj icono-gris">
                <span class="material-symbols-outlined">watch_off</span>
            </div>
            <div class="texto-disp">
                <h4 class="texto-gris">No hay dispositivo</h4>
                <p class="serial">Vincula una pulsera para monitorear.</p>
            </div>
            <button class="btn-vincular" id="btn-accion-vincular">Vincular</button>
        `;

        // Asignar evento al botón recién creado
        document.getElementById('btn-accion-vincular').addEventListener('click', vincularDispositivo);
    }

    // VISTA 3: Buscando / Cargando
    function renderizarCargando(texto) {
        contenedorDispositivo.innerHTML = `
            <div class="icono-reloj">
                <span class="material-symbols-outlined rotando">sync</span>
            </div>
            <div class="texto-disp">
                <h4 class="estado-buscando">${texto}</h4>
            </div>
        `;
    }

    // FUNCIÓN: Desvincular
    function desvincularDispositivo() {
        const confirmacion = confirm("¿Estás seguro de que deseas desvincular la pulsera? Dejarás de recibir alertas.");
        
        if (confirmacion) {
            renderizarCargando("Desvinculando...");
            
            setTimeout(() => {
                localStorage.setItem('careheart_device_status', 'unlinked');
                renderizarSinDispositivo();
                alert("Dispositivo desvinculado correctamente.");
            }, 1000); // Simula 1 segundo de proceso
        }
    }

    // FUNCIÓN: Vincular (Simulación)
    function vincularDispositivo() {
        renderizarCargando("Buscando dispositivos cercanos...");

        // Simulamos espera de 2.5 segundos
        setTimeout(() => {
            localStorage.removeItem('careheart_device_status'); // Borra el estado 'unlinked'
            renderizarConDispositivo();
            alert("¡CareBand Pro v2 conectado exitosamente!");
        }, 2500);
    }


    // --- 3. RESTO DE LA CONFIGURACIÓN (PREFERENCIAS) ---

    formConfig.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const preferencias = {
            alertas: checkAlertas.checked,
            recordatorios: checkRecordatorios.checked,
            resumen: checkResumen.checked,
            email: inputEmail.value
        };

        localStorage.setItem('careheart_config', JSON.stringify(preferencias));
        
        const btn = formConfig.querySelector('.btn-guardar');
        const textoOriginal = btn.innerText;
        btn.innerText = "¡Guardado!";
        btn.style.backgroundColor = "#16a34a";
        setTimeout(() => {
            btn.innerText = textoOriginal;
            btn.style.backgroundColor = "";
        }, 2000);
    });

    [checkAlertas, checkRecordatorios, checkResumen].forEach(check => {
        check.addEventListener('change', () => {
            const configActual = JSON.parse(localStorage.getItem('careheart_config')) || {};
            configActual.alertas = checkAlertas.checked;
            configActual.recordatorios = checkRecordatorios.checked;
            configActual.resumen = checkResumen.checked;
            localStorage.setItem('careheart_config', JSON.stringify(configActual));
        });
    });

    function cargarPreferencias() {
        const configGuardada = JSON.parse(localStorage.getItem('careheart_config'));
        if (configGuardada) {
            checkAlertas.checked = configGuardada.alertas;
            checkRecordatorios.checked = configGuardada.recordatorios;
            checkResumen.checked = configGuardada.resumen;
            if(configGuardada.email) inputEmail.value = configGuardada.email;
        }
    }
    // ... (Tu código anterior de configuración) ...

    // --- 4. LÓGICA DE SOPORTE (MODAL) ---
    
    const btnAbrirSoporte = document.getElementById('btn-abrir-soporte');
    const modalSoporte = document.getElementById('modal-soporte');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnIniciarChat = document.getElementById('btn-iniciar-chat');
    const areaChat = document.getElementById('area-chat-simulado');

    // Abrir Modal
    btnAbrirSoporte.addEventListener('click', () => {
        modalSoporte.classList.remove('hidden');
    });

    // Cerrar Modal (Botón X)
    btnCerrarModal.addEventListener('click', () => {
        modalSoporte.classList.add('hidden');
        // Reiniciar estado del chat si se cerró
        setTimeout(() => {
            areaChat.classList.add('hidden');
            document.querySelector('.grid-opciones-soporte').classList.remove('hidden');
        }, 300);
    });

    // Cerrar Modal (Clic afuera)
    modalSoporte.addEventListener('click', (e) => {
        if (e.target === modalSoporte) {
            btnCerrarModal.click();
        }
    });

    // Simulación de Chat
    btnIniciarChat.addEventListener('click', () => {
        // Ocultar opciones y mostrar "Cargando..."
        document.querySelector('.grid-opciones-soporte').classList.add('hidden');
        areaChat.classList.remove('hidden');

        // Simular conexión después de 2 segundos
        setTimeout(() => {
            areaChat.innerHTML = `
                <div style="text-align:left; font-size:0.9rem;">
                    <p style="background:#e5e7eb; padding:8px 12px; border-radius:12px 12px 12px 0; display:inline-block; margin-bottom:5px;">
                        👋 ¡Hola! Soy el asistente virtual de CareHeart.
                    </p>
                    <p style="background:#e5e7eb; padding:8px 12px; border-radius:12px 12px 12px 0; display:inline-block;">
                        ¿En qué puedo ayudarte hoy?
                    </p>
                </div>
                <button onclick="alert('Abriendo chat completo...')" style="margin-top:10px; width:100%; padding:8px; background:#17a19c; color:white; border:none; border-radius:6px; cursor:pointer;">
                    Escribir mensaje
                </button>
            `;
        }, 2000);
    }); 
});