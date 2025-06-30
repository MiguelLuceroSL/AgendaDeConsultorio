import connectDB from '../config/db.js'


export const crearListaEsperaM = async (paciente_id, profesional_especialidad_id, fecha_registro) => {
    try {
        const connection = await connectDB();
        const sql = 'INSERT INTO listaespera (paciente_id, profesional_especialidad_id, fecha_registro) VALUES (?, ?, ?)';
        const [result] = await connection.execute(sql, [paciente_id, profesional_especialidad_id, fecha_registro]);
        return result;
    } catch (error) {
        console.error('Error al crear entrada en lista de espera:', error);
        throw error;
    }
};


export const traerListaEsperaM = async () => {
    try {
        const connection = await connectDB();
        const sql = `
            SELECT 
                le.id,
                p.nombre_completo,
                p.telefono,
                le.fecha_registro,
                pr.nombre_completo AS nombre_medico,
                e.nombre AS especialidad
            FROM listaespera le
            JOIN paciente p ON le.paciente_id = p.id
            JOIN profesional_especialidad pe ON le.profesional_especialidad_id = pe.id
            JOIN profesional pr ON pe.profesional_id = pr.id
            JOIN especialidad e ON pe.especialidad_id = e.id
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error al traer la lista de espera:', error);
        throw error;
    }
};

export const eliminarEsperaM = async (id) => {
  try {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `DELETE FROM listaespera WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Error en eliminarAusenciaM:", error);
    throw error;
  }
};