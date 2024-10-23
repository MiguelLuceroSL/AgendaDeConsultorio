const Paciente = require('../models/pacienteModel')

const pacienteService = {
    crearPaciente: (nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento) =>{
    return new Promise((resolve,reject)=>{
        Paciente.crear(nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento,(err,result)=>{
            if(err){
                return reject(err);
            }
            resolve(result)
        })
    })
        }
}

module.exports = pacienteService;