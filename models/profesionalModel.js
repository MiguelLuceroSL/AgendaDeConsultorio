import connectDB from '../config/db.js';

/*export const profesionalCrearM = (nombre_completo, callback) => {
  const sql = 'INSERT INTO profesional(nombre_completo) VALUES (?)';
  db.query(sql, [nombre_completo], callback);
};*/

export const profesionalCrearM = async (dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula, callback) => {
  try {
    const connection = await connectDB();

    // Verificar si el profesional ya existe
    const [existingProf] = await connection.query('SELECT id FROM profesional WHERE dni = ?', [dni]);
    
    let profesionalId;
    
    if (existingProf && existingProf.length > 0) {
      // El profesional ya existe, usar su ID
      profesionalId = existingProf[0].id;
      console.log(`Profesional con DNI ${dni} ya existe. Agregando nueva especialidad.`);
      
      // Verificar si ya tiene esta especialidad
      const [existingEsp] = await connection.query(
        'SELECT id FROM profesional_especialidad WHERE profesional_id = ? AND especialidad_id = (SELECT id FROM especialidad WHERE nombre = ?)',
        [profesionalId, especialidad]
      );
      
      if (existingEsp && existingEsp.length > 0) {
        return callback(new Error(`El profesional ya tiene la especialidad ${especialidad} registrada`), null);
      }
    } else {
      // El profesional no existe, crearlo
      const sqlProfesional = "INSERT INTO profesional (dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const [profResult] = await connection.query(sqlProfesional, [dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal]);
      profesionalId = profResult.insertId;
      console.log(`Nuevo profesional creado con ID ${profesionalId}`);
    }

    // Agregar la especialidad
    const sqlEspecialidad = "INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, (SELECT id FROM especialidad WHERE nombre = ?), ?)";
    const [espResult] = await connection.query(sqlEspecialidad, [profesionalId, especialidad, matricula]);

    callback(null, espResult);
  } catch (error) {
    callback(error, null);
  }
};

export const cargarProfesionalEspecialidadM = async (profesional_id, especialidad_id, matricula, callback) => {
  try {
    const connection = await connectDB();
    const sql = "INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, ?, ?)";
    await connection.query(sql, [profesional_id, especialidad_id, matricula]);
    callback(null);
  } catch (error) {
    callback(error, null);
  }
}

