document.addEventListener('DOMContentLoaded', () => {
    // Referencias a las Vistas (Pantallas)
    const viewInitial = document.getElementById('view-initial');
    const viewSending = document.getElementById('view-sending');
    const viewSuccess = document.getElementById('view-success');
    const viewCancelled = document.getElementById('view-cancelled');

    // Referencias a los Botones
    const btnStart = document.getElementById('btn-start-sos');
    const btnCancel = document.getElementById('btn-cancel-sos');
    const btnRetry = document.getElementById('btn-retry-sos');
    
    // Elementos de Texto (Contadores)
    const countdownSpan = document.getElementById('countdown');
    const countdownCancelSpan = document.getElementById('countdown-cancel');
    
    // Variables de Control
    let timer = null;
    let cancelTimer = null;
    let timeLeft = 15; // Tiempo para enviar la alerta (segundos)
    let cancelTimeLeft = 15; // Tiempo para volver al inicio tras cancelar

    // --- FUNCIÓN 1: INICIAR ALERTA (Click en botón gigante) ---
    btnStart.addEventListener('click', () => {
        // Cambiar vista: de Inicial a "Enviando..."
        showView(viewSending);
        
        // Reiniciar contador
        timeLeft = 15;
        if(countdownSpan) countdownSpan.innerText = timeLeft;

        // Iniciar cuenta regresiva
        timer = setInterval(() => {
            timeLeft--;
            if(countdownSpan) countdownSpan.innerText = timeLeft;
            
            // Si llega a 0, se envía la alerta
            if (timeLeft <= 0) {
                clearInterval(timer);
                sendAlertSuccess();
            }
        }, 1000);
    });

    // --- FUNCIÓN 2: CANCELAR ALERTA ---
    btnCancel.addEventListener('click', () => {
        // Detener el envío
        clearInterval(timer);
        
        // Cambiar vista: a "Cancelado"
        showView(viewCancelled);

        // Iniciar contador para volver al inicio automáticamente
        cancelTimeLeft = 15;
        if(countdownCancelSpan) countdownCancelSpan.innerText = cancelTimeLeft;

        cancelTimer = setInterval(() => {
            cancelTimeLeft--;
            if(countdownCancelSpan) countdownCancelSpan.innerText = cancelTimeLeft;

            if (cancelTimeLeft <= 0) {
                clearInterval(cancelTimer);
                resetToInitial();
            }
        }, 1000);
    });

    // --- FUNCIÓN 3: REINTENTAR / VOLVER (Click en botón tras cancelar) ---
    if(btnRetry) {
        btnRetry.addEventListener('click', () => {
            clearInterval(cancelTimer); // Detener el contador de retorno
            // Volver a intentar enviar la alerta (o ir al inicio, según prefieras)
            // En este caso, simulamos volver a presionar el botón SOS
            btnStart.click(); 
        });
    }

    // --- FUNCIONES AUXILIARES ---

    // Mostrar éxito
    function sendAlertSuccess() {
        showView(viewSuccess);
        // Aquí iría la lógica real (ej: fetch API a un servidor)
        console.log("¡ALERTA ENVIADA A CONTACTOS DE EMERGENCIA!");
        
        // Opcional: Volver al inicio después de unos segundos
        setTimeout(() => {
            resetToInitial();
        }, 5000); // 5 segundos mostrando el éxito
    }

    // Volver al estado inicial
    function resetToInitial() {
        clearInterval(timer);
        clearInterval(cancelTimer);
        showView(viewInitial);
    }

    // Utilidad para cambiar de vista (oculta todas, muestra una)
    function showView(viewToShow) {
        // Ocultar todas
        [viewInitial, viewSending, viewSuccess, viewCancelled].forEach(view => {
            if(view) {
                view.classList.remove('active');
                view.classList.add('hidden'); // Asegurarnos de usar hidden si tu CSS lo requiere
                // O simplemente quitar active si tu CSS oculta por defecto lo que no es active
                view.style.display = 'none'; // Forzar ocultar por si acaso
            }
        });

        // Mostrar la deseada
        if(viewToShow) {
            viewToShow.classList.add('active');
            viewToShow.classList.remove('hidden');
            viewToShow.style.display = 'flex'; // Forzar mostrar flex
        }
    }
});