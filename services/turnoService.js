import { crearTurnoM, borrarTurnoM, actuTurnoM, confTurnoM, selTurnoM, traerTurnos, verificarTurnoExistenteM } from '../models/turnoModel.js';

export const crearTurnoS = (paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado) => {
    return new Promise((resolve, reject) => {
        // Verificacion por si ya existe un turno para ese profesional en esa fecha y hora
        verificarTurnoExistenteM(profesional_especialidad_id, fecha, hora, (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length > 0) {
                // Si ya existe, rechazamos la promesa con un mensaje de error
                return reject(new Error('Ya existe un turno para este profesional en esa fecha y hora.'));
            }

            // Si no existe, procedemos a crear el turno
            crearTurnoM(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
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