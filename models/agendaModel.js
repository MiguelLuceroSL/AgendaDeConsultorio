import connectDB from '../config/db.js';

export const validarConflictoHorariosM = async (profesionalId, sucursalId, horarioInicio, horarioFin, diasSemana, diaInicio, diaFin, agendaIdExcluir = null) => {
  const connection = await connectDB();
  try {
    //obtenemos todas las especialidades del profesional
    const [especialidades] = await connection.query(
      'SELECT id FROM profesional_especialidad WHERE profesional_id = ?',
      [profesionalId]
    );

    if (especialidades.length === 0) {
      return { conflicto: false, mensaje: '' };
    }

    const especialidadIds = especialidades.map(e => e.id);

    //verificamos conflictos de horarios en la misma sucursal y dias
    for (const dia of diasSemana) {
      const sql = `
        SELECT 
          a.id,
          a.horario_inicio,
          a.horario_fin,
          a.dia_inicio,
          a.dia_fin,
          e.nombre AS especialidad,
          s.nombre AS sucursal
        FROM agenda a
        JOIN profesional_especialidad pe ON a.profesional_especialidad_id = pe.id
        JOIN especialidad e ON pe.especialidad_id = e.id
        JOIN sucursal s ON a.sucursal_id = s.id
        JOIN agenda_dias ad ON ad.agenda_id = a.id
        WHERE pe.id IN (?)
          AND ad.dia_semana = ?
          AND a.estado = 'Activo'
          ${agendaIdExcluir ? 'AND a.id != ?' : ''}
          AND (
            (? >= a.horario_inicio AND ? < a.horario_fin) OR
            (? > a.horario_inicio AND ? <= a.horario_fin) OR
            (? <= a.horario_inicio AND ? >= a.horario_fin)
          )
          AND (
            (? <= a.dia_fin AND ? >= a.dia_inicio)
          )
      `;

      const params = agendaIdExcluir 
        ? [especialidadIds, dia, agendaIdExcluir, horarioInicio, horarioInicio, horarioFin, horarioFin, horarioInicio, horarioFin, diaInicio, diaFin]
        : [especialidadIds, dia, horarioInicio, horarioInicio, horarioFin, horarioFin, horarioInicio, horarioFin, diaInicio, diaFin];

      const [conflictos] = await connection.query(sql, params);

      if (conflictos.length > 0) {
        const c = conflictos[0];
        return {
          conflicto: true,
          mensaje: `El profesional ya tiene una agenda para ${dia} de ${c.horario_inicio.substring(0, 5)} a ${c.horario_fin.substring(0, 5)} en ${c.sucursal} (${c.especialidad}) que se solapa con el período solicitado (vigente desde ${c.dia_inicio} hasta ${c.dia_fin}).`
        };
      }
    }

    return { conflicto: false, mensaje: '' };
  } catch (error) {
    console.error('Error al validar conflictos de horarios:', error);
    throw error;
  }
};

