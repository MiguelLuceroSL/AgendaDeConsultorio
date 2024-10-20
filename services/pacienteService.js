const Paciente = require('../models/pacienteModel')

const pacienteService = {
    crearPaciente: (nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento,fotocopia_documento,usuario_id) =>{
    return new Promise((resolve,reject)=>{
        Paciente.crear(nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento,fotocopia_documento,usuario_id,(err,result)=>{
            if(err){
                return reject(err);
            }
            resolve(result)
        })
    })
        }
}