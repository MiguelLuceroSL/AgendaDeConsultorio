
import { crearAgendaS, obtenerAgendaS, actulizarAgendaS, borrarAgendaS,obtenerAgendasActivasS,obtenerSucursalesS, registrarAusenciaS, verificarAusenciaS, obtenerAusenciasTotalesS, eliminarAusenciaS, obtenerAgendasActivasAgrupadasS, eliminarAgendaS } from '../services/agendaService.js';
import{ obtenerSucursales, obtenerAgendasActivasPorProfesional, mostarAusenciasM } from '../models/agendaModel.js' 
import {obtenerProfesionalesVistaM} from "../models/profesionalModel.js";



export const crearAgendaC = async (req, res) => {
  try {
    const { profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, tiempo_consulta, dias, max_sobreturnos } = req.body;


    if (!profesional_especialidad_id || !sucursal_id || !dia_inicio || !dia_fin || !tiempo_consulta) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    
    // Validar que dia_fin sea posterior a dia_inicio
    const fechaInicio = new Date(dia_inicio);
    const fechaFin = new Date(dia_fin);
    if (fechaFin <= fechaInicio) {
      return res.status(400).json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" });
    }

    const diasActivos = Object.values(dias).some(dia => dia.activo);
    if (!diasActivos) {
      return res.status(400).json({ error: "Debe seleccionar al menos un día de atención" });
    }

    const agendasCreadas = [];

    // Procesar cada día
    for (const [dia, datos] of Object.entries(dias)) {
      if (datos.activo) {
        const franjas = [];

        // Verificar y agregar turno mañana
        if (datos.manana_inicio && datos.manana_fin) {
          if (datos.manana_inicio >= datos.manana_fin) {
            return res.status(400).json({ 
              error: `El horario de mañana del ${dia} es inválido: la hora de inicio debe ser menor que la de fin` 
            });
          }
          franjas.push({ 
            inicio: datos.manana_inicio, 
            fin: datos.manana_fin,
            turno: 'mañana'
          });
        }

        // Verificar y agregar turno tarde
        if (datos.tarde_inicio && datos.tarde_fin) {
          if (datos.tarde_inicio >= datos.tarde_fin) {
            return res.status(400).json({ 
              error: `El horario de tarde del ${dia} es inválido: la hora de inicio debe ser menor que la de fin` 
            });
          }
          franjas.push({ 
            inicio: datos.tarde_inicio, 
            fin: datos.tarde_fin,
            turno: 'tarde'
          });
        }

        // Verificar que no se solapen los turnos del mismo día
        if (franjas.length === 2) {
          const [mañana, tarde] = franjas;
          if (mañana.fin > tarde.inicio) {
            return res.status(400).json({ 
              error: `Los horarios de mañana y tarde del ${dia} se solapan` 
            });
          }
        }

        // Crear agenda para cada franja horaria
        for (const franja of franjas) {
          try {
            const resultado = await crearAgendaS(
              {
                profesional_especialidad_id,
                sucursal_id,
                horario_inicio: franja.inicio,
                horario_fin: franja.fin,
                tiempo_consulta,
                dia_inicio,
                dia_fin,
                max_sobreturnos
              },
              [dia] // lista de días asociados a esa franja
            );
            
            agendasCreadas.push({
              dia,
              turno: franja.turno,
              horario: `${franja.inicio} - ${franja.fin}`,
              agendaId: resultado.agendaId
            });

          } catch (error) {
            console.error(`Error creando agenda para ${dia} (${franja.turno}):`, error);
            return res.status(error.status || 500).json({ 
              error: error.message || "Error interno del servidor" 
            });
          }
        }
      }
    }

    res.status(201).json({
      message: "Agendas creadas exitosamente",
      agendas: agendasCreadas
    });

  } catch (error) {
    console.error('Error en crearAgendaC:', error);
    res.status(500).json({ 
      error: "Error interno del servidor al crear las agendas" 
    });
  }
};

export const obtenerSucursalesC = async (req, res) => {
  try {
    const sucursales = await obtenerSucursalesS();
    res.status(200).json(sucursales);
  } catch (error) {
    console.error('Error en el controlador al obtener sucursales:', error);
    res.status(500).json({ error: 'Error al obtener sucursales' });
  }
};


