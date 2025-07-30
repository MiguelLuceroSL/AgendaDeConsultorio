import connectDB from '../config/db.js';

/*export const profesionalCrearM = (nombre_completo, callback) => {
  const sql = 'INSERT INTO profesional(nombre_completo) VALUES (?)';
  db.query(sql, [nombre_completo], callback);
};*/

export const profesionalCrearM = async (nombre_completo, especialidad, matricula, callback) => {
  try {
    const connection = await connectDB();

    const sqlProfesional = "INSERT INTO profesional (nombre_completo) VALUES (?)";
    const [profResult] = await connection.query(sqlProfesional, [nombre_completo]);
    const profesionalId = profResult.insertId;

    const sqlEspecialidad = "INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, (SELECT id FROM especialidad WHERE nombre = ?), ?)";
    const [espResult] = await connection.query(sqlEspecialidad, [profesionalId, especialidad, matricula]);

    callback(null, espResult);
  } catch (error) {
    callback(error, null);
  }
};

export const profesionalBorrarM = async (id, callback) => {
  try {
    const connection = await connectDB();
    const sqlPrimera = 'SELECT estado FROM profesional WHERE id=?';
    const [result] = await connection.query(sqlPrimera, [id]);
    if (!result || result.length === 0) {
      return callback(new Error('Profesional no encontrado'));
    }
    let estado = result[0].estado;
    console.log("estadoOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO:", estado);
    estado === 1 ? estado = 0 : estado = 1;
    const sql = 'UPDATE profesional SET estado=? WHERE id=?';
    console.log("estado cambiado a:", estado);
    const [updateResult] = await connection.query(sql, [estado, id]);
    callback(null, updateResult);
  } catch (error) {
    callback(error);
  }
};



export const borrarProfesionalEspecialidadM = (id, callback) => {
  const sql = "DELETE FROM profesional_especialidad WHERE id = ?";
  db.query(sql, [id], callback);
};

export const obtenerProfesionalesM = async (especialidad, callback) => {
  try {
    const connection = await connectDB();

    const sql = `
      SELECT p.id, p.nombre_completo, e.nombre AS especialidad, pe.matricula, p.estado
      FROM profesional_especialidad pe
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      ${especialidad ? 'WHERE e.nombre = ?' : ''};
    `;

    const params = especialidad ? [especialidad] : [];

    const [rows] = await connection.query(sql, params);

    callback(null, rows);
  } catch (error) {
    console.error('Error en la consulta:', error);
    callback(error);

  }
};


export const obtenerProfesionalesVistaM = async() => {
  try{
        const connection = await connectDB();
  const sql = `
    SELECT pe.id ,p.nombre_completo, e.nombre AS especialidad, pe.matricula, p.estado
    FROM profesional_especialidad pe
    JOIN profesional p ON pe.profesional_id = p.id
    JOIN especialidad e ON pe.especialidad_id = e.id
  `;
     const [rows] = await connection.query(sql);

    return rows;
    }catch(error){
    console.error('Error al traer profesionales:', error);
    throw error;
    }
  }



export const actualizarEspecialidadM = async (matricula, especialidad, callback) => {
  try {
    const connection = await connectDB();
    const sql = `UPDATE profesional_especialidad SET especialidad_id=? WHERE matricula = ?;`;
    const [result] = await connection.query(sql, [especialidad, matricula]);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
};

export const actualizarMatriculaM = async (matricula, nueva_matricula, callback) => {
  try {
    const connection = await connectDB();
    console.log("WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
    console.log('nueva matricula', nueva_matricula, ' - matricula', matricula);
    const sql = `UPDATE profesional_especialidad SET matricula=? WHERE matricula=?;`;
    const [result] = await connection.query(sql, [nueva_matricula, matricula]);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
};

export const actualizarNombreCompletoM = async (nuevo_nombre_completo, profesional_id, callback) => {
  try {
    const connection = await connectDB();
    const sql = `UPDATE profesional SET nombre_completo=? WHERE id=?;`;
    const [result] = await connection.query(sql, [nuevo_nombre_completo, profesional_id]);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
};