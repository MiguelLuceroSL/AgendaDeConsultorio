import express from 'express';
const router = express.Router();


router.get("/preguntas-frecuentes", (req, res) => {
  res.render("preguntasFrecuentes");
});

router.get("/sobre-nosotros", (req, res) => {
  res.render("sobreNosotros");
});

export default router;