export const crearAgendaM = async (agendaData, diasSemana) => {
  const connection = await connectDB();
  try {
    //obtenemos el profesional_id desde profesional_especialidad
    const [profEsp] = await connection.query(
      'SELECT profesional_id FROM profesional_especialidad WHERE id = ?',
      [agendaData.profesional_especialidad_id]
    );

    if (!profEsp || profEsp.length === 0) {
      throw new Error('No se encontró la especialidad del profesional');
    }

    const profesionalId = profEsp[0].profesional_id;

    //validamos conflictos de horarios y fechas
    const validacion = await validarConflictoHorariosM(
      profesionalId,
      agendaData.sucursal_id,
      agendaData.horario_inicio,
      agendaData.horario_fin,
      diasSemana,
      agendaData.dia_inicio,
      agendaData.dia_fin
    );

    if (validacion.conflicto) {
      throw new Error(validacion.mensaje);
    }

    //insert de la agenda
    const sqlAgenda = `
      INSERT INTO agenda (
        profesional_especialidad_id,
        sucursal_id,
        horario_inicio,
        horario_fin,
        tiempo_consulta,
        dia_inicio,
        dia_fin,
        estado,
        max_sobreturnos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(sqlAgenda, [
      agendaData.profesional_especialidad_id,
      agendaData.sucursal_id,
      agendaData.horario_inicio,
      agendaData.horario_fin,
      agendaData.tiempo_consulta,
      agendaData.dia_inicio,
      agendaData.dia_fin,
      'Activo',
      agendaData.max_sobreturnos
    ]);
    console.log("🚀 ~ crearAgendaM ~ result:", result)

    const agendaId = result.insertId;

    //insert de los dias de la agenda
    const sqlDia = `INSERT INTO agenda_dias (agenda_id, dia_semana) VALUES (?, ?)`;
    for (const dia of diasSemana) {
      await connection.execute(sqlDia, [agendaId, dia]);
    }

    return { agendaId, diasSemana };
  } catch (error) {
    console.error('Error al crear agenda:', error);
    throw error;
  }
};

export const obtenerSucursales = async () => {
  const connection = await connectDB();
  const [rows] = await connection.query(`SELECT id, nombre FROM sucursal`);
  return rows;
};

export const obtenerAgendasM = (callback) => {
    const sql = 'SELECT * FROM agenda'
    db.query(sql,callback)
}

export const actulizarAgendaM = (horario_inicio, horario_fin, estado, id, callback) =>{
    const sql = 'UPDATE agenda SET horario_inicio = ?, horario_fin = ?, estado = ? WHERE id = ?'
    db.query (sql,[ horario_inicio, horario_fin, estado,id],callback)
}


export const borrarAgenda = (id,callback) => {
    const sql = 'DELETE FROM agenda WHERE id = ?'
    db.query(sql, [id], callback)
}


export const obtenerAgendasActivasM = async (profesionalId) => {
  try {
    const connection = await connectDB();
    const sql = `SELECT * FROM agenda WHERE profesional_especialidad_id = ? AND estado = 'Activo'`;
    const [rows] = await connection.execute(sql, [profesionalId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener agendas activas:', error);
    throw error;
  }
};

export const obtenerAgendasActivasPorProfesional = async (profesionalId, sucursalId = null) => {
  try {
    const connection = await connectDB();
    
    let sql = `SELECT a.id, a.horario_inicio, a.horario_fin, a.tiempo_consulta, a.dia_inicio, a.dia_fin, a.max_sobreturnos, a.sucursal_id
       FROM agenda a
       WHERE a.profesional_especialidad_id = ?
       AND a.estado = 'Activo'`;
    
    const params = [profesionalId];
    
    //si se proporciona sucursalId, filtramos por sucursal
    if (sucursalId) {
      sql += ` AND a.sucursal_id = ?`;
      params.push(sucursalId);
    }
    
    console.log('📋 SQL Query:', sql);
    console.log('📋 Params:', params);
    
    const [agendas] = await connection.query(sql, params);
    
    console.log('📋 Agendas obtenidas de BD:', agendas.length);
    agendas.forEach(a => console.log(`  - Agenda ${a.id}: sucursal_id=${a.sucursal_id}, horario=${a.horario_inicio}-${a.horario_fin}`));

    for (const agenda of agendas) {
      const [dias] = await connection.query(
        `SELECT dia_semana FROM agenda_dias WHERE agenda_id = ?`,
        [agenda.id]
      );
      agenda.dias = dias.map(d => d.dia_semana.toLowerCase());
    }

    return agendas;
  } catch (err) {
    console.error('Error en obtenerAgendasActivasPorProfesional:', err);
    return [];
  }
};

export const obtenerAgendasOcupadasM= async(profesional_especialidad_id, dia_inicio, dia_fin, horario_inicio, horario_fin, dia_semana ) => {

  try{
    const connection = await connectDB()

    const sql = `
    SELECT a.*, ad.dia_semana
      FROM agenda a
      JOIN agenda_dias ad ON ad.agenda_id = a.id
      WHERE a.profesional_especialidad_id = ?
        AND ad.dia_semana = ?
        AND a.estado = 'Activo'
        AND (
          (a.dia_inicio <= ? AND a.dia_fin >= ?)
          OR (a.dia_inicio >= ? AND a.dia_inicio <= ?)
        )
        AND (
          (a.horario_inicio < ? AND a.horario_fin > ?)
          OR (a.horario_inicio < ? AND a.horario_fin > ?)
          OR (a.horario_inicio >= ? AND a.horario_fin <= ?)
        )
    `;

    const [rows] = await connection.query(sql,[
      profesional_especialidad_id,
      dia_semana,
      dia_fin, dia_inicio,
      dia_inicio, dia_fin,
      horario_fin, horario_inicio,
      horario_inicio, horario_fin,
      horario_inicio, horario_fin
    ])

    return rows.map(row => row.dia_semana)
  
  }catch (error){
    console.error ('Error al obtener las agendas ocuapadas', error)
    throw error
  }
}

export const registrarAusenciaM = async ({ profesional_especialidad_id, fecha_inicio, fecha_fin, tipo, confirmarRegistro = false }) => {
  try {
    const connection = await connectDB();

    //verificamos si hay turnos activos en el rango de fechas
    const [turnos] = await connection.execute(
      `SELECT t.id, t.fecha, t.hora, p.nombre_completo AS paciente_nombre
       FROM turnos t
       JOIN paciente p ON t.paciente_id = p.id
       WHERE t.profesional_especialidad_id = ?
         AND t.fecha BETWEEN ? AND ?
         AND t.estado NOT IN ('Cancelado', 'Atendido', 'Por reasignar')`,
      [profesional_especialidad_id, fecha_inicio, fecha_fin]
    );

    if (turnos.length > 0) {
      if (!confirmarRegistro) {
        //retornamos información sobre los turnos para que el frontend pueda preguntar
        return {
          tieneTurnos: true,
          cantidadTurnos: turnos.length,
          turnos: turnos,
          mensaje: `Este profesional tiene ${turnos.length} turno(s) activo(s) en el rango de fechas seleccionado. Si registra la ausencia, estos turnos quedarán marcados como "Por reasignar".`
        };
      }

      //si se confirma el registro, marcar los turnos como "Por reasignar"
      const turnoIds = turnos.map(t => t.id);
      const placeholders = turnoIds.map(() => '?').join(',');
      await connection.execute(
        `UPDATE turnos SET estado = 'Por reasignar' WHERE id IN (${placeholders})`,
        turnoIds
      );
    }

    //registramos la ausencia
    const sql = `
      INSERT INTO ausencias (profesional_especialidad_id, fecha_inicio, fecha_fin, tipo)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute(sql, [
      profesional_especialidad_id,
      fecha_inicio,
      fecha_fin,
      tipo
    ]);

    return { success: true, result, turnosAfectados: turnos.length };
  } catch (error) {
    console.error("Error en registrarAusenciaM:", error);
    throw error;
  }
};