export const obtenerIdPorDniM = async (dni, callback) => {
  try {
    const connection = await connectDB();
    const sql = 'SELECT id FROM profesional WHERE dni = ?';
    const [result] = await connection.query(sql, [dni]);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
};

export const obtenerEspecialidadPorNombreM = async (especialidad, callback) => {
  try {
    const connection = await connectDB();
    const sql = 'SELECT id FROM especialidad WHERE nombre = ?';
    const [result] = await connection.query(sql, [especialidad]);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

// Dar de baja/alta una especialidad específica de un profesional
export const profesionalEspecialidadBorrarM = async (profesionalEspecialidadId, callback) => {
  try {
    const connection = await connectDB();
    const sqlPrimera = 'SELECT estado FROM profesional_especialidad WHERE id=?';
    const [result] = await connection.query(sqlPrimera, [profesionalEspecialidadId]);
    if (!result || result.length === 0) {
      return callback(new Error('Especialidad del profesional no encontrada'));
    }
    
    const estadoAnterior = result[0].estado;
    const nuevoEstado = estadoAnterior === 1 ? 0 : 1;
    
    console.log("Estado anterior:", estadoAnterior);
    console.log("Nuevo estado:", nuevoEstado);
    
    const sql = 'UPDATE profesional_especialidad SET estado=? WHERE id=?';
    const [updateResult] = await connection.query(sql, [nuevoEstado, profesionalEspecialidadId]);
    
    callback(null, { 
      ...updateResult, 
      estadoAnterior, 
      nuevoEstado 
    });
  } catch (error) {
    callback(error);
  }
};

export const marcarTurnosPorReasignarM = async (profesionalEspecialidadId) => {
  try {
    const connection = await connectDB();
    const sql = `
      UPDATE turnos t
      SET t.estado = 'Por reasignar'
      WHERE t.profesional_especialidad_id = ? 
      AND t.estado NOT IN ('Atendido', 'Cancelado', 'Ausente')
      AND t.fecha >= CURDATE()
    `;
    const [result] = await connection.query(sql, [profesionalEspecialidadId]);
    return result;
  } catch (error) {
    console.error('Error al marcar turnos por reasignar:', error);
    throw error;
  }
};

export const verificarTurnosPendientesM = async (profesionalEspecialidadId) => {
  try {
    const connection = await connectDB();
    const sql = `
      SELECT COUNT(*) as cantidad 
      FROM turnos t
      WHERE t.profesional_especialidad_id = ? 
      AND t.estado NOT IN ('Atendido', 'Cancelado', 'Ausente')
      AND t.fecha >= CURDATE()
    `;
    const [result] = await connection.query(sql, [profesionalEspecialidadId]);
    return {
      tieneTurnosPendientes: result[0].cantidad > 0,
      cantidadTurnos: result[0].cantidad
    };
  } catch (error) {
    console.error('Error al verificar turnos pendientes:', error);
    throw error;
  }
};

export const eliminarAgendasProfesionalEspecialidadM = async (profesionalEspecialidadId) => {
  try {
    const connection = await connectDB();
    const sql = `
      DELETE FROM agenda 
      WHERE profesional_especialidad_id = ?
    `;
    const [result] = await connection.query(sql, [profesionalEspecialidadId]);
    return result;
  } catch (error) {
    console.error('Error al eliminar agendas de la especialidad:', error);
    throw error;
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
      SELECT pe.id AS profesional_especialidad_id, p.id AS profesional_id, 
             CONCAT(p.apellido, ', ', p.nombre) AS nombre_completo, 
             e.nombre AS especialidad, pe.matricula, pe.estado
      FROM profesional_especialidad pe
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      ${especialidad ? 'WHERE e.nombre = ?' : ''}
      ORDER BY p.apellido, p.nombre, e.nombre;
    `;

    const params = especialidad ? [especialidad] : [];

    const [rows] = await connection.query(sql, params);

    callback(null, rows);
  } catch (error) {
    console.error('Error en la consulta:', error);
    callback(error);

  }
};


export const obtenerProfesionalesVistaM = async(sucursalId = null) => {
  try{
        const connection = await connectDB();
  let sql = `
    SELECT DISTINCT pe.id AS profesional_especialidad_id, p.id AS profesional_id,
           CONCAT(p.apellido, ', ', p.nombre) AS nombre_completo, 
           e.nombre AS especialidad, pe.matricula, pe.estado
    FROM profesional_especialidad pe
    JOIN profesional p ON pe.profesional_id = p.id
    JOIN especialidad e ON pe.especialidad_id = e.id
  `;
  
  const params = [];
  
  // Si hay sucursalId, filtrar por profesionales que tengan agendas en esa sucursal
  if (sucursalId) {
    sql += `
    JOIN agenda a ON a.profesional_especialidad_id = pe.id
    WHERE a.sucursal_id = ?
    `;
    params.push(sucursalId);
  }
  
  sql += ` ORDER BY p.apellido, p.nombre, e.nombre;`;
  
  const [rows] = await connection.query(sql, params);

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

export const buscarProfesionalesM = async (texto, especialidadId = null, sucursalId = null, soloConAgendas = false) => {
  try {
    const connection = await connectDB();
    
    // Si soloConAgendas es true o hay sucursalId, hacer JOIN con agenda
    const necesitaAgenda = soloConAgendas || sucursalId;
    
    let sql = `
      SELECT DISTINCT
        pe.id, 
        CONCAT(p.apellido, ', ', p.nombre) AS nombre_completo, 
        e.nombre AS especialidad,
        pe.matricula,
        e.id AS especialidad_id
      FROM profesional_especialidad pe
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      ${necesitaAgenda ? 'JOIN agenda a ON a.profesional_especialidad_id = pe.id' : ''}
      WHERE pe.estado = 1
    `;
    
    const params = [];
    
    if (texto) {
      sql += ` AND (LOWER(p.apellido) LIKE ? OR LOWER(p.nombre) LIKE ?)`;
      const searchTerm = `%${texto.toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (especialidadId) {
      sql += ` AND e.id = ?`;
      params.push(especialidadId);
    }
    
    // Filtrar por sucursal si se proporciona (para secretarias)
    if (sucursalId) {
      sql += ` AND a.sucursal_id = ?`;
      params.push(sucursalId);
    }
    
    sql += ` ORDER BY p.apellido, p.nombre LIMIT 10`;
    
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Error al buscar profesionales:', error);
    throw error;
  }
};

export const obtenerEspecialidadesM = async () => {
  try {
    const connection = await connectDB();
    const sql = `SELECT id, nombre FROM especialidad ORDER BY nombre`;
    const [rows] = await connection.query(sql);
    return rows;
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    throw error;
  }
};