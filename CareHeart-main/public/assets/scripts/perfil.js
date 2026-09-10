document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS ---
    const btnEditar = document.getElementById('btn-editar-perfil');
    const textoBtn = document.getElementById('texto-btn-editar');
    const camposEditables = document.querySelectorAll('.dato-editable');
    
    const btnAnadir = document.getElementById('btn-anadir-contacto');
    const contenedorContactos = document.getElementById('contenedor-contactos');

    // --- 1. CARGAR DATOS AL INICIAR ---
    cargarPerfil();
    cargarContactos();

    // --- 2. LÓGICA EDICIÓN PERFIL ---
    let enModoEdicion = false;

    btnEditar.addEventListener('click', () => {
        if (!enModoEdicion) {
            entrarModoEdicion();
        } else {
            guardarCambiosPerfil();
        }
    });

    function entrarModoEdicion() {
        enModoEdicion = true;
        textoBtn.innerText = "Guardar Cambios";
        btnEditar.classList.add('guardando');
        
        camposEditables.forEach(campo => {
            campo.contentEditable = "true";
            campo.style.cursor = "text";
        });
        camposEditables[0].focus();
    }

    function guardarCambiosPerfil() {
        enModoEdicion = false;
        textoBtn.innerText = "Editar Perfil";
        btnEditar.classList.remove('guardando');

        // Deshabilitar edición
        camposEditables.forEach(campo => {
            campo.contentEditable = "false";
            campo.style.cursor = "default";
        });

        // 1. Recolectar datos
        const datosPerfil = {
            direccion: document.getElementById('perfil-direccion').innerText,
            telefono: document.getElementById('perfil-telefono').innerText,
            nacimiento: document.getElementById('perfil-nacimiento').innerText,
            email: document.getElementById('perfil-email').innerText
        };

        // 2. Guardar en LocalStorage
        localStorage.setItem('careheart_perfil_data', JSON.stringify(datosPerfil));

        alert("¡Datos actualizados y guardados!");
    }

    function cargarPerfil() {
        const datosGuardados = JSON.parse(localStorage.getItem('careheart_perfil_data'));
        if (datosGuardados) {
            document.getElementById('perfil-direccion').innerText = datosGuardados.direccion;
            document.getElementById('perfil-telefono').innerText = datosGuardados.telefono;
            document.getElementById('perfil-nacimiento').innerText = datosGuardados.nacimiento;
            document.getElementById('perfil-email').innerText = datosGuardados.email;
        }
    }

    // --- 3. LÓGICA CONTACTOS ---

    btnAnadir.addEventListener('click', () => {
        const nombre = prompt("Ingrese el nombre del contacto:");
        
        if (nombre) {
            const relacion = prompt("¿Qué relación tiene? (Ej: Hijo, Vecina):");
            const telefono = prompt("Número de teléfono:");

            if (relacion && telefono) {
                const nuevoContacto = { nombre, relacion, telefono };
                guardarContacto(nuevoContacto);
                renderizarContacto(nuevoContacto);
            } else {
                alert("Faltaron datos. No se agregó el contacto.");
            }
        }
    });

    function guardarContacto(contacto) {
        let listaContactos = JSON.parse(localStorage.getItem('careheart_contactos_list')) || [];
        listaContactos.push(contacto);
        localStorage.setItem('careheart_contactos_list', JSON.stringify(listaContactos));
    }

    function cargarContactos() {
        let listaContactos = localStorage.getItem('careheart_contactos_list');

        // Si NO hay contactos guardados (es la primera vez), guardamos el default (Carlos García)
        if (!listaContactos) {
            const defaultContact = { nombre: "Carlos García", relacion: "Hijo", telefono: "(+51) 982 912 012" };
            const defaultList = [defaultContact];
            localStorage.setItem('careheart_contactos_list', JSON.stringify(defaultList));
            listaContactos = JSON.stringify(defaultList);
        }

        // Renderizar (limpiamos primero para no duplicar el que está en el HTML estático)
        contenedorContactos.innerHTML = ""; 
        const arrayContactos = JSON.parse(listaContactos);
        
        arrayContactos.forEach(contacto => {
            renderizarContacto(contacto);
        });
    }

    function renderizarContacto(contacto) {
        const nuevoContactoHTML = `
        <div class="item-contacto" style="animation: fadeIn 0.5s ease;">
            <h4>${contacto.nombre}</h4>
            <p>${contacto.relacion} - ${contacto.telefono}</p>
        </div>
        `;
        contenedorContactos.insertAdjacentHTML('beforeend', nuevoContactoHTML);
    }
});

// Estilo de animación
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);