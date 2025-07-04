import {crearAgendaM, obtenerAgendasM, actulizarAgendaM, borrarAgenda,obtenerAgendasActivasM, obtenerSucursales, obtenerAgendasOcupadasM,registrarAusenciaM, verificarAusenciaM, obtenerAusenciasTotalesM,  eliminarAusenciaM  } from "../models/agendaModel.js"

export const crearAgendaS = async (agendaData, diasSemana) => {
  try{
  const {profesional_especialidad_id, dia_inicio, dia_fin, horario_inicio, horario_fin} = agendaData

 for (const dia of diasSemana) {
      const conflictos = await obtenerAgendasOcupadasM(
        profesional_especialidad_id,
        dia_inicio,
        dia_fin,
        horario_inicio,
        horario_fin,
        dia
      );

      if (conflictos.length > 0) {
        const error = new Error(
          `Ya existe una agenda para el día ${dia} en el horario ${horario_inicio} - ${horario_fin} en el rango de fechas especificado`
        );
        error.status = 400;
        throw error;
      }
    }

  console.log("🚀 ~ crearAgendaS ~ agendaData:", agendaData)
  return await crearAgendaM (agendaData, diasSemana)

  }catch(error){
    console.error('Error en el servicio al crear agenda:', error);
    throw error;
  }
};


export const obtenerSucursalesS = async () => {
  try {
    return await obtenerSucursales();
  } catch (error) {
    console.error('Error en el servicio al obtener sucursales:', error);
    throw error;
  }
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


export const obtenerAgendasActivasS = async (profesionalId) => {
  if (!profesionalId) {
    throw new Error('El ID del profesional es obligatorio.');
  }

  const agendas = await obtenerAgendasActivasM(profesionalId);

  if (agendas.length === 0) {
    throw new Error('El medico seleccionado no tiene turnos momentaneamente.');
  }

  return agendas;
};

export const registrarAusenciaS = async (data) => {
  try {
    return await registrarAusenciaM(data);
  } catch (error) {
    console.error("Error en registrarAusenciaS:", error);
    throw error;
  }
};

export const verificarAusenciaS = async (profesional_especialidad_id, fecha) => {
  try {
    return await verificarAusenciaM(profesional_especialidad_id, fecha);
  } catch (error) {
    console.error("Error en verificarAusenciaS:", error);
    throw error;
  }
};

export const obtenerAusenciasTotalesS = async (profesional_especialidad_id) => {
  try {
    return await obtenerAusenciasTotalesM(profesional_especialidad_id);
  } catch (error) {
    console.error("Error en obtenerAusenciasTotalesS:", error);
    throw error;
  }
};


export const eliminarAusenciaS = async (id) => {
  try {
    return await eliminarAusenciaM(id);
  } catch (error) {
    console.error("Error en eliminarAusenciaS:", error);
    throw error;
  }
};