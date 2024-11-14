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
  const sqlPrimera = 'SELECT estado FROM profesional WHERE id=?';
  db.query(sqlPrimera,[id], ((error, result) => {
    if(error){
      return callback(error);
    }
    console.log('resultttttttttttttttado ',result.estado)
    const estado = result.estado;
    const sql = 'UPDATE profesional SET estado=? WHERE id=?';
    db.query(sql, [estado, id], (error, result) => {
      if(error){
        return callback(error)
      }
      callback(null, result)
    });
  }))
};



export const borrarProfesionalEspecialidadM = (id, callback) => {
  const sql = "DELETE FROM profesional_especialidad WHERE id = ?";
  db.query(sql, [id], callback);
};

export const obtenerProfesionalesM = (especialidad, callback) => {
  const sql = `
    SELECT p.id, p.nombre_completo, e.nombre AS especialidad, pe.matricula, p.estado
    FROM profesional_especialidad pe
    JOIN profesional p ON pe.profesional_id = p.id
    JOIN especialidad e ON pe.especialidad_id = e.id
    ${especialidad ? 'WHERE e.nombre = ?' : ''};
  `;
  const params = especialidad ? [especialidad] : [];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return callback(err);
    }
    console.log('Resultado de profesionales:', result);
    callback(null, result);
  });
};


export const obtenerProfesionalesVistaM = (callback) => {
  const sql = `
    SELECT p.nombre_completo, e.nombre AS especialidad, pe.matricula, p.estado
    FROM profesional_especialidad pe
    JOIN profesional p ON pe.profesional_id = p.id
    JOIN especialidad e ON pe.especialidad_id = e.id;
  `;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return callback(err);
      } else {
        callback(null, result);
      }
    });
};



export const actualizarEspecialidadM = (matricula, especialidad, callback) => {
  const sql = `UPDATE profesional_especialidad SET especialidad_id=? WHERE matricula=?;`;
  db.query(sql, [especialidad, matricula], callback);
};

export const actualizarMatriculaM = (matricula, nueva_matricula, callback) => {
  const sql = `UPDATE profesional_especialidad SET matricula=? WHERE matricula=?;`;
  db.query(sql, [nueva_matricula, matricula], callback);
};

export const actualizarNombreCompletoM = (nuevo_nombre_completo, profesional_id, callback) => {
  const sql = `UPDATE profesional SET nombre_completo=? WHERE id=?;`;
  db.query(sql, [nuevo_nombre_completo, profesional_id], callback);
};