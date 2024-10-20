const db = require('../config/db');

const Paciente ={
    crear: (nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento,fotocopia_documento,usuario_id, callback) => {
        const sql ='INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(sql, [nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento,fotocopia_documento,usuario_id], callback);
    },
    borrar: (nombre_completo,callback)=>{
        const sql = 'DELETE FROM paciente WHERE nombre_completo = ?'
        db.query(sql, [ nombre_completo ], callback);
    }

}

module.exports = Paciente;