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

export const obtenerProfesionalesM = (callback) => {
  const sql = `
    SELECT p.nombre_completo, e.nombre AS especialidad, pe.matricula 
    FROM profesional_especialidad pe 
    JOIN profesional p ON pe.profesional_id = p.id 
    JOIN especialidad e ON pe.especialidad_id = e.id;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return callback(err);
    }
    console.log('Profesionales obtenidos:', result);  // Verifica que los datos sean correctos
    callback(null, result);
  });
};


export const actualizarEspecialidadM = (profesional_id, nueva_especialidad, matricula, callback) => {
  const sql = `UPDATE profesional_especialidad SET especialidad_id = (SELECT id FROM especialidad WHERE nombre = ?), matricula = ? WHERE profesional_id = ?;`;
  db.query(sql, [nueva_especialidad, matricula, profesional_id], callback);
};