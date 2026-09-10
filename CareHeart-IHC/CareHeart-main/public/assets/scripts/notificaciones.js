document.addEventListener('DOMContentLoaded', () => {
    const btnCampana = document.querySelector('.btn-notificacion');
    
    // --- 1. VERIFICAR ALERTAS REALES (LocalStorage) ---
    // Si se activó el SOS en la otra página, encendemos la campana
    const estadoSOS = localStorage.getItem('careheart_sos_active'); // 'true' o 'false'
    
    if (estadoSOS === 'true') {
        activarModoAlerta("¡SOS ACTIVO! El paciente solicitó ayuda.");
    }

    // --- 2. SIMULACIÓN (Para que veas el efecto ahora mismo) ---
    // A los 3 segundos, simulamos una alerta de salud
    setTimeout(() => {
        // Solo activamos si no estaba activa ya
        if (!btnCampana.classList.contains('alerta')) {
            activarModoAlerta("Alerta: Ritmo cardíaco irregular detectado (125 BPM)");
            
            // Opcional: Reproducir un sonido suave
            // const audio = new Audio('assets/sounds/alert.mp3'); 
            // audio.play().catch(e => console.log("Audio bloqueado por navegador"));
        }
    }, 4000);

    // --- FUNCIONES ---

    function activarModoAlerta(mensaje) {
        if (!btnCampana) return;

        // 1. Cambiar estilo visual
        btnCampana.classList.add('alerta');
        
        // 2. Mostrar "Tooltip" o título al pasar el mouse
        btnCampana.setAttribute('title', mensaje);

        // 3. Comportamiento al hacer clic
        btnCampana.onclick = () => {
            // Ir a la página de alertas para ver el detalle
            // Guardamos el mensaje para mostrarlo allá (opcional)
            localStorage.setItem('careheart_ultima_alerta', mensaje);
            window.location.href = 'alertas.html';
        };
    }
}); 