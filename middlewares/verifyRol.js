import { rolById } from "../models/pacienteModel.js";

const verifyRol = (roles) => {
    return (req, res, next) => {
      console.log('verifing role...');
      const rolUser = rolById(req.user.id, (err, rol) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('Rol:', rol);
        }
      });

      if (!roles === rolUser) {
        return res.status(403).send('No tienes permiso para acceder a esta ruta.');
      }
      next();
    };
  };
  
export default verifyRol;