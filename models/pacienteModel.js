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

export const updatePacienteM = async (nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, callback) => {
  try {
    const db = await connectDB();
    const sql = 'UPDATE paciente SET nombre_completo=?,dni=?,obra_social=?,telefono=?,email=?,direccion=?,fecha_nacimiento=?,fotocopia_documento=? WHERE dni=?';
    await db.execute(sql, [nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, dni]);
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


//SELECT id, nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento FROM paciente