import { crearTurnoM, borrarTurnoM, actuTurnoM, confTurnoM, selTurnoM, traerTurnos, verificarTurnoExistenteM, obtenerTurnosOcupados, traerTurnosFiltrados, traerTurnoPorIdM, actuEstadoTurnoM, actualizarTurnoTrasladoM, verificarSobreturnosM, obtenerHorariosPorEstadoM, obtenerCantidadSobreturnos } from '../models/turnoModel.js';



export const crearTurnoS = async (
  paciente_id,
  profesional_especialidad_id,
  detalle_turno,
  fecha,
  hora,
  estado,
  dniFotoUrl,
  es_sobreturno
) => {
  console.log('Creando turno servicio ...');
  try {
    // Validar que no se saquen turnos para fechas pasadas o el mismo día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaTurno = new Date(year, month - 1, day);
    fechaTurno.setHours(0, 0, 0, 0);

    console.log('Fecha hoy:', hoy.toISOString());
    console.log('Fecha turno:', fechaTurno.toISOString());
    console.log('Comparación:', fechaTurno <= hoy);

    if (fechaTurno <= hoy) {
      throw new Error('No se pueden sacar turnos para hoy o fechas pasadas');
    }

    // Validar límite de sobreturnos si corresponde
    if (estado === "Reservada" && es_sobreturno === 1) {
      const cantidadSobreturnos = await contarSobreturnosM(profesional_especialidad_id, fecha, hora);
      const agenda = await obtenerAgendaPorFechaYProfesionalM(profesional_especialidad_id, fecha);
      if (agenda && cantidadSobreturnos >= agenda.max_sobreturnos) {
        throw new Error("Se alcanzó el máximo de sobreturnos para este horario.");
      }
    }

    // Crear turno
    console.log('Creando turno...');
    const resultado = await crearTurnoM(
      paciente_id,
      profesional_especialidad_id,
      detalle_turno,
      fecha,
      hora,
      estado,
      dniFotoUrl,
      es_sobreturno
    );
    console.log('Turno creado exitosamente:', resultado);
    return resultado;
  } catch (error) {
    throw error;
  }
};


export const obtenerEstadosTurnoPorHorarioS = async (profesionalId, fecha) => {
  return await obtenerEstadosTurnoPorHorarioM(profesionalId, fecha);
};

export const selTurnoS = (nombre_completo) => {
    return new Promise((resolve, reject) => {
        selTurnoM(nombre_completo, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const borrarTurnoS = (id) => {
    return new Promise((resolve, reject) => {
        borrarTurnoM(id, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const actualizarTurnoS = (fecha, hora, estado, id) => {
    return new Promise((resolve, reject) => {
        actuTurnoM(fecha, hora, estado, id, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const actualizarTurnoTrasladoS = (fecha, hora, estado, turnoId, profesional_especialidad_id, detalle_turno) => {
    return new Promise((resolve, reject) => {
        actualizarTurnoTrasladoM(fecha, hora, estado, turnoId, profesional_especialidad_id, detalle_turno, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

export const confTurnoS = (confirmado, id) => {
    return new Promise((resolve, reject) => {
        confTurnoM(confirmado, id, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}


export const traerTurnosS = () => {
    return new Promise((resolve, reject) => {
        traerTurnos((err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}



export const traerTurnosFiltradosS = (filtros) => {
    return new Promise((resolve, reject) => {
        traerTurnosFiltrados(filtros, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

export const traerTurnoPorIdS = (id) => {
    return new Promise((resolve, reject) => {
        traerTurnoPorIdM(id, (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};


export const obtenerHorariosPorEstadoS = async (profesionalId, fecha) => {
  return await obtenerHorariosPorEstadoM(profesionalId, fecha);
};

export const getTurnosOcupadosService = async (profesionalId, fecha) => {
    if (!profesionalId || !fecha) {
        throw new Error('Faltan parámetros');
    }
    return await obtenerTurnosOcupados(profesionalId, fecha);
};

export const actualizarEstadoTurnoS = async (estado, id) => {
    return new Promise((resolve, reject) => {
        actuEstadoTurnoM(estado, id, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

export const verificarSobreturnosS = async (profesionalId, fecha, hora) => {
  return await verificarSobreturnosM(profesionalId, fecha, hora);
};


export const verificarCantidadSobreturnos = async (profesionalId, fecha) => {
  return await obtenerCantidadSobreturnos(profesionalId, fecha);
};