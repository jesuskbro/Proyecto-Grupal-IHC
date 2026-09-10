document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS ---
    const contenedorLista = document.getElementById('lista-eventos');
    const botonesFiltro = document.querySelectorAll('.chip-filtro');
    const btnExportar = document.getElementById('btn-exportar');
    
    // Referencias para la fecha
    const inputFecha = document.getElementById('input-fecha');
    const textoFecha = document.getElementById('texto-fecha-filtro');
    const btnFechaWrapper = document.getElementById('btn-fecha-wrapper'); // NUEVA REFERENCIA

    // --- CORRECCIÓN: ABRIR CALENDARIO AL HACER CLIC ---
    btnFechaWrapper.addEventListener('click', () => {
        // Usamos la API moderna showPicker() si existe, si no, click()
        try {
            if (typeof inputFecha.showPicker === 'function') {
                inputFecha.showPicker();
            } else {
                inputFecha.click(); // Fallback para navegadores antiguos
                inputFecha.focus();
            }
        } catch (error) {
            console.log("El navegador no soporta la apertura automática del calendario", error);
        }
    });

    // --- FECHAS REALES ---
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    // Ajuste de zona horaria simple para evitar problemas de "ayer" por UTC
    const fechaHoyISO = hoy.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local
    const fechaAyerISO = ayer.toLocaleDateString('en-CA');

    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long' };
    const textoHoy = "Hoy, " + hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    const textoAyer = "Ayer, " + ayer.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    // --- DATOS SIMULADOS (HISTÓRICOS) ---
    const datosHistoricos = [
        {
            tipo: 'alerta',
            titulo: 'Alerta: Presión Alta',
            subtitulo: 'Se notificó a los contactos',
            dato: '150/95 mmHg',
            estado: 'Critico', 
            textoEstado: 'Crítico',
            fechaTexto: textoAyer,
            fechaISO: fechaAyerISO,
            hora: '09:15 PM'
        },
        {
            tipo: 'signo',
            titulo: 'Oxígeno en Sangre',
            subtitulo: 'Registro automático',
            dato: '98%',
            estado: 'normal',
            textoEstado: 'Normal',
            fechaTexto: textoAyer,
            fechaISO: fechaAyerISO,
            hora: '02:00 PM'
        }
    ];

    // --- DATOS LOCALSTORAGE (RECORDATORIOS) ---
    const recordatoriosGuardados = JSON.parse(localStorage.getItem('careheart_recordatorios')) || [];
    
    const eventosHoy = recordatoriosGuardados.map(rec => ({
        tipo: rec.tipo === 'medicamento' ? 'medicamento' : 'cita',
        titulo: rec.tipo === 'medicamento' ? 'Toma de Medicamento' : 'Cita Médica',
        subtitulo: rec.titulo + (rec.subtitulo ? ` - ${rec.subtitulo}` : ''),
        dato: '', 
        estado: 'completado',
        textoEstado: 'Completado',
        fechaTexto: textoHoy,
        fechaISO: fechaHoyISO,
        hora: formatearHora(rec.hora)
    }));

    // Evento manual de hoy
    eventosHoy.unshift({
        tipo: 'signo',
        titulo: 'Medición de Ritmo Cardíaco',
        subtitulo: 'Registro automático',
        dato: '72 bpm',
        estado: 'normal',
        textoEstado: 'Normal',
        fechaTexto: textoHoy,
        fechaISO: fechaHoyISO,
        hora: '10:30 AM'
    });

    let todosLosEventos = [...eventosHoy, ...datosHistoricos];

    // --- INICIALIZAR ---
    renderizarEventos(todosLosEventos);

    // --- LÓGICA FILTROS ---
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            aplicarFiltros();
        });
    });

    // Evento cuando seleccionas una fecha en el calendario
    inputFecha.addEventListener('change', (e) => {
        const fechaSeleccionada = e.target.value; 
        
        if (fechaSeleccionada) {
            // Formatear la fecha seleccionada para mostrarla bonita en el botón
            // Truco: agregar T00:00 para evitar desfase de zona horaria al visualizar
            const fechaObj = new Date(fechaSeleccionada + 'T00:00:00');
            const fechaBonita = fechaObj.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
            
            textoFecha.innerText = fechaBonita;
            textoFecha.style.color = "#17a19c"; 
            textoFecha.style.fontWeight = "800";
        } else {
            textoFecha.innerText = "Filtrar por fecha";
            textoFecha.style.color = "";
        }

        aplicarFiltros();
    });

    function aplicarFiltros() {
        const tipoSeleccionado = document.querySelector('.chip-filtro.activo').dataset.filtro;
        const fechaSeleccionada = inputFecha.value;

        let resultado = todosLosEventos;

        // Filtro Tipo
        if (tipoSeleccionado !== 'todos') {
            resultado = resultado.filter(ev => {
                if(tipoSeleccionado === 'medicamento' && ev.tipo === 'cita') return true;
                return ev.tipo === tipoSeleccionado;
            });
        }

        // Filtro Fecha
        if (fechaSeleccionada) {
            resultado = resultado.filter(ev => ev.fechaISO === fechaSeleccionada);
        }

        renderizarEventos(resultado);
    }

    function renderizarEventos(lista) {
        contenedorLista.innerHTML = ''; 
        
        if (lista.length === 0) {
            contenedorLista.innerHTML = `
                <div style="text-align:center; padding: 3rem; color: #9ca3af;">
                    <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 10px;">event_busy</span>
                    <p>No se encontraron eventos.</p>
                    <button id="btn-limpiar-fecha" style="color:#17a19c; background:none; border:none; cursor:pointer; text-decoration:underline; margin-top:10px;">
                        Borrar filtro de fecha
                    </button>
                </div>`;
            
            // Lógica para el botón de limpiar dentro del mensaje vacío
            const btnLimpiar = document.getElementById('btn-limpiar-fecha');
            if(btnLimpiar) {
                btnLimpiar.addEventListener('click', () => {
                    inputFecha.value = '';
                    inputFecha.dispatchEvent(new Event('change')); // Disparar evento para actualizar
                });
            }
            return;
        }

        let ultimaFecha = '';

        lista.forEach(evento => {
            if (evento.fechaTexto !== ultimaFecha) {
                const separador = document.createElement('div');
                separador.className = 'separador-fecha';
                separador.innerText = evento.fechaTexto;
                contenedorLista.appendChild(separador);
                ultimaFecha = evento.fechaTexto;
            }

            const card = document.createElement('div');
            card.className = `evento-card ${evento.tipo === 'alerta' ? 'alerta' : ''}`;
            card.innerHTML = generarHTMLTarjeta(evento);
            contenedorLista.appendChild(card);
        });
    }

    function generarHTMLTarjeta(ev) {
        const config = obtenerConfigIcono(ev.tipo);
        const bloqueValor = ev.dato ? `<span class="dato ${ev.tipo === 'alerta' ? 'rojo' : ''}">${ev.dato}</span>` : '';

        return `
            <div class="icono-evento ${config.colorClase}">
                <span class="material-symbols-outlined">${config.icono}</span>
            </div>
            <div class="info-evento">
                <h4>${ev.titulo}</h4>
                <p>${ev.subtitulo}</p>
            </div>
            <div class="valor-evento">
                ${bloqueValor}
                <span class="badge ${ev.estado}">${ev.textoEstado}</span>
            </div>
            <div class="hora-evento">${ev.hora}</div>
        `;
    }

    function obtenerConfigIcono(tipo) {
        switch(tipo) {
            case 'signo': return { icono: 'favorite', colorClase: 'azul-claro' };
            case 'medicamento': return { icono: 'pill', colorClase: 'naranja-claro' };
            case 'cita': return { icono: 'calendar_month', colorClase: 'azul-claro' };
            case 'alerta': return { icono: 'warning', colorClase: 'rojo-claro' };
            default: return { icono: 'info', colorClase: 'celeste-claro' };
        }
    }

    function formatearHora(hora24) {
        if(!hora24) return '--:--';
        if(hora24.includes('M')) return hora24;
        const [h, m] = hora24.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; 
        return `${hour}:${m} ${ampm}`;
    }

    btnExportar.addEventListener('click', () => {
        const textoOriginal = btnExportar.innerHTML;
        btnExportar.innerHTML = `<span class="material-symbols-outlined">check</span> Descargado`;
        btnExportar.style.backgroundColor = "#16a34a";
        setTimeout(() => {
            btnExportar.innerHTML = textoOriginal;
            btnExportar.style.backgroundColor = "";
        }, 1500);
    });
});