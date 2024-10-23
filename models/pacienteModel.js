const db = require('../config/db');

const Paciente ={
    crear: (nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento, callback) => {
        const sql ='INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)'
        db.query(sql, [nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento], callback);
    },
    borrar: (dni,callback)=>{
        const sql = 'DELETE FROM paciente WHERE dni = ?'
        db.query(sql, [ dni ], callback);
    }

}

module.exports = Paciente;