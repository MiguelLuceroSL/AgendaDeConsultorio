import connectDB from '../config/db.js';

export const crearAgendaM = (profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado, callback) => {
    const sql = 'INSERT INTO agenda (profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado) VALUES (?,?,?,?,?,?,?)'
    db.query(sql , [profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado], callback)
}

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