export const verificarAusenciaM = async (profesional_especialidad_id, fecha) => {
  const connection = await connectDB();

  const sql = `
      SELECT *
      FROM ausencias
      WHERE profesional_especialidad_id = ?
        AND ? BETWEEN fecha_inicio AND fecha_fin
  `;

  const [rows] = await connection.execute(sql, [
    profesional_especialidad_id,
    fecha,
  ]);

  return rows;
};

export const obtenerAusenciasTotalesM = async (profesional_especialidad_id) => {
  try {
    const connection = await connectDB();
    const sql = `
      SELECT fecha_inicio, fecha_fin
      FROM ausencias
      WHERE profesional_especialidad_id = ?
    `;
    const [rows] = await connection.execute(sql, [profesional_especialidad_id]);
    return rows;
  } catch (error) {
    console.error("Error en obtenerAusenciasTotalesM:", error);
    throw error;
  }
};

export const mostarAusenciasM = async (sucursalId = null) =>{
   try {
    const connection = await connectDB();
    let sql = `
      SELECT DISTINCT a.*, CONCAT(p.apellido, ', ', p.nombre) AS nombre_completo, e.nombre AS especialidad
      FROM ausencias a
      JOIN profesional_especialidad pe ON pe.id = a.profesional_especialidad_id
      JOIN profesional p ON p.id = pe.profesional_id
      JOIN especialidad e ON e.id = pe.especialidad_id
    `;
    
    const params = [];
    
    //si hay sucursalId, filtrar por profesionales que tengan agendas en esa sucursal
    if (sucursalId) {
      sql += `
      JOIN agenda ag ON ag.profesional_especialidad_id = pe.id
      WHERE ag.sucursal_id = ?
      `;
      params.push(sucursalId);
    }
    
    sql += ` ORDER BY p.apellido, p.nombre, fecha_inicio DESC`;
    
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Error en mostarAusenciasM:", error);
    throw error;
  }
};

