const verifyRol = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return res.status(403).send('No tienes permiso para acceder a esta ruta.');
      }
      next();
    };
  };
  
export default verifyRol;