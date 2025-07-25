import connectDB from '../config/db.js';

export const crearTurnoM = async (paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl) => {
    try {
        const connection = await connectDB();
        const sql = 'INSERT INTO turnos(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dni_foto_url) VALUES (?,?,?,?,?,?,?)'
        console.log('Datos para crear turno:', paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl);
        console.log('SQL:', sql);
        const [result] = await connection.execute(sql, [paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl]);
        return result;
    } catch (error) {
        console.error('Error al crear turno:', error);
        throw (error);
    }
}

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
    SELECT DISTINCT
        t.id, 
        p.nombre_completo AS paciente_nombre,
        pr.nombre_completo AS nombre_medico,
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
    JOIN
    	agenda a ON a.profesional_especialidad_id = pe.id
    JOIN
    	sucursal s ON a.sucursal_id = s.id
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
    SELECT DISTINCT
        t.id, 
        p.nombre_completo AS paciente_nombre,
        p.dni,
        p.obra_social,
        p.telefono,
        pr.nombre_completo AS nombre_medico,
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
    JOIN
    	agenda a ON a.profesional_especialidad_id = pe.id
    JOIN
    	sucursal s ON a.sucursal_id = s.id
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
      SELECT DISTINCT
        t.id, 
        p.nombre_completo AS paciente_nombre, 
        pr.nombre_completo AS nombre_medico,
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
    JOIN
    	agenda a ON a.profesional_especialidad_id = pe.id
    JOIN
    	sucursal s ON a.sucursal_id = s.id
    `;

        const params = [];

        if (filtros.sucursal) {
            sql += ' AND s.nombre = ?';
            params.push(filtros.sucursal);
        }
        if (filtros.paciente) {
            sql += ' AND LOWER(p.nombre_completo) LIKE ?';
            params.push(`%${filtros.paciente.toLowerCase()}%`);
        }
        if (filtros.profesional) {
            sql += ' AND LOWER(pr.nombre_completo) LIKE ?';
            params.push(`%${filtros.profesional.toLowerCase()}%`);
        }

        const [rows] = await connection.query(sql, params);
        callback(null, rows);
    } catch (err) {
        callback(err);
    }
};

export const obtenerTodasLasSucursales = async () => {
    try {
        const connection = await connectDB();
        const [rows] = await connection.query('SELECT nombre FROM sucursal');
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
      `SELECT hora, estado FROM turnos WHERE profesional_especialidad_id = ? AND fecha = ?`,
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
    WHERE pe.id = ? AND t.fecha = ? AND t.hora = ? AND t.estado = 'Reservada'
  `, [profesionalId, fecha, hora]);
  return rows[0].cantidad;
};

