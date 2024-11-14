import { profesionalCrearM, profesionalBorrarM, obtenerProfesionalesM, actualizarEspecialidadM } from '../models/profesionalModel.js';

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
  return new Promise((resolve, reject) => {
    obtenerProfesionalesM(especialidad, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const obtenerProfesionalesVistaS = () => {
  return new Promise((resolve, reject) => {
    obtenerProfesionalesM((err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};


export const actualizarEspecialidadS = (profesional_id, nueva_especialidad, matricula) => {
  return new Promise((resolve, reject) => {
      actualizarEspecialidadM(profesional_id, nueva_especialidad, matricula, (err, result) => {
          if (err) {
              return reject(err);
          }
          resolve(result);
      });
  });
};
