import connectDB from '../config/db.js';

export const crearTurnoM = async (paciente_id, profesional_especialidad_id, sucursal_id, detalle_turno, fecha, hora, estado, dniFotoUrl, es_sobreturno) => {
    try {
        const connection = await connectDB();
        const sql = 'INSERT INTO turnos(paciente_id, profesional_especialidad_id, sucursal_id, detalle_turno, fecha, hora, estado, dni_foto_url, es_sobreturno) VALUES (?,?,?,?,?,?,?,?,?)'
        console.log('Datos para crear turno:', paciente_id, profesional_especialidad_id, sucursal_id, detalle_turno, fecha, hora, estado, dniFotoUrl, es_sobreturno);
        console.log('SQL:', sql);
        const [result] = await connection.execute(sql, [paciente_id, profesional_especialidad_id, sucursal_id, detalle_turno, fecha, hora, estado, dniFotoUrl, es_sobreturno ? 1 : 0]);
        return result;
    } catch (error) {
        console.error('Error al crear turno:', error);
        throw (error);
    }
}

export const obtenerEstadosTurnoPorHorarioM = async (profesionalId, fecha) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(`
    SELECT hora, estado
    FROM turnos
    WHERE profesional_especialidad_id = ? AND fecha = ?
  `, [profesionalId, fecha]);

  return rows;
};

export const selTurnoM = (nombre_completo, callback) => {
    const sql = 'SELECT t.detalle_turno, t.fecha, t.hora, t.estado, t.confirmado FROM turnos t JOIN paciente p ON t.paciente_id = p.id WHERE p.nombre_completo = ?;'
    db.query(sql, [nombre_completo], (err, res) => {
        if (err) {
            callback(err, null);
            return
        }
        return callback(null, res)
    })

}


export const borrarTurnoM = (id, callback) => {
    const sql = 'DELETE FROM turnos WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, res);
    });
}

export const actuTurnoM = (fecha, hora, estado, id, callback) => {
    const sql = 'UPDATE turnos SET fecha = ?, hora = ?, estado = ? WHERE id = ?'

    db.query(sql, [fecha, hora, estado, id], (err, res) => {
        if (err) {
            callback(err, null)
            return;
        }
        callback(null, res)
    })
}

export const actualizarTurnoTrasladoM = async (fecha, hora, estado, turnoId, profesional_especialidad_id, detalle_turno, callback) => {

    try {
        const connection = await connectDB();
        const sql = `UPDATE turnos SET fecha = ?, hora = ?, estado = ?, profesional_especialidad_id = ?, detalle_turno = ? WHERE id = ?`;
        const [rows] = await connection.query(sql, [fecha, hora, estado, profesional_especialidad_id, detalle_turno, turnoId]);
        callback(null, rows);
        return rows;
    } catch (error) {
        console.error('Error al actualizar turno:', error);
        callback(error);
    }
}

export const actualizarTurnoTrasladM = (fecha, hora, estado, turnoId, profesional_especialidad_id, detalle_turno, callback) => {
    const sql = 'UPDATE turnos SET fecha = ?, hora = ?, estado = ?, profesional_especialidad_id = ?, detalle_turno = ? WHERE id = ?'

    db.query(sql, [fecha, hora, estado, profesional_especialidad_id, detalle_turno, turnoId], (err, res) => {
        if (err) {
            callback(err, null)
            return;
        }
        callback(null, res)
    })
}

export const confTurnoM = (confirmado, id, callback) => {
    const sql = 'UPDATE turnos SET confirmado = ? WHERE id = ?'

    db.query(sql, [confirmado, id], (err, res) => {
        if (err) {
            callback(err, null)
            return;
        }
        callback(null, res)
    })
}

