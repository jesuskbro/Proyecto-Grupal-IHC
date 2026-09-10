document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS DOM ---
    const btnTabMed = document.getElementById('btn-tab-med');
    const btnTabCita = document.getElementById('btn-tab-cita');
    const camposMed = document.getElementById('campos-medicamento');
    const camposCita = document.getElementById('campos-cita');
    const btnSubmit = document.getElementById('btn-submit');
    const listaRecordatorios = document.getElementById('lista-recordatorios');
    const form = document.querySelector('.form-recordatorio');

    // --- 1. CARGAR DATOS AL INICIAR ---
    cargarRecordatorios();

    // --- 2. LÓGICA DE PESTAÑAS (Igual que antes) ---
    btnTabMed.addEventListener('click', () => {
        cambiarPestana(true);
    });

    btnTabCita.addEventListener('click', () => {
        cambiarPestana(false);
    });

    function cambiarPestana(esMedicamento) {
        if (esMedicamento) {
            btnTabMed.classList.add('activo');
            btnTabCita.classList.remove('activo');
            camposMed.classList.remove('hidden');
            camposCita.classList.add('hidden');
        } else {
            btnTabCita.classList.add('activo');
            btnTabMed.classList.remove('activo');
            camposCita.classList.remove('hidden');
            camposMed.classList.add('hidden');
        }
    }

    // --- 3. AGREGAR Y GUARDAR ---
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        const esMedicamento = btnTabMed.classList.contains('activo');
        let datosRecordatorio = null;

        if (esMedicamento) {
            // Datos Medicamento
            const nombre = document.getElementById('input-med-nombre').value;
            const hora = document.getElementById('input-med-hora').value;
            const dosis = document.getElementById('input-med-dosis').value;
            const freq = document.getElementById('input-med-freq').value;

            if(!nombre || !hora) { alert("Por favor completa el nombre y la hora"); return; }

            datosRecordatorio = {
                id: Date.now(), // ID único basado en la fecha
                tipo: 'medicamento',
                titulo: nombre,
                subtitulo: (dosis ? dosis + ', ' : '') + freq,
                hora: hora,
                textoTiempo: 'Próximamente'
            };

        } else {
            // Datos Cita
            const medico = document.getElementById('input-cita-medico').value;
            const fecha = document.getElementById('input-cita-fecha').value; 
            const hora = document.getElementById('input-cita-hora').value;
            const notas = document.getElementById('input-cita-notas').value;

            if(!medico || !hora) { alert("Por favor completa el médico y la hora"); return; }

            datosRecordatorio = {
                id: Date.now(),
                tipo: 'cita',
                titulo: `Cita con ${medico}`,
                subtitulo: notas ? notas : 'Sin notas adicionales',
                hora: hora,
                textoTiempo: fecha ? fecha : 'Hoy'
            };
        }

        // 1. Guardar en LocalStorage
        guardarEnStorage(datosRecordatorio);

        // 2. Pintar en pantalla
        renderizarItem(datosRecordatorio);

        // 3. Limpiar formulario
        form.reset();
    });

    // --- FUNCIONES DE ALMACENAMIENTO ---

    function guardarEnStorage(objeto) {
        // Obtener array existente o crear uno nuevo
        let recordatorios = JSON.parse(localStorage.getItem('careheart_recordatorios')) || [];
        recordatorios.push(objeto);
        // Guardar array actualizado
        localStorage.setItem('careheart_recordatorios', JSON.stringify(recordatorios));
    }

    function cargarRecordatorios() {
        let recordatorios = JSON.parse(localStorage.getItem('careheart_recordatorios')) || [];
        recordatorios.forEach(rec => {
            renderizarItem(rec);
        });
    }

    // --- FUNCIONES DE RENDERIZADO (HTML) ---

    function renderizarItem(data) {
        let iconoHTML = '';
        
        if (data.tipo === 'medicamento') {
            iconoHTML = `
            <div class="icono-tipo naranja">
                <span class="material-symbols-outlined">pill</span>
            </div>`;
        } else {
            iconoHTML = `
            <div class="icono-tipo azul">
                <span class="material-symbols-outlined">calendar_month</span>
            </div>`;
        }

        const html = `
        <div class="item-recordatorio" id="${data.id}">
            ${iconoHTML}
            <div class="info-rec">
                <h4>${data.titulo}</h4>
                <p>${data.subtitulo}</p>
            </div>
            <div class="tiempo-rec">
                <span class="hora">${formatearHora(data.hora)}</span>
                <span class="restante">${data.textoTiempo}</span>
            </div>
            </div>`;

        // Insertar al final de la lista
        listaRecordatorios.insertAdjacentHTML('beforeend', html);
    }

    function formatearHora(hora24) {
        if(!hora24) return '--:--';
        const [h, m] = hora24.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; 
        return `${hour}:${m} ${ampm}`;
    }
});