import { profesionalCrearM, profesionalEspecialidadBorrarM, obtenerProfesionalesM, actualizarEspecialidadM, obtenerProfesionalesVistaM, actualizarNombreCompletoM, actualizarMatriculaM, cargarProfesionalEspecialidadM, obtenerIdPorDniM, obtenerEspecialidadPorNombreM, buscarProfesionalesM, obtenerEspecialidadesM, marcarTurnosPorReasignarM, verificarTurnosPendientesM, eliminarAgendasProfesionalEspecialidadM } from '../models/profesionalModel.js';

export const crearProfesionalS = (dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula) => {
  return new Promise((resolve, reject) => {
    profesionalCrearM(dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula, (err, result) => {
      if (err) {
        return reject(err); //rechazamos la promesa
      }
      resolve(result); //resolvemos la promesa
    });
  });
};

export const profesionalEspecialidadBorrarS = (profesionalEspecialidadId) => {
  return new Promise((resolve, reject) => {
    profesionalEspecialidadBorrarM(profesionalEspecialidadId, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const obtenerProfesionalesS = (especialidad) => {
  
  console.log("especialidad en service", especialidad);
  return new Promise((resolve, reject) => {
    obtenerProfesionalesM(especialidad, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const obtenerProfesionalesVistaS = async (sucursalId = null) => {
  try {
    return await obtenerProfesionalesVistaM(sucursalId);
  } catch (error) {
    console.error('Error en servicio obtenerProfesionalesVistaS:', error);
    throw error;
  }
};


export const actualizarEspecialidadS = (matricula, especialidad) => {
  return new Promise((resolve, reject) => {
      actualizarEspecialidadM(matricula, especialidad, (err, result) => {
          if (err) {
              return reject(err);
          }
          resolve(result);
      });
  });
};

export const cargarProfesionalEspecialidadS = (profesional_id, especialidad_id, matricula) => {
  return new Promise((resolve, reject) => {
    cargarProfesionalEspecialidadM(profesional_id, especialidad_id, matricula, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const obtenerIdPorDniS = (dni) => {
  return new Promise((resolve, reject) => {
    obtenerIdPorDniM(dni, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const obtenerEspecialidadPorNombreS = (nombre) => {
  return new Promise((resolve, reject) => {
    obtenerEspecialidadPorNombreM(nombre, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const obtenerProfesionalPorDniS = async (dni) => {
  try {
    const { obtenerProfesionalPorDniM } = await import('../models/profesionalModel.js');
    return await obtenerProfesionalPorDniM(dni);
  } catch (error) {
    console.error('Error en servicio obtenerProfesionalPorDniS:', error);
    throw error;
  }
};

export const actualizarMatriculaS = (matricula, nueva_matricula) => {
  return new Promise((resolve, reject) => {
    console.log("nueva_matricula service: ", nueva_matricula);
    console.log("matricula service: ", matricula);
    actualizarMatriculaM(matricula,nueva_matricula, (err, result) => {
          if (err) {
              return reject(err);
          }
          resolve(result);
      });
  });
};

export const actualizarNombreCompletoS = (nuevo_nombre_completo, profesional_id) => {
  return new Promise((resolve, reject) => {
      actualizarNombreCompletoM(nuevo_nombre_completo, profesional_id, (err, result) => {
          if (err) {
              return reject(err);
          }
          resolve(result);
      });
  });
};

export const buscarProfesionalesS = async (texto, especialidadId = null, sucursalId = null, soloConAgendas = false, incluirInactivos = false) => {
  try {
    return await buscarProfesionalesM(texto, especialidadId, sucursalId, soloConAgendas, incluirInactivos);
  } catch (error) {
    console.error('Error en servicio buscarProfesionalesS:', error);
    throw error;
  }
};

export const obtenerEspecialidadesS = async () => {
  try {
    return await obtenerEspecialidadesM();
  } catch (error) {
    console.error('Error en servicio obtenerEspecialidadesS:', error);
    throw error;
  }
};

export const marcarTurnosPorReasignarS = async (profesionalEspecialidadId) => {
  try {
    return await marcarTurnosPorReasignarM(profesionalEspecialidadId);
  } catch (error) {
    console.error('Error en servicio marcarTurnosPorReasignarS:', error);
    throw error;
  }
};

export const verificarTurnosPendientesS = async (profesionalEspecialidadId) => {
  try {
    return await verificarTurnosPendientesM(profesionalEspecialidadId);
  } catch (error) {
    console.error('Error en servicio verificarTurnosPendientesS:', error);
    throw error;
  }
};

export const eliminarAgendasProfesionalEspecialidadS = async (profesionalEspecialidadId) => {
  try {
    return await eliminarAgendasProfesionalEspecialidadM(profesionalEspecialidadId);
  } catch (error) {
    console.error('Error en servicio eliminarAgendasProfesionalEspecialidadS:', error);
    throw error;
  }
};
