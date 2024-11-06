import db from '../config/db.js';

export const crearAgendaM = (profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado, callback) => {
    const sql = 'INSERT INTO `agenda`(profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado) VALUES (?,?,?,?,?,?,?)'
    db.query(sql , [profesional_especialidad_id, sucursal_id, dia_inicio, dia_fin, horario_inicio, horario_fin, estado], callback)
}

export const obtenerAgendasM = (callback) => {
    const sql = 'SELECT * FROM agenda'
    db.query(sql,callback)
}

export const actulizarAgendaM = (id, horario_inicio, horario_fin, estado, callback) =>{
    const sql = 'UPDATE agenda SET horario_inicio = ?, horario_fin = ?, estado = ? WHERE id = ?'
    db.query (sql,[id, horario_inicio, horario_fin, estado],callback)
}


export const borrarAgenda = (id,callback) => {
    const sql = 'DELETE FROM agenda WHERE id = ?'
    db.query(sql, [id], callback)
}