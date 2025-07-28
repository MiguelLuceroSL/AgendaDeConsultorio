import { profesionalCrearM, profesionalBorrarM, obtenerProfesionalesM, actualizarEspecialidadM, obtenerProfesionalesVistaM, actualizarNombreCompletoM, actualizarMatriculaM } from '../models/profesionalModel.js';

export const crearProfesionalS = (nombre_completo, especialidad, matricula) => {
  return new Promise((resolve, reject) => {
    profesionalCrearM(nombre_completo, especialidad, matricula, (err, result) => {
      if (err) {
        return reject(err); //rechazamos la promesa
      }
      resolve(result); //resolvemos la promesa
    });
  });
};

export const profesionalBorrarS = (id) => {
  return new Promise((resolve, reject) => {
    profesionalBorrarM(id, (err, result) => {
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

export const obtenerProfesionalesVistaS = async () => {
  try {
    return await obtenerProfesionalesVistaM();
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
