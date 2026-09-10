document.addEventListener('DOMContentLoaded', () => {
    
    // --- BASE DE DATOS SIMULADA ---
    const DATOS = {
        ritmo: {
            hoy: {
                puntos: "0,25 15,22 30,28 45,20 60,25 75,22 90,26 100,24",
                ejeX: "<span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span>",
                // Datos del resumen lateral
                promedio: "75 BPM", max: "88 BPM", min: "62 BPM",
                // Lista de eventos simulada
                eventos: `
                    <div class="item-evento"><div class="icono-evento verde"><span class="material-symbols-outlined">check</span></div><div><p class="titulo-evento">Ritmo estable</p><p class="hora-evento">Hace 2 horas</p></div></div>
                    <div class="item-evento"><div class="icono-evento amarillo"><span class="material-symbols-outlined">medication</span></div><div><p class="titulo-evento">Medicación tomada</p><p class="hora-evento">Hace 4 horas</p></div></div>
                `
            },
            semana: {
                puntos: "0,30 10,18 20,22 30,16 40,20 50,25 60,34 70,10 80,32 90,18 100,24",
                ejeX: "<span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>",
                promedio: "78 BPM", max: "125 BPM", min: "45 BPM",
                eventos: `
                    <div class="item-evento"><div class="icono-evento rojo"><span class="material-symbols-outlined">warning</span></div><div><p class="titulo-evento">Alerta: Taquicardia</p><p class="hora-evento">Jue, 10:15</p></div></div>
                    <div class="item-evento"><div class="icono-evento verde"><span class="material-symbols-outlined">directions_run</span></div><div><p class="titulo-evento">Caminata</p><p class="hora-evento">Mié, 17:40</p></div></div>
                `
            },
            mes: {
                puntos: "0,20 10,25 20,15 30,30 40,20 50,10 60,25 70,15 80,28 90,20 100,22",
                ejeX: "<span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span>",
                promedio: "80 BPM", max: "130 BPM", min: "50 BPM",
                eventos: `<div class="item-evento"><div class="icono-evento azul"><span class="material-symbols-outlined">info</span></div><div><p class="titulo-evento">Consulta Mensual</p><p class="hora-evento">15 Oct</p></div></div>`
            },
            anio: {
                puntos: "0,25 20,22 40,28 60,20 80,24 100,23",
                ejeX: "<span>Ene</span><span>Abr</span><span>Jul</span><span>Oct</span>",
                promedio: "76 BPM", max: "140 BPM", min: "48 BPM",
                eventos: `<div class="item-evento"><div class="icono-evento verde"><span class="material-symbols-outlined">verified</span></div><div><p class="titulo-evento">Chequeo Anual</p><p class="hora-evento">Enero</p></div></div>`
            }
        },
        presion: {
            hoy: {
                sis: "M0,20 L20,22 L40,18 L60,20 L80,22 L100,20",
                dia: "M0,35 L20,38 L40,36 L60,38 L80,36 L100,35",
                ejeX: "<span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span>"
            },
            semana: {
                sis: "M0,25 C10,22 20,15 30,16 C40,17 50,22 60,22 C70,15 80,16 90,20 L100,19",
                dia: "M0,40 C10,40 20,38 30,35 C40,34 50,38 60,42 C70,40 80,38 90,39 L100,41",
                ejeX: "<span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>"
            },
            mes: {
                sis: "M0,20 L10,15 L20,25 L30,20 L40,18 L50,22 L60,15 L70,25 L80,20 L90,18 L100,20",
                dia: "M0,38 L10,35 L20,40 L30,38 L40,36 L50,40 L60,35 L70,40 L80,38 L90,36 L100,38",
                ejeX: "<span>S1</span><span>S2</span><span>S3</span><span>S4</span>"
            },
            anio: {
                sis: "M0,22 L25,20 L50,25 L75,18 L100,22",
                dia: "M0,38 L25,36 L50,40 L75,35 L100,38",
                ejeX: "<span>Ene</span><span>Abr</span><span>Jul</span><span>Oct</span>"
            }
        },
        oxigeno: {
            hoy: {
                d: "M0,30 L20,28 L40,25 L60,28 L80,26 L100,25",
                relleno: "M0,40 L0,30 L20,28 L40,25 L60,28 L80,26 L100,25 L100,40 Z",
                ejeX: "<span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span>",
                promedio: "98%"
            },
            semana: {
                d: "M0,30 C10,20 20,20 30,30 C40,40 50,25 60,35 C70,45 80,10 90,25 L100,20",
                relleno: "M0,40 L0,30 C10,20 20,20 30,30 C40,40 50,25 60,35 C70,45 80,10 90,25 L100,20 L100,40 Z",
                ejeX: "<span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>",
                promedio: "96.5%"
            },
            mes: {
                d: "M0,25 Q25,10 50,25 T100,25",
                relleno: "M0,40 L0,25 Q25,10 50,25 T100,25 L100,40 Z",
                ejeX: "<span>S1</span><span>S2</span><span>S3</span><span>S4</span>",
                promedio: "97%"
            },
            anio: {
                d: "M0,28 L33,25 L66,20 L100,22",
                relleno: "M0,40 L0,28 L33,25 L66,20 L100,22 L100,40 Z",
                ejeX: "<span>Ene</span><span>Abr</span><span>Jul</span><span>Oct</span>",
                promedio: "98%"
            }
        }
    };

    // --- DETECCIÓN Y CONFIGURACIÓN ---
    
    // 1. Caso RITMO CARDÍACO
    if (document.querySelector('.linea-ritmo')) {
        configurarBotones('ritmo', (datos) => {
            // Actualizar gráfico
            document.querySelector('.linea-ritmo').setAttribute('points', datos.puntos);
            // Actualizar Resumen (Promedio, Max, Min)
            const valores = document.querySelectorAll('.valor-resumen');
            if(valores.length >= 3) {
                valores[0].innerText = datos.promedio;
                valores[1].innerText = datos.max;
                valores[2].innerText = datos.min;
            }
            // Actualizar Eventos Relevantes
            const contenedorEventos = document.querySelector('.tarjeta.eventos-relevantes');
            if(contenedorEventos) {
                // Mantenemos el título h3 y reemplazamos el resto
                const titulo = contenedorEventos.querySelector('h3').outerHTML;
                contenedorEventos.innerHTML = titulo + datos.eventos;
            }
        });
    } 
    
    // 2. Caso PRESIÓN ARTERIAL
    else if (document.querySelector('.linea-borde-purple')) {
        configurarBotones('presion', (datos) => {
            document.querySelector('.linea-borde-purple').setAttribute('d', datos.sis);
            document.querySelector('.linea-borde-pink').setAttribute('d', datos.dia);
        });
    } 
    
    // 3. Caso OXÍGENO
    else if (document.querySelector('.linea-borde-cyan')) {
        configurarBotones('oxigeno', (datos) => {
            document.querySelector('.linea-borde-cyan').setAttribute('d', datos.d);
            document.querySelector('.linea-relleno-cyan').setAttribute('d', datos.relleno);
            
            // Actualizar Promedio del historial
            const valorPromedio = document.querySelector('.valor-promedio');
            if(valorPromedio) valorPromedio.innerText = datos.promedio;
        });
    }

    // --- FUNCIÓN GENÉRICA PARA LOS BOTONES ---
    function configurarBotones(tipo, callbackActualizar) {
        const botones = document.querySelectorAll('.filtros-grafico button, .filtros button');
        const ejeXContainer = document.querySelector('.dias-grafico, .eje-x');
        const subtitulo = document.querySelector('.subtitulo-grafico, .sub-grafico');

        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Estilos visuales
                botones.forEach(b => b.classList.remove('activo'));
                e.target.classList.add('activo');

                // Detectar periodo
                const texto = e.target.innerText.toLowerCase();
                let periodo = 'semana';
                if (texto.includes('hoy')) periodo = 'hoy';
                if (texto.includes('mes')) periodo = 'mes';
                if (texto.includes('año')) periodo = 'anio';

                // Obtener datos y actualizar Eje X
                const datos = DATOS[tipo][periodo];
                if(ejeXContainer) ejeXContainer.innerHTML = datos.ejeX;
                
                // Actualizar subtítulo (ej: "Últimos 7 días" -> "Hoy")
                if(subtitulo) subtitulo.innerText = e.target.innerText;

                // Ejecutar la actualización específica de cada página
                callbackActualizar(datos);
            });
        });
    }
});