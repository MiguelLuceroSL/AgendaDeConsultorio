import { crearTurnoM, borrarTurnoM, actuTurnoM, confTurnoM, selTurnoM } from '../models/turnoModel.js';

export const crearTurnoS = (paciente_id, agenda_id, detalle_turno, fecha, hora, estado, confirmado) =>{
    return new Promise((resolve, reject)=>{
        crearTurnoM(paciente_id, agenda_id, detalle_turno, fecha, hora, estado, confirmado, (err, result) =>{
            if (err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

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