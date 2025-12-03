import connectDB from '../config/db.js';

export const crearPacienteM = async (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, callback) => {
  try {
    const db = await connectDB();

    const sqlUsuario = 'SELECT usuario_id FROM usuario WHERE email = ? AND rol = "paciente"';
    const [result] = await db.execute(sqlUsuario, [email]);

    if (result.length === 0) {
      return callback(new Error('Usuario no encontrado con ese email o no es un paciente.'));
    }

    const usuario_id = result[0].usuario_id;
    const sqlPaciente = 'INSERT INTO paciente (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const icon = Math.floor(Math.random() * 17) + 1;

    await db.execute(sqlPaciente, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, usuario_id, icon]);

    callback(null, { message: 'Paciente creado con éxito' });
  } catch (err) {
    callback(err);
  }
};

export const borrarPacienteM = async (dni, callback) => {
  try {
    const db = await connectDB();
    const sql = 'DELETE FROM paciente WHERE dni = ?';
    await db.execute(sql, [dni]);
    callback(null, { message: 'Paciente eliminado' });
  } catch (err) {
    callback(err);
  }
};

export const rolById = async (id, callback) => {
  try {
    const db = await connectDB();
    const sqlRol = 'SELECT rol FROM usuario WHERE usuario_id = ?';
    const [result] = await db.execute(sqlRol, [id]);

    if (result.length === 0) {
      return callback(new Error('Rol no encontrado'));
    }

    callback(null, result[0].rol);
  } catch (err) {
    callback(err);
  }
};

export const obtenerPacientesVistaM = async (callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente`;
    const [result] = await db.execute(sql);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const obtenerPacienteDniM = async (dni, callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente WHERE dni=?`;
    const [result] = await db.execute(sql, [dni]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const pacienteByUserIdM = async (usuario_id, callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, icon FROM paciente WHERE usuario_id = ?`;
    const [result] = await db.execute(sql, [usuario_id]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const pacienteIdByUserIdM = async (usuario_id, callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT id FROM paciente WHERE usuario_id = ?`;
    const [result] = await db.execute(sql, [usuario_id]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const obtenerTurnosPorPacienteIdM = async (usuario_id, callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT t.detalle_turno, t.fecha, t.hora, t.estado, p.nombre, p.apellido, e.nombre AS especialidad
      FROM turnos t
      JOIN profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      WHERE t.paciente_id = ?
      AND (
            t.fecha > CURDATE()
            OR (t.fecha = CURDATE() AND t.hora >= CURTIME())
          )
      ORDER BY t.fecha, t.hora;`;
    const [result] = await db.execute(sql, [usuario_id]);
    console.log("Turnos obtenidos para paciente ID:", usuario_id, result);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const obtenerHistorialTurnosPorPacienteIdM = async (usuario_id, callback) => {
  try {
    const db = await connectDB();
    const sql = `SELECT t.detalle_turno, t.fecha, t.hora, t.estado, p.nombre, p.apellido, e.nombre AS especialidad
      FROM turnos t
      JOIN profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      WHERE t.paciente_id = ?
      AND (
            t.fecha < CURDATE()
            OR (t.fecha = CURDATE() AND t.hora < CURTIME())
          )
      ORDER BY t.fecha, t.hora;`;
    const [result] = await db.execute(sql, [usuario_id]);
    console.log("Turnos obtenidos para paciente ID:", usuario_id, result);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

export const updatePacienteM = async (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, callback) => {
  try {
    const db = await connectDB();
    const sql = 'UPDATE paciente SET nombre_completo=?,dni=?,obra_social=?,telefono=?,email=?,direccion=?,fecha_nacimiento=? WHERE dni=?';
    await db.execute(sql, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, dni]);
    callback(null, { message: 'Paciente actualizado' });
  } catch (err) {
    callback(err);
  }
};

export const updateFotoM = async (dni, icon, callback) => {
  try {
    const db = await connectDB();
    const sql = 'UPDATE paciente SET icon=? WHERE dni=?';
    await db.execute(sql, [icon, dni]);
    callback(null, { message: 'Foto actualizada' });
  } catch (err) {
    callback(err);
  }
};

export const buscarPacientesM = async (texto) => {
  try {
    const db = await connectDB();
    const sql = `
      SELECT id, nombre_completo, dni, obra_social 
      FROM paciente 
      WHERE nombre_completo LIKE ? OR dni LIKE ?
      ORDER BY nombre_completo
      LIMIT 10
    `;
    const searchTerm = `%${texto}%`;
    const [rows] = await db.execute(sql, [searchTerm, searchTerm]);
    return rows;
  } catch (err) {
    console.error('Error al buscar pacientes:', err);
    throw err;
  }
};


//SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento FROM paciente