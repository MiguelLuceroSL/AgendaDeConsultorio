import db from '../config/db.js';

export const profesionalCrearM = (nombre_completo, callback) => {
  const sql = 'INSERT INTO profesional(nombre_completo) VALUES (?)';
  db.query(sql, [nombre_completo], callback);
};

export const profesionalBorrarM = (id, callback) => {
  const sql = 'DELETE FROM profesional WHERE id = ?';
  db.query(sql, [id], callback);
};