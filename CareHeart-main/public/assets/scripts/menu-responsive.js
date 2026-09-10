document.addEventListener('DOMContentLoaded', () => {
    // Referencias
    const btnMenu = document.getElementById('btn-menu-mobile');
    const sidebar = document.querySelector('.barra-lateral');
    
    // Crear el fondo oscuro (overlay) si no existe
    let overlay = document.querySelector('.overlay-sidebar');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay-sidebar';
        document.body.appendChild(overlay);
    }

    // Solo activar si el botón existe (para evitar errores en login/index)
    if (btnMenu) {
        // Abrir / Cerrar al tocar el botón
        btnMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        // Cerrar al tocar el fondo oscuro
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});