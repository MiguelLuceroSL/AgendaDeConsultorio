import {crearListaEsperaM, traerListaEsperaM, eliminarEsperaM} from '../models/listaEsperaModel.js'


export const crearListaEsperaS = async (paciente_id, profesional_especialidad_id, fecha_registro) => {
    return await crearListaEsperaM (paciente_id, profesional_especialidad_id, fecha_registro)
}

export const traerListaEsperaS = async () => {
    return await traerListaEsperaM()
}

export const eliminarEsperaS = async (id) => {
  try {
    return await eliminarEsperaM(id);
  } catch (error) {
    console.error("Error en eliminarAusenciaS:", error);
    throw error;
  }
};