export const traerTurnos = async (callback) => {
    try {
        const connection = await connectDB();
        const sql = `
    SELECT 
        t.id, 
        p.nombre_completo AS paciente_nombre,
        CONCAT(pr.apellido, ', ', pr.nombre) AS nombre_medico,
        e.nombre AS especialidad,
        t.detalle_turno,
        s.nombre AS sucursal,
        t.fecha, 
        t.hora, 
        t.estado,
        t.dni_foto_url
    FROM 
        turnos t
    JOIN 
        paciente p ON t.paciente_id = p.id
    JOIN 
        profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
    JOIN 
        profesional pr ON pe.profesional_id = pr.id
    JOIN 
        especialidad e ON pe.especialidad_id = e.id
    LEFT JOIN
    	sucursal s ON t.sucursal_id = s.id
    ORDER BY t.fecha DESC, t.hora DESC, pr.apellido, pr.nombre
    `;

        const [rows] = await connection.query(sql);

        callback(null, rows);
    } catch (error) {
        console.error('Error al traer turnos:', error);
        callback(error);
    }

};

export const traerTurnoPorIdM = async (id, callback) => {
    try {
        const connection = await connectDB();
        const sql = `
    SELECT 
        t.id, 
        p.nombre_completo AS paciente_nombre,
        p.dni,
        p.obra_social,
        p.telefono,
        CONCAT(pr.apellido, ', ', pr.nombre) AS nombre_medico,
        e.nombre AS especialidad,
        t.detalle_turno,
        s.nombre AS sucursal,
        t.sucursal_id,
        t.fecha, 
        t.hora, 
        t.estado,
        t.dni_foto_url
    FROM 
        turnos t
    JOIN 
        paciente p ON t.paciente_id = p.id
    JOIN 
        profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
    JOIN 
        profesional pr ON pe.profesional_id = pr.id
    JOIN 
        especialidad e ON pe.especialidad_id = e.id
    LEFT JOIN
    	sucursal s ON t.sucursal_id = s.id
    WHERE t.id = ?
    `;

        const [rows] = await connection.query(sql, [id]);

        callback(null, rows);
    } catch (error) {
        console.error('Error al traer turnos:', error);
        callback(error);
    }

};


export const traerTurnosFiltrados = async (filtros, callback) => {
  try {
    const connection = await connectDB();

    let sql = `
      SELECT 
        t.id,
        p.nombre_completo AS paciente_nombre,
        CONCAT(pr.apellido, ', ', pr.nombre) AS nombre_medico,
        e.nombre AS especialidad,
        t.detalle_turno,
        s.nombre AS sucursal,
        t.fecha,
        t.hora,
        t.estado,
        t.dni_foto_url,
        t.es_sobreturno
      FROM turnos t
      JOIN paciente p ON t.paciente_id = p.id
      JOIN profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
      JOIN profesional pr ON pe.profesional_id = pr.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      LEFT JOIN sucursal s ON t.sucursal_id = s.id
      WHERE 1 = 1
    `;

    const params = [];

    //filtro por sucursal
    if (filtros.sucursal_id) {
      sql += ` AND t.sucursal_id = ?`;
      params.push(filtros.sucursal_id);
    }

    //filtro por paciente
    if (filtros.paciente) {
      sql += ` AND LOWER(p.nombre_completo) LIKE ?`;
      params.push(`%${filtros.paciente.toLowerCase()}%`);
    }

    //filtro por profesional
    if (filtros.profesional) {
      sql += ` AND (LOWER(pr.apellido) LIKE ? OR LOWER(pr.nombre) LIKE ?)`;
      params.push(`%${filtros.profesional.toLowerCase()}%`);
      params.push(`%${filtros.profesional.toLowerCase()}%`);
    }

    sql += ` GROUP BY t.id, p.nombre_completo, pr.apellido, pr.nombre, e.nombre, t.detalle_turno, t.fecha, t.hora, t.estado, t.dni_foto_url, t.es_sobreturno`;
    sql += ` ORDER BY t.fecha DESC, t.hora DESC`;

    const [rows] = await connection.query(sql, params);
    callback(null, rows);

  } catch (err) {
    callback(err);
  }
};

