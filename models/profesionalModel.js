import db from '../config/db.js';

/*export const profesionalCrearM = (nombre_completo, callback) => {
  const sql = 'INSERT INTO profesional(nombre_completo) VALUES (?)';
  db.query(sql, [nombre_completo], callback);
};*/

export const profesionalCrearM =(nombre_completo, especialidad, matricula, callback) => {
  //inserta al profesional
  const sqlProfecional = "INSERT INTO profesional (nombre_completo) VALUES (?)"
  db.query(sqlProfecional, [nombre_completo], (error,result) => {
    if(error){
      callback(error, null)//maneja el error
      return //termina la ejecucion
    }

    const profesionalId = result.insertId //obtiene la Id del profesional insertado
    //inserta la especialidad del profesional
    const sqlEspecialidad = "INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, (SELECT id FROM especialidad WHERE nombre = ?), ?)"
    db.query(sqlEspecialidad, [profesionalId, especialidad, matricula], (error, result) =>{
      if(error){
        callback(error,null)//maneja el error
        return //termina la ejecucion
      }
      callback(null,result) //operacion exitosa
    })
  })
}

export const profesionalBorrarM = (id, callback) => {
  const sql = 'DELETE FROM profesional WHERE id = ?';
  db.query(sql, [id], callback);
};



export const borrarProfesionalEspecialidadM = (id, callback) => {
  const sql = "DELETE FROM profesional_especialidad WHERE id = ?";
  db.query(sql, [id], callback);
};
