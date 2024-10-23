const Paciente = require('../models/pacienteModel')

const pacienteService = {
    crearPaciente: (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento) => {
        return new Promise((resolve, reject) => {
            Paciente.crear(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    borrarPaciente: (dni) => {
        return new Promise((resolve, reject) => {
            Paciente.borrar(dni, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = pacienteService;