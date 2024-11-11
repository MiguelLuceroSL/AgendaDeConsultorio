import db from '../config/db.js';

export const crearTurnoM = (paciente_id, agenda_id, detalle_turno, fecha, hora, estado, confirmado, callback) => {
    const sql = 'INSERT INTO `turnos`(paciente_id, agenda_id, detalle_turno, fecha, hora, estado, confirmado) VALUES (?,?,?,?,?,?,?)'
    db.query(sql , [paciente_id, agenda_id, detalle_turno, fecha, hora, estado, confirmado], (err,res) =>{
        if(err){
            callback(err, null);
            return
        }
        return callback(null, res)
    })
}

export const selTurnoM = (nombre_completo,callback)=>{
    const sql = 'SELECT t.detalle_turno, t.fecha, t.hora, t.estado, t.confirmado FROM turnos t JOIN paciente p ON t.paciente_id = p.id WHERE p.nombre_completo = ?;'
    db.query(sql , [nombre_completo], (err,res) =>{
        if(err){
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

export const actuTurnoM =(fecha, hora, estado,id, callback) =>{
    const sql ='UPDATE turnos SET fecha = ?, hora = ?, estado = ? WHERE id = ?'

    db.query (sql,[ fecha, hora, estado, id], (err,res) => {
        if(err){
            callback(err,null)
            return;
        }
        callback(null,res)
    })
}

export const confTurnoM =(confirmado, id, callback) =>{
    const sql ='UPDATE turnos SET confirmado = ? WHERE id = ?'

    db.query (sql,[confirmado, id], (err,res) => {
        if(err){
            callback(err,null)
            return;
        }
        callback(null,res)
    })
}