import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';

import connectDB from '../config/db.js';

export const login = async (req, res) => {
  console.log('Entrando al fetch back');
  console.log('REQ BACK LOGIN:', req.body);

  try {
    const db = await connectDB(); // Esperar la conexión

    const { email, password } = req.body;
    const [result] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);

    if (result.length === 0) return res.status(404).send('Usuario no encontrado');

    console.log('Entrando al try del fetch back');
    const user = result[0];
    console.log('User authController:', user);

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (passwordIsValid) {
      console.log("contraseñas coinciden")
    } else {
      console.log("contraseñas no coinciden")
    }
    if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

    // Incluir rol y sucursal_id en el token
    const token = await createAccessToken({ 
      id: user.usuario_id, 
      rol: user.rol,
      sucursal_id: user.sucursal_id 
    });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

    if (user.rol === 'paciente') {
      console.log('Entramos al rol paciente');
      const [pacienteResult] = await db.execute('SELECT * FROM paciente WHERE usuario_id = ?', [user.usuario_id]);
      console.log("PACIENTE RESULT: ",pacienteResult);
      if (pacienteResult.length === 0) return res.status(404).send('Datos del paciente no encontrados');

      const paciente = pacienteResult[0];
      return res.json({
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        datosPaciente: {
          nombre_completo: paciente.nombre_completo,
          dni: paciente.dni,
          obra_social: paciente.obra_social,
          telefono: paciente.telefono,
          email: paciente.email,
          direccion: paciente.direccion,
          fecha_nacimiento: paciente.fecha_nacimiento,
        },
      });
    } else {
      console.log('Entramos al rol que no es paciente');
      return res.json({
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
      });
    }
  } catch (error) {
    console.log('Entramos al catch del fetch back');
    res.status(500).json({ error: error.message });
  }
};



export const register = async (req, res) => {
  const { nombre, email, dni, mutual, direccion, telefono, fecha_nacimiento, password, confirm_password } = req.body;
  
  try {
    const connection = await connectDB();
    
    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
      return res.status(400).send('Las contraseñas no coinciden');
    }
    
    // Validar que el email no exista
    const [emailExists] = await connection.execute(
      'SELECT usuario_id FROM usuario WHERE email = ?',
      [email]
    );
    if (emailExists.length > 0) {
      return res.status(400).send('El email ya está registrado');
    }
    
    // Validar que el DNI no exista
    const [dniExists] = await connection.execute(
      'SELECT id FROM paciente WHERE dni = ?',
      [dni]
    );
    if (dniExists.length > 0) {
      return res.status(400).send('El DNI ya está registrado');
    }
    
    // Validar formato de DNI (7-8 dígitos numéricos)
    if (!/^\d{7,8}$/.test(dni)) {
      return res.status(400).send('El DNI debe tener 7 u 8 dígitos numéricos');
    }
    
    // Validar formato de teléfono (7-15 dígitos numéricos)
    if (!/^\d{7,15}$/.test(telefono)) {
      return res.status(400).send('El teléfono debe contener entre 7 y 15 dígitos numéricos');
    }
    
    // Validar edad: entre 18 y 100 años
    const fechaNac = new Date(fecha_nacimiento);
    const hoy = new Date();
    
    // Calcular edad
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNac.getMonth();
    const diaActual = hoy.getDate();
    const diaNacimiento = fechaNac.getDate();
    
    // Ajustar edad si aún no cumplió años este año
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }
    
    if (edad < 18) {
      return res.status(400).send('Debe ser mayor de 18 años para registrarse');
    }
    
    if (edad > 100) {
      return res.status(400).send('La fecha de nacimiento no es válida (edad máxima: 100 años)');
    }
    
    const passwordHash = bcrypt.hashSync(password, 8);
    const rol = "paciente";
    
    // Inserta en la tabla usuario
    const insertUserQuery = 'INSERT INTO usuario(email, password, rol) VALUES (?, ?, ?)';
    await connection.execute(insertUserQuery, [email, passwordHash, rol]);

    // Obtiene el usuario_id recién creado
    const selectUserIdQuery = 'SELECT usuario_id FROM usuario WHERE email = ?';
    const [userResult] = await connection.execute(selectUserIdQuery, [email]);

    if (userResult.length === 0) {
      return res.status(404).send('Datos del usuario no encontrados.');
    }

    const usuarioId = userResult[0].usuario_id;

    // Inserta en la tabla paciente
    const insertPacienteQuery = `
      INSERT INTO paciente(
        nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(insertPacienteQuery, [nombre, dni, mutual, telefono, email, direccion, fecha_nacimiento, usuarioId]);

    // Renderiza la vista de éxito
    res.render('registerSuccess', { message: '¡Usuario creado con éxito!' });

  } catch (error) {
    console.error('Error al registrar usuario o paciente:', error);
    res.status(500).send('Error al registrar usuario o paciente.');
  }
};


export const registerSecretaria = async (req, res) => {
  
  try {
    const { email, password, confirm_password, sucursal_id } = req.body;
    const connection = await connectDB();
    
    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
      return res.status(400).send('Las contraseñas no coinciden');
    }
    
    // Validar que el email no exista
    const [emailExists] = await connection.execute(
      'SELECT usuario_id FROM usuario WHERE email = ?',
      [email]
    );
    if (emailExists.length > 0) {
      return res.status(400).send('El email ya está registrado');
    }
    
    const passwordHash = bcrypt.hashSync(password, 8);
    const rol = "secretaria";
    
    await connection.execute(
      'INSERT INTO usuario(email, password, rol, sucursal_id) VALUES (?, ?, ?, ?)',
      [email, passwordHash, rol, sucursal_id]
    );

    return res.render('admin/adminSecretariaSuccess', { message: '¡Secretaria creada con éxito!' });
  } catch (error) {
    console.error('Error al registrar secretaria:', error);
    return res.status(500).send('Error al registrar secretaria.');
  }
};

export const getRole = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    res.json({ rol: decoded.rol });
  });
};

// Nueva función para hacer logout
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};