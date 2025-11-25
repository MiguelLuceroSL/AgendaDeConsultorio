import { crearListaEsperaS, traerListaEsperaS, eliminarEsperaS } from '../services/listaEsperaService.js'
import { obtenerProfesionalesVistaS } from "../services/profesionalService.js";
import { obtenerPacientesVistaS } from '../services/pacienteService.js';

export const crearListaEsperaC = async (req, res) => {
  try {
    const { paciente_id, profesional_especialidad_id } = req.body
    const fecha_registro = new Date().toISOString().split('T')[0]
    await crearListaEsperaS(paciente_id, profesional_especialidad_id, fecha_registro)
    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaS(sucursalId);
    const pacientes = await obtenerPacientesVistaS()

    console.log('Profesionales:', profesionales?.length);
    console.log('Pacientes:', pacientes?.length);
    res.render('secretaria/secretariaCrearListaEsperaSuccess', { profesionales, pacientes });
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al agregar a lista de espera')
  }
}


export const listarListaEsperaC = async (req, res) => {
  try {
    const sucursalId = req.user?.sucursal_id;
    const lista = await traerListaEsperaS(sucursalId)
    res.render('secretaria/secretariaListaEspera', { lista })
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de espera');
  }
}


export const obtenerProfesionalesEsperaC = async (req, res) => {
  try {
    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaS(sucursalId);
    const pacientes = await obtenerPacientesVistaS()

    console.log('Profesionales:', profesionales?.length);
    console.log('Pacientes:', pacientes?.length);
    res.render('secretaria/secretariaCrearListaEspera', { profesionales, pacientes });
  } catch (err) {
    console.error('Error al obtener los profesionales:', err);
    res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
  }
};


export const eliminarEsperaC = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarEsperaS(id);
    res.json({ message: "Espera eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar espera:", error);
    res.status(500).json({ error: "No se pudo eliminar la espera" });
  }
};