export const FormCrearAgendaVista = async (req, res) => {
  try {
    const profesionales = await obtenerProfesionalesVistaM();
    const sucursales = await obtenerSucursales();
    res.render('secretaria/secretariaCrearAgenda', { profesionales, sucursales });
  } catch (error) {
    console.error('Error al mostrar el formulario de agenda:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};


export const obtenerAgendasC = async (req, res) => {
  
  try {
    const agendas = await obtenerAgendaS();
    res.json(agendas);
  } catch (err) {
    console.error('Error al obtener las agendas:', err);
    res.status(500).json({ message: 'Hubo un error al obtener las agendas.' });
  }
};

export const actulizarAgendaC = async (req, res) => {
  const {horario_inicio , horario_fin, estado, id} =req.body

  try {
    await actulizarAgendaS(horario_inicio , horario_fin, estado, id)
    res.json({ message: 'Agenda Actualizada con exito'})
  } catch (err) {
    console.log('error al actulizar agenda', err)
    res.status(500).json({ message: 'Hubo un error al actulizar la agenda'})
  }
}


export const borrarAgendaC = async (req,res) => {
  const {id} = req.body

  try {
    await borrarAgendaS(id)
    res.json ({message: 'Agenda eliminada con exito'})
  } catch (err) {
    console.log('Error al eliminar agenda', err)
    res.status(500).json({ message: 'Hubo un error al eliminar la agenda'})
  }
}


export const obtenerAgendasActivasC = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const agendas = await obtenerAgendasActivasPorProfesional(profesionalId);

    res.json(agendas);
  } catch (error) {
    console.error('Error al obtener agendas activas:', error);
    res.status(500).json({ error: 'Error al obtener agendas activas' });
  }
};

/*a*/
export const registrarAusenciaC = async (req, res) => {
  try {
    const { profesional_especialidad_id, fecha_inicio, fecha_fin, tipo } = req.body;

    await registrarAusenciaS({ profesional_especialidad_id, fecha_inicio, fecha_fin, tipo });

    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaM(sucursalId);
    const ausencias = await mostarAusenciasM(sucursalId);
    res.render('secretaria/secretariaCrearAusenciaSuccess', { profesionales, ausencias });
  } catch (err) {
    console.error('Error al registrar ausencia:', err);
    res.status(500).json({ error: 'Error al registrar la ausencia' });
  }
};

export const verificarAusenciaC = async (req, res) => {
  try {
    const { profesional_especialidad_id, fecha} = req.query;

    const resultado = await verificarAusenciaS(profesional_especialidad_id, fecha);

    res.json({ bloqueado: resultado.length > 0, detalle: resultado });
  } catch (err) {
    console.error('Error al verificar ausencia:', err);
    res.status(500).json({ error: 'Error al verificar ausencias' });
  }
};

export const formCrearAusenciaC = async (req, res) => {
  try {
    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaM(sucursalId);
    const ausencias = await mostarAusenciasM(sucursalId);
    res.render('secretaria/secretariaCrearAusencia', { profesionales, ausencias });
  } catch (error) {
    console.error("Error al mostrar formulario de ausencia:", error);
    res.status(500).send("Error al cargar el formulario");
  }
};


export const obtenerAusenciasTotalesC = async (req, res) => {
  try {
    const { profesional_especialidad_id } = req.query;
    const resultado = await obtenerAusenciasTotalesS(profesional_especialidad_id);
    res.json(resultado);
  } catch (err) {
    console.error("Error al obtener ausencias totales:", err);
    res.status(500).json({ error: "Error al obtener ausencias totales" });
  }
};

/*b*/
export const eliminarAusenciaC = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarAusenciaS(id);
    res.json({ message: "Ausencia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar ausencia:", error);
    res.status(500).json({ error: "No se pudo eliminar la ausencia" });
  }
};

export const listarAgendasActivasC = async (req, res) => {
  try {
    const sucursalId = req.user?.sucursal_id;
    const agendas = await obtenerAgendasActivasAgrupadasS(sucursalId);
    
    // Agrupar agendas por profesional
    const profesionales = {};
    agendas.forEach(agenda => {
      if (!profesionales[agenda.profesional_id]) {
        profesionales[agenda.profesional_id] = {
          profesional_id: agenda.profesional_id,
          nombre_profesional: agenda.nombre_profesional,
          especialidades: {}
        };
      }
      
      if (!profesionales[agenda.profesional_id].especialidades[agenda.especialidad_id]) {
        profesionales[agenda.profesional_id].especialidades[agenda.especialidad_id] = {
          especialidad_id: agenda.especialidad_id,
          especialidad: agenda.especialidad,
          agendas: []
        };
      }
      
      profesionales[agenda.profesional_id].especialidades[agenda.especialidad_id].agendas.push({
        agenda_id: agenda.agenda_id,
        horario_inicio: agenda.horario_inicio,
        horario_fin: agenda.horario_fin,
        dias: agenda.dias,
        tiempo_consulta: agenda.tiempo_consulta,
        dia_inicio: agenda.dia_inicio,
        dia_fin: agenda.dia_fin,
        max_sobreturnos: agenda.max_sobreturnos,
        sucursal: agenda.sucursal
      });
    });
    
    res.render('secretaria/secretariaGestionAgendas', { profesionales: Object.values(profesionales) });
  } catch (error) {
    console.error("Error al listar agendas:", error);
    res.status(500).send("Error al cargar las agendas");
  }
};

export const eliminarAgendaC = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarAgendaS(id);
    res.json({ message: "Agenda eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar agenda:", error);
    res.status(500).json({ error: "No se pudo eliminar la agenda" });
  }
};

// Buscar sucursales para autocompletado
export const buscarSucursalesC = async (req, res) => {
  try {
    const { texto } = req.query;
    const sucursales = await obtenerSucursalesS();
    
    // Filtrar sucursales por texto (manejar valores NULL)
    const resultados = sucursales.filter(sucursal => {
      const textoLower = texto.toLowerCase();
      const nombreMatch = sucursal.nombre && sucursal.nombre.toLowerCase().includes(textoLower);
      const direccionMatch = sucursal.direccion && sucursal.direccion.toLowerCase().includes(textoLower);
      return nombreMatch || direccionMatch;
    });
    
    res.json(resultados);
  } catch (error) {
    console.error('Error al buscar sucursales:', error);
    res.status(500).json({ error: 'Error al buscar sucursales' });
  }
};