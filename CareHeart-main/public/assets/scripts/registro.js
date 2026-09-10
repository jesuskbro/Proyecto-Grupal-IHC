document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('form-registro');
    const modalExito = document.getElementById('modal-exito');
    
    // Inputs para validación
    const pass1 = document.getElementById('password');
    const pass2 = document.getElementById('confirm-password');

    registroForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        // 1. Validación básica de contraseñas
        if (pass1.value !== pass2.value) {
            alert("Las contraseñas no coinciden. Por favor verifícalas.");
            return;
        }

        // 2. Simular proceso de registro (Mostrar Modal)
        // Reutilizamos las clases .hidden y .active del CSS de login
        modalExito.classList.remove('hidden');
        modalExito.classList.add('active');

        // 3. Redirigir después de 2 segundos
        setTimeout(() => {
            // Guardamos un flag por si quieres mostrar un mensaje de bienvenida en el dashboard
            localStorage.setItem('careheart_new_user', 'true');
            
            // Redirección
            window.location.href = 'dashboard.html';
        }, 2000);
    });
});