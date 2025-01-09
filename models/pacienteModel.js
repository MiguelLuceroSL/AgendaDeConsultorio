import db from '../config/db.js';

export const crearPacienteM = (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, callback) => {
  // Primero buscamos el usuario_id basado en el email en la tabla usuario
  const sqlUsuario = 'SELECT usuario_id FROM usuario WHERE email = ? AND rol = "paciente"';

  db.query(sqlUsuario, [email], (err, result) => {
    if (err) {
      return callback(err); // Si hay un error, devolverlo
    }

    // Si no encuentra un usuario con ese email, devolvemos un error
    if (result.length === 0) {
      return callback(new Error('Usuario no encontrado con ese email o no es un paciente.')); // Mensaje más claro
    }

    // Obtenemos el usuario_id del resultado
    const usuario_id = result[0].usuario_id;
    // Ahora hacemos la inserción del paciente en la tabla paciente
    const sqlPaciente = 'INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const icon = Math.floor(Math.random() * 17) + 1;
    db.query(sqlPaciente, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id, icon], callback);
  });

};

export const borrarPacienteM = (dni, callback) => {
  const sql = 'DELETE FROM paciente WHERE dni = ?'
  db.query(sql, [dni], callback);
};

export const rolById = (id, callback) => {
  const sqlRol = 'SELECT rol FROM usuario WHERE usuario_id = ?';
  db.query(sqlRol, [id], (err, result) => {
    if (err) {
      return callback(err);
    }
    return result[0].rol;
  });
};

export const obtenerPacientesVistaM = (callback) => {
  const sql = `SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return callback(err);
      } else {
        callback(null, result);
      }
    });
};

export const obtenerPacienteDniM = (dni, callback) => {
  const sql = `SELECT nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente WHERE dni=?`;
    db.query(sql, [dni], (err, result) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return callback(err);
      } else {
        
        callback(null, result);
        
      }
    });
};

export const pacienteByUserIdM = (usuario_id, callback) => {
  const sql = `SELECT nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente WHERE usuario_id = ?`;
    db.query(sql, [usuario_id], (err, result)=>{
      if (err) {
        console.error('Error en la consulta: ',err);
        return callback(err);
      } else {
        callback(null, result)
      }
    });
}

export const updatePacienteM = (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, callback) => {
  const sql = 'UPDATE paciente SET nombre_completo=?,dni=?,obra_social=?,telefono=?,email=?,direccion=?,fecha_nacimiento=?,fotocopia_documento=? WHERE dni=?'
  db.query(sql, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, dni], callback);
};

export const updateFotoM = (dni, icon, callback) => {
  const sql = 'UPDATE paciente SET icon=? WHERE dni=?'
  db.query(sql, [icon, dni], callback);
};

//SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento FROM paciente