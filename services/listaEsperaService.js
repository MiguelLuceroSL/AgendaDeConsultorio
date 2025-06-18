import {crearListaEsperaM, traerListaEsperaM} from '../models/listaEsperaModel.js'


export const crearListaEsperaS = async (paciente_id, profesional_especialidad_id, fecha_registro) => {
    return await crearListaEsperaM (paciente_id, profesional_especialidad_id, fecha_registro)
}

export const traerListaEsperaS = async () => {
    return await traerListaEsperaM()
}