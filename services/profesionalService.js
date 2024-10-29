const Profesional = require('../models/profesionalModel');
const ProfesionalEspecialidad = require ('../models/profesionalEspecialidadModel');

const profesionalService = {
  crearProfesional: (nombre_completo) => {
    return new Promise((resolve, reject) => {
      Profesional.crear(nombre_completo,(err, result) => {
        if (err) {
          return reject(err); //rechazamos la promesa
        }
        resolve(result); //resolvemos la promesa
      });
    });
  },

  borrarProfesional: (id) => {
    return new Promise((resolve, reject) => {
      Profesional.borrar(id, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  crearProfesionalEspecialidad : async (nombre_completo, especialidad_id, matricula) => {
    try {
      console.log("🚀 ~ Crear Profesional ~ nombre_completo, especialidad_id, matricula:", nombre_completo, especialidad_id, matricula);
      
      const result = await new Promise((resolve, reject) => {
        Profesional.crear(nombre_completo, especialidad_id, matricula, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
  
      console.log("🚀 ~ Profesional creado ~ result:", result);
  
      const resultPE = await new Promise((resolve, reject) => {
        ProfesionalEspecialidad.crear(result.profesional_id, especialidad_id, matricula, (errPE, resPE) => {
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
  }
  
};

module.exports = profesionalService;