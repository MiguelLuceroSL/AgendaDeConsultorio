import connectDB from '../config/db.js';

export const crearAgendaM = async (agendaData, diasSemana) => {
  const connection = await connectDB();
  try {
    // Insert de la agenda
    const sqlAgenda = `
      INSERT INTO agenda (
        profesional_especialidad_id,
        sucursal_id,
        horario_inicio,
        horario_fin,
        tiempo_consulta,
        dia_inicio,
        dia_fin,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(sqlAgenda, [
      agendaData.profesional_especialidad_id,
      agendaData.sucursal_id,
      agendaData.horario_inicio,
      agendaData.horario_fin,
      agendaData.tiempo_consulta,
      agendaData.dia_inicio,
      agendaData.dia_fin,
      'Activo'
    ]);
    console.log("🚀 ~ crearAgendaM ~ result:", result)

    const agendaId = result.insertId;

    // Insert de los dias de la agenda
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

export const obtenerAgendasActivasPorProfesional = async (profesionalId) => {
  try {
    const connection = await connectDB();
    const [agendas] = await connection.query(
      `SELECT a.id, a.horario_inicio, a.horario_fin, a.tiempo_consulta, a.dia_inicio, a.dia_fin
       FROM agenda a
       WHERE a.profesional_especialidad_id = ?`,
      [profesionalId]
    );

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

export const registrarAusenciaM = async ({ profesional_especialidad_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, tipo, descripcion }) => {
  const connection = await connectDB();

  const sql = `
    INSERT INTO ausencias (profesional_especialidad_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, tipo, descripcion)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await connection.execute(sql, [
    profesional_especialidad_id,
    fecha_inicio,
    fecha_fin,
    hora_inicio ?? null,
    hora_fin ?? null,
    tipo,
    descripcion ?? null
  ]);
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