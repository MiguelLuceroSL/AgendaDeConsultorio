const Profesional = require('../models/profesionalModel');

const profesionalService = {
  crearProfesional: (nombre_completo, matricula) => {
    return new Promise((resolve, reject) => {
      Profesional.crear(nombre_completo, matricula, (err, result) => {
        if (err) {
          return reject(err); //rechazamos la promesa
        }
        resolve(result); //resolvemos la promesa
      });
    });
  }
};

module.exports = profesionalService;