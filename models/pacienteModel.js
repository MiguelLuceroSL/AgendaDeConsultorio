const db = require('../config/db');

const Paciente ={
    crear: (nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento, usuario_id, callback) => {
        const sql ='INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(sql, [nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento, usuario_id], callback);
    },
    borrar: (dni,callback)=>{
        const sql = 'DELETE FROM paciente WHERE dni = ?'
        db.query(sql, [ dni ], callback);
    },
    select_id: () => {
        const sql = 'SELECT email from usuario AS u JOIN paciente as p ON u.email = p.email'
    }

}

module.exports = Paciente;