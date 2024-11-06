import {crearAgendaM, obtenerAgendasM, actulizarAgendaM, borrarAgenda } from "../models/agendaModel"

export const crearAgendaS = (profesional_especialidad_id, sucursal_id, horario_inicio, horario_fin, dia_inicio, dia_fin, estado) => {
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

export const actulizarAgendaS = (id, horario_inicio, horario_fin, estado) =>{
    return new Promise((resolve, reject) =>{
        actulizarAgendaM(id, horario_inicio, horario_fin, estado, (err, result) => {
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