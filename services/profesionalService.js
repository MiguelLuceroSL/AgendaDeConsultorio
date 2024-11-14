import { profesionalCrearM, profesionalBorrarM, obtenerProfesionalesM, actualizarEspecialidadM, obtenerProfesionalesVistaM, actualizarNombreCompletoM } from '../models/profesionalModel.js';

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
  return new Promise ((resolve,reject) => {
    obtenerProfesionalesVistaM((err, result)=>{
          if(err){
              return reject(err)
          }
          resolve(result)
      })
  })
}


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

export const actualizarMatriculaS = (profesional_id, nueva_especialidad, matricula) => {
  return new Promise((resolve, reject) => {
      actualizarEspecialidadM(profesional_id, nueva_especialidad, matricula, (err, result) => {
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
