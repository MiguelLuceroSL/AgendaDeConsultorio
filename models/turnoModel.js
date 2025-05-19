import connectDB from '../config/db.js';

export const crearTurnoM = (paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, callback) => {
    const sql = 'INSERT INTO turnos(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado) VALUES (?,?,?,?,?,?)'
    db.query(sql , [paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado], (err,res) =>{
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

export const traerTurnos = async(callback) => {
    try{
        const connection = await connectDB();
        const sql = `
    SELECT 
        t.id, 
        p.nombre_completo AS paciente_nombre, 
        CONCAT(pr.nombre_completo, ' / ', e.nombre) AS profesional_especialidad, 
        t.detalle_turno, 
        t.fecha, 
        t.hora, 
        t.estado
    FROM 
        turnos t
    JOIN 
        paciente p ON t.paciente_id = p.id
    JOIN 
        profesional_especialidad pe ON t.agenda_id = pe.id
    JOIN 
        profesional pr ON pe.profesional_id = pr.id
    JOIN 
        especialidad e ON pe.especialidad_id = e.id;
    `;
    
    const [rows] = await connection.query(sql);

    callback(null, rows);
    }catch(error){
    console.error('Error al traer turnos:', error);
    callback(error);
    }
    
};


export const verificarTurnoExistenteM = (profesional_especialidad_id, fecha, hora, callback) => {
    const sql = 'SELECT * FROM turnos WHERE profesional_especialidad_id = ? AND fecha = ? AND hora = ?';
    db.query(sql, [profesional_especialidad_id, fecha, hora], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results); 
    });
};