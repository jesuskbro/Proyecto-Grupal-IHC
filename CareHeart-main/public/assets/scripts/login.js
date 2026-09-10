document.addEventListener('DOMContentLoaded', () => {
    // Referencias
    const loginForm = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const modal = document.getElementById('modal-2fa');
    
    // Pasos del modal
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const stepSuccess = document.getElementById('step-success');

    // Elementos dinámicos
    const displayEmail = document.getElementById('display-email');
    const inputCode = document.getElementById('input-code');

    // Botones
    const btnSendCode = document.getElementById('btn-send-code');
    const btnHaveCode = document.getElementById('btn-have-code');
    const btnVerify = document.getElementById('btn-verify');

    // 1. AL DAR CLIC EN "INGRESAR" (Formulario)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value || "usuario@ejemplo.com";
        
        // Poner el email en el modal
        displayEmail.innerText = email;

        // Mostrar Modal (Paso 1)
        modal.classList.remove('hidden');
        modal.classList.add('active');
        showStep(1);
    });

    // 2. PASAR AL PASO 2 (Ingresar código)
    btnSendCode.addEventListener('click', () => {
        // Simular envío...
        alert(`Código enviado a ${displayEmail.innerText}: 6578`);
        showStep(2);
        inputCode.focus();
    });

    btnHaveCode.addEventListener('click', () => {
        showStep(2);
        inputCode.focus();
    });

    // 3. VALIDAR CÓDIGO
    btnVerify.addEventListener('click', () => {
        const code = inputCode.value;
        
        if (code.length === 4) {
            // ÉXITO
            showStep('success');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            alert("Por favor ingresa un código de 4 dígitos (Ej: 6578)");
        }
    });

    // Función auxiliar para cambiar pasos
    function showStep(stepNumber) {
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        stepSuccess.classList.add('hidden');

        if(stepNumber === 1) step1.classList.remove('hidden');
        if(stepNumber === 2) step2.classList.remove('hidden');
        if(stepNumber === 'success') stepSuccess.classList.remove('hidden');
    }

    // Cerrar modal si se da clic fuera (Opcional)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    });
});