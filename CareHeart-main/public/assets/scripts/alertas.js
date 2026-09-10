document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS ---
    const inputFcMin = document.getElementById('input-fc-min');
    const inputFcMax = document.getElementById('input-fc-max');
    const inputPaSis = document.getElementById('input-pa-sis');
    const inputPaDia = document.getElementById('input-pa-dia');
    const inputSpo2 = document.getElementById('input-spo2');
    const selectContacto = document.getElementById('select-contacto');
    const btnAddContact = document.getElementById('btn-add-contact-alert');
    const btnSave = document.getElementById('btn-save-alerts');

    // --- 1. CARGAR DATOS AL INICIAR ---
    cargarContactos();
    cargarConfiguracion();

    // --- 2. LOGICA DE CONTACTOS (INTEGRACIÓN CON PERFIL) ---
    function cargarContactos() {
        // Leemos la MISMA lista que usa la página de Perfil
        const contactosGuardados = JSON.parse(localStorage.getItem('careheart_contactos_list')) || [];
        
        // Limpiamos el select (manteniendo la opción por defecto)
        selectContacto.innerHTML = '<option value="">Seleccionar contacto...</option>';

        // Si no hay contactos, agregamos uno por defecto
        if (contactosGuardados.length === 0) {
            const defaultOption = document.createElement('option');
            defaultOption.value = "Carlos García";
            defaultOption.text = "Carlos García (Hijo) - Default";
            selectContacto.appendChild(defaultOption);
        } else {
            // Llenamos con los contactos reales
            contactosGuardados.forEach(c => {
                const option = document.createElement('option');
                option.value = c.nombre; // Usamos el nombre como valor
                option.text = `${c.nombre} (${c.relacion})`;
                selectContacto.appendChild(option);
            });
        }
    }

    // Botón "+ Añadir nuevo contacto" desde Alertas
    btnAddContact.addEventListener('click', () => {
        const nombre = prompt("Nombre del nuevo contacto:");
        if (nombre) {
            const relacion = prompt("Relación (ej. Hija, Enfermero):");
            const telefono = prompt("Teléfono:");
            
            if (relacion && telefono) {
                // Guardamos en la lista global de contactos
                const nuevoContacto = { nombre, relacion, telefono };
                let lista = JSON.parse(localStorage.getItem('careheart_contactos_list')) || [];
                lista.push(nuevoContacto);
                localStorage.setItem('careheart_contactos_list', JSON.stringify(lista));

                // Recargamos el select y seleccionamos el nuevo
                cargarContactos();
                selectContacto.value = nombre;
            }
        }
    });

    // --- 3. GUARDAR CONFIGURACIÓN DE UMBRALES ---
    btnSave.addEventListener('click', () => {
        const config = {
            fcMin: inputFcMin.value,
            fcMax: inputFcMax.value,
            paSis: inputPaSis.value,
            paDia: inputPaDia.value,
            spo2: inputSpo2.value,
            contactoPrincipal: selectContacto.value
        };

        // Guardar en memoria
        localStorage.setItem('careheart_alertas_config', JSON.stringify(config));

        // Feedback Visual
        const textoOriginal = btnSave.innerText;
        btnSave.innerText = "¡Configuración Guardada!";
        btnSave.style.backgroundColor = "#16a34a"; // Verde éxito
        
        setTimeout(() => {
            btnSave.innerText = textoOriginal;
            btnSave.style.backgroundColor = ""; // Volver al color original
        }, 2000);
    });

    // --- 4. CARGAR CONFIGURACIÓN PREVIA ---
    function cargarConfiguracion() {
        const config = JSON.parse(localStorage.getItem('careheart_alertas_config'));
        if (config) {
            inputFcMin.value = config.fcMin || 50;
            inputFcMax.value = config.fcMax || 120;
            inputPaSis.value = config.paSis || 140;
            inputPaDia.value = config.paDia || 90;
            inputSpo2.value = config.spo2 || 92;
            
            // Seleccionar el contacto guardado si existe en la lista
            if (config.contactoPrincipal) {
                selectContacto.value = config.contactoPrincipal;
            }
        }
    }
});