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

export const actualizarTurnoS =(id,fecha,hora,estado) =>{
    return new Promise((resolve,reject)=>{
        actuTurnoM(id,fecha,hora,estado, (err,result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const confTurnoS = (id,confirmado)=>{
    return new Promise((resolve,reject)=>{
        confTurnoM(id,confirmado,(err,result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
}