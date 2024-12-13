import {crearPacienteM, borrarPacienteM, obtenerPacientesVistaM} from '../models/pacienteModel.js';

export const crearPacienteS = (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento) => {
    return new Promise((resolve, reject) => {
        crearPacienteM(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

export const borrarPacienteS = (dni) => {
    return new Promise((resolve, reject) => {
        borrarPacienteM(dni, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

export const obtenerPacientesVistaS = () => {
    return new Promise ((resolve,reject) => {
        obtenerPacientesVistaM((err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
};

export const obtenerPacienteDniS = (dni) => {
    return new Promise ((resolve,reject) => {
        obtenerPacienteDniM(dni, (err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result)
        })
    })
};