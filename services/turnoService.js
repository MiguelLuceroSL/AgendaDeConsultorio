import { crearTurnoM, borrarTurnoM, actuTurnoM, confTurnoM, selTurnoM, traerTurnos, verificarTurnoExistenteM } from '../models/turnoModel.js';

export const crearTurnoS = async(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado) => {
        try{
        // Verificacion por si ya existe un turno para ese profesional en esa fecha y hora
        const turnoExistente = await verificarTurnoExistenteM(profesional_especialidad_id, fecha, hora);
            if (turnoExistente.length > 0) {
                throw new Error('Ya existe un turno para este profesional en esa fecha y hora.');
    }

            // Si no existe, procedemos a crear el turno
        const resultado = await crearTurnoM(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado);
        return resultado;
        } catch (error) {
            throw error;
  }
};

export const selTurnoS= (nombre_completo) =>{
    return new Promise((resolve, reject)=>{
        selTurnoM(nombre_completo,(err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const borrarTurnoS =(id) =>{
    return new Promise((resolve, reject)=>{
        borrarTurnoM(id,(err,result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const actualizarTurnoS =(fecha,hora,estado, id) =>{
    return new Promise((resolve,reject)=>{
        actuTurnoM(fecha,hora,estado,id, (err,result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const confTurnoS = (confirmado, id)=>{
    return new Promise((resolve,reject)=>{
        confTurnoM(confirmado,id,(err,result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}


export const traerTurnosS= () =>{
    return new Promise((resolve, reject)=>{
        traerTurnos((err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}