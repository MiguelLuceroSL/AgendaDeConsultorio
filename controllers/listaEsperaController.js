import {crearListaEsperaS, traerListaEsperaS} from '../services/listaEsperaService.js'
import {obtenerProfesionalesVistaS} from "../services/profesionalService.js";
import { obtenerPacientesVistaS } from '../services/pacienteService.js';

export const crearListaEsperaC = async (req, res) => {
    try{
        const {paciente_id, profesional_especialidad_id} =req.body
        const fecha_registro = new Date().toISOString().split('T')[0]
        await crearListaEsperaS(paciente_id, profesional_especialidad_id, fecha_registro)
        res.status(400).send('espera agregada con exito')
    }catch (error){
        console.error(error)
        res.status(500).send('Error al agregar a lista de espera')
    }
}


export const listarListaEsperaC = async(req, res) =>{
    try {
        const lista = await traerListaEsperaS()
        res.render('secretaria/secretariaListaEspera', {lista})
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de espera');
    }
}


export const obtenerProfesionalesEsperaC = async (req, res) => {
    try {
      const profesionales = await obtenerProfesionalesVistaS();
      const pacientes = await obtenerPacientesVistaS()

    console.log('Profesionales:', profesionales?.length);
    console.log('Pacientes:', pacientes?.length);
      res.render('secretaria/secretariaCrearListaEspera', {profesionales, pacientes});
    } catch (err) {
      console.error('Error al obtener los profesionales:', err);
      res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
    }
  };