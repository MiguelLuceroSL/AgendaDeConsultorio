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
    const sqlPaciente = 'INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sqlPaciente, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id], callback);
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