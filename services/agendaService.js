import {crearAgendaM, obtenerAgendasM, actulizarAgendaM, borrarAgenda } from "../models/agendaModel.js"

export const crearAgendaS = (profesional_especialidad_id, sucursal_id,dia_inicio, dia_fin, horario_inicio, horario_fin, estado) => {
    return new Promise((resolve, reject) => {
      crearAgendaM(profesional_especialidad_id, sucursal_id, horario_inicio, horario_fin, dia_inicio, dia_fin, estado, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };


  export const obtenerAgendaS = () => {
    return new Promise ((resolve,reject) => {
        obtenerAgendasM((err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
  }

export const actulizarAgendaS = (horario_inicio, horario_fin, estado, id) =>{
    return new Promise((resolve, reject) =>{
        actulizarAgendaM(horario_inicio, horario_fin, estado, id, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const borrarAgendaS = (id) => {
    return new Promise ((resolve, reject) => {
        borrarAgenda(id, (err, result) => {
            if(err) {
                return reject (err)
            }
            resolve(result)
        })
    })
}