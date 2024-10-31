import { profesionalCrearM, profesionalBorrarM } from '../models/profesionalModel.js';
import { crearProfesionalEspecialidadM, borrarProfesionalEspecialidadM } from '../models/profesionalEspecialidadModel.js';

export const profesionalCrearS = (nombre_completo) => {
  return new Promise((resolve, reject) => {
    profesionalCrearM(nombre_completo, (err, result) => {
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

export const crearProfesionalEspecialidadS = async (nombre_completo, especialidad_id, matricula) => {
  try {
    console.log("🚀 ~ Crear Profesional ~ nombre_completo, especialidad_id, matricula:", nombre_completo, especialidad_id, matricula);

    const result = await new Promise((resolve, reject) => {
      profesionalCrearM(nombre_completo, especialidad_id, matricula, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    console.log("🚀 ~ Profesional creado ~ result:", result);

    const resultPE = await new Promise((resolve, reject) => {
      crearProfesionalEspecialidadM(result.profesional_id, especialidad_id, matricula, (errPE, resPE) => {
        if (errPE) return reject(errPE);
        resolve(resPE);
      });
    });

    console.log("🚀 ~ ProfesionalEspecialidad creado ~ resultPE:", resultPE);
    return resultPE;

  } catch (error) {
    console.error("Error en crearProfesionalEspecialidad:", error);
    throw error;
  }
};