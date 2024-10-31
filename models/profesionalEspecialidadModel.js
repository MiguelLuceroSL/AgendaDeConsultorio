import db from "../config/db.js";

export const crearProfesionalEspecialidadM = (profesional_id, especialidad_id, matricula, callback) => {
  const sql =
    "INSERT INTO `profesional_especialidad` (`profesional_id`, `especialidad_id`, `matricula`) VALUES (?,?,?)";
  db.query(sql, [profesional_id, especialidad_id, matricula], callback);
};

export const borrarProfesionalEspecialidadM = (id, callback) => {
  const sql = "DELETE FROM profesional_especialidad WHERE id = ?";
  db.query(sql, [id], callback);
};