export const eliminarAusenciaM = async (id) => {
  try {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `DELETE FROM ausencias WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Error en eliminarAusenciaM:", error);
    throw error;
  }
};

export const obtenerAgendasActivasAgrupadasM = async (sucursalId = null) => {
  try {
    const connection = await connectDB();
    
    let sql = `
      SELECT 
        a.id AS agenda_id,
        a.horario_inicio,
        a.horario_fin,
        a.tiempo_consulta,
        a.dia_inicio,
        a.dia_fin,
        a.max_sobreturnos,
        a.estado,
        p.id AS profesional_id,
        CONCAT(p.apellido, ', ', p.nombre) AS nombre_profesional,
        e.id AS especialidad_id,
        e.nombre AS especialidad,
        s.nombre AS sucursal,
        pe.id AS profesional_especialidad_id,
        GROUP_CONCAT(ad.dia_semana ORDER BY 
          FIELD(ad.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')
        ) AS dias
      FROM agenda a
      JOIN profesional_especialidad pe ON a.profesional_especialidad_id = pe.id
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      JOIN sucursal s ON a.sucursal_id = s.id
      LEFT JOIN agenda_dias ad ON ad.agenda_id = a.id
      WHERE a.estado = 'Activo'
    `;
    
    const params = [];
    
    if (sucursalId) {
      sql += ` AND a.sucursal_id = ?`;
      params.push(sucursalId);
    }
    
    sql += `
      GROUP BY a.id, p.id, p.apellido, p.nombre, e.id, e.nombre, s.nombre, pe.id,
               a.horario_inicio, a.horario_fin, a.tiempo_consulta, a.dia_inicio, 
               a.dia_fin, a.max_sobreturnos, a.estado
      ORDER BY p.apellido, p.nombre, e.nombre, a.horario_inicio
    `;
    
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Error en obtenerAgendasActivasAgrupadasM:", error);
    throw error;
  }
};

export const eliminarAgendaM = async (agendaId, confirmarEliminacion = false) => {
  try {
    const connection = await connectDB();
    
    //verificamos si la agenda tiene turnos asociados
    const [turnos] = await connection.execute(
      `SELECT t.id
       FROM turnos t
       JOIN profesional_especialidad pe ON t.profesional_especialidad_id = pe.id
       JOIN agenda a ON a.profesional_especialidad_id = pe.id
       WHERE a.id = ? AND t.estado NOT IN ('Cancelado', 'Atendido')`,
      [agendaId]
    );
    
    if (turnos.length > 0) {
      if (!confirmarEliminacion) {
        //retornamos informacion sobre los turnos para que el frontend pueda preguntar
        return {
          tieneTurnos: true,
          cantidadTurnos: turnos.length,
          mensaje: `Esta agenda tiene ${turnos.length} turno(s) activo(s). Si la elimina, estos turnos quedarán marcados como "Por reasignar".`
        };
      }
      
      //si se confirma la eliminacion, marcamos los turnos como "Por reasignar"
      const turnoIds = turnos.map(t => t.id);
      const placeholders = turnoIds.map(() => '?').join(',');
      await connection.execute(
        `UPDATE turnos SET estado = 'Por reasignar' WHERE id IN (${placeholders})`,
        turnoIds
      );
    }
    
    //primero eliminamos los dias asociados
    await connection.execute(
      `DELETE FROM agenda_dias WHERE agenda_id = ?`,
      [agendaId]
    );
    
    //luego eliminamos la agenda
    const [result] = await connection.execute(
      `DELETE FROM agenda WHERE id = ?`,
      [agendaId]
    );
    
    return { success: true, result };
  } catch (error) {
    console.error("Error en eliminarAgendaM:", error);
    throw error;
  }
};