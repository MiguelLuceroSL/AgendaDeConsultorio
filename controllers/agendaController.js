
import { crearAgendaS, obtenerAgendaS, actulizarAgendaS, borrarAgendaS,obtenerAgendasActivasS,obtenerSucursalesS } from '../services/agendaService.js';
import{ obtenerSucursales, obtenerAgendasActivasPorProfesional} from '../models/agendaModel.js' 
import {obtenerProfesionalesVistaM} from "../models/profesionalModel.js";



export const crearAgendaC = async (req, res) => {
  try {
    const { profesional_especialidad_id,sucursal_id, dia_inicio, dia_fin, tiempo_consulta, dias } = req.body;

    for (const [dia, datos] of Object.entries(dias)) {
      if (datos.activo) {
        const franjas = [];

        if (datos.manana_inicio && datos.manana_fin) {
          franjas.push({ inicio: datos.manana_inicio, fin: datos.manana_fin });
        }
        if (datos.tarde_inicio && datos.tarde_fin) {
          franjas.push({ inicio: datos.tarde_inicio, fin: datos.tarde_fin });
        }

        for (const franja of franjas) {
          await crearAgendaS(
            {
              profesional_especialidad_id,
              sucursal_id,
              horario_inicio: franja.inicio,
              horario_fin: franja.fin,
              tiempo_consulta,
              dia_inicio,
              dia_fin
            },
            [dia] // lista de días asociados a esa franja
          );
        }
      }
    }

    res.status(201).json({ message: 'Agenda creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear agenda' });
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
    console.log('[Controller] Recibido profesionalId:', profesionalId);
    const agendas = await obtenerAgendasActivasPorProfesional(profesionalId);
    console.log('[Controller] Agendas encontradas:', agendas);

    res.json(agendas);
  } catch (error) {
    console.error('Error al obtener agendas activas:', error);
    res.status(500).json({ error: 'Error al obtener agendas activas' });
  }
};