export const obtenerTodasLasSucursales = async () => {
    try {
        const connection = await connectDB();
        const [rows] = await connection.query('SELECT id, nombre FROM sucursal');
        return rows;
    } catch (err) {
        console.error('Error al obtener sucursales:', err);
        throw err;
    }
};



export const verificarTurnoExistenteM = async (profesional_especialidad_id, fecha, hora) => {
    try {
        const connection = await connectDB();
        const sql = 'SELECT * FROM turnos WHERE profesional_especialidad_id = ? AND fecha = ? AND hora = ?';
        const [results] = await connection.execute(sql, [profesional_especialidad_id, fecha, hora]);
        return results;
    } catch (error) {
        console.error('Error al verificar si existe el turno:', error);
        throw error;
    }
};

export const obtenerTurnosOcupados = async (profesionalId, fecha) => {
    const connection = await connectDB();
    const sql = `
    SELECT hora FROM turnos
    WHERE profesional_especialidad_id = ?
      AND fecha = ?
      AND estado NOT IN ('Cancelado')
  `;
    const [rows] = await connection.execute(sql, [profesionalId, fecha]);
    await connection.end();

    return rows.map(row => row.hora.slice(0, 5));
};

export const actuEstadoTurnoM = async (estado, id, callback) => {
    try {
        console.log("Actualizando estado del turno en model:", estado, "para el ID:", id);
        const connection = await connectDB();
        const sql = 'UPDATE turnos SET estado = ? WHERE id = ?';
        const [result] = await connection.execute(sql, [estado, id]);
        await connection.end();
        console.log("Estado del turno actualizado correctamente en model");
        callback(null, result);
    } catch (error) {
        console.error('Error al actualizar el estado del turno:', error);
        callback(error);
    }
};


export const obtenerHorariosPorEstadoM = async (profesionalId, fecha) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT hora, estado FROM turnos WHERE profesional_especialidad_id = ? AND fecha = ? AND estado NOT IN ('Cancelado')`,
      [profesionalId, fecha]
    );
    return rows;
  } catch (error) {
    console.error("Error en obtenerHorariosPorEstadoM:", error);
    throw error;
  }
};

export const verificarSobreturnosM = async (profesionalId, fecha, hora) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(`
    SELECT COUNT(*) AS cantidad
    FROM turnos t
    JOIN profesional_especialidad pe ON pe.id = t.profesional_especialidad_id
    WHERE pe.id = ? AND t.fecha = ? AND t.hora = ? AND t.estado = 'Reservada' AND t.es_sobreturno = 1 AND t.estado NOT IN ('Cancelado')
  `, [profesionalId, fecha, hora]);
  return rows[0].cantidad;
};


export const contarSobreturnosM = async (profesional_especialidad_id, fecha, hora) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS cantidad 
     FROM turnos 
     WHERE profesional_especialidad_id = ? AND fecha = ? AND hora = ? AND es_sobreturno = 1 AND estado NOT IN ('Cancelado')`,
    [profesional_especialidad_id, fecha, hora]
  );
  return rows[0].cantidad;
};

export const obtenerAgendaPorFechaYProfesionalM = async (profesional_especialidad_id, fecha) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(
    `SELECT a.max_sobreturnos
     FROM agenda a
     JOIN agenda_dias ad ON a.id = ad.agenda_id
     WHERE a.profesional_especialidad_id = ?
       AND ? BETWEEN a.dia_inicio AND a.dia_fin
       AND FIND_IN_SET(DAYOFWEEK(?), ad.dia_semana)`,
    [profesional_especialidad_id, fecha, fecha]
  );

  return rows[0];
};

export const obtenerCantidadSobreturnos = async (profesionalId, fecha) => {
  const connection = await connectDB();


  const sql = `
    SELECT COUNT(*) AS cantidad
    FROM turnos
    WHERE profesional_especialidad_id = ? 
      AND fecha = ? 
      AND es_sobreturno = 1
      AND estado NOT IN ('Cancelado')
  `;

  const [rows] = await connection.execute(sql, [profesionalId, fecha]);
  return rows[0];
};

