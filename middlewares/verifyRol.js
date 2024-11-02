import { rolById } from "../models/pacienteModel.js";

const verifyRol = (roles) => {
    return (req, res, next) => {
      console.log('verifing role...');
      console.log('req.user.rol:',req.user.rol);
      console.log('req.user:',req.user);
      console.log('req.user.id:',req.user.id);
      console.log('roles:',roles)
      const rolUser = rolById(req.user.id);

      if (!roles === rolUser) {
        return res.status(403).send('No tienes permiso para acceder a esta ruta.');
      }
      next();
    };
  };
  
export default verifyRol;